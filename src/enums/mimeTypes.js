const MIME_TYPES = {
  IMAGE: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],
  VIDEO: [
    'video/mp4',
    'video/x-m4v',
    'video/ogg',
    'video/quicktime',
    'video/webm',
  ],
  AUDIO: ['audio/mpeg', 'audio/mp3'],
  PDF: ['application/pdf'],
};

Object.freeze(MIME_TYPES);

export default MIME_TYPES;
