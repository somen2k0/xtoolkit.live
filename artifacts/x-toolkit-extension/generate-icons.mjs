import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
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

      // Dark navy background matching website logo (#09071a → #110d24)
      const t = (px + py) / (2 * size);
      const bgR = Math.round(0x09 + (0x11 - 0x09) * t);
      const bgG = Math.round(0x07 + (0x0d - 0x07) * t);
      const bgB = Math.round(0x1a + (0x24 - 0x1a) * t);

      const cy = size * 0.5;
      const dL1 = distToSeg(px, py, lx1, lyt, lxv, cy);
      const dL2 = distToSeg(px, py, lxv, cy, lx1, lyb);
      const dSl = distToSeg(px, py, slX1, slY1, slX2, slY2);
      const dR1 = distToSeg(px, py, rx1, lyt, rxv, cy);
      const dR2 = distToSeg(px, py, rxv, cy, rx1, lyb);

      const onSymbol = dL1 < bStroke || dL2 < bStroke || dSl < sStroke || dR1 < bStroke || dR2 < bStroke;

      if (onSymbol) {
        // Purple/violet X matching website gradient (#c4b5fd → #7c3aed)
        const st = (px + py) / (2 * size);
        pixels[i]     = Math.round(0xc4 + (0x7c - 0xc4) * st);
        pixels[i + 1] = Math.round(0xb5 + (0x3a - 0xb5) * st);
        pixels[i + 2] = Math.round(0xfd + (0xed - 0xfd) * st);
        pixels[i + 3] = 255;
      } else {
        pixels[i] = bgR; pixels[i + 1] = bgG; pixels[i + 2] = bgB; pixels[i + 3] = 255;
      }
    }
  }
  return pixels;
}

const outDir = resolve(__dirname, "public/icons");
mkdirSync(outDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const png = makePNG(size, drawIcon(size));
  writeFileSync(resolve(outDir, `icon${size}.png`), png);
  console.log(`  Generated icon${size}.png`);
}
console.log("Icons ready.");
