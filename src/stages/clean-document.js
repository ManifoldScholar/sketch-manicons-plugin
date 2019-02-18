export default function cleanDocument(artboards) {

  // remove the cloned artboards from the document
  artboards.forEach((layer) => {
    layer.remove();
  })

  return Promise.resolve();

}
