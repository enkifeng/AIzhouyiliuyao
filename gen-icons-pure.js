/**
 * 用纯 Node.js 生成最简单的 PNG 图标（不依赖任何第三方库）
 * 颜色：深蓝背景 #0d1b2a，金色 #d4a030
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createSimplePng(size, bgColor, fgColor) {
  const w = size, h = size;
  const pixels = Buffer.alloc(w * h * 4);

  // 解析颜色
  const bg = hexToRgb(bgColor);
  const fg = hexToRgb(fgColor);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      // 圆角判断
      const r = size * 0.22;
      const cx = w / 2, cy = h / 2;
      const inCornerTL = x < r && y < r && dist(x, y, r, r) > r;
      const inCornerTR = x > w-r && y < r && dist(x, y, w-r, r) > r;
      const inCornerBL = x < r && y > h-r && dist(x, y, r, h-r) > r;
      const inCornerBR = x > w-r && y > h-r && dist(x, y, w-r, h-r) > r;

      if (inCornerTL || inCornerTR || inCornerBL || inCornerBR) {
        // 透明
        pixels[idx+3] = 0;
      } else {
        // 黄金边框
        const borderW = Math.max(2, Math.round(size * 0.06));
        const inBorder = x < borderW || x >= w-borderW || y < borderW || y >= h-borderW;
        // 中心区域画简单十字图案
        const cx2 = Math.round(w/2), cy2 = Math.round(h/2);
        const lineW = Math.max(2, Math.round(size * 0.08));
        const inCross = (Math.abs(x - cx2) < lineW && y > h*0.25 && y < h*0.75) ||
                        (Math.abs(y - cy2) < lineW && x > w*0.25 && x < w*0.75);

        let color = inBorder || inCross ? fg : bg;
        pixels[idx]   = color.r;
        pixels[idx+1] = color.g;
        pixels[idx+2] = color.b;
        pixels[idx+3] = 255;
      }
    }
  }
  return toPng(w, h, pixels);
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#',''), 16);
  return { r: (n>>16)&255, g: (n>>8)&255, b: n&255 };
}

function toPng(w, h, pixels) {
  // PNG signature
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT: scanlines with filter byte 0
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    pixels.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const compressed = zlib.deflateSync(raw);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeB, data]);
  const crc = crc32(crcInput);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([len, typeB, data, crcBuf]);
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  const table = makeCrcTable();
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF);
}

let _crcTable;
function makeCrcTable() {
  if (_crcTable) return _crcTable;
  _crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    _crcTable[n] = c;
  }
  return _crcTable;
}

// 生成各尺寸
const resDir = path.join(__dirname, 'app/src/main/res');
const configs = [
  ['mipmap-mdpi',    48],
  ['mipmap-hdpi',    72],
  ['mipmap-xhdpi',   96],
  ['mipmap-xxhdpi',  144],
  ['mipmap-xxxhdpi', 192],
];

for (const [dir, size] of configs) {
  const png = createSimplePng(size, '#0d1b2a', '#d4a030');
  const outDir = path.join(resDir, dir);
  fs.writeFileSync(path.join(outDir, 'ic_launcher.png'), png);
  fs.writeFileSync(path.join(outDir, 'ic_launcher_round.png'), png);
  console.log(`✅ ${dir}/ic_launcher.png  (${size}x${size})`);
}
console.log('\n所有图标生成完毕！');
