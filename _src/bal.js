/* ========== 受力平衡图：把研究对象的力平移到一点，再首尾相接 ========== */
// 每个力：[标签, 大小（同一组内可比）, 方向（数学角，度）, 'k' 已知 / 'r' 算出, 数值文字]
const kN = v => v + ' kN';
const BAL = {
  'p27-6': [[{ t: '圆环（再加一个平衡力）', con: true, F: [['F_1', 2000, 180, 'k', '2000 N'], ['F_2', 2500, 220, 'k', '2500 N'], ['F_3', 1500, 270, 'k', '1500 N'], ['−F_R', 4998, 38.43, 'r', '≈5000 N']], note: '这题求的是合力。再加一个和合力等大、反向的力 −F<sub>R</sub>，四个力就平衡了。' }]],
  'p27-7': [[{ t: '滑轮 B', con: true, F: [['F_{T1}', 20, 270, 'k', '20 kN'], ['F_{T2}', 20, 240, 'k', '20 kN'], ['F_{AB}', 54.64, 180, 'r', '54.6 kN'], ['F_{BC}', 74.64, 30, 'r', '74.6 kN']], note: '这里画的是真实方向：AB 拉着 B 往左，BC 顶着 B 往右上。' }]],
  'p27-11': [[{ t: '火箭', con: true, F: [['F_1', 100, 30, 'k', '100 kN'], ['W', 200, 270, 'k', '200 kN'], ['F_2', 173.2, 120, 'r', '173 kN']] }]],
  'p27-12': [[
    { t: '结点 D', con: true, F: [['F', 0.8, 270, 'k', '0.8 kN'], ['F_{DE}', 8.01, 174.27, 'r', '8.01 kN'], ['F_{DB}', 7.97, 0, 'r', '7.97 kN']], note: '向下的 800 N 很短，两根绳的拉力却很长：角度越小，绳力越大。' },
    { t: '结点 B', con: true, F: [['F_{BD}', 7.97, 180, 'r', '7.97 kN'], ['F_{BC}', 79.9, 84.27, 'r', '79.9 kN'], ['F_{BA}', 79.5, 270, 'r', '79.5 kN']], note: '和结点 D 比，力又放大了 10 倍。（数值按 θ = 0.1 rad 精确计算）' }
  ]],
  'p27-13': [[
    { t: '铰 B', con: true, F: [['F', 1, 270, 'k', 'F'], ['F_{BC}', 2.37, 155, 'r', '2.37F'], ['F_{NB}', 2.14, 0, 'r', '2.14F']], note: '数值按 θ = 25° 算，写成 F 的倍数。' },
    { t: '铰 C', con: true, F: [['F_{CB}', 2.37, 335, 'r', '2.37F'], ['F_{CD}', 1.99, 245, 'r', '1.99F'], ['F_{CE}', 3.09, 115, 'r', '3.09F']] },
    { t: '压板 E', con: true, F: [['F_{EC}', 3.09, 295, 'r', '3.09F'], ['F_N', 1.31, 180, 'r', '1.31F'], ['F′_H', 2.80, 90, 'r', '2.80F']], note: '$F′_H$ 是工件顶压板的力；压板压工件的力 $F_H$ 和它等大反向，就是 2.80F = F/(2sin²25°)。$F_N$ 是导轨挡住压板的水平力。' }
  ]],
  'p27-14': [[
    { t: '铰 A', con: true, F: [['F_1', 1, 330, 'k', 'F₁'], ['F_{AB}', 0.897, 195, 'r', '0.897F₁'], ['F_{AC}', 0.732, 90, 'r', '0.732F₁']], note: 'AB、AC 都是压杆，箭头画的是它们推 A 的真实方向。' },
    { t: '铰 B', con: true, F: [['F_2', 1.553, 225, 'k', '1.553F₁'], ['F_{BA}', 0.897, 15, 'r', '0.897F₁'], ['F_{BD}', 0.897, 75, 'r', '0.897F₁']] }
  ]],
  'p27-15': [
    [{ t: '左半刚架 AC', con: true, F: [['F', 1, 0, 'k', 'F'], ['F_C', 0.707, 135, 'r', '0.707F'], ['F_A', 0.707, 225, 'r', '0.707F']] },
     { t: '右半刚架 BC', con: true, F: [['F_B', 0.707, 135, 'r', '0.707F'], ['F′_C', 0.707, 315, 'r', '0.707F']], note: '二力构件：两个力等大、反向、共线。' }],
    [{ t: '左半刚架 AC', con: true, F: [['F', 1, 270, 'k', 'F'], ['F_C', 0.354, 135, 'r', '0.354F'], ['F_A', 0.791, 71.57, 'r', '0.791F']], note: '三个力交于 K 点，所以这是汇交力系。' },
     { t: '右半刚架 BC', con: true, F: [['F_B', 0.354, 135, 'r', '0.354F'], ['F′_C', 0.354, 315, 'r', '0.354F']], note: '二力构件：两个力等大、反向、共线。' }]
  ],
  'p36-7': [[
    { t: '构件 AB', F: [['F_A', 1, 315, 'r', '√2M/(4a)'], ['F_B', 1, 135, 'r', '√2M/(4a)']], note: '两个力合起来为零，但不共线，相距 2√2a，组成一个逆时针力偶，正好抵消顺时针的 M。' },
    { t: '构件 BC', con: true, F: [['F′_B', 1, 315, 'r', '√2M/(4a)'], ['F_C', 1, 135, 'r', '√2M/(4a)']], note: '二力构件，两力共线、等大、反向。' }
  ]],
  'p36-8': [
    [{ t: '梁 AB', F: [['F_B', 1, 90, 'r', 'M/l'], ['F_A', 1, 270, 'r', 'M/l']], note: '两力相距 l、不共线，组成逆时针力偶，抵消顺时针的 M。' }],
    [{ t: '梁 AB', F: [['F_B', 1, 90, 'r', 'M/l'], ['F_A', 1, 270, 'r', 'M/l']], note: '和图 a 完全一样：力偶放在哪里都不影响。' }],
    [{ t: '梁 AB（θ = 30°）', F: [['F_B', 1.155, 120, 'r', '1.155M/l'], ['F_A', 1.155, 300, 'r', '1.155M/l']], note: '两力相距 l·cosθ，组成力偶抵消 M。' }]
  ],
  'p36-9': [[
    { t: '轮 I', F: [['F_n', 1, 70, 'r', 'M₁/(r₁cosθ)'], ['F_{O1}', 1, 250, 'r', 'M₁/(r₁cosθ)']], note: '两力相距 r₁cosθ，组成力偶抵消主动力偶 M₁。' },
    { t: '轮 II', F: [['F_n′', 1, 250, 'r', 'M₁/(r₁cosθ)'], ['F_{O2}', 1, 70, 'r', 'M₁/(r₁cosθ)']], note: '两力相距 r₂cosθ，组成力偶和阻力偶 M₂ 平衡。' }
  ]],
  'p36-10': [[
    { t: '滑块 C', con: true, F: [['F', 100, 180, 'k', '100 kN'], ['F_N', 57.7, 90, 'r', '57.7 kN'], ['F_{BC}', 115.5, 330, 'r', '115.5 kN']], note: '导轨的支持力 $F_N=F_{BC}sin30°=57.7$ kN，正文里没算，这里补上。' },
    { t: '曲柄 AB', F: [['F_B', 115.5, 150, 'r', '115.5 kN'], ['F_A', 115.5, 330, 'r', '115.5 kN']], note: '两力相距 d = 0.966 m，组成力偶抵消 M。' }
  ]],
  'p14-10': [
    [{ t: '梁 AB', F: [['F_{Ay}', 1 / 3, 90, 'r', 'qa/3'], ['F_B', 2 / 3, 90, 'r', '2qa/3'], ['F', 1, 270, 'k', 'qa']] }],
    [{ t: '梁 AB', F: [['F_B', 2, 90, 'r', '2qa'], ['F', 1, 270, 'k', 'qa'], ['F_{Ay}', 1, 270, 'r', 'qa']] }],
    [{ t: '梁 AB', F: [['F_{Ay}', 1, 90, 'r', 'qa'], ['F_B', 2, 90, 'r', '2qa'], ['q·2a', 2, 270, 'k', '2qa'], ['F', 1, 270, 'k', 'qa']] }],
    [{ t: '梁 AB', F: [['F_{Ay}', 11 / 6, 90, 'r', '11qa/6'], ['F_B', 13 / 6, 90, 'r', '13qa/6'], ['q·3a', 3, 270, 'k', '3qa'], ['F', 1, 270, 'k', 'qa']] }],
    [{ t: '梁 AB', F: [['F_{Ay}', 2, 90, 'r', '2qa'], ['qa', 1, 270, 'k', 'qa'], ['F', 1, 270, 'k', 'qa']], note: '固定端的 $M_A$ 是力偶，不在这张图里，它在取矩方程里平衡。' }],
    [{ t: '梁 AB', F: [['F_{Ay}', 3, 90, 'r', '3qa'], ['q·2a', 2, 270, 'k', '2qa'], ['F', 1, 270, 'k', 'qa']], note: '固定端的 $M_A$ 和力偶 M 都不在这张图里，它们在取矩方程里平衡。' }]
  ],
  'p14-11': [
    [{ t: 'CD 段', F: [['F_C', 90, 90, 'r', kN(90)], ['F_D', 90, 90, 'r', kN(90)], ['q·2a', 180, 270, 'k', kN(180)]] },
     { t: 'AC 段', F: [['F_B', 360, 90, 'r', kN(360)], ['q·2a', 180, 270, 'k', kN(180)], ['F′_C', 90, 270, 'k', kN(90)], ['F_A', 90, 270, 'r', kN(90)]], note: 'B 处向上 360 kN，正好托住向下的 180 + 90 + 90。' }],
    [{ t: 'CD 段', F: [['F_D', 3.33, 90, 'r', kN(3.33)], ['F_C', 3.33, 270, 'r', kN(3.33)]], note: '两力组成力偶，抵消 M。' },
     { t: 'AC 段', F: [['F_A', 8.33, 90, 'r', kN(8.33)], ['F′_C', 3.33, 90, 'k', kN(3.33)], ['F', 10, 270, 'k', kN(10)], ['F_B', 1.67, 270, 'r', kN(1.67)]] }],
    [{ t: 'CD 段', F: [['F', 10, 225, 'k', kN(10)], ['F_{Cx}', 7.07, 0, 'r', kN(7.07)], ['F_{Cy}', 3.54, 90, 'r', kN(3.54)], ['F_D', 3.54, 90, 'r', kN(3.54)]] },
     { t: 'AC 段', F: [['F_{Ax}', 7.07, 0, 'r', kN(7.07)], ['F_{Ay}', 3.54, 90, 'r', kN(3.54)], ['F′_{Cx}', 7.07, 180, 'k', kN(7.07)], ['F′_{Cy}', 3.54, 270, 'k', kN(3.54)]], note: '力偶 M 和固定端的 $M_A$ 不在这张图里，它们在取矩方程里平衡。' }],
    [{ t: 'CD 段', F: [['F_C', 67.5, 90, 'r', kN(67.5)], ['F_D', 22.5, 90, 'r', kN(22.5)], ['qa', 90, 270, 'k', kN(90)]] },
     { t: 'AC 段', F: [['F_{Ay}', 157.5, 90, 'r', kN(157.5)], ['qa', 90, 270, 'k', kN(90)], ['F′_C', 67.5, 270, 'k', kN(67.5)]], note: '固定端的 $M_A$ 不在这张图里，它在取矩方程里平衡。' }]
  ],
  'p14-12': [[
    { t: '曲柄 OA', F: [['F_A', 5, 180, 'r', '5 N'], ['F_O', 5, 0, 'r', '5 N']], note: '两力相距 0.2 m，组成逆时针力偶，抵消顺时针的 M₁。' },
    { t: '摇杆 O₁B', F: [['F_B', 5, 0, 'r', '5 N'], ['F_{O1}', 5, 180, 'r', '5 N']], note: '两力相距 0.6 m，组成顺时针力偶，和逆时针的 M₂ 平衡。' }
  ]],
  'p14-15': [[
    { t: '截面 I 右边部分', F: [['F_B', 87.5, 90, 'r', kN(87.5)], ['50 kN', 50, 270, 'k', kN(50)], ['N_2', 53.03, 225, 'r', kN(53.0)], ['N_{GH}', 87.5, 180, 'r', kN(87.5)], ['N_1', 125, 0, 'r', kN(125)]], note: '杆 1 是压杆，图里画的是它推右边部分的真实方向（向右）。' },
    { t: '截面 II 右边部分', F: [['F_B', 87.5, 90, 'r', kN(87.5)], ['N_3', 87.5, 270, 'r', kN(87.5)], ['N_{EB}', 87.5, 0, 'r', kN(87.5)], ['N_{GH}', 87.5, 180, 'r', kN(87.5)]], note: '杆 3、杆 EB 是压杆，画的是真实方向。' }
  ]],
  'p14-16': [
    [{ t: '刚架', F: [['F_{Ay}', 17, 90, 'r', kN(17)], ['12 kN', 12, 270, 'k', kN(12)], ['5 kN', 5, 270, 'k', kN(5)]], note: '固定端的 $M_A$ = 33 kN·m 不在这张图里，它在取矩方程里平衡。' }],
    [{ t: '刚架', F: [['F_{Ax}', 3, 0, 'r', kN(3)], ['F_{Ay}', 5, 90, 'r', kN(5)], ['5 kN', 5, 233.13, 'k', kN(5)], ['F_B', 1, 270, 'r', kN(1)]], note: '力偶 2.5 kN·m 不在这张图里，它在取矩方程里平衡。' }]
  ]
};
PROBS.forEach(p => p.variants.forEach((v, i) => { v.bal = (BAL[p.id] || [])[i] || []; }));

