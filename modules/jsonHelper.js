import fs from 'fs/promises';

/**
 * Reads JSON data from a file
 * @param {string} filePath - path to JSON file
 * @returns {Promise<any>} parsed JSON data
 */
export async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading JSON from ${filePath}:`, err);
    return null;
  }
}

/**
 * Writes JSON data to a file
 * @param {string} filePath - path to JSON file
 * @param {any} data - data to write
 */
export async function writeJSON(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, json, 'utf8');
  } catch (err) {
    console.error(`Error writing JSON to ${filePath}:`, err);
  }
}

/**
 * Adds a new item to a JSON array file
 * @param {string} filePath
 * @param {any} newItem
 */
export async function addToJSON(filePath, newItem) {
  const data = (await readJSON(filePath)) || [];
  data.push(newItem);
  await writeJSON(filePath, data);
}

/**
 * Removes an item from a JSON array by id
 * @param {string} filePath
 * @param {string} id - ID of the item to remove
 * @returns {Promise<boolean>} - true if removed, false if not found
 */
export async function removeFromJSON(filePath, id) {
  const data = (await readJSON(filePath)) || [];
  const index = data.findIndex(item => item.id === id);

  if (index === -1) return false;

  data.splice(index, 1); 
  await writeJSON(filePath, data); 
  return true;
}

