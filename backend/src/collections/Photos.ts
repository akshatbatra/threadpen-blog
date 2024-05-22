import { CollectionConfig } from 'payload/types';
import { resolveModuleNameFromCache } from 'typescript';
import handlePhoto from './hooks/handlePhoto';

const Photos: CollectionConfig = {
    slug: 'photos',
    admin: {
      useAsTitle: 'title',
    },
    access: {
      read: () => true,
    },
    upload: {
      staticURL: "/photos",
      staticDir: "../../public/photos",
      adminThumbnail: "thumbnail",
      mimeTypes: ["image/*"],
    },
    fields: [
      {
        name: "title",
        type: "text"
      }
    ],
    hooks: {
      beforeOperation: [handlePhoto],
    },
  }
  
  export default Photos;
