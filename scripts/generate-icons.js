/**
 * Icon Generator Script
 * Generates all required PWA icon sizes from source image
 * 
 * Usage:
 * 1. npm install sharp
 * 2. node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SIZES = [72, 96, 128, 144, 152, 384];
const SOURCE_FILE = path.join(__dirname, '../public/icon-512.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

async function generateIcons() {
  // Check if source exists
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`❌ Source file not found: ${SOURCE_FILE}`);
    console.log('Please place icon-512.png in the public folder');
    process.exit(1);
  }

  console.log('🎨 Generating PWA icons...\n');

  for (const size of SIZES) {
    const outputFile = path.join(OUTPUT_DIR, `icon-${size}.png`);
    
    try {
      await sharp(SOURCE_FILE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 10, g: 10, b: 15, alpha: 1 } // Match your theme
        })
        .toFile(outputFile);
      
      console.log(`✅ Generated icon-${size}.png (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate icon-${size}.png:`, error.message);
    }
  }

  console.log('\n🎉 All icons generated successfully!');
  console.log('You can now build and deploy your PWA.');
}

// Check if sharp is installed
try {
  require.resolve('sharp');
  generateIcons();
} catch (e) {
  console.log('📦 Installing sharp package...');
  const { execSync } = require('child_process');
  execSync('npm install sharp --save-dev', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Sharp installed, running generator...\n');
  generateIcons();
}
