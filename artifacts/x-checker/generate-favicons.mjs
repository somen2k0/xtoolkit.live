import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[i] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const l = Buffer.allocUnsafe(4); l.writeUInt32BE(data.length);
  const c = Buffer.allocUnsafe(4); c.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([l, t, data, c]);
}
function makePNG(size, pixels) {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8); ihdr.writeUInt8(6, 9); ihdr.fill(0, 10);
  const raw = [];
  for (let y = 0; y < size; y++) {
    raw.push(0);
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      raw.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.from(raw))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function distToSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function drawIcon(size) {
  const pixels = new Uint8Array(size * size * 4);
  const cr = size * 0.20;
  const bStroke = Math.max(1.2, size * 0.092);
  const sStroke = Math.max(1.0, size * 0.075);

  const lx1 = size * 0.344, lyt = size * 0.256, lyb = size * 0.744, lxv = size * 0.15;
  const rx1 = size * 0.656, rxv = size * 0.85;
  const slX1 = size * 0.583, slY1 = size * 0.222, slX2 = size * 0.417, slY2 = size * 0.778;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5, py = y + 0.5;
      const i = (y * size + x) * 4;

      let outside = false;
      if (px < cr && py < cr) outside = Math.hypot(px - cr, py - cr) > cr;
      else if (px > size - cr && py < cr) outside = Math.hypot(px - (size - cr), py - cr) > cr;
      else if (px < cr && py > size - cr) outside = Math.hypot(px - cr, py - (size - cr)) > cr;
      else if (px > size - cr && py > size - cr) outside = Math.hypot(px - (size - cr), py - (size - cr)) > cr;

      if (outside) { pixels[i + 3] = 0; continue; }

      const t = (px + py) / (2 * size);
      const r = Math.round(0x4f + (0x7c - 0x4f) * t);
      const g = Math.round(0x46 + (0x3a - 0x46) * t);
      const b = Math.round(0xe5 + (0xed - 0xe5) * t);

      const cy = size * 0.5;
      const dL1 = distToSeg(px, py, lx1, lyt, lxv, cy);
      const dL2 = distToSeg(px, py, lxv, cy, lx1, lyb);
      const dSl = distToSeg(px, py, slX1, slY1, slX2, slY2);
      const dR1 = distToSeg(px, py, rx1, lyt, rxv, cy);
      const dR2 = distToSeg(px, py, rxv, cy, rx1, lyb);

      const onSymbol = dL1 < bStroke || dL2 < bStroke || dSl < sStroke || dR1 < bStroke || dR2 < bStroke;

      if (onSymbol) {
        pixels[i] = 255; pixels[i + 1] = 255; pixels[i + 2] = 255; pixels[i + 3] = 255;
      } else {
        pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = 255;
      }
    }
  }
  return pixels;
}

const outDir = resolve(__dirname, "public");

for (const size of [48, 192, 512]) {
  const png = makePNG(size, drawIcon(size));
  writeFileSync(resolve(outDir, `favicon-${size}.png`), png);
  console.log(`  Generated favicon-${size}.png`);
}

function makeICO(png16, png32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(2, 4);

  const entry16 = Buffer.alloc(16);
  entry16.writeUInt8(16, 0); entry16.writeUInt8(16, 1);
  entry16.writeUInt8(0, 2); entry16.writeUInt8(0, 3);
  entry16.writeUInt16LE(1, 4); entry16.writeUInt16LE(32, 6);
  entry16.writeUInt32LE(png16.length, 8);
  entry16.writeUInt32LE(6 + 32, 12);

  const entry32 = Buffer.alloc(16);
  entry32.writeUInt8(32, 0); entry32.writeUInt8(32, 1);
  entry32.writeUInt8(0, 2); entry32.writeUInt8(0, 3);
  entry32.writeUInt16LE(1, 4); entry32.writeUInt16LE(32, 6);
  entry32.writeUInt32LE(png32.length, 8);
  entry32.writeUInt32LE(6 + 32 + png16.length, 12);

  return Buffer.concat([header, entry16, entry32, png16, png32]);
}

const png16 = makePNG(16, drawIcon(16));
const png32 = makePNG(32, drawIcon(32));
writeFileSync(resolve(outDir, "favicon.ico"), makeICO(png16, png32));
console.log("  Generated favicon.ico");
console.log("Favicons ready.");
