/* ================= 章节 ================= */
const CHAPTERS = [
  { id: 'ch1', key: 'p27', no: '第一章', short: '第1章', name: '平面汇交力系', src: '任务 1-2 · P27',
    desc: '所有力的作用线交于一点。只用两个投影方程，最多解两个未知量。',
    cards: [['平衡方程', '$ΣF_x=0$，$ΣF_y=0$。坐标轴尽量和未知力垂直，一个方程只含一个未知数。'], ['解析法', '每个力往 x、y 轴上投影，分量相加得合力：$F_R=#sqrt{F_{Rx}^2+F_{Ry}^2}$。'], ['几何法', '各力首尾相接画力多边形，封闭就是平衡；不封闭时从起点到终点的边就是合力。'], ['三力平衡汇交', '物体只受三个力平衡，三力作用线交于一点，可以用来确定未知力的方向。']] },
  { id: 'ch2', key: 'p36', no: '第二章', short: '第2章', name: '平面力偶系', src: '任务 1-3 · P36',
    desc: '物体上只有力偶。力偶只能用力偶平衡，只有一个方程 $ΣM=0$。',
    cards: [['力偶和力偶矩', '一对等大、反向、平行不共线的力，只转不移。$M=F·d$，逆时针为正。'], ['力偶只能由力偶平衡', '构件上有一个力偶和两个约束力时，两个约束力必定等大、反向、平行，组成反向力偶。'], ['力偶臂', '两条平行作用线之间的垂直距离，常常要作垂线才能看出来。']] },
  { id: 'ch3', key: 'p14', no: '第三章', short: '第3章', name: '平面任意力系', src: '任务 1-4',
    desc: '力的作用线不交于一点，也不全是力偶。三个平衡方程，最多解三个未知量。',
    cards: [['力对点之矩', '$M_O(F)=±F·d$，d 是 O 到力作用线的垂直距离，逆时针为正。对未知力的交点取矩，方程最简单。'], ['三个平衡方程', '$ΣF_x=0$，$ΣF_y=0$，$ΣM_A=0$。'], ['均布载荷', '合力 = q × 长度，作用在这一段的中点。'], ['固定端', '既不能移也不能转：$F_{Ax}$、$F_{Ay}$、$M_A$ 三个约束。'], ['物体系统', '组合梁等多个物体连在一起时，先拆出未知量只有三个的那一部分。'], ['桁架', '零杆用两条规则判断；求个别杆的内力用截面法，切断不超过三根杆。']] },
  { id: 'ch4', key: 'p21', no: '第四章', short: '第4章', name: '点的运动', src: '任务 2-1',
    desc: '只研究点怎么动：位置、速度、加速度随时间怎么变，不管受什么力。',
    cards: [['运动方程', '直角坐标法写 $x(t)$、$y(t)$；自然法沿轨迹写弧长 $s(t)$。'], ['速度、加速度就是求导', '$v_x=#frac{dx}{dt}$，$a_x=#frac{dv_x}{dt}$；自然法 $v=#frac{ds}{dt}$。'], ['切向和法向加速度', '$a_τ=#frac{dv}{dt}$ 管速度大小的变化，$a_n=#frac{v^2}{ρ}$ 管方向的变化，指向曲率中心。'], ['定轴转动的点', '离轴 r 的点：$v=rω$，$a_τ=rα$，$a_n=rω^2$。'], ['轨迹', '运动方程里消去 t，得到 x、y 的关系。']] }
];
PROBS.forEach(p => { p.ch = CHAPTERS.findIndex(c => p.id.startsWith(c.key)); });
const probsOf = ci => PROBS.filter(p => p.ch === ci);
function chapterHTML(ci) {
  const c = CHAPTERS[ci], list = probsOf(ci), prev = CHAPTERS[ci - 1], first = list[0];
  const rows = list.map(p => `<tr><td><a href="#${p.id}">${p.nav}</a></td><td>${p.short}</td><td>${T(p.sum[0])}</td></tr>`).join('');
  return `<article>
    <div class="tag">${c.no} · ${c.src}</div>
    <div class="ph"><h2>${c.name}</h2></div>
    <p class="lead">${T(c.desc)}这一章 ${list.length} 道题，先看下面几条要点，再按顺序做题。</p>
    <div class="know">${c.cards.map(k => `<div class="kc"><h5>${k[0]}</h5><p>${T(k[1])}</p></div>`).join('')}</div>
    <section class="blk"><h3>本章题目</h3>
      <table class="sum"><tr><th>题号</th><th>内容</th><th>要求</th></tr>${rows}</table>
    </section>
    <nav class="pn">${prev ? `<a href="#${prev.id}"><small>上一章</small>${prev.no} ${prev.name}</a>` : `<a href="#intro"><small>上一页</small>先看这页</a>`}<a href="#${first.id}" style="text-align:right"><small>开始做题</small>${first.nav} ${first.short}</a></nav>
  </article>`;
}

