/* ================= 第四章 点的运动（任务 2-1） ================= */
// 套在杆上的滑块（矩形，随杆转）
const sleeve = (x, y, deg, w = 40, h = 22) => `<rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${w}" height="${h}" class="body" transform="translate(${f(x)} ${f(y)}) rotate(${f(-deg)})"/>`;
const safeArrow = (x, y, len, deg, o) => len > 4 ? D.af(x, y, len, deg, o) : '';

/* ---------- 第 11 题 摇杆 ---------- */
reg({
  id: 'p21-11', nav: '2-1·11', short: '摇杆上点 C',
  tag: '第四章 · 任务 2-1 · 第 11 题 · 图 2-1-18',
  title: '滑杆匀速上升带动摇杆，求点 C 的运动方程和速度',
  orig: '如图 2-1-18 所示摇杆机构的滑杆 AB 以等速 v 向上运动，试建立摇杆 OC 上点 C 的运动方程，并求此点在 φ = π/4 时的速度大小。假定初始瞬时 φ = 0，摇杆长 OC = a，l 为已知。',
  given: '滑杆速度 v（匀速向上），OC = a，O 到滑杆的水平距离 l；t = 0 时 φ = 0',
  ask: '点 C 的运动方程；φ = π/4 时 C 的速度大小',
  know: [
    ['运动方程', '把点的位置写成时间 t 的函数，例如 $x=x(t)$、$y=y(t)$，这就是运动方程。'],
    ['速度 = 位置对时间求导', '$v_x=#frac{dx}{dt}$，$v_y=#frac{dy}{dt}$。点在圆周上运动时也可以用 $v=rω$，ω 是转角对时间的导数。'],
    ['先找几何关系', '这题的突破口：滑杆上的 A 点同时在摇杆上，所以 A 的高度和摇杆转角 φ 有关系。']
  ],
  sum: ['点 C 的运动方程和速度', '$x=#frac{al}{#sqrt{l^2+v^2t^2}}$，$y=#frac{avt}{#sqrt{l^2+v^2t^2}}$；φ = π/4 时 $v_C=#frac{av}{2l}$'],
  variants: [{
    params: { tt: { min: 0, max: 1.4, step: 0.01, val: 0.6, label: '时间（用 vt/l 表示）', fmt: v => `vt/l = ${v.toFixed(2)}，φ = ${(Math.atan(v) / RAD).toFixed(1)}°` } },
    anim: { k: 'tt', speed: 0.35, mode: 'bounce', auto: true },
    tools: [animTool(), jumpTool('放到 φ = 45°', 'tt', 1)],
    readout: p => { const c2 = 1 / (1 + p.tt * p.tt); return `此刻 $v_C=#frac{av}{l}cos^2φ$ = <b>${c2.toFixed(3)} av/l</b>${Math.abs(p.tt - 1) < 0.005 ? '（正好是 φ = 45°，等于 0.5 av/l）' : ''}`; },
    svg(p) {
      const O = [130, 380], l = 200, a = 330, ph = Math.atan(p.tt), deg = ph / RAD;
      const A = [O[0] + l, O[1] - l * p.tt], C = pol(O[0], O[1], a, deg);
      let s = '';
      s += D.ln(O[0], O[1], 520, O[1], 'dsh');
      s += D.hatch(316, 410, 316, 470, 1) + D.hatch(344, 410, 344, 470, -1);
      s += D.rod([A, [A[0], 470]]);
      s += D.rod([O, C]);
      s += sleeve(A[0], A[1], deg);
      s += D.fixed(O[0], O[1]) + D.pin(A[0], A[1], { r: 4 }) + D.pin(C[0], C[1], { r: 4 });
      s += D.af(372, 455, 46, 90, { l: 'v', lp: [386, 420] });
      if (deg > 4) s += D.arc(O[0], O[1], 54, 0, deg, 'φ', { lo: 14 });
      s += D.txt(O[0] - 16, O[1] - 10, 'O') + D.txt(A[0] + 26, A[1] - 12, 'A') + D.txt(...pol(C[0], C[1], 18, deg + 60), 'C') + D.txt(352, 486, 'B');
      // 第 1 步：几何关系
      s += D.g(D.ln(A[0], O[1], A[0], A[1], 'dsh h') + D.dim(O[0], 400, A[0], 400, 'l', { off: 16 }) + (p.tt > 0.1 ? D.txt(A[0] - 14, (O[1] + A[1]) / 2, 'vt', 'pt', { a: 'end' }) : ''), { s: 1 });
      // 第 2 步：坐标
      s += D.g(D.axes(O[0], O[1], { len: 380, back: 10 }).replace(/data-s="\d+"/g, '') + D.ln(C[0], C[1], C[0], O[1], 'dsh') + D.ln(C[0], C[1], O[0], C[1], 'dsh') + D.txt(C[0], O[1] + 20, 'x_C') + D.txt(O[0] - 20, C[1] + 5, 'y_C'), { s: 2 });
      s += `<path d="M${f(O[0] + a)},${O[1]} A${a},${a} 0 0 0 ${f(pol(O[0], O[1], a, 60)[0])},${f(pol(O[0], O[1], a, 60)[1])}" class="trace"${at({ s: 2 })}/>`;
      // 第 3、4 步：速度
      const vl = 130 * Math.cos(ph) ** 2;
      s += safeArrow(C[0], C[1], vl, deg + 90, { c: 'r', s: 3, l: 'v_C', lp: pol(C[0], C[1], vl + 16, deg + 90) });
      return s;
    },
    steps: [
      ['先看懂机构', '滑杆 AB 在竖直导轨里以速度 v 匀速上升，顶端 A 套在摇杆 OC 的滑套里，推着摇杆绕 O 转。t = 0 时摇杆水平（φ = 0）。点 "播放运动" 可以看它怎么动，也可以拖滑块。'],
      ['找几何关系', '导轨离 O 的水平距离是 l。A 从 O 的高度出发，以速度 v 上升，t 时刻升高了 vt。直角三角形里：$$tanφ=#frac{vt}{l}$$这就把转角 φ 和时间 t 联系起来了。'],
      ['写 C 点的运动方程', '以 O 为原点，x 轴水平、y 轴竖直。C 在摇杆上离 O 为 a：$$x=acosφ，y=asinφ$$用 $tanφ=#frac{vt}{l}$ 换掉 φ（斜边是 $#sqrt{l^2+v^2t^2}$）：$$x=#frac{al}{#sqrt{l^2+v^2t^2}}，y=#frac{avt}{#sqrt{l^2+v^2t^2}}$$C 的轨迹是以 O 为圆心、a 为半径的圆弧（绿色虚线）。'],
      ['求速度', '对 $φ=arctan#frac{vt}{l}$ 求导，得摇杆的角速度：$$ω=#frac{dφ}{dt}=#frac{vl}{l^2+v^2t^2}=#frac{v}{l}cos^2φ$$C 做圆周运动，速度垂直于 OC：$$v_C=aω=#frac{av}{l}cos^2φ$$摇杆越转越慢，所以图里绿色速度箭头越来越短。'],
      ['代入 φ = π/4', '点 "放到 φ = 45°" 看这个位置。$cos^2 45°=#frac{1}{2}$：$$v_C=#frac{av}{2l}$$']
    ]
  }],
  write: [
    ['解：以 O 为原点建立直角坐标系。t 时刻滑杆上升 vt，由几何关系 $tanφ=#frac{vt}{l}$。'],
    ['点 C 的运动方程：'],
    '$x=acosφ=#frac{al}{#sqrt{l^2+v^2t^2}}，y=asinφ=#frac{avt}{#sqrt{l^2+v^2t^2}}$',
    ['（自然法：$s=aφ=a·arctan#frac{vt}{l}$）'],
    '$ω=#frac{dφ}{dt}=#frac{vl}{l^2+v^2t^2}=#frac{v}{l}cos^2φ，v_C=aω=#frac{av}{l}cos^2φ$',
    '$φ=#frac{π}{4} 时，v_C=#frac{av}{l}*#frac{1}{2}=#frac{av}{2l}$',
    ['答：运动方程如上，φ = π/4 时点 C 的速度大小为 $#frac{av}{2l}$，方向垂直于 OC。']
  ],
  ans: '$x=#frac{al}{#sqrt{l^2+v^2t^2}}$，$y=#frac{avt}{#sqrt{l^2+v^2t^2}}$；φ = π/4 时 $v_C=#frac{av}{2l}$。',
  pit: [
    '滑杆匀速，但摇杆<b>不是</b>匀速转动，ω 随 φ 变化。',
    '求速度可以对 x、y 分别求导再合成，结果一样；用 $v=aω$ 更快。'
  ]
});

