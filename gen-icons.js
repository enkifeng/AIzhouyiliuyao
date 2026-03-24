// 用 Node.js 生成各尺寸 PNG 图标
// 需要: npm install canvas
// 运行: node gen-icons.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

for (const [dir, size] of Object.entries(sizes)) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 背景
  ctx.fillStyle = '#0d1b2a';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // 金色边框
  ctx.strokeStyle = '#d4a030';
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.roundRect(size*0.06, size*0.06, size*0.88, size*0.88, size * 0.16);
  ctx.stroke();

  // 文字 "爻"
  ctx.fillStyle = '#d4a030';
  ctx.font = `bold ${size * 0.5}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('爻', size / 2, size / 2);

  const outPath = path.join(__dirname, 'app/src/main/res', dir, 'ic_launcher.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));

  // 同时生成 round 版本
  const outPathRound = path.join(__dirname, 'app/src/main/res', dir, 'ic_launcher_round.png');
  fs.writeFileSync(outPathRound, canvas.toBuffer('image/png'));

  console.log(`✅ ${dir}/ic_launcher.png (${size}x${size})`);
}
console.log('图标生成完毕！');
