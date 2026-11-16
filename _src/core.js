'use strict';
/* ========== 数学与格式 ========== */
const RAD = Math.PI / 180;
const f = n => Math.round(n * 10) / 10;
// 数学角（度，逆时针为正）→ 屏幕坐标
const pol = (x, y, l, d) => [x + l * Math.cos(d * RAD), y - l * Math.sin(d * RAD)];

function at(o) {
  if (!o) return '';
  let s = '';
  if (o.s != null) s += ` data-s="${o.s}"`;
  else if (o.u != null) s += ` data-s="0"`;
  if (o.u != null) s += ` data-u="${o.u}"`;
  if (o.tk != null) s += ` data-tk="${o.tk}" data-tf="${o.tf}"`;
  if (o.dk != null) s += ` data-dk="${o.dk}"` + (o.du != null ? ` data-du="${o.du}"` : '');
  if (o.hk != null) s += ` data-hk="${o.hk}"`;
  if (o.style) s += ` style="${o.style}"`;
  return s;
}
// 标签：F_AB → F 加下标
function lab(t) {
  return String(t).replace(/([A-Za-zθβγαφ])_\{([^}]*)\}|([A-Za-zθβγαφ])_([A-Za-z0-9′']+)/g,
    (m, a, b, c, d) => `${a || c}<tspan class="sb" dy="5">${b || d}</tspan><tspan dy="-5">​</tspan>`);
}

/* 简易公式：$...$ 行内，$$...$$ 独立行；#frac{}{}、#sqrt{}、#t{直立}、_ 下标、^ 上标 */
function tex(s, up) {
  let out = '', i = 0;
  const group = () => {
    while (s[i] === ' ') i++;
    if (s[i] === '{') {
      let d = 0, j = i;
      for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (!d) break; } }
      const r = s.slice(i + 1, j); i = j + 1; return r;
    }
    return s[i++] || '';
  };
  while (i < s.length) {
    const c = s[i];
    if (c === '#') {
      const m = /^#([a-z]+)/.exec(s.slice(i));
      if (m) {
        i += m[0].length;
        if (m[1] === 'frac') { const a = group(), b = group(); out += `<span class="fr"><span>${tex(a, up)}</span><span>${tex(b, up)}</span></span>`; }
        else if (m[1] === 'sqrt') { const a = group(); out += `<span class="sqrt">√<span class="rad">${tex(a, up)}</span></span>`; }
        else if (m[1] === 't') { out += group(); }
        continue;
      }
    }
    if (c === '_' || c === '^') { i++; const a = group(); out += c === '_' ? `<sub>${tex(a, true)}</sub>` : `<sup>${tex(a, up)}</sup>`; continue; }
    if (/[A-Za-z]/.test(c)) {
      let j = i; while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
      const w = s.slice(i, j); i = j;
      const fm = /^([A-Za-z])(sin|cos|tan)$/.exec(w);
      if (fm && !up) { out += `<i>${fm[1]}</i>${fm[2]}`; continue; }
      out += (w.length === 1 && !up) ? `<i>${w}</i>` : w; continue;
    }
    if ('θβγαφ'.includes(c) && !up) { out += `<i>${c}</i>`; i++; continue; }
    if (c === '=' && !up) { out += '=<wbr>'; i++; continue; }
    if (c === ' ') { out += '&nbsp;'; i++; continue; }
    if (c === '⇒') { out += '<wbr>⇒'; i++; continue; }
    if (c === '-') { out += '−'; i++; continue; }
    if (c === '*') { out += '×'; i++; continue; }
    if (c === '<') { out += '&lt;'; i++; continue; }
    out += c; i++;
  }
  return out;
}
// 公式转成纯文本，给"复制文字"用
function texPlain(s) {
  let out = '', i = 0;
  const sup = { '2': '²', '3': '³' };
  const group = () => {
    while (s[i] === ' ') i++;
    if (s[i] === '{') { let d = 0, j = i; for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (!d) break; } } const r = s.slice(i + 1, j); i = j + 1; return r; }
    return s[i++] || '';
  };
  const wrap = x => /^(\d+(\.\d+)?|[A-Za-zθαβγ][A-Za-z0-9′]{0,2}|√\d+)$/.test(x) ? x : '(' + x + ')';
  while (i < s.length) {
    const c = s[i];
    const m = c === '#' && /^#([a-z]+)/.exec(s.slice(i));
    if (m) {
      i += m[0].length;
      if (m[1] === 'frac') { const a = texPlain(group()), b = texPlain(group()); out += wrap(a) + '/' + wrap(b); }
      else if (m[1] === 'sqrt') out += '√' + wrap(texPlain(group()));
      else out += group();
      continue;
    }
    if (c === '_') { i++; out += texPlain(group()); continue; }
    if (c === '^') { i++; const a = texPlain(group()); out += sup[a] || '^' + a; continue; }
    out += c === '-' ? '−' : c === '*' ? '×' : c; i++;
  }
  return out;
}
function plainLine(h) { return String(h).replace(/\$\$?([^$]+?)\$\$?/g, (m, a) => texPlain(a)).replace(/<[^>]+>/g, ''); }
function T(h) {
  if (!h) return '';
  return String(h)
    .replace(/\$\$([\s\S]+?)\$\$/g, (m, a) => `<div class="eq">${tex(a.trim())}</div>`)
    .replace(/\$([^$]+?)\$/g, (m, a) => `<span class="mx">${tex(a)}</span>`);
}