/* ---------- 第 12 题 摇杆滑道 ---------- */
reg({
  id: 'p21-12', nav: '2-1·12', short: '圆弧槽里的滑块 M',
  tag: '第四章 · 任务 2-1 · 第 12 题 · 图 2-1-19',
  title: '摇杆滑道机构，用两种方法写 M 的运动方程',
  orig: '如图 2-1-19 所示，摇杆滑道机构中的滑块 M 同时在固定的圆弧槽 BC 和摇杆 OA 的滑道中滑动。弧 BC 的半径为 R，摇杆 OA 的轴 O 在弧 BC 的圆周上。摇杆绕 O 轴以等角速度 ω 转动，当运动开始时，摇杆在水平位置。分别用直角坐标法和自然法给出点 M 的运动方程，并求其速度和加速度。',
  given: '圆弧半径 R，O 在圆周上；摇杆角速度 ω 不变，t = 0 时水平',
  ask: '直角坐标法、自然法的运动方程；M 的速度、加速度',
  know: [
    ['圆周角定理', '同一段弧所对的圆心角是圆周角的 2 倍。摇杆转过 φ（圆周角），M 绕圆心 O₁ 转过 2φ。'],
    ['直角坐标法', '写出 $x(t)$、$y(t)$，求一次导得速度分量，求两次导得加速度分量。'],
    ['自然法', '沿轨迹量弧长 $s(t)$。$v=#frac{ds}{dt}$；切向加速度 $a_τ=#frac{dv}{dt}$，法向加速度 $a_n=#frac{v^2}{ρ}$（ρ 是曲率半径，圆周上就是 R）。']
  ],
  sum: ['M 的运动方程、速度和加速度', '$x=R(1+cos2ωt)$，$y=Rsin2ωt$；$s=2Rωt$；$v=2Rω$，$a=4Rω^2$（指向圆心 O₁）'],
  variants: [{
    params: { ph: { min: 0, max: 50, step: 0.5, val: 22, label: '摇杆转角 φ = ωt', fmt: v => `${v.toFixed(1)}°` } },
    anim: { k: 'ph', speed: 12, mode: 'bounce', auto: true },
    tools: [animTool()],
    readout: p => `φ = ${p.ph.toFixed(1)}°，M 绕 O₁ 转过 2φ = ${(2 * p.ph).toFixed(1)}°；速度 <b>2Rω</b>、加速度 <b>4Rω²</b> 大小始终不变。`,
    svg(p) {
      const O1 = [330, 230], R = 140, O = [190, 230], ph = p.ph, M = pol(O1[0], O1[1], R, 2 * ph), A = pol(O[0], O[1], 400, ph);
      let s = '';
      s += `<circle cx="${O1[0]}" cy="${O1[1]}" r="${R}" class="dsh"/>`;
      const [bx, by] = pol(O1[0], O1[1], R, 108), [cx2, cy2] = pol(O1[0], O1[1], R, -108);
      s += `<path d="M${f(bx)},${f(by)} A${R},${R} 0 1 1 ${f(cx2)},${f(cy2)}" class="slot"/><path d="M${f(bx)},${f(by)} A${R},${R} 0 1 1 ${f(cx2)},${f(cy2)}" class="slotI"/>`;
      s += D.ln(O[0], O[1], 520, O[1], 'dd');
      s += D.rod([O, A]);
      s += `<circle cx="${f(M[0])}" cy="${f(M[1])}" r="9" class="body"/>`;
      s += D.fixed(O[0], O[1]) + D.pin(O1[0], O1[1], { r: 3 });
      s += D.couple(O[0], O[1], 46, false, 'ω', { a1: -20, a2: 55, lp: [O[0] + 30, O[1] - 52] });
      s += D.txt(O[0] - 16, O[1] - 10, 'O') + D.txt(O1[0] + 4, O1[1] + 22, 'O_1') + D.txt(...pol(M[0], M[1], 20, 2 * ph + 40), 'M') + D.txt(A[0] + 14, A[1] - 6, 'A') + D.txt(bx - 12, by - 6, 'B') + D.txt(cx2 - 12, cy2 + 18, 'C');
      // 第 1 步：圆心角
      s += D.g(D.ln(O1[0], O1[1], M[0], M[1], 'dsh h') + (ph > 2 ? D.arc(O[0], O[1], 60, 0, ph, 'φ', { lo: 12 }) + D.arc(O1[0], O1[1], 42, 0, 2 * ph, '2φ', { lo: 14, c: 'r' }) : ''), { s: 1 });
      // 第 2 步：坐标
      s += D.g(D.axes(O[0], O[1], { len: 340, back: 10 }) + D.ln(M[0], M[1], M[0], O[1], 'dsh') + D.ln(M[0], M[1], O[0], M[1], 'dsh'), { s: 2 });
      // 第 3、4 步：速度、加速度
      s += D.af(M[0], M[1], 80, 2 * ph + 90, { c: 'r', s: 3, g: 9, l: 'v', lp: pol(M[0], M[1], 104, 2 * ph + 90) });
      s += D.af(M[0], M[1], 70, 2 * ph + 180, { c: 'u', s: 4, g: 9, l: 'a', lp: pol(...pol(M[0], M[1], 60, 2 * ph + 180), 14, 2 * ph + 90) });
      // 第 5 步：弧长
      if (ph > 1) s += `<path d="M${O1[0] + R},${O1[1]} A${R},${R} 0 0 0 ${f(M[0])},${f(M[1])}" class="trace" style="stroke-width:3"${at({ s: 5 })}/>`;
      s += D.txt(...pol(O1[0], O1[1], R + 24, Math.max(ph, 4)), 's', 'pt', { s: 5 });
      s += `<circle cx="${O1[0] + R}" cy="${O1[1]}" r="4" class="kdot"${at({ s: 5 })}/>`;
      return s;
    },
    steps: [
      ['先看懂机构', '圆弧槽 BC 固定不动，半径 R，圆心 O₁。摇杆 OA 的转轴 O 正好在这个圆上。滑块 M 同时卡在圆弧槽和摇杆的滑道里，摇杆一转，M 就沿着圆弧走。摇杆以不变的角速度 ω 转，t = 0 时水平。'],
      ['关键：M 绕 O₁ 转过的角是 2φ', '摇杆转角 φ = ωt 是从圆周上的 O 看过去的角（圆周角）；M 绕圆心 O₁ 转过的是同一段弧的圆心角，等于 2φ：$$∠MO_1x=2φ=2ωt$$<div class="tip"><b>拖动滑块验证</b>　红色 2φ 的弧始终是黄色 φ 的两倍。</div>'],
      ['直角坐标法', '原点取 O，x 轴沿 OO₁。M 在以 O₁(R, 0) 为圆心的圆上：$$x=R+Rcos2ωt，y=Rsin2ωt$$求导：$$v_x=-2Rωsin2ωt，v_y=2Rωcos2ωt$$$$v=#sqrt{v_x^2+v_y^2}=2Rω$$'],
      ['加速度', '再求一次导：$$a_x=-4Rω^2cos2ωt，a_y=-4Rω^2sin2ωt$$$$a=4Rω^2$$方向和 M 相对 O₁ 的位置正好相反，指向圆心 O₁（蓝色箭头）。'],
      ['自然法', '以 t = 0 时 M 的位置（圆最右边的点）为弧长起点，逆时针为正：$$s=R·2φ=2Rωt$$$$v=#frac{ds}{dt}=2Rω，a_τ=#frac{dv}{dt}=0，a_n=#frac{v^2}{R}=4Rω^2$$两种方法结果一样：M 做匀速圆周运动，速度 2Rω，加速度 4Rω² 指向 O₁。']
    ]
  }],
  write: [
    ['解：由圆周角与圆心角的关系，M 绕 O₁ 转过的角度为 2φ = 2ωt。'],
    ['(1) 直角坐标法：以 O 为原点，x 轴沿 OO₁。'],
    '$x=R(1+cos2ωt)，y=Rsin2ωt$',
    '$v_x=-2Rωsin2ωt，v_y=2Rωcos2ωt，v=2Rω$',
    '$a_x=-4Rω^2cos2ωt，a_y=-4Rω^2sin2ωt，a=4Rω^2$',
    ['(2) 自然法：以 M 的起始位置为弧坐标原点，逆时针为正。'],
    '$s=2Rωt，v=#frac{ds}{dt}=2Rω，a_τ=0，a_n=#frac{v^2}{R}=4Rω^2$',
    ['答：M 的速度大小 2Rω，沿圆弧切线；加速度大小 4Rω²，指向圆心 O₁。']
  ],
  ans: '$x=R(1+cos2ωt)$，$y=Rsin2ωt$；$s=2Rωt$；$v=2Rω$，$a=a_n=4Rω^2$（指向 O₁）。',
  pit: [
    'M 绕 O₁ 转过的是 2φ，不是 φ。用 φ 写方程，速度会少一半。',
    '自然法里 R 就是曲率半径，$a_n=v^2/R$。'
  ]
});

