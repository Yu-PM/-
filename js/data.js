/**
 * data.js - 数据加载器
 * 异步加载题库JSON和身份配置文件
 */

const DataLoader = {
  _cache: {},

  async loadQuestions(level) {
    const key = 'questions_' + level;
    if (this._cache[key]) return this._cache[key];
    try {
      const res = await fetch('./question-bank/' + level.toLowerCase() + '.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      this._cache[key] = data;
      return data;
    } catch (e) {
      console.error('题库加载失败:', e);
      throw new Error('题库加载失败，请使用本地服务器（如 Live Server）打开此页面。');
    }
  },

  async loadResultConfig() {
    if (this._cache['resultConfig']) return this._cache['resultConfig'];
    try {
      const res = await fetch('./result-config.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      this._cache['resultConfig'] = data;
      return data;
    } catch (e) {
      console.error('身份配置加载失败:', e);
      throw new Error('身份配置加载失败，请使用本地服务器打开此页面。');
    }
  }
};