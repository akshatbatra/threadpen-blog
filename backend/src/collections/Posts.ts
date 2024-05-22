import { CollectionConfig } from 'payload/types'
import createMarkdownForPost from "./hooks/createMarkdownForPost"

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      admin: {
        position: 'sidebar'
      },
      required: true,
    },
    {
      name: "description",
      type: "text",
      admin: {
        position: 'sidebar'
      },
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "coverPhoto",
      type: "upload",
      relationTo: "cover-photos",
      required: false,
    },
    {
      name: "slug",
      type: "text",
      admin: {
        position: 'sidebar'
      },
      required: true,
    }
  ],
  hooks: {
    afterChange: [createMarkdownForPost],
  },
}

export default Posts;
