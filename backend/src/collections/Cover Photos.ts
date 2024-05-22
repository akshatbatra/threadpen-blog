import { CollectionConfig } from 'payload/types';
import { resolveModuleNameFromCache } from 'typescript';
import handlePhoto from './hooks/handlePhoto';

const CoverPhotos: CollectionConfig = {
    slug: 'cover-photos',
    admin: {
      useAsTitle: 'title',
    },
    access: {
      read: () => true,
    },
    upload: {
      staticURL: "/cover",
      staticDir: "../../public/cover-photos",
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
  
  export default CoverPhotos;