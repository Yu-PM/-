/**
 * calc-engine.js - 维度计算与身份映射引擎
 * 后台静默计算，不向UI层暴露分数和维度名称
 */

const CalcEngine = {
  DIMENSIONS: ['compliance', 'business', 'governance'],

  /**
   * 根据答题记录计算主导维度
   * @param {Array} answers - QuizEngine 产生的 answers 数组
   * @returns {string} dominantDimension: 'compliance' | 'business' | 'governance' | 'balanced'
   */
  calcDominantDimension(answers) {
    const scores = { compliance: 0, business: 0, governance: 0 };

    answers.forEach(a => {
      if (a.isCorrect && scores.hasOwnProperty(a.dimension)) {
        scores[a.dimension]++;
      }
    });

    const values = Object.values(scores);
    const maxScore = Math.max(...values);

    // 找出所有得最高分的维度
    const topDimensions = this.DIMENSIONS.filter(d => scores[d] === maxScore);

    // 若最高分为0（全部答错），判定为 balanced
    if (maxScore === 0) return 'balanced';

    // 若多个维度并列最高，判定为 balanced
    if (topDimensions.length > 1) return 'balanced';

    // 检查最高分与第二高分的差距
    const sortedValues = [...values].sort((a, b) => b - a);
    const secondScore = sortedValues[1];

    // 差距 <= 1 则判定为 balanced
    if (maxScore - secondScore <= 1) return 'balanced';

    return topDimensions[0];
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