/* ================= 入门页、汇总页、导航 ================= */
function introHTML() {
  const fig = (svg, cap) => `<figure><svg viewBox="0 0 160 130">${svg}</svg><figcaption>${T(cap)}</figcaption></figure>`;
  const c1 = D.hatch(40, 18, 120, 18, -1) + D.ln(80, 18, 80, 76, 'rope') + `<rect x="58" y="76" width="44" height="32" class="body"/>` + D.af(80, 76, 40, 90, { c: 'u', l: 'F_T', lp: [104, 52] });
  const c2 = D.fixed(80, 78) + D.af(80, 78, 46, 0, { c: 'u', g: 6, l: 'F_x', lp: [140, 70] }) + D.af(80, 78, 46, 90, { c: 'u', g: 6, l: 'F_y', lp: [100, 26] });
  const c3 = D.roller(80, 80) + D.af(80, 80, 50, 90, { c: 'u', g: 6, l: 'F_N', lp: [104, 30] });
  const c4 = D.rod([[34, 98], [126, 44]]) + D.pin(34, 98) + D.pin(126, 44) + D.af(126, 44, 26, 30.4, { c: 'u', g: 6, l: 'F', lp: [146, 16] }) + D.af(34, 98, 26, 210.4, { c: 'u', g: 6, l: 'F′', lp: [16, 124] });
  const cp = D.rod([[60, 85], [340, 85]]) + D.af(110, 85, 52, 270, { g: 6, l: 'F', lp: [94, 140] }) + D.af(290, 85, 52, 90, { g: 6, l: 'F′', lp: [310, 36] }) + D.dim(110, 155, 290, 155, 'd') + D.couple(200, 85, 26, false, 'M', { c: 'r' });
  const items = CHAPTERS.map((c, ci) => `<tr><td><a href="#${c.id}">${c.no}</a></td><td>${c.name}<br><small style="color:var(--muted)">${c.src}</small></td><td>${probsOf(ci).map(p => `<a href="#${p.id}">${p.nav}</a>`).join('　')}</td></tr>`).join('');
  return `<article>
    <div class="tag">开始之前</div>
    <div class="ph"><h2>先花 5 分钟，把这几样东西认熟</h2></div>
    <p class="lead">作业分四章，共 ${PROBS.length} 题：平面汇交力系、平面力偶系、平面任意力系、点的运动。前三章的基础都在这一页，每章开头还有一页本章要点。每道题的讲解页左边是图，右边是步骤；点"下一步"或按键盘 <span class="kbd">→</span>，图上的力会一步步画出来。颜色是固定的：<b style="color:var(--known)">红色</b>是已知的力，<b style="color:var(--unk)">蓝色</b>是要求的力，<b style="color:var(--res)">绿色</b>是算出来的结果。</p>
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
    <section class="blk"><h3>四章目录</h3>
      <table class="sum"><tr><th>章</th><th>内容</th><th>题目</th></tr>${items}</table>
    </section>
    <nav class="pn"><span></span><a href="#ch1" style="text-align:right"><small>开始</small>第一章 平面汇交力系</a></nav>
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
  const rows = CHAPTERS.map((c, ci) => `<tr><th colspan="3" style="background:var(--bg);color:var(--ink);font-size:14px">${c.no} ${c.name}<span style="color:var(--muted);font-weight:400">　${c.src}</span></th></tr>` +
    probsOf(ci).map(p => `<tr><td><a href="#${p.id}">${p.nav}</a></td><td>${T(p.sum[0])}</td><td>${T(p.sum[1])}</td></tr>`).join('')).join('');
  const last = PROBS[PROBS.length - 1];
  return `<article>
    <div class="tag">最后</div>
    <div class="ph"><h2>答案汇总</h2></div>
    <p class="lead">${T('做完可以对一下，点题号回到讲解页。第一章第 11 题按老师要求取 $F_1$ = 100 kN。')}</p>
    <table class="sum"><tr><th>题号</th><th>求什么</th><th>答案</th></tr>${rows}</table>
    <nav class="pn"><a href="#${last.id}"><small>上一题</small>${last.nav} ${last.short}</a><a href="#intro" style="text-align:right"><small>回到</small>先看这页</a></nav>
  </article>`;
}
function buildNav() {
  const item = p => `<a href="#${p.id}" data-id="${p.id}"><span class="no">${p.nav}</span><span class="t">${p.short}</span></a>`;
  $('#nav').innerHTML = `<a href="#intro" data-id="intro"><span class="no">0</span><span class="t">先看这页</span></a>` +
    CHAPTERS.map((c, ci) => `<h4>${c.no} ${c.name}</h4><a href="#${c.id}" data-id="${c.id}" class="chl"><span class="no">${c.short}</span><span class="t">本章要点</span></a>${probsOf(ci).map(item).join('')}`).join('') +
    `<h4>最后</h4><a href="#sum" data-id="sum"><span class="no">✓</span><span class="t">答案汇总</span></a>`;
}
function route() {
  stop();
  stopAnim();
  const id = (location.hash || '#intro').slice(1);
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.id === id));
  const p = PROBS.find(x => x.id === id);
  S.p = null;
  if (p) { S.p = p; S.vi = 0; S.cur = 0; renderProb(p); document.title = `${p.nav} ${p.short} · 工程力学作业讲解`; }
  else if (id === 'sum') { $('#main').innerHTML = sumHTML(); document.title = '答案汇总 · 工程力学作业讲解'; }
  else if (CHAPTERS.some(c => c.id === id)) { const ci = CHAPTERS.findIndex(c => c.id === id); $('#main').innerHTML = chapterHTML(ci); document.title = `${CHAPTERS[ci].no} ${CHAPTERS[ci].name} · 工程力学作业讲解`; }
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
