/**
 * poster.js - 水墨风分享海报生成（Canvas 2D）
 */

const PosterGenerator = {
  CANVAS_W: 750,
  CANVAS_H: 1334,

  LEVEL_THEMES: {
    L1: { primary: '#5a9e6f', light: '#d4edda', bg: '#f5faf5', dark: '#2d6a3f', name: '支付学徒' },
    L2: { primary: '#64748b', light: '#e2e8f0', bg: '#f5f7fa', dark: '#334155', name: '支付进阶者' },
    L3: { primary: '#C79A3B', light: '#fde68a', bg: '#fffdf5', dark: '#92400e', name: '支付探索者' },
    L4: { primary: '#991b1b', light: '#fecaca', bg: '#fdf5f5', dark: '#7f1d1d', name: '支付达人' },
  },

  DIM_LABELS: {
    compliance: '律',
    business: '商',
    governance: '账',
    balanced: '道',
  },

  DIM_SILHOUETTES: {
    compliance: [
      [0.50,0],[0.43,0.06],[0.40,0.14],[0.36,0.28],[0.28,0.35],[0.14,0.42],[0.18,0.50],[0.30,0.46],[0.36,0.40],[0.37,0.54],[0.35,0.70],[0.33,0.86],[0.38,1],[0.62,1],[0.67,0.86],[0.65,0.70],[0.63,0.54],[0.64,0.40],[0.70,0.46],[0.82,0.50],[0.86,0.42],[0.72,0.35],[0.64,0.28],[0.60,0.14],[0.57,0.06]
    ],
    business: [
      [0.50,0],[0.42,0.08],[0.38,0.20],[0.33,0.32],[0.22,0.40],[0.12,0.38],[0.12,0.44],[0.26,0.50],[0.36,0.44],[0.37,0.52],[0.34,0.68],[0.32,0.84],[0.36,1],[0.44,0.92],[0.50,0.80],[0.56,0.92],[0.64,1],[0.68,0.84],[0.66,0.68],[0.63,0.52],[0.64,0.44],[0.74,0.50],[0.88,0.44],[0.88,0.38],[0.78,0.40],[0.67,0.32],[0.62,0.20],[0.58,0.08]
    ],
    governance: [
      [0.50,0],[0.42,0.08],[0.37,0.22],[0.32,0.34],[0.24,0.42],[0.22,0.54],[0.28,0.52],[0.38,0.44],[0.40,0.50],[0.38,0.66],[0.35,0.82],[0.38,1],[0.48,1],[0.50,0.98],[0.52,1],[0.62,1],[0.65,0.82],[0.62,0.66],[0.60,0.50],[0.62,0.44],[0.72,0.52],[0.78,0.54],[0.76,0.42],[0.68,0.34],[0.63,0.22],[0.58,0.08]
    ],
    balanced: [
      [0.50,0],[0.42,0.06],[0.37,0.18],[0.32,0.30],[0.18,0.36],[0.06,0.38],[0.08,0.44],[0.22,0.52],[0.34,0.44],[0.36,0.50],[0.34,0.66],[0.30,0.82],[0.34,1],[0.46,0.96],[0.50,0.94],[0.54,0.96],[0.66,1],[0.70,0.82],[0.66,0.66],[0.64,0.50],[0.66,0.44],[0.78,0.52],[0.92,0.44],[0.94,0.38],[0.82,0.36],[0.68,0.30],[0.63,0.18],[0.58,0.06]
    ]
  },

  draw(identity, level, dimension) {
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = this.CANVAS_W;
    canvas.height = this.CANVAS_H;
    const W = this.CANVAS_W, H = this.CANVAS_H;
    const theme = this.LEVEL_THEMES[level] || this.LEVEL_THEMES.L3;
    const dimChar = this.DIM_LABELS[dimension] || '道';

    this._drawBg(ctx, W, H, theme);
    this._drawMountains(ctx, W, H, theme);
    this._drawInkTexture(ctx, W, H);
    this._drawBorder(ctx, W, H, theme);
    this._drawHeader(ctx, W, H, theme, level);
    this._drawSilhouette(ctx, W, H, theme, dimension);
    this._drawIdentity(ctx, W, H, theme, identity);
    this._drawQuote(ctx, W, H, theme, identity.quote);
    this._drawFooter(ctx, W, H, theme);
    this._drawSeal(ctx, W, H, theme, dimChar);
  },

  _drawBg(ctx, W, H, theme) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1a1510');
    grad.addColorStop(0.25, '#2a2218');
    grad.addColorStop(0.4, '#4a3f30');
    grad.addColorStop(0.55, '#7a6b50');
    grad.addColorStop(0.7, '#b8a882');
    grad.addColorStop(0.85, '#d4c9a8');
    grad.addColorStop(1, theme.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  },

  _drawMountains(ctx, W, H, theme) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#1a1510';
    ctx.beginPath();
    ctx.moveTo(0, H * 0.38);
    ctx.quadraticCurveTo(W * 0.12,H * 0.22, W * 0.25, H * 0.32);
    ctx.quadraticCurveTo(W * 0.38, H * 0.18, W * 0.52, H * 0.28);
    ctx.quadraticCurveTo(W * 0.65, H * 0.15, W * 0.78, H * 0.26);
    ctx.quadraticCurveTo(W * 0.9, H * 0.2, W, H * 0.34);
    ctx.lineTo(W, H * 0.45);
    ctx.lineTo(0, H * 0.45);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#2a2218';
    ctx.beginPath();
    ctx.moveTo(0, H * 0.42);
    ctx.quadraticCurveTo(W * 0.2, H * 0.35, W * 0.4, H * 0.4);
    ctx.quadraticCurveTo(W * 0.6, H * 0.33, W * 0.8, H * 0.38);
    ctx.quadraticCurveTo(W * 0.95, H * 0.32, W, H * 0.4);
    ctx.lineTo(W, H * 0.5);
    ctx.lineTo(0, H * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.2;
    const fog = ctx.createLinearGradient(0, H * 0.38, 0, H * 0.52);
    fog.addColorStop(0, 'transparent');
    fog.addColorStop(0.5, 'rgba(200,190,170,0.7)');
    fog.addColorStop(1, 'transparent');
    ctx.fillStyle = fog;
    ctx.fillRect(0, H * 0.38, W, H * 0.14);
    ctx.restore();
  },

  _drawInkTexture(ctx, W, H) {
    ctx.save();
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 120; i++) {
      const x = (i * 137.5) % W;
      const y = (i * 89.3) % H;
      const r = ((i * 17) % 4) + 1;
      ctx.fillStyle = '#1a1510';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  _drawBorder(ctx, W, H, theme) {
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, W - 56, H - 56);

    ctx.strokeStyle = this._rgba(theme.primary, 0.25);
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    const cs = 26;
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3;
    [[44, 44, 1, 1], [W - 44, 44, -1, 1], [44, H - 44, 1, -1], [W - 44, H - 44, -1, -1]].forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * cs);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * cs, y);
      ctx.stroke();
    });
  },

  _drawHeader(ctx, W, H, theme, level) {
    ctx.fillStyle = theme.light;
    ctx.font = 'bold 40px "Ma Shan Zheng", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('支付江湖榜', W / 2, 80);

    ctx.fillStyle = this._rgba(theme.primary, 0.5);
    ctx.font = '20px sans-serif';
    ctx.fillText('测一测你在支付江湖中的身份', W / 2, 118);

    ctx.fillStyle = this._rgba(theme.primary, 0.12);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(W / 2 - 90, 138, 180, 34, 17);
    else ctx.rect(W / 2 - 90, 138, 180, 34);
    ctx.fill();
    ctx.fillStyle = theme.light;
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(level + ' · ' + (theme.name || ''), W / 2, 155);
  },

  _drawSilhouette(ctx, W, H, theme, dimension) {
    const points = this.DIM_SILHOUETTES[dimension] || this.DIM_SILHOUETTES.balanced;
    const cx = W / 2;
    const topY = H * 0.2;
    const silW = 200;
    const silH = 320;

    ctx.save();
    const silGrad = ctx.createLinearGradient(cx, topY, cx, topY + silH);
    silGrad.addColorStop(0, 'rgba(42,34,24,0.5)');
    silGrad.addColorStop(0.5, 'rgba(42,34,24,0.8)');
    silGrad.addColorStop(1, 'rgba(42,34,24,0.95)');
    ctx.fillStyle = silGrad;

    ctx.beginPath();
    const startX = cx - silW / 2 + points[0][0] * silW;
    const startY = topY + points[0][1] * silH;
    ctx.moveTo(startX, startY);
    for (let i = 1; i < points.length; i++) {
      const px = cx - silW / 2 + points[i][0] * silW;
      const py = topY + points[i][1] * silH;
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.15;
    ctx.fillStyle = theme.primary;
    ctx.beginPath();
    ctx.ellipse(cx, topY + silH + 10, silW * 0.4, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  _drawIdentity(ctx, W, H, theme, identity) {
    const y = H * 0.52;

    ctx.save();
    ctx.fillStyle = theme.dark;
    ctx.font = 'bold 62px "Ma Shan Zheng", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = this._rgba(theme.primary, 0.3);
    ctx.shadowBlur = 12;
    ctx.fillText(identity.name, W / 2, y);
    ctx.restore();

    ctx.strokeStyle = this._rgba(theme.primary, 0.4);
    ctx.lineWidth = 1;
    const lineW = Math.min(ctx.measureText(identity.name).width + 40, W * 0.6);
    ctx.beginPath();
    ctx.moveTo(W / 2 - lineW / 2, y + 40);
    ctx.lineTo(W / 2 + lineW / 2, y + 40);
    ctx.stroke();

    ctx.fillStyle = '#4a4a4a';
    ctx.font = '24px sans-serif';
    ctx.textBaseline = 'top';
    this._wrapText(ctx, identity.intro, W / 2, y + 60, W - 160, 38);
  },

  _drawQuote(ctx, W, H, theme, quote) {
    const qY = H * 0.68;
    const qH = 100;

    ctx.fillStyle = this._rgba(theme.primary, 0.06);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(60, qY, W - 120, qH, 10);
    else ctx.rect(60, qY, W - 120, qH);
    ctx.fill();

    ctx.fillStyle = theme.primary;
    ctx.fillRect(60, qY + 12, 4, qH - 24);

    ctx.fillStyle = this._rgba(theme.primary, 0.15);
    ctx.font = 'bold 60px serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('“', 72, qY + 4);

    ctx.fillStyle = theme.dark;
    ctx.font = 'italic 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    this._wrapText(ctx, quote, W / 2, qY + qH / 2, W - 200, 34);
  },

  _drawFooter(ctx, W, H, theme) {
    ctx.strokeStyle = this._rgba(theme.primary, 0.3);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, H - 160);
    ctx.lineTo(W - 100, H - 160);
    ctx.stroke();

    ctx.fillStyle = theme.primary;
    ctx.font = 'bold 22px "Ma Shan Zheng", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('支付知多少 · 测出你的江湖地位', W / 2, H - 125);

    ctx.fillStyle = this._rgba(theme.primary, 0.5);
    ctx.font = '16px sans-serif';
    ctx.fillText('扫码挑战，发现你的支付身份', W / 2, H - 92);
  },

  _drawSeal(ctx, W, H, theme, dimChar) {
    const sx = W - 100, sy = H - 100, r = 34;
    ctx.save();
    ctx.globalAlpha = 0.85;

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(sx, sy, r - 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = theme.primary;
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dimChar, sx, sy);
    ctx.restore();
  },

  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return;
    const chars = text.split('');
    let line = '', currentY = y;
    ctx.textAlign = 'center';
    for (let i = 0; i < chars.length; i++) {
      const test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, currentY);
  },

  _rgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  },

  download(name) {
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = '支付江湖_' + (name || '身份') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
};
