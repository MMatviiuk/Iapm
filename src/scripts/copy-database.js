#!/usr/bin/env node

/**
 * Copy Database Script
 * Ensures complete-database.json is copied to public/data/ before dev/build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility: get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, 'data', 'complete-database.json');
const targetDir = path.join(projectRoot, 'public', 'data');
const targetPath = path.join(targetDir, 'complete-database.json');

console.log('\n📋 Database Copy Script');
console.log('─────────────────────────');

try {
  // Check if source file exists
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Source file not found:', sourcePath);
    process.exit(1);
  }

  // Create target directory
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('✓ Created directory:', targetDir);
  }

  // Copy file
  fs.copyFileSync(sourcePath, targetPath);
  
  // Verify copy
  const sourceSize = fs.statSync(sourcePath).size;
  const targetSize = fs.statSync(targetPath).size;
  
  if (sourceSize !== targetSize) {
    console.error('❌ File size mismatch!');
    console.error('  Source:', sourceSize, 'bytes');
    console.error('  Target:', targetSize, 'bytes');
    process.exit(1);
  }

  console.log('✓ Copied complete-database.json to public/data/');
  console.log('  Size:', sourceSize, 'bytes');
  console.log('─────────────────────────\n');
  
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\nPaths:');
  console.error('  Source:', sourcePath);
  console.error('  Target:', targetPath);
  process.exit(1);
}
