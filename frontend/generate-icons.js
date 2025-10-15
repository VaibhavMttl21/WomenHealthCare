/**
 * PWA Icon Generator Script
 * 
 * This script generates all required PWA icons from a source image.
 * 
 * Prerequisites:
 * npm install sharp
 * 
 * Usage:
 * node generate-icons.js <source-image-path>
 * 
 * Example:
 * node generate-icons.js ./source-logo.png
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon configurations
const ICONS = {
  // Standard PWA icons
  'pwa-64x64.png': { width: 64, height: 64, padding: 0 },
  'pwa-192x192.png': { width: 192, height: 192, padding: 0 },
  'pwa-512x512.png': { width: 512, height: 512, padding: 0 },
  
  // Maskable icon (with padding)
  'maskable-icon-512x512.png': { width: 512, height: 512, padding: 80 },
  
  // Apple touch icons
  'apple-touch-icon.png': { width: 180, height: 180, padding: 0 },
  'apple-touch-icon-152x152.png': { width: 152, height: 152, padding: 0 },
  'apple-touch-icon-167x167.png': { width: 167, height: 167, padding: 0 },
  'apple-touch-icon-180x180.png': { width: 180, height: 180, padding: 0 },
  
  // Windows tile
  'mstile-150x150.png': { width: 150, height: 150, padding: 0 },
  
  // Shortcut icons
  'icon-appointment.png': { width: 96, height: 96, padding: 8 },
  'icon-chat.png': { width: 96, height: 96, padding: 8 },
};

// Splash screen configurations (iOS)
const SPLASH_SCREENS = {
  'apple-splash-2048-2732.png': { width: 2048, height: 2732 },
  'apple-splash-1668-2388.png': { width: 1668, height: 2388 },
  'apple-splash-1536-2048.png': { width: 1536, height: 2048 },
  'apple-splash-1170-2532.png': { width: 1170, height: 2532 },
  'apple-splash-1125-2436.png': { width: 1125, height: 2436 },
  'apple-splash-1242-2688.png': { width: 1242, height: 2688 },
};

const OUTPUT_DIR = path.join(__dirname, 'public');

// Theme colors for splash screens
const THEME_COLOR = '#4F46E5'; // Indigo
const BACKGROUND_COLOR = '#FFFFFF'; // White

async function generateIcon(sourcePath, outputName, config) {
  try {
    const { width, height, padding } = config;
    const actualSize = width - (padding * 2);
    
    let pipeline = sharp(sourcePath);
    
    // Resize with proper aspect ratio
    pipeline = pipeline.resize(actualSize, actualSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
    
    // Add padding if needed (for maskable icons)
    if (padding > 0) {
      pipeline = pipeline.extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      });
    }
    
    // Ensure final size
    pipeline = pipeline.resize(width, height, { fit: 'contain' });
    
    const outputPath = path.join(OUTPUT_DIR, outputName);
    await pipeline.png().toFile(outputPath);
    console.log(`✅ Generated: ${outputName}`);
  } catch (error) {
    console.error(`❌ Failed to generate ${outputName}:`, error);
  }
}

async function generateSplashScreen(sourcePath, outputName, config) {
  try {
    const { width, height } = config;
    
    // Load and resize icon to fit in splash screen
    const iconSize = Math.min(width, height) * 0.3; // 30% of smallest dimension
    
    const icon = await sharp(sourcePath)
      .resize(Math.round(iconSize), Math.round(iconSize), {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();
    
    // Create background
    const background = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: BACKGROUND_COLOR
      }
    })
    .png()
    .toBuffer();
    
    // Composite icon on background (centered)
    const splash = await sharp(background)
      .composite([{
        input: icon,
        gravity: 'center'
      }])
      .png();
    
    const outputPath = path.join(OUTPUT_DIR, outputName);
    await splash.toFile(outputPath);
    console.log(`✅ Generated splash: ${outputName}`);
  } catch (error) {
    console.error(`❌ Failed to generate splash ${outputName}:`, error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Usage: node generate-icons.js <source-image-path>');
    console.error('Example: node generate-icons.js ./logo.png');
    process.exit(1);
  }
  
  const sourcePath = args[0];
  
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source image not found: ${sourcePath}`);
    process.exit(1);
  }
  
  console.log('🚀 Starting PWA icon generation...');
  console.log(`📁 Source: ${sourcePath}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Generate standard icons
  console.log('📦 Generating icons...');
  for (const [name, config] of Object.entries(ICONS)) {
    await generateIcon(sourcePath, name, config);
  }
  
  // Generate splash screens
  console.log('\n🎨 Generating splash screens...');
  for (const [name, config] of Object.entries(SPLASH_SCREENS)) {
    await generateSplashScreen(sourcePath, name, config);
  }
  
  console.log('\n✅ All icons generated successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Review generated icons in public/ directory');
  console.log('2. Test icons on actual devices');
  console.log('3. Optimize images if needed (use TinyPNG or similar)');
  console.log('4. Update manifest.json if you changed any names');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
