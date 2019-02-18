import sketch from 'sketch'
import helpers from './helpers';
import os from "@skpm/os";
import exportArtboards from "./stages/export-artboards";
import cleanTarget from "./stages/clean-target";
import cleanDocument from "./stages/clean-document";
import compressSVGs from "./stages/compress-svgs";
import makeComponents from "./stages/make-components";

export default function() {

  const homeDir   = os.homedir();
  const target    = `${homeDir}/src/manifold/client/src/global/components/icon/svg`;
  const artboards = helpers.duplicateSelection(helpers.selectedIcons());

  try {
    Promise.resolve()
      .then(_ => {
        cleanTarget(target);
      })
      .then(_ => {
        exportArtboards(artboards, target);
      })
      .then(_ => {
        cleanDocument(artboards);
      })
      .then(_ => {
        compressSVGs(target);
      })
      .then(_ => {
        makeComponents(target);
      })
      .catch(error => {
        if (typeof artboards !== undefined) cleanDocument(artboards);
        console.log(error);
      });
  } catch(error) {
    if (typeof artboards !== undefined) cleanDocument(artboards);
    throw error;
  }

}
