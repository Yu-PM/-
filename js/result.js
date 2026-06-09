/**
 * result.js - 结果页渲染
 */

const ResultRenderer = {
  /**
   * 渲染结果页所有内容
   * @param {Object} identity - 身份配置对象
   * @param {string} level - 等级字符串 'L1'-'L4'
   */
  render(identity, level) {
    const levelNames = {
      L1: '支付学徒', L2: '支付进阶者',
      L3: '支付探索者', L4: '支付达人'
    };

    // 身份徽章
    const badgeEl = document.getElementById('result-badge');
    const nameEl = document.getElementById('result-name');
    const introEl = document.getElementById('result-intro');
    const quoteEl = document.getElementById('result-quote');
    const commentEl = document.getElementById('result-ai-comment');
    const stepsEl = document.getElementById('result-steps');
    const levelTagEl = document.getElementById('result-level-tag');

    if (badgeEl) badgeEl.textContent = identity.badge;
    if (nameEl) nameEl.textContent = identity.name;
    if (introEl) introEl.textContent = identity.intro;
    if (quoteEl) quoteEl.textContent = identity.quote;
    if (commentEl) commentEl.textContent = identity.aiComment;
    if (levelTagEl) levelTagEl.textContent = level + ' · ' + (levelNames[level] || '');

    // 渲染修炼建议列表
    if (stepsEl) {
      stepsEl.innerHTML = '';
      (identity.nextSteps || []).forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsEl.appendChild(li);
      });
    }

    // 重置并触发卷轴动效
    const scrollWrap = document.querySelector('.scroll-wrap');
    if (scrollWrap) {
      scrollWrap.style.animation = 'none';
      // 强制重排触发重绘
      scrollWrap.offsetHeight;
      scrollWrap.style.animation = '';
    }
  }
};