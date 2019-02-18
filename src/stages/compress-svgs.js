import helpers from '../helpers';
import svgoConfig from "../svgo/svgo-config";
import svgo from 'svgo'
import svgoPlugins from "../svgo/svgo-plugins";
import fs from "@skpm/fs";

const floatPrecision = typeof svgoConfig.floatPrecision !== 'undefined'
  ? Number(svgoConfig.floatPrecision)
  : undefined;

if (typeof svgoConfig.full === 'undefined') { svgoConfig.full = true }
if (typeof svgoConfig.multipass === 'undefined') { svgoConfig.multipass = true }
if (typeof svgoConfig.pretty === 'undefined') { svgoConfig.pretty = true }
if (typeof svgoConfig.indent === 'undefined') { svgoConfig.indent = 2 }

const parsedSVGOPlugins = []
svgoConfig.plugins.forEach(item => {
  if (typeof item.enabled !== 'undefined' && !item.enabled) {
    return
  }
  let plugin = svgoPlugins[item.name]
  plugin.pluginName = item.name
  plugin.active = true
  if (plugin.params) {
    if (floatPrecision && 'floatPrecision' in plugin.params) {
      plugin.params.floatPrecision = floatPrecision
    }
  }
  if (item.params != null) {
    if (typeof plugin.params === 'undefined') {
      plugin.params = {}
    }
    for (var attrname in item.params) {
      plugin.params[attrname] = item.params[attrname]
    }
  }
  parsedSVGOPlugins.push([plugin])
});

function compressSVG(path) {

  const svgCompressor = new svgo({
   full: svgoConfig.full,
   js2svg: {
     pretty: svgoConfig.pretty,
     indent: svgoConfig.indent
   },
   plugins: parsedSVGOPlugins,
   multipass: svgoConfig.multipass
 })

 const src = fs.readFileSync(path, 'utf-8');
 const promise = svgCompressor.optimize(src)
 promise.then(result => {
    fs.writeFileSync(path, result.data, 'utf8')
 })
 return promise;
}

export default function compressSVGs(target) {

  const paths = helpers.paths(`${target}/icon`);
  const promises = []
  paths.forEach((path) => {
    promises.push(compressSVG(path));
  })
  return Promise.all(promises);
}