/* ========== SVG 图元 ========== */
const D = {
  g: (c, o = {}, cls = '') => `<g${cls ? ` class="${cls}"` : ''}${at(o)}>${c}</g>`,
  ln: (x1, y1, x2, y2, cls = 'ln', o = {}) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="${cls}"${at(o)}/>`,
  pl: (pts, cls = 'ln', o = {}) => `<polyline points="${pts.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}" class="${cls}"${at(o)}/>`,
  rod(pts, o = {}) {
    const P = pts.map(p => f(p[0]) + ',' + f(p[1])).join(' ');
    return `<g class="rod${o.cls ? ' ' + o.cls : ''}"${at(o)}><polyline points="${P}" class="rodO"/><polyline points="${P}" class="rodI"/></g>`;
  },
  pin: (x, y, o = {}) => `<circle cx="${f(x)}" cy="${f(y)}" r="${o.r || 5}" class="pinc"${at(o)}/>`,
  hatch(x1, y1, x2, y2, side = 1, o = {}) {
    const L = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1) / L, dy = (y2 - y1) / L, nx = -dy * side, ny = dx * side;
    let s = `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="gl"/>`;
    const n = Math.max(2, Math.floor(L / 8));
    for (let i = 0; i <= n; i++) {
      const px = x1 + dx * (i * L / n), py = y1 + dy * (i * L / n);
      s += `<line x1="${f(px)}" y1="${f(py)}" x2="${f(px + nx * 7 - dx * 6)}" y2="${f(py + ny * 7 - dy * 6)}" class="ht"/>`;
    }
    return D.g(s, o);
  },
  // 固定铰支座：rot 为屏幕旋转角（顺时针为正）
  fixed(x, y, rot = 0, o = {}) {
    let s = `<path d="M${x},${y} L${x - 13},${y + 22} L${x + 13},${y + 22} Z" class="sup"/>` + D.hatch(x - 22, y + 22, x + 22, y + 22, 1) + `<circle cx="${x}" cy="${y}" r="5" class="pinc"/>`;
    return `<g transform="rotate(${rot} ${x} ${y})"${at(o)}>${s}</g>`;
  },
  roller(x, y, rot = 0, o = {}) {
    let s = `<path d="M${x},${y} L${x - 12},${y + 15} L${x + 12},${y + 15} Z" class="sup"/><circle cx="${x - 7}" cy="${y + 19.5}" r="4" class="pinc"/><circle cx="${x + 7}" cy="${y + 19.5}" r="4" class="pinc"/>` + D.hatch(x - 22, y + 24, x + 22, y + 24, 1) + `<circle cx="${x}" cy="${y}" r="5" class="pinc"/>`;
    return `<g transform="rotate(${rot} ${x} ${y})"${at(o)}>${s}</g>`;
  },
  txt: (x, y, t, cls = 'pt', o = {}) => `<text x="${f(x)}" y="${f(y)}" class="${cls}" text-anchor="${o.a || 'middle'}"${at(o)}>${lab(t)}</text>`,
  note: (x, y, t, o = {}) => `<text x="${f(x)}" y="${f(y)}" class="nt${o.c ? ' ' + o.c : ''}" text-anchor="${o.a || 'middle'}"${at(o)}>${t}</text>`,
  arc(cx, cy, r, a1, a2, label, o = {}) {
    const [x1, y1] = pol(cx, cy, r, a1), [x2, y2] = pol(cx, cy, r, a2);
    const big = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
    let s = `<path d="M${f(x1)},${f(y1)} A${r},${r} 0 ${big} ${sweep} ${f(x2)},${f(y2)}" class="arc ${o.c || ''}"/>`;
    if (label) {
      const m = o.am != null ? o.am : (a1 + a2) / 2;
      const [lx, ly] = o.lp || pol(cx, cy, r + (o.lo || 15), m);
      s += `<text x="${f(lx)}" y="${f(ly + 5)}" class="arcT ${o.c || ''}" text-anchor="middle">${lab(label)}</text>`;
    }
    return D.g(s, o);
  },
  // 力偶：cw=true 顺时针。可用 o.a1/o.a2 指定弧的起止（数学角）
  couple(cx, cy, r, cw, label, o = {}) {
    const a1 = o.a1 != null ? o.a1 : (cw ? 215 : -35), a2 = o.a2 != null ? o.a2 : (cw ? -35 : 215);
    const [x1, y1] = pol(cx, cy, r, a1), [x2, y2] = pol(cx, cy, r, a2);
    const span = Math.abs(a2 - a1);
    let s = `<path d="M${f(x1)},${f(y1)} A${r},${r} 0 ${span > 180 ? 1 : 0} ${cw ? 1 : 0} ${f(x2)},${f(y2)}" class="cpl"/>`;
    const tx = cw ? Math.sin(a2 * RAD) : -Math.sin(a2 * RAD), ty = cw ? Math.cos(a2 * RAD) : -Math.cos(a2 * RAD);
    const h = 12, w = 5.5, bx = x2 - tx * h * 0.6, by = y2 - ty * h * 0.6, ex = x2 + tx * h * 0.4, ey = y2 + ty * h * 0.4;
    s += `<path d="M${f(ex)},${f(ey)} L${f(bx - ty * w)},${f(by + tx * w)} L${f(bx + ty * w)},${f(by - tx * w)} Z" class="cplh"/>`;
    if (label) { const [lx, ly] = o.lp || [cx, cy - r - 9]; s += `<text x="${f(lx)}" y="${f(ly)}" class="lb cplt" text-anchor="middle">${lab(label)}</text>`; }
    return D.g(s, o, 'cplg ' + (o.c || 'k'));
  },
  arrow(x1, y1, x2, y2, o = {}) {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = o.h || 14, w = o.w || 5.5;
    const bx = x2 - ux * h, by = y2 - uy * h;
    let s = `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(bx + ux * 2)}" y2="${f(by + uy * 2)}"${o.dash ? ' class="dsl"' : ''}/><path d="M${f(x2)},${f(y2)} L${f(bx - uy * w)},${f(by + ux * w)} L${f(bx + uy * w)},${f(by - ux * w)} Z"/>`;
    if (o.l) {
      const [lx, ly] = o.lp || [x2 + ux * 12 - uy * 14, y2 + uy * 12 + ux * 14 + 5];
      s += `<text x="${f(lx)}" y="${f(ly)}" class="lb" text-anchor="${o.la || 'middle'}">${lab(o.l)}</text>`;
    }
    if (o.v) { const [vx, vy] = o.vp; s += `<text x="${f(vx)}" y="${f(vy)}" class="vl" text-anchor="${o.va || 'middle'}">${o.v}</text>`; }
    const oo = Object.assign({}, o, { style: `transform-origin:${f(x1)}px ${f(y1)}px` + (o.style ? ';' + o.style : '') });
    return `<g class="arw ${o.c || 'k'}"${at(oo)}>${s}</g>`;
  },
  // 从点出发的力
  af(x, y, len, deg, o = {}) { const g = o.g || 0; const [sx, sy] = pol(x, y, g, deg), [ex, ey] = pol(x, y, g + len, deg); return D.arrow(sx, sy, ex, ey, o); },
  // 指向点的力（箭头尖在点上）
  ai(x, y, len, deg, o = {}) { const g = o.g != null ? o.g : 7; const [sx, sy] = pol(x, y, g + len, deg + 180), [ex, ey] = pol(x, y, g, deg + 180); return D.arrow(sx, sy, ex, ey, o); },
  dim(x1, y1, x2, y2, label, o = {}) {
    const L = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1) / L, dy = (y2 - y1) / L, h = 8, w = 3;
    const head = (x, y, sx, sy) => `<path d="M${f(x)},${f(y)} L${f(x - sx * h - sy * w)},${f(y - sy * h + sx * w)} L${f(x - sx * h + sy * w)},${f(y - sy * h - sx * w)} Z" class="dmh"/>`;
    const nx = -dy, ny = dx;
    let s = `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="dm"/>` + head(x2, y2, dx, dy) + head(x1, y1, -dx, -dy);
    s += `<line x1="${f(x1 + nx * 7)}" y1="${f(y1 + ny * 7)}" x2="${f(x1 - nx * 7)}" y2="${f(y1 - ny * 7)}" class="dm"/><line x1="${f(x2 + nx * 7)}" y1="${f(y2 + ny * 7)}" x2="${f(x2 - nx * 7)}" y2="${f(y2 - ny * 7)}" class="dm"/>`;
    const off = o.off != null ? o.off : -12;
    const mx = (x1 + x2) / 2 + nx * off, my = (y1 + y2) / 2 + ny * off;
    s += `<text x="${f(mx)}" y="${f(my + 5)}" class="dmt" text-anchor="middle">${lab(label)}</text>`;
    return D.g(s, o);
  },
  rt(x, y, d1, d2, sz = 10, o = {}) {
    const [ax, ay] = pol(x, y, sz, d1), [cx, cy] = pol(x, y, sz, d2);
    return D.pl([[ax, ay], [ax + cx - x, ay + cy - y], [cx, cy]], 'rtm', o);
  },
  axes(x, y, o = {}) {
    const L = o.len || 100, B = o.back || 20, r = o.rot || 0;
    const ax = (d, lb) => { const [sx, sy] = pol(x, y, B, d + 180), [ex, ey] = pol(x, y, L, d); const [lx, ly] = pol(x, y, L + 13, d); return D.arrow(sx, sy, ex, ey, { c: 'ax', h: 10, w: 4, l: lb, lp: [lx, ly + 5] }); };
    return D.g(ax(r, o.lx || 'x') + ax(r + 90, o.ly || 'y'), o);
  }
};

