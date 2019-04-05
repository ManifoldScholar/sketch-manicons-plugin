import sketch, {Document, Group} from "sketch/dom";
import startsWith from "lodash/startsWith";
import fs from "@skpm/fs";
import endsWith from "lodash/endsWith";

class Helpers {

  announce(msg) {
    sketch.UI.message(msg)
  }

  get doc() {
    return sketch.getSelectedDocument();
  }

  get page() {
    return this.doc.selectedPage
  }

  paths(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      if (endsWith(file, "svg")) {
        file = `${dir}/${file}`;
        const stat = fs.lstatSync(file);
        if (stat && stat.isDirectory()) {
          results = results.concat(this.paths(file));
        } else {
          results.push(file);
        }
      }
    })
    return results;
  }

  components(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      if (!endsWith(file, "index.js") && endsWith(file, "js")) {
        file = `${dir}/${file}`;
        const stat = fs.lstatSync(file);
        if (stat && stat.isDirectory()) {
          results = results.concat(this.paths(file));
        } else {
          results.push(file);
        }
      }
    })
    return results;
  }

  duplicateSelection(selection) {
    const duplicateSelection = [];
    selection.forEach(layer => {
      console.log(layer);
       const duplicatedLayer = layer.duplicate();
       duplicatedLayer.name = duplicatedLayer.name.toLowerCase().replace(/\s/g, '');
       duplicateSelection.push(duplicatedLayer);
   });
   return duplicateSelection;
  }

  selectedIcons() {
    const icons = [];
    this.selectedLayers().forEach((layer) => {
      if (startsWith(layer.name.toLowerCase(), "icon")) icons.push(layer);
    })
    const iconsCount = icons.length;
    console.log(`${iconsCount} icon layers selected.`);
    return icons;
  }

  selectedLayers() {
    const selectedLayers = this.doc.selectedLayers
    const selectedCount = selectedLayers.length
    console.log(`${selectedCount} layers selected.`);
    return selectedLayers;
  }

}

const helpers = new Helpers();
export default helpers;
