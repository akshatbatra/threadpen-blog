import { $convertToMarkdownString } from '@lexical/markdown'
import { sanitizeEditorConfig, defaultEditorConfig, getEnabledNodes } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from "lexical"
import { createHeadlessEditor } from "@lexical/headless"
import { open } from "fs/promises"
import type {ElementTransformer} from "@lexical/markdown"
import { UploadNode } from "@payloadcms/richtext-lexical/dist/field/features/Upload/nodes/UploadNode"
import {$createBlockNode, $createUploadNode, $isUploadNode} from '@payloadcms/richtext-lexical' 

export default async ({doc,req,previousDoc,operation}) => {
    if (operation == "create" || operation == "update") {
        let frontMatter = "";
        frontMatter += `title: '${doc.title}'\n`;
        frontMatter += `description: "${doc.description}"\n`;
        frontMatter += `pubDate: '${doc.createdAt}'\n`;
        try{
          let {filename} = await req.payload.findByID({collection: 'cover-photos', id: doc.coverPhoto});
        } catch (e) {
          let filename = "";
        }
        frontMatter += `heroImage: '${(typeof filename === 'undefined') ? '': `/cover-photos/${filename}`}'\n`;
        frontMatter = `---\n${frontMatter}---\n\n`;
        const sanitizedEditorConfig = sanitizeEditorConfig(defaultEditorConfig);
        const editorState: SerializedEditorState = doc.content;
        const headlessEditor = createHeadlessEditor({
        nodes: getEnabledNodes({
            editorConfig: sanitizedEditorConfig
        })
        })
        try {
            headlessEditor.setEditorState(headlessEditor.parseEditorState(editorState));
        } catch(e) {
        console.log({err: e});
        }
        let imageURLMap = {};
        for (let node of doc.content.root.children) {
          if (node.type === "upload") {
            let imgData = await req.payload.findByID({
              collection: 'photos',
              id: node.value.id
            });
            imageURLMap[node.value.id] = imgData.url;
          }
        }
        const imgTransformer = {
          dependencies: [UploadNode],
          export: (node) => {
            if (!$isUploadNode(node)) {
              return null;
            }
            let imageURL = imageURLMap[node.getData().value?.id];
            return `![](${imageURL})`;
          },
          type: 'element'
        }
        let markdown: string;
        headlessEditor.getEditorState().read(() => {
        markdown = $convertToMarkdownString([...sanitizedEditorConfig?.features?.markdownTransformers, imgTransformer]);
        })
        let fullContent = frontMatter + markdown;
        let fileHandle;
        try {
          fileHandle = await open(`C:/Users/ACS/Desktop/threadpen-blog/Workware/src/content/blog/${doc.slug}.md`, "w+");
          await fileHandle.write(fullContent);
        } catch (e) {
          console.log(e);
        } finally {
          await fileHandle?.close();
        }
    }
}