/* ========== 题目注册与渲染 ========== */
const PROBS = [];
const reg = p => PROBS.push(p);
const S = { p: null, vi: 0, cur: 0, params: {}, timer: null };
const $ = sel => document.querySelector(sel);

function legendHTML() {
  return `<div class="legend"><span><i style="background:var(--known)"></i>已知的力</span><span><i style="background:var(--unk)"></i>待求的力</span><span><i style="background:var(--res)"></i>算出来的结果</span><span><i style="background:var(--geo)"></i>辅助线</span></div>`;
}

function renderProb(p) {
  const idx = PROBS.indexOf(p), prev = PROBS[idx - 1], next = PROBS[idx + 1];
  const tabs = p.variants.length > 1 ? `<div class="vtabs">${p.variants.map((v, i) => `<button data-vi="${i}">${v.label}</button>`).join('')}</div>` : '';
  $('#main').innerHTML = `
  <article class="prob">
    <div class="ph">
      <div class="tag">${p.tag}</div>
      <h2>${p.title}</h2>
      <div class="orig" id="orig">${T(p.orig)}</div><button class="omore" id="omore">展开原题</button>
      <div class="given"><b>已知</b><div>${T(p.given)}</div><b>要求</b><div>${T(p.ask)}</div></div>
    </div>
    <div class="khead">先搞懂这几个概念（左右滑动）</div>
    <div class="know">${p.know.map(k => `<div class="kc"><h5>${k[0]}</h5><p>${T(k[1])}</p></div>`).join('')}</div>
    <div class="stage">
      <div class="fig" id="fig">
        ${tabs}
        <div id="svgw"></div>
        <div class="figbar">
          <button class="btn" id="bPrev" title="上一步（←）">上一步</button>
          <span class="stepno" id="stepno"></span>
          <button class="btn pri" id="bNext" title="下一步（→）">下一步</button>
          <button class="btn" id="bPlay">自动播放</button>
          <span class="dots" id="dots"></span>
        </div>
        <div class="ctrl" id="ctrl"></div>
        ${legendHTML()}
      </div>
      <div class="shead"><span id="shno"></span><button class="btn" id="bAll">展开全部步骤</button></div>
      <ol class="steps" id="steps"></ol>
    </div>
    <section class="blk"><h3>作业本上这样写 <button class="btn" id="bCopy">复制文字</button></h3><div class="write" id="write"></div></section>
    <div class="ans" id="ans"></div>
    <section class="blk" id="pitw"><h3>容易错的地方</h3><ul class="pit" id="pit"></ul></section>
    <nav class="pn">
      ${prev ? `<a href="#${prev.id}"><small>上一题</small>${prev.nav} ${prev.short}</a>` : `<a href="#intro"><small>上一页</small>先看这页</a>`}
      ${next ? `<a href="#${next.id}" style="text-align:right"><small>下一题</small>${next.nav} ${next.short}</a>` : `<a href="#sum" style="text-align:right"><small>最后</small>答案汇总</a>`}
    </nav>
    <div class="mbar"><button class="btn" id="mPrev">上一步</button><span class="mprog" id="mprog"></span><button class="btn pri" id="mNext">下一步</button></div>
  </article>`;
  $('#bPrev').onclick = () => go(S.cur - 1);
  $('#bNext').onclick = () => go(S.cur + 1);
  $('#bPlay').onclick = togglePlay;
  $('#bCopy').onclick = copyWrite;
  $('#omore').onclick = () => { const o = $('#orig'); o.classList.toggle('open'); $('#omore').textContent = o.classList.contains('open') ? '收起原题' : '展开原题'; };
  $('#mPrev').onclick = () => { stop(); go(S.cur - 1); };
  $('#mNext').onclick = () => {
    stop();
    if (S.cur < V().steps.length - 1) go(S.cur + 1);
    else { const nx = PROBS[PROBS.indexOf(S.p) + 1]; location.hash = nx ? nx.id : 'sum'; }
  };
  $('#bAll').onclick = () => { const el = $('#steps'); el.classList.toggle('all'); $('#bAll').textContent = el.classList.contains('all') ? '只看当前步' : '展开全部步骤'; };
  // 在图上左右滑动翻步
  let tx = null, ty = 0;
  $('#svgw').addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  $('#svgw').addEventListener('touchend', e => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
    if (Math.abs(dx) > 45 && Math.abs(dy) < 50) { stop(); go(S.cur + (dx < 0 ? 1 : -1)); }
  }, { passive: true });
  document.querySelectorAll('.vtabs button').forEach(b => b.onclick = () => { stop(); S.vi = +b.dataset.vi; S.cur = 0; renderVariant(); });
  renderVariant();
}

