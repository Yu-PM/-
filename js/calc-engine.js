/**
 * calc-engine.js - 维度计算与身份映射引擎
 * 基于答题准确率 + 维度倾向 进行身份判定
 * 后台静默计算，不向UI层暴露任何分数
 */

const CalcEngine = {
  DIMENSIONS: ['compliance', 'business', 'governance'],

  /**
   * 根据答题记录计算主导维度
   * 策略：
   * 1. 统计各维度答对数
   * 2. 答错的题也给 0.1 分微弱信号（表示用户接触了该领域）
   * 3. 只有三维度得分完全相等才判定 balanced
   */
  calcDominantDimension(answers) {
    const scores = { compliance: 0, business: 0, governance: 0 };

    answers.forEach(a => {
      if (!scores.hasOwnProperty(a.dimension)) return;
      if (a.isCorrect) {
        scores[a.dimension] += 1;
      } else {
        scores[a.dimension] += 0.1;
      }
    });

    const values = this.DIMENSIONS.map(d => scores[d]);
    const maxScore = Math.max(...values);
    const minScore = Math.min(...values);

    // 全部为0或极低分
    if (maxScore <= 0.2) return 'balanced';

    // 只有三个维度得分完全相等时才判定 balanced
    if (maxScore === minScore) return 'balanced';

    // 找出最高维度
    const topDimension = this.DIMENSIONS.reduce((best, d) =>
      scores[d] > scores[best] ? d : best
    , this.DIMENSIONS[0]);

    return topDimension;
  },

  /**
   * 根据等级和主导维度，从配置中获取身份信息
   * @param {string} level - 'L1' | 'L2' | 'L3' | 'L4'
   * @param {Object} resultConfig - 完整身份配置
   * @param {Array} answers - 答题记录
   * @returns {Object} 身份配置对象
   */
  getIdentity(level, resultConfig, answers) {
    const dominantDimension = this.calcDominantDimension(answers);
    return resultConfig[level][dominantDimension];
  }
};