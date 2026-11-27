const fs = require('fs');
const path = require('path');

async function downloadFont() {
  const dir = path.join(__dirname, '../public/fonts');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const dest = path.join(dir, 'JameelNooriNastaleeq.woff');
  const url = 'https://cdn.jsdelivr.net/gh/tariq-abdullah/urdu-web-font-CDN/JameelNooriNastaleeq.woff';

  console.log('Downloading Jameel Noori Nastaleeq font from:', url);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download font: ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(dest, buffer);
  console.log(`Font downloaded successfully! Size: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB saved to: ${dest}`);
}

downloadFont().catch(console.error);
