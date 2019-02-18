import sketch from 'sketch'

export default function exportArtboards(artboards, target) {

  artboards.forEach((artboard) => {
    sketch.export(artboards, {
      formats: "svg",
      output: `${target}`
    })
  })

  return Promise.resolve();

}
