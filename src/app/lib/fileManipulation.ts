export const EXTENSIONS_BY_MIME_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

export const DATA_URL_MIME_MATCHER = /:(.*?);/;

export function dataURLtoBlob(dataurl) {
    const {bytes, type} = dataURLtoByteArrayAndMimeType(dataurl);
    return new Blob([bytes], {type}); // broken in IE < 10
}

function dataURLtoByteArrayAndMimeType (dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(DATA_URL_MIME_MATCHER)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  return {bytes: u8arr, type: mime};
}

export function getMimeTypeFromDataUrl (dataurl) {
  const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
  return mime;
}

export function blobToDataURL(blob) {
  return new Promise (resolve => {
    const a: FileReader = new FileReader();
    a.onload = function(e: FileReaderEvent) {
      resolve(e.target.result);
    };
    a.readAsDataURL(blob); // broken in IE < 10
  });
}

export function dataURLtoFile(dataurl, name?) {
  const {bytes, type} = dataURLtoByteArrayAndMimeType(dataurl);
    name = name || 'unnamed';
    return new File([bytes], name, {type}); // Broken in IE <= 11  // TODO: fix this
}

export function getExtensionForMimeType (mime) {
  const ext = EXTENSIONS_BY_MIME_TYPE[mime];
  if (!ext) throw new Error(`no file extension found for mime type "${mime}"`);
  return ext;
}

export function mimeTypeForExtension (ext) {
  let mime: any = false;
  for (const possibleMime in EXTENSIONS_BY_MIME_TYPE) {
    if (EXTENSIONS_BY_MIME_TYPE[possibleMime] === ext) mime = possibleMime;
  }
  if (!mime) throw new Error(`no mime type found for extension "${mime}"`);
  return mime;
}
