#!/usr/bin/env node
/**
 * TEST IMAGE DOWNLOADER
 *
 * Downloads sample "bad fence" images for testing the transformation system.
 * All images are from free stock sites (Unsplash, Pexels) - free for commercial use.
 *
 * Usage: node assets/test-images/download-test-images.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Test images - curated "bad fence" / "old fence" images from free stock sites
const TEST_IMAGES = [
  {
    id: 'backyard-weathered-01',
    description: 'Weathered wooden fence in backyard',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    type: 'backyard',
    angle: 'straight',
  },
  {
    id: 'old-wood-fence-02',
    description: 'Old wooden privacy fence',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    type: 'backyard',
    angle: 'angled',
  },
  {
    id: 'rustic-fence-03',
    description: 'Rustic aged fence panels',
    url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200',
    type: 'side',
    angle: 'straight',
  },
  {
    id: 'worn-privacy-04',
    description: 'Worn privacy fence needing replacement',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
    type: 'backyard',
    angle: 'corner',
  },
  {
    id: 'aging-wood-05',
    description: 'Aging wood fence with weathering',
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200',
    type: 'backyard',
    angle: 'straight',
  },
  // Pexels images (direct URLs)
  {
    id: 'pexels-fence-06',
    description: 'Old fence in residential yard',
    url: 'https://images.pexels.com/photos/113726/pexels-photo-113726.jpeg?w=1200',
    type: 'backyard',
    angle: 'straight',
  },
  {
    id: 'pexels-weathered-07',
    description: 'Weathered backyard fence',
    url: 'https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?w=1200',
    type: 'side',
    angle: 'angled',
  },
  {
    id: 'pexels-old-08',
    description: 'Old wooden fence panels',
    url: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?w=1200',
    type: 'backyard',
    angle: 'straight',
  },
  {
    id: 'pexels-yard-09',
    description: 'Fence in need of repair',
    url: 'https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?w=1200',
    type: 'backyard',
    angle: 'corner',
  },
  {
    id: 'pexels-residential-10',
    description: 'Residential fence showing age',
    url: 'https://images.pexels.com/photos/1029606/pexels-photo-1029606.jpeg?w=1200',
    type: 'front',
    angle: 'straight',
  },
];

const OUTPUT_DIR = path.join(__dirname, 'bad-fences');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Download a single image
 */
function downloadImage(imageInfo) {
  return new Promise((resolve, reject) => {
    const filename = `${imageInfo.id}.jpg`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ✓ ${filename} (already exists)`);
      resolve({ ...imageInfo, filepath, skipped: true });
      return;
    }

    console.log(`  ↓ Downloading ${filename}...`);

    const protocol = imageInfo.url.startsWith('https') ? https : http;

    const request = protocol.get(imageInfo.url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        console.log(`    → Redirecting to ${redirectUrl.substring(0, 50)}...`);

        const redirectProtocol = redirectUrl.startsWith('https') ? https : http;
        redirectProtocol.get(redirectUrl, (redirectResponse) => {
          const file = fs.createWriteStream(filepath);
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`  ✓ ${filename}`);
            resolve({ ...imageInfo, filepath });
          });
        }).on('error', reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${imageInfo.url}`));
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✓ ${filename}`);
        resolve({ ...imageInfo, filepath });
      });
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

/**
 * Download all images
 */
async function downloadAll() {
  console.log('\n=== DOWNLOADING TEST IMAGES ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const results = [];
  let success = 0;
  let failed = 0;

  for (const image of TEST_IMAGES) {
    try {
      const result = await downloadImage(image);
      results.push(result);
      success++;
    } catch (error) {
      console.log(`  ✗ ${image.id}: ${error.message}`);
      failed++;
    }
  }

  // Write manifest
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(results.filter(r => !r.skipped || fs.existsSync(r.filepath)), null, 2));

  console.log(`\n=== COMPLETE ===`);
  console.log(`Downloaded: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Manifest: ${manifestPath}\n`);

  return results;
}

// Run
downloadAll().catch(console.error);
