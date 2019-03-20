import fs from "@skpm/fs";
import path from "@skpm/path";
import helpers from "../helpers";
import humps from "humps";
import ejs from "ejs";
import indexTemplate from "../template/index.js"

const nameFromPath = (sourcePath) => {
  const fileName = path.basename(sourcePath);
  const ext = path.extname(fileName);
  const file = path.basename(fileName, ext);
  const parts = file.split("-");
  if (Number.isInteger(parseInt(parts[0]))) parts.shift();
  return humps.pascalize(parts.join("_"));
}

export default function makeIndexes(target) {

  const root = path.join(target, "..");
  const components = helpers.components(root).map((p) => {
    const rel = path.relative(root, p)
    const size = rel.split("/")[0];
    const fileName = path.basename(p);
    const ext = path.extname(fileName);
    const file = path.basename(fileName, ext);
    const parts = file.split("-");
    if (Number.isInteger(parseInt(parts[0]))) parts.shift();
    const exportName = `${humps.pascalize(parts.join("_"))}${size}`;
    return { rel: `./${size}/${file}`, exportName }
  });

  const data = { components };
  
  let out = ejs.render(indexTemplate, data, {});
  fs.writeFileSync(path.join(root, "index.js"), out, 'utf8');

  return Promise.resolve();

}
