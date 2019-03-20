import helpers from "../helpers";
import ejs from "ejs";
import fs from "@skpm/fs";
import path from "@skpm/path";
import componentTemplate from "../template/component.js"
import humps from "humps";
import { html2json, json2html } from "html2json";
import mapKeys from "lodash/mapKeys";

const makeOutputPath = (sourcePath, target) => {
  const dir = path.dirname(sourcePath);
  const fileName = path.basename(sourcePath);
  const ext = path.extname(fileName);
  const name = nameFromPath(sourcePath);
  const file = path.basename(fileName, ext);
  const writePath = path.relative(`${target}/icon/svg`, dir)
  const out = `${target}/${writePath}/${name}.js`;
  return out;
}

const nameFromPath = (sourcePath) => {
  const fileName = path.basename(sourcePath);
  const ext = path.extname(fileName);
  const file = path.basename(fileName, ext);
  const parts = file.split("-");
  if (Number.isInteger(parseInt(parts[0]))) parts.shift();
  return humps.pascalize(parts.join("_"));
}

const ensureDir = (writePath) => {
  const dir = path.dirname(writePath);
  if (fs.existsSync(dir)) return true;
  fs.mkdirSync(dir, { recursive: true });
}

const findAndAdjustSvg = (node) => {
  const svg = node["child"].find((childNode) => {
    if (childNode.node !== "element") return false;
    if (childNode.tag === "svg") return childNode;
    if (childNode.child) return findSvg(childNode.child);
    return false;
  })
  const width = svg.attr.width;
  const height = svg.attr.height;
  const viewBox = svg.attr.viewBox;
  svg.attr.width = "{width}"
  svg.attr.height = "{height}"
  svg.attr.className = "{className}"
  return { svg, width, height, viewBox };
}

const jsxifyAttributes = (node) => {
  if (node.attr) {
    node.attr = mapKeys(node.attr, (value, key) => {
      const newKey = humps.camelize(key, { separator: "-" });
      return newKey;
    })
  }
  if (Array.isArray(node.child)) {
    node.child.forEach((childNode) => {
      jsxifyAttributes(childNode);
    });
  }
  return node;
}

const svgJsx = (sourcePath) => {
  const src = fs.readFileSync(sourcePath, 'utf-8');
  const svgJson = html2json(src);
  jsxifyAttributes(svgJson);
  return findAndAdjustSvg(svgJson);
}

function makeComponent(sourcePath, target) {


  const options = {};
  const { svg, width, height, viewBox } = svgJsx(sourcePath);
  const svgGuts = json2html({
    node: "root",
    child: svg["child"]
  })
    .toString()
    .replace(/xlink:href/g, "href")
    .replace(/fill="#\d*"/g, "fill={this.fill}")
    .replace(/stroke="#\d*"/g, "stroke={this.stroke}")
  const name = nameFromPath(sourcePath);
  const data = {
    svg: svgGuts,
    width,
    height,
    viewBox: viewBox.join(" "),
    name
  };

  let out = ejs.render(componentTemplate, data, options);
  const outputPath = makeOutputPath(sourcePath, target);
  ensureDir(outputPath);
  console.log(`Writing component to ${outputPath}...`);
  fs.writeFileSync(outputPath, out, 'utf8');
}

export default function makeComponents(target) {

  const sourcePaths = helpers.paths(`${target}/icon`);
  sourcePaths.forEach((sourcePath) => {
    makeComponent(sourcePath, target);
  })

  return Promise.resolve(target);

}
