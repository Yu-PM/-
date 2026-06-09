/**
 * poster.js - 分享海报生成（Canvas 2D API）
 */

const PosterGenerator = {
  CANVAS_W: 750,
  CANVAS_H: 1200,

  /**
   * 绘制武侠风分享海报
   * @param {Object} identity - 身份配置
   * @param {string} level - 等级
   */
  draw(identity, level) {
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = this.CANVAS_W;
    canvas.height = this.CANVAS_H;

    const W = this.CANVAS_W;
    const H = this.CANVAS_H;

    // 背景 - 宣纸色
    ctx.fillStyle = '#F8F5EE';
    ctx.fillRect(0, 0, W, H);

    // 背景纹理 - 淡金色圆形渐变
    const grad1 = ctx.createRadialGradient(150, 200, 0, 150, 200, 400);
    grad1.addColorStop(0, 'rgba(199,154,59,0.08)');
    grad1.addColorStop(1, 'rgba(199,154,59,0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, W, H);

    const grad2 = ctx.createRadialGradient(600, 900, 0, 600, 900, 400);
    grad2.addColorStop(0, 'rgba(199,154,59,0.08)');
grad2.addColorStop(1, 'rgba(199,154,59,0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, W, H);

    // 外边框
    ctx.strokeStyle = '#C79A3B';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // 内边框
    ctx.strokeStyle = 'rgba(199,154,59,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // 顶部装饰线
    ctx.strokeStyle = '#C79A3B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 120); ctx.lineTo(W - 60, 120);
    ctx.stroke();

    // 标题 - 支付江湖榜
    ctx.fillStyle = '#C79A3B';
    ctx.font = 'bold 44px serif';
    ctx.textAlign = 'center';
    ctx.fillText('支付江湖榜', W / 2, 90);

    // 等级标签
    const levelNames = { L1: '支付学徒', L2: '支付进阶者', L3: '支付探索者', L4: '支付达人' };
    ctx.fillStyle = 'rgba(199,154,59,0.15)';
    ctx.beginPath();
    ctx.roundRect(W/2 - 140, 138, 280, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#9A7530';
    ctx.font = '24px sans-serif';
    ctx.fillText(level + ' · ' + (levelNames[level] || ''), W / 2, 169);

    // 徽章图标
    ctx.font = '140px serif';
    ctx.textAlign = 'center';
    ctx.fillText(identity.badge || '🏆', W / 2, 400);

    // 身份名称
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 80px serif';
    ctx.fillText('【' + identity.name + '】', W / 2, 510);

    // 中部分隔线
    ctx.strokeStyle = '#C79A3B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 550); ctx.lineTo(W - 80, 550);
    ctx.stroke();

    // 简介文字（自动换行）
    ctx.fillStyle = '#374151';
    ctx.font = '28px sans-serif';
    this._wrapText(ctx, identity.intro, W / 2, 610, W - 160, 44);

    // 经典语录区域
    ctx.fillStyle = 'rgba(199,154,59,0.10)';
    ctx.beginPath();
    ctx.roundRect(60, 780, W - 120, 120, 12);
    ctx.fill();
    ctx.strokeStyle = '#C79A3B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 793); ctx.lineTo(60, 887);
    ctx.stroke();

    ctx.fillStyle = '#9A7530';
    ctx.font = 'italic 30px serif';
    ctx.textAlign = 'center';
    ctx.fillText(identity.quote, W / 2, 848);

    // 底部标识
    ctx.strokeStyle = '#C79A3B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 960); ctx.lineTo(W - 80, 960);
    ctx.stroke();

    ctx.fillStyle = '#C79A3B';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('支付知多少 · 测出你的江湖地位', W / 2, 1000);

    ctx.fillStyle = 'rgba(199,154,59,0.5)';
    ctx.font = '20px sans-serif';
    ctx.fillText('扫码挑战，发现你的支付身份', W / 2, 1040);
  },

  /**
   * 自动换行文字绘制
   */
  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line = '';
    let currentY = y;
    ctx.textAlign = 'center';
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      if (ctx.measureText(testLine).width > maxWidth && line !== '') {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, x, currentY);
  },

  /**
   * 下载海报（PC端）
   */
  download(filename) {
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = filename || '支付江湖身份.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
};