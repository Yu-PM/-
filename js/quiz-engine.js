/**
 * quiz-engine.js - 题目引擎
 * 随机抽题、选项乱序、答题状态管理
 */

const QuizEngine = {
  QUIZ_COUNT: 6,

  /**
   * Fisher-Yates 洗牌算法
   */
  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  /**
   * 从题库中随机抽取 QUIZ_COUNT 道题，并打乱选项顺序
   * 返回处理后的题目数组，每题携带 shuffledOptions 和 correctShuffledIndex
   */
  prepareQuestions(allQuestions) {
    const picked = this._shuffle(allQuestions).slice(0, this.QUIZ_COUNT);
    return picked.map(q => {
      // 创建 [原始索引, 选项文本] 对
      const indexedOptions = q.options.map((text, idx) => ({ idx, text }));
      const shuffled = this._shuffle(indexedOptions);
      // 找出正确答案在乱序后的位置
      const correctShuffledIndex = shuffled.findIndex(o => o.idx === q.answer);
      return {
        ...q,
        shuffledOptions: shuffled.map(o => o.text),
        correctShuffledIndex
      };
    });
  },

  /**
   * 答题状态对象
   */
  createState(questions) {
    return {
      questions,
      currentIndex: 0,
      answers: [],    // 每题：{ selectedIndex, isCorrect }
      isAnswered: false
    };
  },

  /**
   * 提交答案，返回是否正确
   */
  submitAnswer(state, selectedShuffledIndex) {
    if (state.isAnswered) return null;
    const q = state.questions[state.currentIndex];
    const isCorrect = selectedShuffledIndex === q.correctShuffledIndex;
    state.answers.push({
      questionId: q.id,
      dimension: q.dimension,
      selectedIndex: selectedShuffledIndex,
      correctIndex: q.correctShuffledIndex,
      isCorrect
    });
    state.isAnswered = true;
    return isCorrect;
  },

  /**
   * 前进到下一题，返回是否还有更多题目
   */
  nextQuestion(state) {
    state.currentIndex++;
    state.isAnswered = false;
    return state.currentIndex < state.questions.length;
  },

  isFinished(state) {
    return state.answers.length >= state.questions.length;
  }
};