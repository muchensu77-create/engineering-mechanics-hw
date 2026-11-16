/* ========== 第三、四章用到的图元和动画 ========== */
// 均布载荷：x1..x2，y 为梁上表面
D.q = (x1, x2, y, o = {}) => {
  const h = o.h || 46, n = Math.max(3, Math.round((x2 - x1) / 26));
  let s = `<line x1="${f(x1)}" y1="${f(y - h)}" x2="${f(x2)}" y2="${f(y - h)}"/>`;
  for (let i = 0; i <= n; i++) {
    const x = x1 + (x2 - x1) * i / n;
    s += `<line x1="${f(x)}" y1="${f(y - h)}" x2="${f(x)}" y2="${f(y - 9)}"/><path d="M${f(x)},${f(y - 2)} L${f(x - 3.5)},${f(y - 10)} L${f(x + 3.5)},${f(y - 10)} Z"/>`;
  }
  s += `<text x="${f((x1 + x2) / 2)}" y="${f(y - h - 8)}" class="lb" text-anchor="middle">${lab(o.l || 'q')}</text>`;
  return D.g(s, o, 'ql');
};
// 固定端（墙）
D.wall = (x, y1, y2, side, o = {}) => D.g(D.hatch(x, y1, x, y2, side) + `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" class="frm"/>`, o);
// 桁架杆
D.bar = (p, q, o = {}) => `<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" class="bar${o.cls ? ' ' + o.cls : ''}"${at(o)}/>`;
// 沿直线方向旋转的文字
D.rtxt = (x, y, t, deg, cls = 'nt', o = {}) => `<text x="${f(x)}" y="${f(y)}" class="${cls}" text-anchor="${o.a || 'middle'}" transform="rotate(${-deg} ${f(x)} ${f(y)})"${at(o)}>${lab(t)}</text>`;
// 扇形色块（标角度用）
D.wedge = (cx, cy, r1, r2, a1, a2, o = {}) => {
  const [p1x, p1y] = pol(cx, cy, r1, a1), [p2x, p2y] = pol(cx, cy, r2, a1), [p3x, p3y] = pol(cx, cy, r2, a2), [p4x, p4y] = pol(cx, cy, r1, a2);
  return `<path d="M${f(p1x)},${f(p1y)} L${f(p2x)},${f(p2y)} A${r2},${r2} 0 0 0 ${f(p3x)},${f(p3y)} L${f(p4x)},${f(p4y)} A${r1},${r1} 0 0 1 ${f(p1x)},${f(p1y)} Z" class="wedge"${at(o)}/>`;
};

// 改参数（滑块、按钮共用）
function setParam(k, val) {
  const v = V(), pm = v.params[k];
  S.params[k] = val;
  const inp = $('#pr_' + k); if (inp) inp.value = val;
  const lb = $('#pv_' + k); if (lb) lb.textContent = pm.fmt(val);
  drawSVG(true); updReadout();
}
// 机构动画：按时间推进某个参数
const ANIM = { raf: 0, last: 0, dir: 1 };
function stopAnim() { if (ANIM.raf) cancelAnimationFrame(ANIM.raf); ANIM.raf = 0; const b = $('#bAnim'); if (b) b.textContent = '播放运动'; }
function startAnim() {
  const v = V(), A = v.anim, pm = v.params[A.k];
  stopAnim(); ANIM.last = 0; ANIM.dir = 1;
  const b = $('#bAnim'); if (b) b.textContent = '暂停运动';
  const tick = ts => {
    if (S.p == null || V() !== v) return stopAnim();
    if (ANIM.last) {
      let x = S.params[A.k] + ANIM.dir * A.speed * Math.min(0.05, (ts - ANIM.last) / 1000);
      if (x > pm.max) { if (A.mode === 'loop') x = pm.min + (x - pm.max); else { x = pm.max; ANIM.dir = -1; } }
      if (x < pm.min) { x = pm.min; ANIM.dir = 1; }
      setParam(A.k, x);
    }
    ANIM.last = ts; ANIM.raf = requestAnimationFrame(tick);
  };
  ANIM.raf = requestAnimationFrame(tick);
}
const animTool = () => ({ label: '播放运动', id: 'bAnim', on: () => ANIM.raf ? stopAnim() : startAnim() });
const jumpTool = (label, k, val) => ({ label, on: () => { stopAnim(); setParam(k, val); } });