/* ---------- 第 13 题 曲柄摇杆 ---------- */
reg({
  id: 'p21-13', nav: '2-1·13', short: '曲柄摇杆点 B',
  tag: '第四章 · 任务 2-1 · 第 13 题 · 图 2-1-20',
  title: '曲柄摇杆机构，求摇杆端点 B 的速度和加速度',
  orig: '如图 2-1-20 所示，在曲柄摇杆机构中，曲柄 O₁A = 10 cm，摇杆 O₂B = 24 cm，距离 O₁O₂ = 10 cm。如曲柄以 φ = (π/4)t 的运动规律绕 O₁ 轴转动，运动开始时曲柄铅直向上，试求点 B 的速度和加速度。',
  given: 'O₁A = 10 cm，O₂B = 24 cm，O₁O₂ = 10 cm；φ = πt/4，t = 0 时曲柄竖直向上',
  ask: '点 B 的速度和加速度',
  know: [
    ['定轴转动的点', '刚体绕定轴转动，离轴 r 的点：$v=rω$，$a_τ=rα$，$a_n=rω^2$。ω 是角速度，α 是角加速度。'],
    ['等腰三角形', 'O₁A = O₁O₂ = 10 cm，三角形 O₁O₂A 是等腰三角形，这是摇杆转角好算的原因。']
  ],
  sum: ['点 B 的速度和加速度', '$v_B=3π≈9.42$ cm/s，$a_B=a_n=3π^2/8≈3.70$ cm/s²（指向 O₂）'],
  variants: [{
    params: { t: { min: 0, max: 3.6, step: 0.02, val: 1.2, label: '时间 t', fmt: v => `${v.toFixed(2)} s，φ = ${(45 * v).toFixed(0)}°，摇杆转角 ${(22.5 * v).toFixed(1)}°` } },
    anim: { k: 't', speed: 0.6, mode: 'loop', auto: true },
    tools: [animTool()],
    readout: () => '摇杆转角 θ = φ/2 = πt/8，角速度 π/8 rad/s 不变：$v_B$ = <b>9.42 cm/s</b>，$a_B$ = <b>3.70 cm/s²</b>（任何时刻都一样）',
    svg(p) {
      const O1 = [230, 290], O2 = [230, 390], ph = 45 * p.t, th = ph / 2;
      const A = pol(O1[0], O1[1], 100, 90 - ph), B = pol(O2[0], O2[1], 240, 90 - th);
      let s = '';
      s += D.wall(200, 130, 420, 1);
      s += D.ln(230, 120, 230, 430, 'dd');
      s += D.rod([O2, B]);
      s += sleeve(A[0], A[1], 90 - th, 34, 24);
      s += D.rod([O1, A]);
      s += D.fixed(O1[0], O1[1], 90) + D.fixed(O2[0], O2[1], 90) + D.pin(A[0], A[1], { r: 4 }) + D.pin(B[0], B[1], { r: 4 });
      if (ph > 3) s += D.arc(O1[0], O1[1], 38, 90 - ph, 90, 'φ', { lo: 12 });
      s += D.txt(O1[0] + 20, O1[1] + 18, 'O_1') + D.txt(O2[0] + 20, O2[1] + 18, 'O_2') + D.txt(...pol(A[0], A[1], 22, 90 - th - 90), 'A') + D.txt(...pol(B[0], B[1], 20, 90 - th), 'B');
      // 第 1 步：等腰三角形
      s += D.g(`<path d="M${O1[0]},${O1[1]} L${O2[0]},${O2[1]} L${f(A[0])},${f(A[1])} Z" class="dsh h"/>` + (th > 2 ? D.arc(O2[0], O2[1], 40, 90 - th, 90, 'θ', { lo: 12, c: 'r' }) : '') + D.note(300, 452, 'O₁A = O₁O₂ = 10 cm → 等腰三角形'), { s: 1 });
      // 第 3、4 步：速度、加速度
      s += D.af(B[0], B[1], 90, -th, { c: 'r', s: 3, g: 6, l: 'v_B', lp: pol(B[0], B[1], 112, -th) });
      s += D.af(B[0], B[1], 56, 270 - th, { c: 'u', s: 4, g: 6, l: 'a_B', lp: pol(...pol(B[0], B[1], 44, 270 - th), 18, 180 - th) });
      return s;
    },
    steps: [
      ['先看懂机构', '曲柄 O₁A 绕 O₁ 转，A 端的滑块套在摇杆 O₂B 的槽里，带着摇杆绕 O₂ 摆。O₁ 在 O₂ 正上方 10 cm。t = 0 时曲柄竖直向上，转角 φ = πt/4。点 "播放运动" 看看。'],
      ['摇杆转角是曲柄转角的一半', '三角形 O₁O₂A 中 O₁A = O₁O₂ = 10 cm，是等腰三角形。曲柄转过 φ，O₁ 处的外角就是 φ，两个底角相等，各为 φ/2。所以摇杆偏离竖直线的角：$$θ=#frac{φ}{2}=#frac{π}{8}t$$'],
      ['摇杆在匀速转动', '$$ω=#frac{dθ}{dt}=#frac{π}{8} #t{rad/s}，α=#frac{dω}{dt}=0$$摇杆的角速度是常数。'],
      ['B 点的速度', 'B 离转轴 O₂ 为 24 cm，做圆周运动，速度垂直于 O₂B：$$v_B=O_2B·ω=24*#frac{π}{8}=3π≈9.42 #t{cm/s}$$'],
      ['B 点的加速度', 'α = 0，切向加速度为零，只有指向 O₂ 的法向加速度：$$a_τ=O_2B·α=0$$$$a_n=O_2B·ω^2=24*(#frac{π}{8})^2=#frac{3π^2}{8}≈3.70 #t{cm/s^2}$$']
    ]
  }],
  write: [
    ['解：O₁A = O₁O₂，三角形 O₁O₂A 为等腰三角形，摇杆转角 $θ=#frac{φ}{2}=#frac{π}{8}t$。'],
    '$ω=#frac{dθ}{dt}=#frac{π}{8} #t{rad/s}，α=0$',
    '$v_B=O_2B·ω=24*#frac{π}{8}=3π≈9.42 #t{cm/s}$',
    '$a_τ=O_2B·α=0，a_n=O_2B·ω^2=24*#frac{π^2}{64}≈3.70 #t{cm/s^2}$',
    ['答：$v_B$ ≈ 9.42 cm/s，垂直于 O₂B；$a_B=a_n$ ≈ 3.70 cm/s²，沿 BO₂ 指向 O₂。']
  ],
  ans: '$v_B=3π≈9.42$ cm/s（垂直于 O₂B），$a_B=#frac{3π^2}{8}≈3.70$ cm/s²（指向 O₂）。',
  pit: [
    '摇杆转角是 φ/2，不是 φ，这一步错了后面全错。',
    'B 的加速度只有法向分量，别再加切向的。'
  ]
});

