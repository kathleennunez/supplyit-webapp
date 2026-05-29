import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export async function readJson(file) {
  const raw = await fs.readFile(path.join(dataDir, file), "utf8");
  return JSON.parse(raw);
}

export async function writeJson(file, data) {
  await fs.writeFile(path.join(dataDir, file), JSON.stringify(data, null, 2), "utf8");
}