function V() { return S.p.variants[S.vi]; }
function pick(k) { const v = V(); return v[k] != null ? v[k] : S.p[k]; }

function renderVariant() {
  const v = V();
  document.querySelectorAll('.vtabs button').forEach(b => b.classList.toggle('on', +b.dataset.vi === S.vi));
  S.params = {};
  for (const k in (v.params || {})) S.params[k] = v.params[k].val;
  drawSVG(true);
  // 步骤
  $('#steps').innerHTML = v.steps.map((st, i) => `<li data-i="${i}"><span class="n">${i}</span><h4>${T(st[0])}</h4><div class="bd">${T(st[1])}</div></li>`).join('');
  document.querySelectorAll('#steps li').forEach(li => li.onclick = () => { stop(); go(+li.dataset.i); });
  $('#dots').innerHTML = v.steps.map((_, i) => `<i data-i="${i}" title="第 ${i} 步"></i>`).join('');
  document.querySelectorAll('#dots i').forEach(d => d.onclick = () => { stop(); go(+d.dataset.i); });
  // 滑块与工具
  let c = '';
  for (const k in (v.params || {})) {
    const pm = v.params[k];
    c += `<label><span>${pm.label}</span><span id="pv_${k}">${pm.fmt(pm.val)}</span></label><input type="range" id="pr_${k}" min="${pm.min}" max="${pm.max}" step="${pm.step}" value="${pm.val}">`;
  }
  if (v.readout) c += `<div class="readout" id="readout"></div>`;
  if (v.tools) c += `<div style="display:flex;gap:8px">${v.tools.map((t, i) => `<button class="btn" data-tool="${i}">${t.label}</button>`).join('')}</div>`;
  $('#ctrl').innerHTML = c;
  for (const k in (v.params || {})) {
    $('#pr_' + k).addEventListener('input', e => {
      S.params[k] = +e.target.value;
      $('#pv_' + k).textContent = v.params[k].fmt(S.params[k]);
      drawSVG(true); updReadout();
    });
  }
  if (v.tools) document.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => v.tools[+b.dataset.tool].on($('#svgw'), b));
  updReadout();
  $('#write').innerHTML = (pick('write') || []).map(l => typeof l === 'string' ? `<div class="wl">${T(l)}</div>` : `<div class="wl zh">${T(l[0])}</div>`).join('');
  $('#ans').innerHTML = `<b>答案</b>${T(pick('ans'))}`;
  const pit = pick('pit') || [];
  $('#pitw').style.display = pit.length ? '' : 'none';
  $('#pit').innerHTML = pit.map(x => `<li>${T(x)}</li>`).join('');
  go(S.cur, true);
}

