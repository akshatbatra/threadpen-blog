import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload/config'
//import webpack from 'webpack';
import Users from './collections/Users';
import Posts from './collections/Posts';
import CoverPhotos from './collections/Cover Photos';
import Photos from './collections/Photos';

const fullFilePath = path.resolve(__dirname, "collections/hooks/createMarkdownForPost");
const mockModulePath = path.resolve(__dirname, "mockModule.js");

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: (config) => {
      /*
      config.resolve.fallback.fs = false;
      config.resolve.fallback["node:fs/promises"] = false;
      config.resolve.alias.fs = false;
      config.resolve.alias["node:fs/promises"] = false;
      config.externals = {
        'node:fs/promises': 'commonjs2 node:fs/promises'
      };
      
      config.plugins.unshift(new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        console.log(resource.request);
        resource.request = resource.request.replace(/^node:/, "");
      }));
      */
      return {
        ...config,
        resolve:{
          ...config.resolve,
          alias: {
            ...config.resolve.alias,
            [fullFilePath]: mockModulePath,
          },
        },
      };
  }
  },
  editor: lexicalEditor({}),
  collections: [Users, Posts, Photos, CoverPhotos],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