function allSteps(v) {
  if (!v._all) v._all = v.steps.concat(v.bal.map(g => ['受力平衡图：' + g.t, balText(g)]));
  return v._all;
}
function balText(g) {
  const names = g.F.map(x => `$${x[0]}$`).join('、');
  let t = `把${g.t}受的 ${g.F.length} 个力（${names}）都平移到同一点，就是图里左半边。右半边把它们一个接一个首尾相连，最后一支箭头的尖正好回到起点，说明合力为零：$ΣF_x=0$，$ΣF_y=0$。`;
  t += g.con ? '<br>这几个力本来就交于一点，合力为零就是它平衡的全部条件。' : '<div class="tip"><b>还差一半</b>　这些力在原图里不交于一点，合力为零只说明它不会移动；不转动靠的是力矩平衡，就是前面的取矩方程。</div>';
  if (g.note) t += `<p>${g.note}</p>`;
  return t;
}
function drawBal(k) {
  const g = V().bal[k];
  const F = g.F.map(([l, m, d, c, v]) => ({ l, m, d, c, v, ux: Math.cos(d * RAD), uy: Math.sin(d * RAD) }));
  const maxM = Math.max(...F.map(x => x.m)), k1 = 112 / maxM, C = [165, 250], CY = 250;
  // 文字防重叠：按给定方向一点点挪开
  const placed = [[0, 0, 640, 70]];
  const tw = x => x.l.replace(/[_{}]/g, '').length * 10 + (x.v ? x.v.length * 7.5 + 6 : 0);
  const place = (cx, cy, w, dx, dy) => {
    for (let t = 0; t < 10; t++) {
      const b = [cx - w / 2, cy - 15, cx + w / 2, cy + 5];
      if (!placed.some(q => b[0] < q[2] && b[2] > q[0] && b[1] < q[3] && b[3] > q[1])) { placed.push(b); return [cx, cy]; }
      cx += dx * 12; cy += dy * 12;
    }
    placed.push([cx - w / 2, cy - 15, cx + w / 2, cy + 5]); return [cx, cy];
  };
  let s = `<text x="20" y="34" class="bt">受力平衡图 · ${g.t}</text><text x="620" y="34" class="replay" text-anchor="end">重播</text>`;
  s += `<text x="165" y="62" class="nt" text-anchor="middle">① 平移到同一点</text><text x="480" y="62" class="nt" text-anchor="middle">② 首尾相接</text>`;
  s += `<line x1="322" y1="78" x2="322" y2="425" class="dm"/>`;
  // ① 汇交图：各力从外面飞到同一点；同方向的力并排错开 12 像素，标签往外错开
  const lbl = (x, X, Y) => `<text x="${f(X)}" y="${f(Y)}" class="lb" text-anchor="middle">${lab(x.l)}<tspan class="bv" dx="5">${x.v}</tspan></text>`;
  const grp = {};
  F.forEach(x => { const key = Math.round(((x.d % 360) + 360) % 360); (grp[key] = grp[key] || []).push(x); });
  F.forEach((x, i) => {
    const same = grp[Math.round(((x.d % 360) + 360) % 360)], j = same.indexOf(x), n = same.length;
    const len = Math.max(x.m * k1, 14), off = (j - (n - 1) / 2) * 12;
    const ox0 = C[0] - x.uy * off, oy0 = C[1] - x.ux * off;
    const [lx0, ly0] = pol(ox0, oy0, len + 24, x.d), fly = pol(0, 0, 90, x.d);
    const [lx, ly] = place(lx0, ly0 + 6, tw(x), x.ux, -x.uy);
    s += `<g class="fly" style="--fx:${f(fly[0])}px;--fy:${f(fly[1])}px;transition-delay:${(i * 0.18).toFixed(2)}s"><g class="arw ${x.c}">` + D.af(ox0, oy0, len, x.d, { c: x.c }).replace(/^<g class="arw [a-z]+"[^>]*>/, '').replace(/<\/g>$/, '') + lbl(x, lx, ly) + '</g></g>';
  });
  s += `<circle cx="${C[0]}" cy="${C[1]}" r="4" class="kdot"/>`;
  // ② 力多边形：反向的力错开 14 像素画，方便看清
  let px = 0, py = 0, shx = 0, shy = 0, sx = 0, sy = 0;
  const seg = F.map((x, i) => {
    const prev = F[i - 1];
    if (prev && Math.abs(prev.ux * x.uy - prev.uy * x.ux) < 0.04 && prev.ux * x.ux + prev.uy * x.uy < 0) { shx += -x.uy * 16; shy += x.ux * 16; }
    const len = x.m * k1, t = [px + shx, py + shy];
    px += len * x.ux; py += len * x.uy; sx += x.m * x.ux; sy += x.m * x.uy;
    return { x, t, h: [px + shx, py + shy] };
  });
  const closed = Math.hypot(sx, sy) < 0.02 * maxM;
  const xs = [0, ...seg.flatMap(q => [q.t[0], q.h[0]])], ys = [0, ...seg.flatMap(q => [q.t[1], q.h[1]])];
  const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
  const sc = Math.min(1, 250 / Math.max(bx1 - bx0, 1), 250 / Math.max(by1 - by0, 1));
  const P = ([x, y]) => [480 + (x - (bx0 + bx1) / 2) * sc, CY - (y - (by0 + by1) / 2) * sc];
  seg.forEach((q, i) => {
    const [tx, ty] = P(q.t), [hx, hy] = P(q.h), L = Math.hypot(hx - tx, hy - ty);
    const tt = i % 2 ? 0.62 : 0.4, [mx, my] = place(tx + (hx - tx) * tt - q.x.uy * 18, ty + (hy - ty) * tt - q.x.ux * 18 + 5, q.x.l.replace(/[_{}]/g, '').length * 10, -q.x.uy, -q.x.ux);
    s += `<g class="fly" style="--fx:${f(C[0] - tx)}px;--fy:${f(C[1] - ty)}px;transition-delay:${(0.9 + i * 0.45).toFixed(2)}s">` + D.arrow(tx, ty, hx, hy, { c: q.x.c, h: Math.min(14, L * 0.6), w: Math.min(5.5, L * 0.25), l: q.x.l, lp: [mx, my] }) + '</g>';
  });
  const [ox, oy] = P([0, 0]), last = P(seg[seg.length - 1].h), T = (0.9 + seg.length * 0.45 + 0.3).toFixed(2);
  s += `<circle cx="${f(ox)}" cy="${f(oy)}" r="4.5" class="kdot"/>`;
  if (closed) {
    s += `<g class="late" style="transition-delay:${T}s"><circle cx="${f(ox)}" cy="${f(oy)}" r="12" class="focus"/>`;
    if (Math.hypot(last[0] - ox, last[1] - oy) > 3) s += `<line x1="${f(last[0])}" y1="${f(last[1])}" x2="${f(ox)}" y2="${f(oy)}" class="dsh"/>`;
    s += `<text x="480" y="446" class="big" text-anchor="middle">回到起点（圆点）⇒ ΣF<tspan dy="4" font-size="12">x</tspan><tspan dy="-4"> = 0，ΣF</tspan><tspan dy="4" font-size="12">y</tspan><tspan dy="-4"> = 0</tspan></text></g>`;
  }
  s += `<text x="165" y="446" class="nt" text-anchor="middle">${g.con ? '各力交于一点：合力为零就平衡' : '各力不交于一点：还要看力矩'}</text>`;
  $('#svgw').innerHTML = `<svg class="dg balp pre" viewBox="0 0 640 460" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  const svg = $('#svgw svg');
  svg.querySelector('.replay').onclick = () => drawBal(k);
  svg.getBoundingClientRect();
  requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove('pre')));
}
