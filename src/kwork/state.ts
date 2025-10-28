import fs from "fs/promises";
import path from "path";

const statePath = path.resolve("seenIds.json");

async function loadIds(): Promise<number[]> {
  try {
    const data = await fs.readFile(statePath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveIds(data: number[]): Promise<void> {
  await fs.writeFile(statePath, JSON.stringify(data, null, 2));
}

export async function appendId(id: number): Promise<void> {
  const data = await loadIds();
  if (!data.includes(id)) {
    data.push(id);
    await saveIds(data);
  }
}

export async function existId(id: number): Promise<boolean> {
  const data = await loadIds();
  return data.includes(id);
}
