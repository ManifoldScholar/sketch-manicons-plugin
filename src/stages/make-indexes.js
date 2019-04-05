import fs from "@skpm/fs";
import path from "@skpm/path";
import helpers from "../helpers";
import humps from "humps";
import ejs from "ejs";
import indexTemplate from "../template/index.js"
import capitalize from "lodash/capitalize";
import sortBy from "lodash/sortBy";
import startsWith from "lodash/startsWith";

export default function makeIndexes(target) {

  const root = path.join(target, "..");
  const components = helpers.components(root).map((p) => {
    const rel = path.relative(root, p).split('.').slice(0, -1).join('.');
    const size = rel.split("/")[0].trim();
    const fileName = path.basename(p);
    const ext = path.extname(fileName);
    const file = path.basename(fileName, ext);
    const parts = file.split("-");
    const pathParts = rel.split('/');

    let exportName;
    if (Number.isInteger(parseInt(size))) {
      exportName = `${humps.pascalize(parts.join("_"))}${capitalize(size)}`;
    } else {
      pathParts.pop();
      exportName = `${humps.pascalize(`${pathParts.join("_")}--${file}`)}`;
    }

    // A hack, for now, to handle icons with BE at the beginning of the name.
    if(startsWith(exportName, "Be")) exportName = exportName.replace(/^.{2}/g, 'BE');

    return { rel: `./${rel}`, exportName }
  });

  const data = { components: sortBy(components, "exportName") };

  let out = ejs.render(indexTemplate, data, {});
  fs.writeFileSync(path.join(root, "index.js"), out, 'utf8');

  return Promise.resolve();

}
