import fs from "@skpm/fs";

export default function cleanTarget(target) {
  if (!target) return;
  if (fs.existsSync(target)) fs.rmdirSync(target);
  return Promise.resolve();
}
