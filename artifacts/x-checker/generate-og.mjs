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
function makePNG(W, H, pixels) {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr.writeUInt8(8, 8); ihdr.writeUInt8(6, 9); ihdr.fill(0, 10);
  const raw = [];
  for (let y = 0; y < H; y++) {
    raw.push(0);
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
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

function clamp(v) { return Math.min(255, Math.max(0, Math.round(v))); }

function drawOG() {
  const W = 1200, H = 630;
  const pixels = new Uint8Array(W * H * 4);

  const BOX_CX = 600, BOX_CY = 315;
  const BOX_W = 900, BOX_H = 472;
  const BOX_R = 48;

  const LOGO_SZ = 220;
  const lx1 = BOX_CX + LOGO_SZ * -0.156, lyt = BOX_CY + LOGO_SZ * -0.244, lyb = BOX_CY + LOGO_SZ * 0.244, lxv = BOX_CX + LOGO_SZ * -0.35;
  const rx1 = BOX_CX + LOGO_SZ * 0.156, rxv = BOX_CX + LOGO_SZ * 0.35;
  const slX1 = BOX_CX + LOGO_SZ * 0.083, slY1 = BOX_CY + LOGO_SZ * -0.278, slX2 = BOX_CX + LOGO_SZ * -0.083, slY2 = BOX_CY + LOGO_SZ * 0.278;
  const bStroke = LOGO_SZ * 0.072;
  const sStroke = LOGO_SZ * 0.058;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x + 0.5, py = y + 0.5;
      const i = (y * W + x) * 4;

      const bgT = (px / W * 0.6 + py / H * 0.4);
      let r = clamp(0x0a + (0x16 - 0x0a) * bgT);
      let g = clamp(0x0f + (0x0f - 0x0f) * bgT);
      let b = clamp(0x1e + (0x38 - 0x1e) * bgT);

      const distC = Math.hypot(px - BOX_CX, py - BOX_CY);
      const glow = Math.max(0, 1 - distC / 560) ** 2;
      r = clamp(r + 28 * glow);
      g = clamp(g + 10 * glow);
      b = clamp(b + 65 * glow);

      const bx = Math.abs(px - BOX_CX), by = Math.abs(py - BOX_CY);
      let inBox = bx <= BOX_W / 2 && by <= BOX_H / 2;
      if (inBox) {
        const cx2 = BOX_W / 2, cy2 = BOX_H / 2;
        if (bx > cx2 - BOX_R && by > cy2 - BOX_R) {
          inBox = Math.hypot(bx - (cx2 - BOX_R), by - (cy2 - BOX_R)) <= BOX_R;
        }
      }

      if (inBox) {
        const bT = (px / W + py / H) * 0.5;
        r = clamp(0x12 + (0x1a - 0x12) * bT);
        g = clamp(0x10 + (0x0e - 0x10) * bT);
        b = clamp(0x2c + (0x44 - 0x2c) * bT);

        const boxGlow = Math.max(0, 1 - distC / 380) ** 1.8;
        r = clamp(r + 32 * boxGlow);
        g = clamp(g + 12 * boxGlow);
        b = clamp(b + 72 * boxGlow);

        const gridX = Math.abs((px % 60) - 30) < 0.6 || Math.abs((py % 60) - 30) < 0.6;
        if (gridX) { r = clamp(r + 8); g = clamp(g + 6); b = clamp(b + 20); }
      }

      const borderDist = Math.min(
        Math.abs(px - (BOX_CX - BOX_W / 2)),
        Math.abs(px - (BOX_CX + BOX_W / 2)),
        Math.abs(py - (BOX_CY - BOX_H / 2)),
        Math.abs(py - (BOX_CY + BOX_H / 2))
      );

      const dL1 = distToSeg(px, py, lx1, lyt, lxv, BOX_CY);
      const dL2 = distToSeg(px, py, lxv, BOX_CY, lx1, lyb);
      const dSl = distToSeg(px, py, slX1, slY1, slX2, slY2);
      const dR1 = distToSeg(px, py, rx1, lyt, rxv, BOX_CY);
      const dR2 = distToSeg(px, py, rxv, BOX_CY, rx1, lyb);

      const minD = Math.min(dL1, dL2, dSl, dR1, dR2);
      const onSymbol = (dL1 < bStroke || dL2 < bStroke) || dSl < sStroke || (dR1 < bStroke || dR2 < bStroke);
      const onBracket = (dL1 < bStroke || dL2 < bStroke || dR1 < bStroke || dR2 < bStroke);
      const onSlash = dSl < sStroke;

      if (onSymbol) {
        const edge = Math.max(0, 1 - minD / (onSlash ? sStroke : bStroke));
        if (onBracket && !onSlash) {
          r = clamp(245 * edge + r * (1 - edge));
          g = clamp(245 * edge + g * (1 - edge));
          b = clamp(255 * edge + b * (1 - edge));
        } else {
          r = clamp(200 * edge + r * (1 - edge));
          g = clamp(200 * edge + g * (1 - edge));
          b = clamp(255 * edge + b * (1 - edge));
        }
      }

      const dots = [
        [BOX_CX + 360, BOX_CY - 160, 5],
        [BOX_CX + 390, BOX_CY + 120, 3.5],
        [BOX_CX - 380, BOX_CY - 140, 4],
        [BOX_CX - 360, BOX_CY + 150, 3],
        [BOX_CX + 200, BOX_CY - 200, 2.5],
        [BOX_CX - 180, BOX_CY + 195, 2.5],
        [BOX_CX + 50,  BOX_CY - 210, 2],
        [BOX_CX - 60,  BOX_CY + 205, 2],
      ];
      for (const [dx, dy, dr] of dots) {
        const dd = Math.hypot(px - dx, py - dy);
        if (dd < dr) {
          const a = Math.max(0, 1 - dd / dr);
          r = clamp(r + 60 * a);
          g = clamp(g + 40 * a);
          b = clamp(b + 140 * a);
        }
      }

      pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = 255;
    }
  }
  return pixels;
}

const outDir = resolve(__dirname, "public");
const png = makePNG(1200, 630, drawOG());
writeFileSync(resolve(outDir, "opengraph.png"), png);
console.log("  Generated opengraph.png (1200x630)");
