import sketch from 'sketch'
import helpers from './helpers';
import os from "@skpm/os";
import exportArtboards from "./stages/export-artboards";
import cleanTarget from "./stages/clean-target";
import cleanDocument from "./stages/clean-document";
import compressSVGs from "./stages/compress-svgs";
import makeComponents from "./stages/make-components";
import makeIndexes from "./stages/make-indexes";

export default function() {

  const homeDir   = os.homedir();
  const target    = `${homeDir}/Desktop/sketch-icon-export/icon/svg`;
  const artboards = helpers.duplicateSelection(helpers.selectedIcons());

  try {
    Promise.resolve()
      .then(_ => {
        console.log("cleaning target...")
        cleanTarget(target);
      })
      .then(_ => {
        console.log("exporting artboards...")
        exportArtboards(artboards, target);
      })
      .then(_ => {
        console.log("cleaning document...")
        cleanDocument(artboards);
      })
      .then(_ => {
        console.log("compressing SVGs...")
        compressSVGs(target);
      })
      .then(_ => {
        console.log("making components...")
        makeComponents(target);
      })
      .then(_ => {
        console.log("making indexes...")
        makeIndexes(target);
      })
      .catch(error => {
        if (typeof artboards !== undefined) cleanDocument(artboards);
        // console.log(error);
      });
  } catch(error) {
    if (typeof artboards !== undefined) cleanDocument(artboards);
    throw error;
  }

}