function updReadout() { const v = V(); if (v.readout && $('#readout')) $('#readout').innerHTML = T(v.readout(S.params)); }

// 量出整张图（所有步骤、滑块两端）的范围，裁掉四周空白
function fitBox(v) {
  if (v._fit) return v._fit;
  const ns = 'http://www.w3.org/2000/svg', m = document.createElementNS(ns, 'svg');
  m.setAttribute('class', 'dg measure'); m.setAttribute('viewBox', '0 0 640 460');
  m.style.cssText = 'position:absolute;left:-9999px;top:0;width:640px;height:460px;visibility:hidden';
  document.body.appendChild(m);
  const base = {}; for (const k in (v.params || {})) base[k] = v.params[k].val;
  const sets = [base];
  for (const k in (v.params || {})) { sets.push(Object.assign({}, base, { [k]: v.params[k].min }), Object.assign({}, base, { [k]: v.params[k].max })); }
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const ps of sets) {
    m.innerHTML = '<g>' + v.svg(ps) + '</g>';
    const b = m.firstChild.getBBox();
    x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
  }
  m.remove();
  const pad = 12;
  if (!(x1 > x0)) return (v._fit = '0 0 640 460');
  return (v._fit = `${f(x0 - pad)} ${f(y0 - pad)} ${f(x1 - x0 + 2 * pad)} ${f(y1 - y0 + 2 * pad)}`);
}

