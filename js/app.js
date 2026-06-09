/**
 * app.js - 应用入口，视图路由与事件绑定
 */

const App = {
  currentLevel: null,
  quizState: null,
  resultIdentity: null,

  init() {
    this._bindHomeEvents();
    this._bindQuizEvents();
    this._bindResultEvents();
    this.showView('home');
  },

  // ===== 视图切换 =====
  showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const el = document.getElementById('view-' + viewId);
    if (el) el.classList.add('active');
    window.scrollTo(0, 0);
  },

  // ===== 首页事件 =====
  _bindHomeEvents() {
    document.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        const level = card.dataset.level;
        this.startQuiz(level);
      });
    });
  },

  // ===== 开始答题 =====
  async startQuiz(level) {
    this.currentLevel = level;
    const loadingEl = document.getElementById('quiz-loading');
    const contentEl = document.getElementById('quiz-content');

    this.showView('quiz');
    if (loadingEl) loadingEl.style.display = 'block';
    if (contentEl) contentEl.style.display = 'none';

    try {
      const allQ = await DataLoader.loadQuestions(level);
      const questions = QuizEngine.prepareQuestions(allQ);
      this.quizState = QuizEngine.createState(questions);

      if (loadingEl) loadingEl.style.display = 'none';
      if (contentEl) contentEl.style.display = 'block';

      // 设置等级标签
      const levelNames = { L1: '支付学徒', L2: '支付进阶者', L3: '支付探索者', L4: '支付达人' };
      const levelTagEl = document.querySelector('.quiz-level-tag');
      if (levelTagEl) levelTagEl.textContent = level + ' · ' + (levelNames[level] || '');

      this._renderQuestion();
    } catch (e) {
      if (loadingEl) {
        loadingEl.textContent = '';
        const tipBox = document.createElement('div');
        tipBox.className = 'tip-box';
        const icon = document.createElement('div');
        icon.className = 'tip-icon';
        icon.textContent = '⚠️';
        const msg = document.createElement('p');
        msg.textContent = e.message;
        tipBox.appendChild(icon);
        tipBox.appendChild(msg);
        loadingEl.appendChild(tipBox);
      }
    }
  },

  // ===== 渲染当前题目 =====
  _renderQuestion() {
    const state = this.quizState;
    const q = state.questions[state.currentIndex];
    const total = state.questions.length;
    const current = state.currentIndex + 1;

    // 更新进度文字
    const progressText = document.querySelector('.quiz-progress-text');
    if (progressText) progressText.textContent = '第 ' + current + ' 题 / 共 ' + total + ' 题';

    // 更新进度点
    const dotsEl = document.querySelector('.quiz-dots');
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'quiz-dot' + (i < state.currentIndex ? ' done' : i === state.currentIndex ? ' current' : '');
        dotsEl.appendChild(dot);
      }
    }

    // 题目文本
    const questionEl = document.getElementById('quiz-question');
    if (questionEl) questionEl.textContent = q.question;

    // 选项
    const optionsEl = document.getElementById('quiz-options');
    if (optionsEl) {
      optionsEl.innerHTML = '';
      const labels = ['A', 'B', 'C', 'D'];
      q.shuffledOptions.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.dataset.index = idx;
        btn.innerHTML = '<span class="option-label">' + labels[idx] + '</span><span class="option-text"></span>';
        btn.querySelector('.option-text').textContent = opt;
        btn.addEventListener('click', () => this._onSelectOption(idx));
        optionsEl.appendChild(btn);
      });
    }

    // 隐藏解析和下一题按钮
    const explanationEl = document.getElementById('quiz-explanation');
    if (explanationEl) explanationEl.classList.remove('show');
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) nextBtn.classList.remove('show');
  },

  // ===== 选择选项 =====
  _onSelectOption(idx) {
    const state = this.quizState;
    if (state.isAnswered) return;

    const isCorrect = QuizEngine.submitAnswer(state, idx);
    const q = state.questions[state.currentIndex];

    // 标记选项状态
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.add('disabled');
      const btnIdx = parseInt(btn.dataset.index);
      if (btnIdx === q.correctShuffledIndex) {
        btn.classList.add('correct');
      } else if (btnIdx === idx && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // 显示解析
    const explanationEl = document.getElementById('quiz-explanation');
    const explanationText = document.getElementById('quiz-explanation-text');
    if (explanationEl) explanationEl.classList.add('show');
    if (explanationText) explanationText.textContent = q.explanation;

    // 判断是否最后一题
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
      nextBtn.classList.add('show');
      const isLast = state.currentIndex >= state.questions.length - 1;
      nextBtn.textContent = isLast ? '查看我的江湖身份' : '下一题';
    }
  },

  // ===== 绑定答题页按钮事件 =====
  _bindQuizEvents() {
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this._onNext());
    }
  },

  _onNext() {
    const hasMore = QuizEngine.nextQuestion(this.quizState);
    if (hasMore) {
      this._renderQuestion();
    } else {
      this._showResult();
    }
  },

  // ===== 显示结果 =====
  async _showResult() {
    try {
      const resultConfig = await DataLoader.loadResultConfig();
      const identity = CalcEngine.getIdentity(this.currentLevel, resultConfig, this.quizState.answers);
      this.resultIdentity = identity;
      ResultRenderer.render(identity, this.currentLevel);
      this.showView('result');
    } catch (e) {
      alert('结果加载失败：' + e.message);
    }
  },

  // ===== 结果页事件 =====
  _bindResultEvents() {
    const retryBtn = document.getElementById('btn-retry');
    if (retryBtn) retryBtn.addEventListener('click', () => this.showView('home'));

    const posterBtn = document.getElementById('btn-poster');
    if (posterBtn) posterBtn.addEventListener('click', () => this._openPoster());

    const posterClose = document.getElementById('poster-close');
    if (posterClose) posterClose.addEventListener('click', () => this._closePoster());

    const downloadBtn = document.getElementById('btn-download');
    if (downloadBtn) downloadBtn.addEventListener('click', () => PosterGenerator.download());

    document.getElementById('poster-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('poster-modal')) this._closePoster();
    });
  },

  _openPoster() {
    if (this.resultIdentity) {
      PosterGenerator.draw(this.resultIdentity, this.currentLevel);
      document.getElementById('poster-modal')?.classList.add('show');
    }
  },

  _closePoster() {
    document.getElementById('poster-modal')?.classList.remove('show');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());