/* ========== 定时开放、匿名统计、“没看懂”标记 ========== */
const TEACHER = new URLSearchParams(location.search).get('view') === CONFIG.teacherKey;

// 未到开放时间返回“12月1日 08:00 开放”，已开放返回 null
function lockInfo(id) {
  const t = CONFIG.lock[id];
  if (TEACHER || !t) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})$/.exec(t);
  if (!m) return null;
  if (Date.now() >= new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:00+08:00`).getTime()) return null;
  return `${+m[2]}月${+m[3]}日 ${m[4]} 开放`;
}

// 统计：只记题号、步骤和次数，不记任何个人信息
const TR = { seen: new Set(), stepAt: 0, stepKey: '' };
function track(action, label, value) {
  if (!CONFIG.baiduId || TEACHER) return;
  const ev = ['_trackEvent', '讲解页', action, label];
  if (value != null) ev.push(Math.round(value));
  (window._hmt = window._hmt || []).push(ev);
}
function trackPage() {
  if (!CONFIG.baiduId || TEACHER) return;
  (window._hmt = window._hmt || []).push(['_trackPageview', location.pathname + location.hash]);
}
// 换步时记：到过哪一步（每次打开页面同一步只记一次），在上一步停了多久
function trackStep(i) {
  if (!S.p) return;
  const key = `${S.p.id}/${S.vi}`, now = Date.now();
  if (TR.stepKey && TR.stepAt) {
    const sec = (now - TR.stepAt) / 1000;
    if (sec > 3) track('停留秒数', TR.stepKey, Math.min(sec, 600));
  }
  TR.stepKey = `${key}/${i}`; TR.stepAt = now;
  if (!TR.seen.has(TR.stepKey)) { TR.seen.add(TR.stepKey); track('到达步骤', TR.stepKey); }
}

// “没看懂”：本机记住按过哪些步，第一次按时上报
const stuckKey = i => `em-stuck:${S.p.id}/${S.vi}/${i}`;
function isStuck(i) { try { return localStorage.getItem(stuckKey(i)) === '1'; } catch (e) { return false; } }
function toggleStuck(i, btn) {
  const on = !isStuck(i);
  try { if (on) localStorage.setItem(stuckKey(i), '1'); else localStorage.removeItem(stuckKey(i)); } catch (e) {}
  btn.classList.toggle('on', on);
  btn.textContent = on ? '已标记' : '没看懂';
  if (on) track('没看懂', `${S.p.id}/${S.vi}/${i}`);
}

if (CONFIG.baiduId && !TEACHER) {
  window._hmt = window._hmt || [];
  const sc = document.createElement('script');
  sc.src = 'https://hm.baidu.com/hm.js?' + CONFIG.baiduId;
  document.head.appendChild(sc);
}
