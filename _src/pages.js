/* ================= 入门页、汇总页、导航 ================= */
function introHTML() {
  const fig = (svg, cap) => `<figure><svg viewBox="0 0 160 130">${svg}</svg><figcaption>${T(cap)}</figcaption></figure>`;
  const c1 = D.hatch(40, 18, 120, 18, -1) + D.ln(80, 18, 80, 76, 'rope') + `<rect x="58" y="76" width="44" height="32" class="body"/>` + D.af(80, 76, 40, 90, { c: 'u', l: 'F_T', lp: [104, 52] });
  const c2 = D.fixed(80, 78) + D.af(80, 78, 46, 0, { c: 'u', g: 6, l: 'F_x', lp: [140, 70] }) + D.af(80, 78, 46, 90, { c: 'u', g: 6, l: 'F_y', lp: [100, 26] });
  const c3 = D.roller(80, 80) + D.af(80, 80, 50, 90, { c: 'u', g: 6, l: 'F_N', lp: [104, 30] });
  const c4 = D.rod([[34, 98], [126, 44]]) + D.pin(34, 98) + D.pin(126, 44) + D.af(126, 44, 26, 30.4, { c: 'u', g: 6, l: 'F', lp: [146, 16] }) + D.af(34, 98, 26, 210.4, { c: 'u', g: 6, l: 'F′', lp: [16, 124] });
  const cp = D.rod([[60, 85], [340, 85]]) + D.af(110, 85, 52, 270, { g: 6, l: 'F', lp: [94, 140] }) + D.af(290, 85, 52, 90, { g: 6, l: 'F′', lp: [310, 36] }) + D.dim(110, 155, 290, 155, 'd') + D.couple(200, 85, 26, false, 'M', { c: 'r' });
  const items = PROBS.map(p => `<tr><td><a href="#${p.id}">${p.nav}</a></td><td>${p.short}</td><td>${T(p.sum[0])}</td></tr>`).join('');
  return `<article>
    <div class="tag">开始之前</div>
    <div class="ph"><h2>先花 5 分钟，把这几样东西认熟</h2></div>
    <p class="lead">这次作业是 P27 平面汇交力系 7 题、P36 平面力偶系 4 题，共 11 题，用到的东西都在这一页。每道题的讲解页左边是图，右边是步骤；点"下一步"或按键盘 <span class="kbd">→</span>，图上的力会一步步画出来。颜色是固定的：<b style="color:var(--known)">红色</b>是已知的力，<b style="color:var(--unk)">蓝色</b>是要求的力，<b style="color:var(--res)">绿色</b>是算出来的结果。</p>
    <div class="pr">
      <div class="prc">
        <h3>1　力是一支有方向的箭头</h3>
        <p>力有三个要素：大小、方向、作用点。斜着的力可以拆成水平、竖直两部分，叫<b>投影</b>。拖动滑块看看：</p>
        <svg id="projsvg" viewBox="0 0 400 220"></svg>
        <div class="ctrl" style="border:none;padding:0"><label><span>力和水平线的夹角 α</span><span id="projv">30°</span></label><input type="range" id="proj" min="0" max="90" step="1" value="30"></div>
        <div class="readout" id="projro"></div>
      </div>
      <div class="prc">
        <h3>2　平衡就是"合起来等于零"</h3>
        <p>物体静止、匀速直线运动、匀速转动，都叫<b>平衡</b>。平衡时：</p>
        <div><b>汇交力系</b>（所有力交于一点）$$ΣF_x=0，ΣF_y=0$$两个方程，最多解出两个未知量。</div>
        <div style="margin-top:8px"><b>力偶系</b>（只有力偶）$$ΣM=0$$一个方程。</div>
        <div class="tip"><b>两个小技巧</b>　① 坐标轴尽量和某个未知力垂直，它在方程里就消失了，不用解方程组。② 算出来的力是负数，说明真实方向和假设相反，不用重算。</div>
      </div>
      <div class="prc wide">
        <h3>3　四种常见的约束：把它们换成力</h3>
        <p>画受力图时，要把绳子、支座、相连的杆拿掉，换成它们给物体的力。换成什么样的力，取决于约束的种类：</p>
        <div class="cons">
          ${fig(c1, '<b>绳索</b>只能拉，力沿绳子、背离物体。')}
          ${fig(c2, '<b>固定铰支座、铰链</b>任何方向都能挡，方向事先不知道，一般拆成 $F_x$、$F_y$。')}
          ${fig(c3, '<b>活动铰支座</b>（带滚轮）只挡垂直于支承面的方向，力垂直于支承面。')}
          ${fig(c4, '<b>二力杆</b>两端铰接、中间不受力的杆，两个力等大反向，沿两铰连线。')}
        </div>
      </div>
      <div class="prc">
        <h3>4　力偶：只转不移</h3>
        <svg viewBox="0 0 400 175">${cp}</svg>
        <div style="font-size:14.5px;color:var(--ink2)">一对大小相等、方向相反、作用线平行但不重合的力叫<b>力偶</b>。它不让物体移动，只让物体转。转的效果用力偶矩表示：$$M=F·d$$逆时针取正，顺时针取负。</div>
        <div class="tip"><b>关键结论</b>　力偶只能用力偶平衡。一个构件上如果只有一个力偶和两个约束力，这两个约束力一定等大、反向、平行，组成一个力偶。P36 的 4 道题全靠这一句。</div>
      </div>
      <div class="prc">
        <h3>5　每道题都按这四步走</h3>
        <ol class="four">
          <li><b>选研究对象</b>：选哪个物体或哪个铰点来分析。优先选未知量不超过方程数的那个。</li>
          <li><b>画受力图</b>：把它单独画出来，绳、杆、支座都换成力。先找二力杆。</li>
          <li><b>建坐标、列方程</b>：汇交力系列 $ΣF_x=0$、$ΣF_y=0$；力偶系列 $ΣM=0$。</li>
          <li><b>解方程、看正负</b>：负号表示实际方向和假设相反，最后写"答"。</li>
        </ol>
      </div>
    </div>
    <section class="blk"><h3>题目清单</h3>
      <table class="sum"><tr><th>题号</th><th>内容</th><th>要求</th></tr>${items}</table>
    </section>
    <nav class="pn"><span></span><a href="#${PROBS[0].id}" style="text-align:right"><small>开始</small>${PROBS[0].nav} ${PROBS[0].short}</a></nav>
  </article>`;
}
function drawProj(a) {
  const ox = 50, oy = 186, L = 170, c = Math.cos(a * RAD), sn = Math.sin(a * RAD);
  const [tx, ty] = pol(ox, oy, L, a);
  let s = D.arrow(ox - 14, oy, 380, oy, { c: 'ax', h: 10, w: 4, l: 'x', lp: [390, oy + 5] }) + D.arrow(ox, oy + 14, ox, 14, { c: 'ax', h: 10, w: 4, l: 'y', lp: [ox + 14, 20] });
  s += D.ln(tx, ty, tx, oy, 'dsh') + D.ln(tx, ty, ox, ty, 'dsh');
  if (L * c > 18) s += D.arrow(ox, oy, tx, oy, { c: 'g', dash: 1, l: 'F_x', lp: [(ox + tx) / 2, oy + 24] });
  if (L * sn > 18) s += D.arrow(ox, oy, ox, ty, { c: 'g', dash: 1, l: 'F_y', lp: [ox - 22, (oy + ty) / 2 + 5] });
  s += D.arrow(ox, oy, tx, ty, { l: 'F', lp: [tx + 14, ty - 4] });
  if (a > 3) s += D.arc(ox, oy, 42, 0, a, 'α', { lo: 13 });
  return s;
}
function initIntro() {
  const upd = () => {
    const a = +$('#proj').value;
    $('#projsvg').innerHTML = drawProj(a);
    $('#projv').textContent = a + '°';
    const c = Math.cos(a * RAD), sn = Math.sin(a * RAD);
    $('#projro').innerHTML = T(`设 F = 100 N，α = ${a}°：$F_x=Fcosα$ = 100 × ${c.toFixed(3)} = <b>${(100 * c).toFixed(1)} N</b>，$F_y=Fsinα$ = 100 × ${sn.toFixed(3)} = <b>${(100 * sn).toFixed(1)} N</b>`);
  };
  $('#proj').addEventListener('input', upd);
  upd();
}
function sumHTML() {
  const rows = PROBS.map(p => `<tr><td><a href="#${p.id}">${p.nav}</a></td><td>${T(p.sum[0])}</td><td>${T(p.sum[1])}</td></tr>`).join('');
  return `<article>
    <div class="tag">最后</div>
    <div class="ph"><h2>答案汇总</h2></div>
    <p class="lead">${T('做完可以对一下。点题号回到讲解页。第 11 题按老师要求取 $F_1$ = 100 kN。')}</p>
    <table class="sum"><tr><th>题号</th><th>求什么</th><th>答案</th></tr>${rows}</table>
    <nav class="pn"><a href="#${PROBS[PROBS.length - 1].id}"><small>上一题</small>${PROBS[PROBS.length - 1].nav} ${PROBS[PROBS.length - 1].short}</a><a href="#intro" style="text-align:right"><small>回到</small>先看这页</a></nav>
  </article>`;
}
function buildNav() {
  const item = p => `<a href="#${p.id}" data-id="${p.id}"><span class="no">${p.nav}</span><span class="t">${p.short}</span></a>`;
  const g1 = PROBS.filter(p => p.id.startsWith('p27')), g2 = PROBS.filter(p => p.id.startsWith('p36'));
  $('#nav').innerHTML = `<a href="#intro" data-id="intro"><span class="no">0</span><span class="t">先看这页</span></a>
    <h4>P27 平面汇交力系</h4>${g1.map(item).join('')}
    <h4>P36 平面力偶系</h4>${g2.map(item).join('')}
    <h4>最后</h4><a href="#sum" data-id="sum"><span class="no">✓</span><span class="t">答案汇总</span></a>`;
}
function route() {
  stop();
  const id = (location.hash || '#intro').slice(1);
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.id === id));
  const p = PROBS.find(x => x.id === id);
  S.p = null;
  if (p) { S.p = p; S.vi = 0; S.cur = 0; renderProb(p); document.title = `${p.nav} ${p.short} · 工程力学作业讲解`; }
  else if (id === 'sum') { $('#main').innerHTML = sumHTML(); document.title = '答案汇总 · 工程力学作业讲解'; }
  else { $('#main').innerHTML = T(introHTML()); initIntro(); document.title = '工程力学作业讲解'; }
  window.scrollTo(0, 0);
  const on = document.querySelector('#nav a.on');
  if (on && window.innerWidth <= 960) on.scrollIntoView({ block: 'nearest', inline: 'center' });
}
function initTheme() {
  const b = $('#theme'), modes = ['auto', 'dark', 'light'], names = { auto: '跟随系统', dark: '深色', light: '浅色' };
  let m = 'auto';
  try { m = localStorage.getItem('em-theme') || 'auto'; } catch (e) {}
  const apply = () => { if (m === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', m); b.textContent = '主题：' + names[m]; };
  b.onclick = () => { m = modes[(modes.indexOf(m) + 1) % 3]; try { localStorage.setItem('em-theme', m); } catch (e) {} apply(); };
  apply();
}
buildNav();
initTheme();
window.addEventListener('hashchange', route);
route();
