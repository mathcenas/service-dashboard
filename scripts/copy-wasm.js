import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function copyWasmFile() {
  const sourceDir = path.join(__dirname, '../node_modules/sql.js/dist');
  const targetDir = path.join(__dirname, '../public');

  try {
    await fs.mkdir(targetDir, { recursive: true });
    await fs.copyFile(
      path.join(sourceDir, 'sql-wasm.wasm'),
      path.join(targetDir, 'sql-wasm.wasm')
    );
    console.log('Successfully copied sql-wasm.wasm to public directory');
  } catch (error) {
    console.error('Error copying wasm file:', error);
    process.exit(1);
  }
}

copyWasmFile();