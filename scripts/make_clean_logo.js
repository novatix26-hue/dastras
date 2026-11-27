const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processLogo() {
  const inputPath = path.join(__dirname, '../public/logo.png');
  const tempPath = path.join(__dirname, '../public/logo-clean.png');
  const outputPath = path.join(__dirname, '../public/logo.png');
  
  const inputBuffer = fs.readFileSync(inputPath);
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();
  console.log('Image dimensions:', metadata.width, metadata.height, metadata.channels);
  
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  // data is a Buffer of RGBA values
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is part of the checkerboard background:
    const isWhite = r > 230 && g > 230 && b > 230;
    const isGray = (r > 185 && g > 185 && b > 185) && (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20);
    const isVeryLight = (r + g + b) / 3 > 210 && (b - r < 30);
    
    if (isWhite || isGray || isVeryLight) {
      // Make transparent
      data[i + 3] = 0;
    } else {
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      if (luminance > 220) {
        data[i + 3] = 0;
      }
    }
  }
  
  // Trim transparent borders
  const processedBuffer = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .trim()
  .png({ quality: 100 })
  .toBuffer();
  
  fs.writeFileSync(tempPath, processedBuffer);
  fs.copyFileSync(tempPath, outputPath);
  fs.unlinkSync(tempPath);
  console.log('Clean transparent logo saved successfully!');
}

processLogo().catch(err => {
  console.error('Error processing logo:', err);
});
