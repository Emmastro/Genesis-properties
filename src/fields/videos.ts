import type { Field } from 'payload'

/**
 * Videos can be uploaded straight to the media library (mp4/webm/mov) or
 * linked from YouTube, TikTok, Instagram or Vimeo — whichever is easier.
 */
export const videosField: Field = {
  name: 'videos',
  type: 'array',
  labels: { singular: 'Video', plural: 'Videos' },
  admin: {
    description: 'Upload a video file, or paste a YouTube / TikTok / Instagram / Vimeo link.',
    initCollapsed: true,
  },
  fields: [
    { name: 'title', type: 'text' },
    {
      type: 'row',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'video' } },
          admin: { width: '50%' },
        },
        {
          name: 'url',
          label: 'Or a link',
          type: 'text',
          admin: { width: '50%', placeholder: 'https://www.youtube.com/watch?v=…' },
        },
      ],
    },
  ],
}