function drawSVG(instant) {
  const v = V();
  const vb = v.vb || fitBox(v);
  $('#svgw').innerHTML = `<svg class="dg instant" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${v.svg(S.params)}</svg>`;
  applyStep(true);
}

function applyStep(instant) {
  const svg = $('#svgw svg');
  if (!svg) return;
  if (instant) svg.classList.add('instant');
  const cur = S.cur;
  svg.querySelectorAll('[data-s]').forEach(e => { const s = +e.dataset.s, u = e.dataset.u != null ? +e.dataset.u : 1e9; e.classList.toggle('on', cur >= s && cur < u); });
  svg.querySelectorAll('[data-tk]').forEach(e => { e.style.transform = cur >= +e.dataset.tk ? e.dataset.tf : ''; });
  svg.querySelectorAll('[data-dk]').forEach(e => { const a = +e.dataset.dk, b = e.dataset.du != null ? +e.dataset.du : 1e9; e.classList.toggle('dim', cur >= a && cur < b); });
  svg.querySelectorAll('[data-hk]').forEach(e => { const L = String(e.dataset.hk).split(',').map(Number); e.classList.toggle('hot', L.includes(cur)); });
  if (instant) { svg.getBoundingClientRect(); requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove('instant'))); }
}

function go(i, instant) {
  const n = V().steps.length;
  i = Math.max(0, Math.min(n - 1, i));
  S.cur = i;
  applyStep(instant);
  document.querySelectorAll('#steps li').forEach(li => { const k = +li.dataset.i; li.classList.toggle('on', k === i); li.classList.toggle('later', k > i); });
  document.querySelectorAll('#dots i').forEach(d => d.classList.toggle('on', +d.dataset.i <= i));
  $('#stepno').textContent = `${i} / ${n - 1}`;
  $('#bPrev').disabled = i === 0;
  $('#bNext').disabled = i === n - 1;
  $('#shno').textContent = `第 ${i} 步 / 共 ${n - 1} 步`;
  $('#mprog').innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('');
  $('#mPrev').disabled = i === 0;
  $('#mNext').textContent = i === n - 1 ? (PROBS[PROBS.indexOf(S.p) + 1] ? '下一题' : '答案汇总') : '下一步';
  if (!instant) {
    const li = document.querySelector('#steps li.on');
    if (li) {
      const r = li.getBoundingClientRect(), mobile = window.innerWidth <= 960;
      const figB = mobile && getComputedStyle($('#fig')).position === 'sticky' ? $('#fig').getBoundingClientRect().bottom : 0;
      if (mobile && !$('#steps').classList.contains('all')) {
        // 手机上只显示当前步：新的一步从图下方开始读
        const figT = $('#fig').getBoundingClientRect().top, stickTop = parseFloat(getComputedStyle($('#fig')).top) || 0;
        if (figB && figT > stickTop + 2) window.scrollBy({ top: figT - stickTop, behavior: 'smooth' }); // 图还没到顶：先把图推到顶上固定
        else if (r.top < figB + 4) window.scrollBy({ top: r.top - figB - 10, behavior: 'smooth' });
      } else if (r.top < figB + 8 || r.bottom > window.innerHeight - 8) window.scrollBy({ top: r.top - figB - 16, behavior: 'smooth' });
    }
  }
}

function togglePlay() {
  if (S.timer) { stop(); return; }
  if (S.cur >= V().steps.length - 1) go(0);
  $('#bPlay').textContent = '停止播放';
  S.timer = setInterval(() => { if (S.cur >= V().steps.length - 1) { stop(); return; } go(S.cur + 1); }, 4200);
}
function stop() { if (S.timer) { clearInterval(S.timer); S.timer = null; } const b = $('#bPlay'); if (b) b.textContent = '自动播放'; }

function copyWrite() {
  const txt = (pick('write') || []).map(l => plainLine(typeof l === 'string' ? l : l[0])).join('\n');
  const done = () => { const b = $('#bCopy'); b.textContent = '已复制'; setTimeout(() => b.textContent = '复制文字', 1500); };
  const fallback = () => { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove(); };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, fallback); else fallback();
}

document.addEventListener('keydown', e => {
  if (!S.p || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if (e.key === 'ArrowRight') { stop(); go(S.cur + 1); }
  if (e.key === 'ArrowLeft') { stop(); go(S.cur - 1); }
});