/* ---------- 第 14 题 曲柄滑块 ---------- */
reg({
  id: 'p21-14', nav: '2-1·14', short: '连杆上 M 点轨迹',
  tag: '第四章 · 任务 2-1 · 第 14 题 · 图 2-1-21',
  title: '曲柄滑块机构，求连杆上 M 点的轨迹和 t = 0 时的速度、加速度',
  orig: '曲柄滑块机构 r = l = 60 cm，MB = l/3，φ = 4t（φ 单位为 rad，t 单位为 s），如图 2-1-21 所示。试求连杆上 M 点的轨迹，并求当 t = 0 时，该点的速度与加速度。',
  given: 'OA = r = 60 cm，AB = l = 60 cm，MB = l/3 = 20 cm，φ = 4t',
  ask: 'M 点的轨迹方程；t = 0 时 M 的速度、加速度',
  know: [
    ['轨迹方程', '运动方程 $x(t)$、$y(t)$ 里消去 t，剩下 x 和 y 的关系就是轨迹。'],
    ['r = l 的特殊之处', 'OA = AB，三角形 OAB 是等腰三角形，滑块 B 的位置 $x_B=2rcosφ$，写坐标很方便。']
  ],
  sum: ['M 的轨迹和 t = 0 时的速度、加速度', '椭圆 $#frac{x^2}{100^2}+#frac{y^2}{20^2}=1$（cm）；$v=80$ cm/s（竖直向上），$a=1600$ cm/s²（水平指向 O）'],
  variants: [{
    params: { ph: { min: 0, max: 360, step: 1, val: 40, label: '曲柄转角 φ = 4t', fmt: v => `${v.toFixed(0)}°（t = ${(v * RAD / 4).toFixed(3)} s）` } },
    anim: { k: 'ph', speed: 40, mode: 'loop', auto: true },
    tools: [animTool(), jumpTool('放到 t = 0', 'ph', 0)],
    readout: p => { const r = p.ph * RAD, vx = -400 * Math.sin(r), vy = 80 * Math.cos(r), ax = -1600 * Math.cos(r), ay = -320 * Math.sin(r); return `M 点 (${(100 * Math.cos(r)).toFixed(1)}, ${(20 * Math.sin(r)).toFixed(1)}) cm；速度 <b>${Math.hypot(vx, vy).toFixed(0)} cm/s</b>，加速度 <b>${Math.hypot(ax, ay).toFixed(0)} cm/s²</b>`; },
    svg(p) {
      const O = [320, 300], r = 150, ph = p.ph, rad = ph * RAD;
      const A = pol(O[0], O[1], r, ph), B = [O[0] + 2 * r * Math.cos(rad), O[1]], M = [O[0] + 250 * Math.cos(rad), O[1] - 50 * Math.sin(rad)];
      let s = '';
      s += D.arrow(0, O[1], 640, O[1], { c: 'ax', h: 10, w: 4, l: 'x', lp: [632, O[1] - 10] }) + D.arrow(O[0], O[1] + 20, O[0], 120, { c: 'ax', h: 10, w: 4, l: 'y', lp: [O[0] - 12, 128] });
      s += D.hatch(10, O[1] + 14, 290, O[1] + 14, 1) + D.hatch(350, O[1] + 14, 630, O[1] + 14, 1);
      s += `<ellipse cx="${O[0]}" cy="${O[1]}" rx="250" ry="50" class="trace"${at({ s: 2 })}/>`;
      s += `<rect x="${f(B[0] - 18)}" y="${O[1] - 12}" width="36" height="24" class="body"/>`;
      s += D.rod([O, A]) + D.rod([A, B]);
      s += D.fixed(O[0], O[1]) + D.pin(A[0], A[1], { r: 4 }) + D.pin(B[0], B[1], { r: 4 });
      s += `<circle cx="${f(M[0])}" cy="${f(M[1])}" r="5.5" class="kdot"/>`;
      if (ph > 3 && ph < 357) s += D.arc(O[0], O[1], 40, 0, ph, 'φ', { lo: 12 });
      s += D.txt(O[0] - 14, O[1] + 26, 'O') + D.txt(...pol(A[0], A[1], 18, ph), 'A') + D.txt(B[0] + 4, O[1] + 34, 'B') + D.txt(M[0] + 14, M[1] - 10, 'M');
      // 第 1 步：投影
      s += D.g(D.ln(M[0], M[1], M[0], O[1], 'dsh h') + D.ln(M[0], M[1], O[0], M[1], 'dsh h'), { s: 1 });
      // 第 3、4 步：速度、加速度（随转角变化）
      const vx = -400 * Math.sin(rad), vy = 80 * Math.cos(rad), ax = -1600 * Math.cos(rad), ay = -320 * Math.sin(rad);
      const vs = 0.45, as = 0.06;
      if (Math.hypot(vx, vy) * vs > 6) s += D.arrow(M[0], M[1], M[0] + vx * vs, M[1] - vy * vs, { c: 'r', s: 3, l: 'v', lp: [M[0] + vx * vs + 12, M[1] - vy * vs - 6] });
      if (Math.hypot(ax, ay) * as > 6) s += D.arrow(M[0], M[1], M[0] + ax * as, M[1] - ay * as, { c: 'u', s: 4, l: 'a', lp: [M[0] + ax * as - 4, M[1] - ay * as + 20] });
      return s;
    },
    steps: [
      ['先看懂机构', '曲柄 OA 绕 O 转，φ = 4t；连杆 AB 带着滑块 B 沿 x 轴来回滑。r = l = 60 cm，M 在连杆上，离 B 为 l/3 = 20 cm（离 A 为 40 cm）。点 "播放运动" 看 M 怎么走。'],
      ['写 M 的坐标', 'OA = AB，三角形 OAB 等腰，所以 $x_B=2rcosφ$。A 的坐标 $(rcosφ, rsinφ)$，B 的坐标 $(2rcosφ, 0)$，M 把 AB 分成 2:1，离 A 占 2/3：$$x_M=rcosφ+#frac{2}{3}rcosφ=#frac{5}{3}rcosφ=100cos4t$$$$y_M=rsinφ-#frac{2}{3}rsinφ=#frac{1}{3}rsinφ=20sin4t$$（单位 cm）'],
      ['消去 t 得轨迹', '$cos4t=#frac{x}{100}$，$sin4t=#frac{y}{20}$，平方相加等于 1：$$#frac{x^2}{100^2}+#frac{y^2}{20^2}=1$$M 的轨迹是一个椭圆（绿色虚线），长半轴 100 cm，短半轴 20 cm。'],
      ['速度', '对运动方程求导：$$v_x=-400sin4t，v_y=80cos4t$$t = 0 时：$$v_x=0，v_y=80 #t{cm/s}$$速度 80 cm/s，<b>竖直向上</b>。点 "放到 t = 0" 看这一刻的箭头。'],
      ['加速度', '再求一次导：$$a_x=-1600cos4t，a_y=-320sin4t$$t = 0 时：$$a_x=-1600 #t{cm/s^2}，a_y=0$$加速度 1600 cm/s²（16 m/s²），<b>水平向左</b>，指向 O。']
    ]
  }],
  write: [
    ['解：r = l，三角形 OAB 为等腰三角形，$x_B=2rcosφ$。M 分 AB 为 AM : MB = 2 : 1。'],
    '$x=#frac{5}{3}rcosφ=100cos4t，y=#frac{1}{3}rsinφ=20sin4t$（cm）',
    ['消去 t，得轨迹方程：'],
    '$#frac{x^2}{100^2}+#frac{y^2}{20^2}=1$（椭圆）',
    '$v_x=-400sin4t，v_y=80cos4t；t=0 时 v_x=0，v_y=80 #t{cm/s}$',
    '$a_x=-1600cos4t，a_y=-320sin4t；t=0 时 a_x=-1600 #t{cm/s^2}，a_y=0$',
    ['答：M 的轨迹为椭圆 $#frac{x^2}{100^2}+#frac{y^2}{20^2}=1$；t = 0 时速度 80 cm/s，竖直向上；加速度 1600 cm/s²，水平指向 O。']
  ],
  ans: '轨迹：$#frac{x^2}{100^2}+#frac{y^2}{20^2}=1$（cm）；t = 0 时 $v=80$ cm/s（↑），$a=1600$ cm/s²（←，指向 O）。',
  pit: [
    'M 离 B 为 l/3，离 A 是 2l/3，分点比例别弄反。',
    '求导时别忘了 φ = 4t 里的系数 4：一次导乘 4，两次导乘 16。'
  ]
});
