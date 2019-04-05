import sketch from 'sketch'

export default function exportArtboards(artboards, target) {

  artboards.forEach((artboard) => {
    artboard.background.includedInExport = false;
    sketch.export(artboard, {
      formats: "svg",
      // ["group-contents-only"]: true,
      output: `${target}`
    })
  })

  return Promise.resolve();

}
