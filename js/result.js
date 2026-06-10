/**
 * result.js - 结果页渲染
 */

const DIM_CLASS_MAP = {
  compliance: 'dim-compliance',
  business: 'dim-business',
  governance: 'dim-governance',
  balanced: 'dim-balanced'
};

const ResultRenderer = {
  render(identity, level, dimension) {
    const levelNames = {
      L1: '支付学徒', L2: '支付进阶者',
      L3: '支付探索者', L4: '支付达人'
    };

    const nameEl = document.getElementById('result-name');
    const quoteEl = document.getElementById('result-quote');
    const commentEl = document.getElementById('result-ai-comment');
    const stepsEl = document.getElementById('result-steps');
    const levelTagEl = document.getElementById('result-level-tag');
    const silhouetteEl = document.getElementById('result-silhouette');

    if (nameEl) nameEl.textContent = identity.name;
    if (quoteEl) quoteEl.textContent = identity.quote;
    if (commentEl) commentEl.textContent = identity.aiComment;
    if (levelTagEl) levelTagEl.textContent = level + ' · ' + (levelNames[level] || '');

    if (silhouetteEl) {
      silhouetteEl.className = 'identity-silhouette ' + (DIM_CLASS_MAP[dimension] || 'dim-balanced');
    }

    if (stepsEl) {
      stepsEl.innerHTML = '';
      (identity.nextSteps || []).forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsEl.appendChild(li);
      });
    }

    const scrollWrap = document.querySelector('.scroll-wrap');
    if (scrollWrap) {
      scrollWrap.style.animation = 'none';
      scrollWrap.offsetHeight;
      scrollWrap.style.animation = '';
    }
  }
};
