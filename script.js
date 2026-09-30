(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = { yellow:'#FFC400', green:'#A7BA2E', pink:'#EC5E81', blue:'#2041B4', purple:'#903FE1', sky:'#5DAAE7', ink:'#1F2236', grey:'#444548', teal:'#1F8A7A', night:'#13173D' };
const root = document.documentElement;
const mqMobileHow = matchMedia('(max-width: 820px)');

/* ---------------- helpers ---------------- */
function setOp(el, key, v){ (el._op ||= {})[key] = v; let o = 1; for (const k in el._op) o *= el._op[k]; el.style.opacity = o >= .999 ? '' : o.toFixed(3); }
function P(el){ if (typeof el === 'string') el = $(el); const r = el.getBoundingClientRect(); const x = scrollX, y = scrollY;
  return { l:r.left + x, t:r.top + y, r:r.right + x, b:r.bottom + y, w:r.width, h:r.height, cx:r.left + x + r.width / 2, cy:r.top + y + r.height / 2 }; }
function norm(a, b){ const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; const x = dx / L, y = dy / L; return { x, y, nx:y, ny:-x, L }; }
function offsetPts(pts, d){
  return pts.map((p, i) => {
    const prev = i > 0 ? norm(pts[i - 1], p) : null, next = i < pts.length - 1 ? norm(p, pts[i + 1]) : null;
    let nx, ny;
    if (prev && next){ const cr = prev.x * next.y - prev.y * next.x; if (Math.abs(cr) < 1e-6){ nx = prev.nx; ny = prev.ny; } else { nx = prev.nx + next.nx; ny = prev.ny + next.ny; } }
    else { const s = prev || next; nx = s.nx; ny = s.ny; }
    return [p[0] + nx * d, p[1] + ny * d];
  });
}
function roundPath(pts, radii){
  let s = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++){
    const a = norm(pts[i - 1], pts[i]), b = norm(pts[i], pts[i + 1]); const [x1, y1] = pts[i];
    const cr = a.x * b.y - a.y * b.x;
    const cap = Math.min(i === 1 ? a.L : a.L / 2, i === pts.length - 2 ? b.L : b.L / 2);
    const r = Math.max(0, Math.min(radii[i], cap));
    if (Math.abs(cr) < 1e-6 || r < .5){ s += ` L${x1.toFixed(1)},${y1.toFixed(1)}`; continue; }
    s += ` L${(x1 - a.x * r).toFixed(1)},${(y1 - a.y * r).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 ${cr > 0 ? 1 : 0} ${(x1 + b.x * r).toFixed(1)},${(y1 + b.y * r).toFixed(1)}`;
  }
  const L = pts[pts.length - 1]; return s + ` L${L[0].toFixed(1)},${L[1].toFixed(1)}`;
}

/* ---------------- horizontal "Como atua" ---------------- */
const how = $('#como-atua'), howTrack = $('#howTrack'), howBg = $('#howBg'), howHalo = $('#howHalo'), howProg = $('#howProg');
let howDist = 0;
function layoutHow(){
  if (mqMobileHow.matches){ how.style.height = ''; howDist = 0; howTrack.style.transform = ''; }
  else { howTrack.style.transform = 'translate3d(0,0,0)'; howDist = Math.max(0, howTrack.scrollWidth - root.clientWidth); how.style.height = (howDist + innerHeight) + 'px'; }
  drawHowThread();
}
function drawHowThread(){
  const svg = $('#howThread'); if (mqMobileHow.matches){ svg.innerHTML = ''; return; }
  const W = howTrack.scrollWidth; svg.setAttribute('width', W); svg.setAttribute('viewBox', `0 0 ${W} 10`); svg.style.width = W + 'px';
  const axes = $$('.axis', howTrack); const x0 = $('.how-intro', howTrack).offsetLeft;
  let html = '';
  axes.forEach((a, i) => { const x = a.offsetLeft, nx = axes[i + 1] ? axes[i + 1].offsetLeft : W; const c = getComputedStyle(a).getPropertyValue('--c').trim(); html += `<rect x="${x}" y="0" width="${nx - x}" height="10" fill="${c}"/>`; });
  svg.innerHTML = html;
}
function updateHow(){
  const top = how.offsetTop, vh = innerHeight, W = root.clientWidth;
  const q = clamp((scrollY - (top - vh)) / vh);
  const cx = howCircleX != null ? howCircleX : W / 2;
  const k = Math.hypot(Math.max(cx, W - cx), vh) / vh * 1.04;
  const r = Math.max(0, scrollY - (top - vh)) * k;
  const R = Math.max(1, r * 2.4), cxs = cx.toFixed(1);
  const f = (180 * (1 - q)).toFixed(0);
  const topFade = `linear-gradient(to bottom, transparent 0, #000 ${f}px)`;
  const mk = q >= 1 ? 'none' : `radial-gradient(circle ${R.toFixed(1)}px at ${cxs}px 0px, #000 0, #000 45%, rgba(0,0,0,.5) 58%, transparent 72%), ${topFade}`;
  const mh = q >= 1 ? 'none' : `radial-gradient(circle ${R.toFixed(1)}px at ${cxs}px 0px, #000 0, #000 58%, rgba(0,0,0,.6) 78%, transparent 100%), ${topFade}`;
  for (const [el, m] of [[howBg, mh], [howHalo, mh]]){ el.style.maskImage = m; el.style.webkitMaskImage = m; el.style.maskComposite = 'intersect'; el.style.webkitMaskComposite = 'source-in'; }
  setOp(howHalo, 'pre', q <= 0 ? 0 : 1);
  setOp(howBg, 'navy', ease(clamp((q - .35) / .55)));
  setOp(howBg, 'pre', q <= 0 ? 0 : 1);
  setOp(howTrack, 'entry', mqMobileHow.matches ? 1 : clamp((q - .45) / .4));
  if (!mqMobileHow.matches && howDist){ const p = clamp((scrollY - top) / howDist); howTrack.style.transform = `translate3d(${(-p * howDist).toFixed(1)}px,0,0)`; if (howProg) howProg.style.width = (p * 100).toFixed(2) + '%'; }
}
let howCircleX = null;

/* ---------------- the weave: scroll-built stripes ---------------- */
const svgW = $('#weaveSvg'), weave = $('#weave'), page = $('#page');
let pieces = [], secTops = [], intro0 = null;
function geo(){
  const cs = getComputedStyle(root); const w = parseFloat(cs.getPropertyValue('--w')) || 28;
  const pad = parseFloat(getComputedStyle($('.hero')).paddingLeft) || 40; const g = w * 43 / 74; const d = (w + g) / 2;
  const W = root.clientWidth; const railX = Math.max(d + w / 2 + 3, pad / 2); const R = Math.max(w * 2.4, d + w / 2 + 10);
  return { w, g, d, pad, W, railX, R, xR:W - railX, u:w / 74 };
}
function build(){
  const G = geo(); const { w, d, W, railX, xR, u } = G;
  const H = page.offsetHeight; weave.style.height = H + 'px'; svgW.setAttribute('viewBox', `0 0 ${W} ${H}`); svgW.setAttribute('width', W); svgW.setAttribute('height', H);
  const list = []; const add = (sec, pts, lanes, o = {}) => list.push({ sec, pts, lanes, R:o.R ?? G.R, w:o.w ?? w, win:o.win || [0, 1], fade:o.fade });
  const BP = [{ d:-d, c:C.blue }, { d:d, c:C.purple }];
  const hband = d + w / 2;

  // 0 · HERO — logo mark bars + blue/purple loop
  const m = P('#mark'), ox = m.l, oy = m.t, hero = P('.hero'), ht = P('.hero-top'), hb = P('.hero-body');
  const cx = ox + 181.5 * u;
  add(0, [[-10, oy + 151 * u], [ox + 318 * u, oy + 151 * u]], [{ d:0, c:C.green }], { win:[0, .3] });
  add(0, [[-10, oy + 268 * u], [ox + 318 * u, oy + 268 * u]], [{ d:0, c:C.pink }], { win:[.06, .36] });
  const yRun = Math.max(ht.b + 20 + hband, oy + 305 * u + G.R + 8);
  const yB = hb.b + 50 + hband;
  const BPs = [{ d:-d, c:C.blue, swap:true }, { d:d, c:C.purple }];
  add(0, [[cx, oy + 74 * u], [cx, yRun], [xR, yRun], [xR, yB], [railX, yB], [railX, hero.b]], BPs, { win:[.18, 1] });
  add(0, [[ox + 354.5 * u, oy + 74 * u], [ox + 354.5 * u, oy + 305 * u]], [{ d:0, c:C.sky }], { win:[.12, .34] });
  add(0, [[ox, oy + 37 * u], [ox + 391 * u, oy + 37 * u]], [{ d:0, c:C.yellow }], { win:[0, .2] });

  { const hx = P('#helix'), ab0 = P('.about'), sec = $('.about'); sec.style.setProperty('--hx', (hx.cx - ab0.l) + 'px'); sec.style.setProperty('--hy', (hx.cy - ab0.t) + 'px'); sec.style.setProperty('--hw', (hx.w * .85) + 'px'); sec.style.setProperty('--hh', (hx.h * .7) + 'px'); }
  // 1 · O QUE É — the loop descends the left margin, then runs under the quote and leaves the page
  const ab = P('.about'), agb = P('.about-grid').b, qmt = parseFloat(getComputedStyle($('#quote')).marginTop) || 120; const yQ = agb + qmt / 2;
  add(1, [[railX, ab.t - 1], [railX, yQ], [W + 40, yQ]], BPs);

  // 2 · POR QUE PAULISTA — yellow weft band + pink/green warp that ends where the next section is born
  const wy = P('.why'); const yY = wy.t + w * 1.3;
  add(2, [[-20, yY], [W + 20, yY]], [{ d:0, c:C.yellow }], { w:w * 1.4, win:[0, .45] });
  const grid = $('.why-grid'); const twoCol = getComputedStyle(grid).gridTemplateColumns.split(' ').length > 1;
  let colX = xR; if (twoCol){ const side = P('.why-side'); const gap = parseFloat(getComputedStyle(grid).columnGap) || 100; colX = side.r + gap / 2; }
  const yA = yY + w * .7 + hband + 16;
  add(2, [[W + 20, yA], [colX, yA], [colX, wy.b]], [{ d:-d, c:C.pink }, { d:d, c:C.green }], { win:[.15, 1], fade:[wy.b - 170, wy.b] });
  howCircleX = colX;

  // 4 · SEU PAPEL — sky/blue rail enters from the left and turns down the right margin
  const ro = P('.roles'), rh = P('.roles-head'); const yT = rh.t - 46 - hband;
  const SB = [{ d:-d, c:C.sky }, { d:d, c:C.blue }];
  add(4, [[-20, yT], [xR, yT], [xR, ro.b]], SB);
  // 5 · MAPA — continues down beside the map and leaves to the west
  const mp = P('.map'), mw = P('#mapWrap'); const yM = mw.b + 50 + hband;
  add(5, [[xR, mp.t - 1], [xR, yM], [-40, yM]], SB);

  // 6 · OPORTUNIDADES — three fine threads fall down the margin and point to the CTA
  const op = P('.opps'), cta = P('#oppsNote'); const fw = w * .42, sp = fw * 1.5;
  const yC = cta.cy; const endX = cta.l - 14;
  const tri = [{ d:-sp, c:C.yellow }, { d:0, c:C.green }, { d:sp, c:C.pink }];
  if (endX - railX > sp * 2 + 12) add(6, [[railX, op.t], [railX, yC], [endX, yC]], tri, { w:fw, R:Math.min(G.R, (endX - railX) * .85) });
  else add(6, [[railX, op.t], [railX, yC + 40]], tri, { w:fw });

  // 7 · FORMULÁRIO — a yellow/sky cable drops into the form card
  const jn = P('.join'), fc = P('#joinCard');
  const twoJ = getComputedStyle($('.join-grid')).gridTemplateColumns.split(' ').length > 1;
  const YS = [{ d:-d, c:C.yellow }, { d:d, c:C.sky }];
  if (twoJ){ const x7 = fc.l + fc.w * .78; add(7, [[x7, jn.t], [x7, fc.t + 30]], YS, { fade:[jn.t + 150, jn.t] }); }
  else add(7, [[xR, jn.t], [xR, fc.t + 40]], YS, { fade:[jn.t + 150, jn.t] });

  // 8 · RECURSOS — a purple bookmark ribbon
  const rs = P('.res'), bw = P('#bookWrap'); const bx = bw.cx + Math.min(bw.w, 340) * .22;
  add(8, [[bx, rs.t], [bx, bw.b + 40]], [{ d:0, c:C.purple }], { w:w * 1.1 });

  // 9 · GOVERNANÇA — each actor arrives from outside the page
  const nodes = [['#nGov', true, C.yellow, true], ['#nAca', false, C.pink, true], ['#nEmp', false, C.sky, false], ['#nSoc', true, C.green, false]];
  const gv = P('.gov'); const twoG = getComputedStyle($('.gov-grid')).gridTemplateColumns.split(' ').length > 1;
  nodes.forEach(([s, left, c, top], i) => { const n = P(s); const pts = twoG ? [[n.cx, top ? gv.t : gv.b], [n.cx, n.cy]] : [[left ? -20 : W + 20, n.cy], [n.cx, n.cy]]; add(9, pts, [{ d:0, c }], { w:w * .6, win:[i * .12, .55 + i * .12] }); });

  // 11 · RODAPÉ — the threads re-form the mark
  const fm = P('#fmark'), ft = P('.foot'); const fx = fm.l, fy = fm.t, fcx = fx + 181.5 * u;
  add(11, [[-10, fy + 151 * u], [fx + 318 * u, fy + 151 * u]], [{ d:0, c:C.green }], { win:[.1, .45] });
  add(11, [[-10, fy + 268 * u], [fx + 318 * u, fy + 268 * u]], [{ d:0, c:C.pink }], { win:[.18, .52] });
  add(11, [[fcx, fy + 74 * u], [fcx, ft.b + 10]], BP, { win:[.3, 1] });
  add(11, [[fx + 354.5 * u, fy + 74 * u], [fx + 354.5 * u, fy + 305 * u]], [{ d:0, c:C.sky }], { win:[.28, .6] });
  add(11, [[fx, fy + 37 * u], [fx + 391 * u, fy + 37 * u]], [{ d:0, c:C.yellow }], { win:[0, .3] });

  // render
  const NS = 'http://www.w3.org/2000/svg'; svgW.innerHTML = ''; pieces = []; let fid = 0;
  list.forEach(pc => {
    let maskRef = null;
    if (pc.fade){ const id = 'fd' + (fid++); const [y0, y1] = pc.fade; const lo = Math.min(y0, y1), hi = Math.max(y0, y1);
      const solid = y1 > y0 ? `<rect x="0" y="0" width="${W}" height="${y0 + 2}" fill="#fff"/>` : `<rect x="0" y="${y0 - 2}" width="${W}" height="${H - y0 + 2}" fill="#fff"/>`;
      svgW.insertAdjacentHTML('afterbegin', `<defs><linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">${solid}<rect x="0" y="${lo}" width="${W}" height="${hi - lo}" fill="url(#${id}g)"/></mask></defs>`);
      maskRef = `url(#${id})`; }
    pc.lanes.forEach(ln => {
      const op2 = offsetPts(pc.pts, ln.d);
      const radii = pc.pts.map((p, i) => { if (i === 0 || i === pc.pts.length - 1) return 0; const a = norm(pc.pts[i - 1], p), b = norm(p, pc.pts[i + 1]); const cr = a.x * b.y - a.y * b.x; return Math.max(2, pc.R + (cr > 0 ? ln.d : -ln.d)); });
      const path = document.createElementNS(NS, 'path'); path.setAttribute('d', roundPath(op2, radii));
      path.setAttribute('fill', 'none'); path.setAttribute('stroke', ln.c); if (ln.swap) path.classList.add('swap'); path.setAttribute('stroke-width', pc.w); path.setAttribute('stroke-linecap', 'butt');
      if (maskRef) path.setAttribute('mask', maskRef); svgW.appendChild(path); const L = path.getTotalLength();
      path.style.strokeDasharray = `${L} ${L + 10}`; path.style.strokeDashoffset = L;
      pieces.push({ el:path, L, sec:pc.sec, win:pc.win, cur:-1 });
    });
  });
  secTops = $$('[data-sec]').map(el => P(el).t);
  tick(true);
}
function targetFor(pc, now){
  const vh = innerHeight, maxS = Math.max(0, root.scrollHeight - vh);
  const end = Math.min(secTops[pc.sec] ?? 0, maxS), start = end - vh * .9;
  let p = end <= 0 ? 1 : (scrollY - start) / (end - start);
  if (pc.sec === 0 && !RM){ const t = intro0 == null ? 0 : (now - intro0) / 2200; p = Math.min(p, t); }
  const [a, b] = pc.win; return clamp((clamp(p) - a) / (b - a));
}
let raf = 0;
function tick(snap){
  const now = performance.now(); let moving = false;
  for (const pc of pieces){
    const t = targetFor(pc, now);
    let v = (snap === true || RM || pc.cur < 0) ? t : pc.cur + (t - pc.cur) * .22;
    if (Math.abs(v - t) < .001) v = t; else moving = true;
    if (v !== pc.cur){ pc.cur = v; pc.el.style.strokeDashoffset = (pc.L * (1 - (pc.sec === 0 ? ease(v) : v))).toFixed(1); }
  }
  if (intro0 != null && now - intro0 < 2300) moving = true;
  updateHow(); quoteReveal(); navState(); heroFade(); xfades();
  raf = moving ? requestAnimationFrame(tick) : 0;
}
const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
addEventListener('scroll', kick, { passive:true });

/* ---------------- scroll-driven section dissolves ---------------- */
const heroEl = $('.hero'), heroParts = $$('.hero-top, .hero-body'), aboutEl = $('#o-que-e'), aboutTitle = $('#o-que-e > .about-title');
function heroFade(){
  const vh = innerHeight, top = aboutEl.offsetTop; const t = clamp((scrollY - (top - vh)) / vh);
  heroEl.style.setProperty('--solid', (t * t * vh).toFixed(1) + 'px');
  heroEl.style.setProperty('--fade', (t * vh * 1.35).toFixed(1) + 'px');
  const o = clamp(1 - t * 1.5);
  heroParts.forEach(el => { setOp(el, 'out', o); el.style.filter = t > 0 ? `blur(${(t * 6).toFixed(1)}px)` : ''; });
  const k = ease(t), A0 = [32, 65, 180], A1 = [93, 170, 231];
  const col = `rgb(${A0.map((v, i) => Math.round(v + (A1[i] - v) * k)).join(',')})`;
  svgW.querySelectorAll('path.swap').forEach(p => p.setAttribute('stroke', col));
  const ai = clamp((t - .35) / .5);
  setOp(aboutTitle, 'in', .15 + .85 * ai); aboutTitle.style.transform = ai < 1 ? `translateY(${((1 - ai) * 30).toFixed(1)}px)` : '';
}
// every other gradient-based boundary: the next section's color floods the previous one as you scroll
const XF = [
  { a:'#o-que-e', b:'#por-que', c:'246,247,251' },
  { a:'#howPin', w:'#como-atua', b:'#seu-papel', c:'246,247,251' },
  { a:'#oportunidades', b:'#conecte', c:'125,59,217' },
  { a:'#conecte', b:'#recursos', c:'255,196,0', m:'236,94,129' },
  { a:'#recursos', b:'#governanca', c:'246,247,251' },
  { a:'#novidades', b:'#contato', c:'19,23,61', keepA:true, keepB:true },
].map(x => { const A = $(x.a), B = $(x.b); const ov = document.createElement('div'); ov.className = 'xf'; A.appendChild(ov);
  return { ...x, A, B, ov, W:x.w ? $(x.w) : A, partsA:x.keepA ? [] : [...A.children].filter(e => e !== ov).map(e => e.classList.contains('quote-wrap') ? e.firstElementChild : e), inB:x.keepB ? null : B.firstElementChild }; });
function xfades(){
  const vh = innerHeight, maxS = Math.max(0, root.scrollHeight - vh);
  for (const x of XF){
    const top = x.B.offsetTop, end = Math.min(top, maxS), start = Math.min(top - vh, end - 1);
    const t = clamp((scrollY - start) / (end - start));
    const s = (t * t * vh).toFixed(1), f = (t * vh * 1.35).toFixed(1), c = x.c;
    x.ov.style.background = t <= 0 ? 'none' : x.m
      ? `linear-gradient(to top, rgb(${c}) 0, rgb(${c}) ${s}px, rgba(${x.m},${(.9 * Math.min(1, t * 2)).toFixed(2)}) ${((+s + +f) / 2).toFixed(1)}px, rgba(${x.m},0) ${f}px)`
      : `linear-gradient(to top, rgb(${c}) 0, rgb(${c}) ${s}px, rgba(${c},0) ${f}px)`;
    const o = clamp(1 - t * 1.5); x.partsA.forEach(el => setOp(el, 'out', o));
    if (x.inB) setOp(x.inB, 'in', .15 + .85 * clamp((t - .35) / .5));
  }
}

/* ---------------- nav ---------------- */
const nav = $('#nav'); let lastY = 0;
function navState(){ const y = scrollY; if (Math.abs(y - lastY) > 6){ nav.classList.toggle('hide', y > lastY && y > 400 && !nav.classList.contains('open')); lastY = y; } }
$('#menuBtn').addEventListener('click', () => { const o = nav.classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); });
function goTo(id){ const el = $(id); if (!el) return; const y = id === '#inicio' ? 0 : P(el).t - (id === '#como-atua' ? 0 : 70); scrollTo({ top:y, behavior:RM ? 'auto' : 'smooth' }); }
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; e.preventDefault(); nav.classList.remove('open');
  if (a.dataset.open) setAcc(+a.dataset.open); goTo(a.getAttribute('href')); });
$('#toTop').addEventListener('click', () => goTo('#inicio'));

/* ---------------- quote word reveal ---------------- */
const qt = $('#quoteText'); qt.innerHTML = qt.textContent.split(' ').map(w => `<span>${w}</span>`).join(' ');
const qWords = $$('span', qt);
function quoteReveal(){ const r = qt.getBoundingClientRect(); const vh = innerHeight; const p = clamp((vh * .92 - r.top) / (vh * .5)); const n = Math.round(p * qWords.length); qWords.forEach((s, i) => s.classList.toggle('on', i < n)); }

/* ---------------- canvas utilities ---------------- */
function fitCanvas(cv){ const dpr = Math.min(2, devicePixelRatio || 1); const r = cv.getBoundingClientRect(); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return { ctx, W:r.width, H:r.height }; }
function whenVisible(el, cb){ let vis = false; new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) cb(); }).observe(el); return () => vis; }

/* ---------------- LOOM (hero visual) ---------------- */
(function loom(){
  const cv = $('#loom'); let S = fitCanvas(cv); const cols = 18; const pal = [C.pink, C.purple, C.yellow, C.sky]; let hx = -1;
  const isVis = whenVisible(cv, () => requestAnimationFrame(frame));
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); hx = e.clientX - r.left; });
  cv.addEventListener('pointerleave', () => hx = -1);
  addEventListener('resize', () => { S = fitCanvas(cv); });
  const t0 = performance.now();
  function frame(now){
    const { ctx, W, H } = S; const cw = W / cols, rh = cw * .62, fell = H * .74;
    const woven = RM ? 40 : 14 + (now - t0) / 2200;
    ctx.fillStyle = '#FBFBFE'; ctx.fillRect(0, 0, W, H);
    const warpW = cw * .5, hot = hx >= 0 ? Math.floor(hx / cw) : -1;
    // bare warp below the fell (opened shed)
    for (let c = 0; c < cols; c++){ const x = c * cw + (cw - warpW) / 2; const lift = (c % 2 ? -1 : 1) * 3; ctx.fillStyle = c === hot ? C.blue : '#D3D7EC';
      ctx.beginPath(); ctx.moveTo(x, fell); ctx.lineTo(x + warpW, fell); ctx.lineTo(x + warpW + lift, H); ctx.lineTo(x + lift, H); ctx.fill(); }
    // woven fabric
    const iMax = Math.floor(woven), frac = woven - iMax;
    for (let i = iMax; i >= 0; i--){
      const y = fell - (woven - i) * rh; if (y < -rh) break;
      const color = pal[Math.floor(i / 3) % 4]; let x0 = 0, x1 = W;
      if (i === iMax){ const e = frac; if (i % 2) { x0 = W - e * W; } else { x1 = e * W; } }
      ctx.fillStyle = color; ctx.fillRect(x0, y + rh * .1, x1 - x0, rh * .8);
      for (let c = 0; c < cols; c++){
        if ((i + c) % 2 === 0) continue; const x = c * cw + (cw - warpW) / 2; if (x + warpW < x0 || x > x1) continue;
        ctx.fillStyle = c === hot ? C.blue : '#D3D7EC'; ctx.fillRect(x, y, warpW, rh);
        ctx.fillStyle = 'rgba(19,23,61,.08)'; ctx.fillRect(x, y + rh - 2, warpW, 2);
      }
      if (i === iMax){ const sx = i % 2 ? x0 : x1; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(sx - 16, fell - rh * .9 - 2, 32, rh * .8 + 4, 6) : ctx.rect(sx - 16, fell - rh * .9 - 2, 32, rh * .8 + 4); ctx.fill(); ctx.fillStyle = color; ctx.fillRect(sx - 9, fell - rh * .9 + 4, 18, 3); }
    }
    // reed (beater) line
    ctx.fillStyle = C.ink; ctx.fillRect(0, fell + 4, W, 4);
    if (isVis() && !RM) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ---------------- HELIX (quadruple helix) ---------------- */
let helixHot = -1;
(function helix(){
  const cv = $('#helix'); let S = fitCanvas(cv); const cols = [C.yellow, C.pink, C.sky, C.green];
  const isVis = whenVisible(cv, () => requestAnimationFrame(frame));
  addEventListener('resize', () => { S = fitCanvas(cv); });
  $$('#helixLegend button').forEach(b => { const i = +b.dataset.i; const on = () => { helixHot = i; $$('#helixLegend button').forEach(x => x.classList.toggle('on', x === b)); kickH(); }; const off = () => { helixHot = -1; b.classList.remove('on'); kickH(); };
    b.addEventListener('mouseenter', on); b.addEventListener('focus', on); b.addEventListener('mouseleave', off); b.addEventListener('blur', off); b.addEventListener('click', on); });
  function kickH(){ if (RM) requestAnimationFrame(frame); }
  function frame(now){
    const { ctx, W, H } = S; ctx.clearRect(0, 0, W, H);
    const A = W / 2 - 9, cx = W / 2, t = RM ? 0 : now / 1800, k = Math.PI * 2 / (H * .62);
    const segs = [];
    for (let s = 0; s < 4; s++){
      let prev = null;
      for (let y = 10; y <= H - 10; y += 5){
        const a = t + y * k + s * Math.PI / 2; const x = cx + Math.sin(a) * A, z = Math.cos(a);
        if (prev) segs.push({ s, x0:prev.x, y0:prev.y, x1:x, y1:y, z:(z + prev.z) / 2 }); prev = { x, y, z };
      }
    }
    // rungs = connections
    for (let y = 30; y < H - 20; y += 34){
      const pts = [0, 1, 2, 3].map(s => { const a = t + y * k + s * Math.PI / 2; return { x:cx + Math.sin(a) * A, z:Math.cos(a) }; });
      [[0, 2], [1, 3]].forEach(([i, j]) => { ctx.strokeStyle = `rgba(255,255,255,${.1 + .12 * ((pts[i].z + pts[j].z) / 2 + 1) / 2})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(pts[i].x, y); ctx.lineTo(pts[j].x, y); ctx.stroke(); });
    }
    segs.sort((a, b) => a.z - b.z); ctx.lineCap = 'round';
    for (const g of segs){ const depth = (g.z + 1) / 2; let al = .25 + .75 * depth; if (helixHot >= 0 && g.s !== helixHot) al *= .18;
      ctx.globalAlpha = al; ctx.strokeStyle = cols[g.s]; ctx.lineWidth = 5 + 9 * depth + (g.s === helixHot ? 3 : 0); ctx.beginPath(); ctx.moveTo(g.x0, g.y0); ctx.lineTo(g.x1, g.y1); ctx.stroke(); }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if (isVis() && !RM) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ---------------- ACCORDION (roles) ---------------- */
const accItems = $$('#acc .acc-item');
function setAcc(i){ accItems.forEach((it, j) => { it.classList.toggle('on', j === i); $('.acc-tab', it).setAttribute('aria-expanded', j === i); }); }
accItems.forEach((it, i) => { const tab = $('.acc-tab', it); tab.addEventListener('click', () => setAcc(i)); it.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover) and (min-width:861px)').matches) setAcc(i); }); });
$$('[data-go]').forEach(b => b.addEventListener('click', () => { const v = b.dataset.go; const inp = $(`#optPerfil input[value="${v}"]`); if (inp){ inp.checked = true; route(); } goTo('#conecte'); }));

/* ---------------- MAP ---------------- */
const CATS = [
  { k:'ensino', n:'Instituições de ensino', c:C.purple },
  { k:'lab', n:'Laboratórios', c:C.sky },
  { k:'cowork', n:'Coworkings', c:C.pink },
  { k:'maker', n:'Espaços makers', c:C.yellow },
  { k:'empresa', n:'Empresas', c:C.green },
  { k:'industria', n:'Indústrias', c:C.grey },
  { k:'centro', n:'Centros de inovação', c:C.blue },
  { k:'parque', n:'Parques tecnológicos', c:C.teal },
];
const PTS = [
  { c:'ensino', n:'Campus de ensino superior', b:'Centro', x:372, y:300, d:'Cursos de graduação e pós-graduação com núcleos de extensão abertos a desafios do território.' },
  { c:'ensino', n:'Instituto Federal · campus', b:'Arthur Lundgren', x:232, y:150, d:'Formação técnica e tecnológica com projetos de pesquisa aplicada junto às empresas locais.' },
  { c:'ensino', n:'Unidade do Sistema S', b:'Paratibe', x:196, y:372, d:'Qualificação profissional e serviços de apoio à indústria e ao comércio.' },
  { c:'lab', n:'Laboratório de pesquisa aplicada', b:'Centro', x:420, y:250, d:'Estrutura para testes, prototipagem e validação de soluções com empresas parceiras.' },
  { c:'lab', n:'Laboratório de materiais', b:'Arthur Lundgren', x:282, y:112, d:'Ensaios e análises de materiais, com foco em processos industriais.' },
  { c:'cowork', n:'Cowork Janga', b:'Janga', x:540, y:400, d:'Espaço compartilhado para startups e profissionais independentes, com agenda de eventos.' },
  { c:'cowork', n:'Cowork Centro', b:'Centro', x:338, y:236, d:'Estações de trabalho, salas de reunião e programação de conexões.' },
  { c:'maker', n:'Espaço maker Pau Amarelo', b:'Pau Amarelo', x:520, y:200, d:'Impressoras 3D, corte a laser e oficinas abertas à comunidade.' },
  { c:'maker', n:'Fab lab escolar', b:'Mirueira', x:130, y:212, d:'Laboratório de fabricação digital para estudantes da rede pública.' },
  { c:'empresa', n:'Polo de comércio e serviços', b:'Centro', x:392, y:342, d:'Concentração de empresas de comércio e serviços com demandas de digitalização.' },
  { c:'empresa', n:'Startup de tecnologia', b:'Janga', x:480, y:452, d:'Negócio de base tecnológica nascido no ecossistema local.' },
  { c:'industria', n:'Distrito industrial', b:'Paratibe', x:126, y:420, d:'Área industrial com demandas reais para inovação aberta e parcerias com startups.' },
  { c:'industria', n:'Indústria de alimentos', b:'Mirueira', x:92, y:318, d:'Planta industrial com desafios de eficiência operacional e sustentabilidade.' },
  { c:'centro', n:'Centro de Inovação', b:'Centro', x:318, y:340, d:'Em implantação. Será a casa do Paulistear e dos programas do ecossistema.' },
  { c:'centro', n:'Instituto de Ciência e Tecnologia', b:'Maranguape', x:420, y:470, d:'Em implantação. Foco em pesquisa, desenvolvimento e transferência de tecnologia.' },
  { c:'parque', n:'Parque Tecnológico', b:'Maria Farinha', x:470, y:86, d:'Projeto em andamento para atrair empresas de base tecnológica.' },
];
const catOf = k => CATS.find(c => c.k === k);
let mapFilter = 'all', mapSel = 13;
(function initMap(){
  const chips = $('#mapChips'); chips.innerHTML = `<button class="chip on" data-k="all"><i style="--c:var(--ink)"></i>Todos</button>` + CATS.map(c => (c.k === 'maker' ? '<span class="chip-brk" aria-hidden="true"></span>' : '') + `<button class="chip" data-k="${c.k}"><i style="--c:${c.c}"></i>${c.n}</button>`).join('');
  chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; mapFilter = b.dataset.k; $$('.chip', chips).forEach(x => x.classList.toggle('on', x === b));
    if (mapFilter !== 'all' && PTS[mapSel].c !== mapFilter) mapSel = PTS.findIndex(p => p.c === mapFilter); renderMap(); });
  const g = $('#pins'); g.innerHTML = PTS.map((p, i) => `<g class="pin" data-i="${i}" transform="translate(${p.x} ${p.y})" style="--c:${catOf(p.c).c}" tabindex="0" role="button" aria-label="${p.n}"><circle class="halo" r="16"/><rect x="-8" y="-8" width="16" height="16" rx="3"/></g>`).join('');
  g.addEventListener('click', e => { const p = e.target.closest('.pin'); if (p){ mapSel = +p.dataset.i; renderMap(); } });
  g.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.pin')){ e.preventDefault(); mapSel = +e.target.closest('.pin').dataset.i; renderMap(); } });
  $('#mapPanel').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b){ mapSel = +b.dataset.i; renderMap(); } });
  renderMap();
})();
function renderMap(){
  $$('#pins .pin').forEach(el => { const i = +el.dataset.i; el.classList.toggle('off', mapFilter !== 'all' && PTS[i].c !== mapFilter); el.classList.toggle('sel', i === mapSel); });
  const p = PTS[mapSel], c = catOf(p.c); const vis = PTS.map((x, i) => [x, i]).filter(([x]) => mapFilter === 'all' || x.c === mapFilter);
  $('#mapPanel').innerHTML = `<span class="cat" style="--c:${c.c === C.grey ? '#C9CBD6' : c.c === C.blue ? '#8FA0FF' : c.c}"><i></i>${c.n}</span><h3>${p.n}</h3><span class="where">Bairro · ${p.b}</span><p class="desc">${p.d}</p><span class="ex">Ponto de exemplo</span>
  <ul class="map-list">${vis.map(([x, i]) => `<li><button data-i="${i}" class="${i === mapSel ? 'on' : ''}"><i style="--c:${catOf(x.c).c}"></i>${x.n}</button></li>`).join('')}</ul>`;
}

/* ---------------- OPPORTUNITIES board ---------------- */
const OT = [
  { k:'all', n:'Todas' }, { k:'evento', n:'Eventos', s:'Evento', c:C.sky }, { k:'ideathon', n:'Ideathons', s:'Ideathon', c:C.yellow }, { k:'hackathon', n:'Hackathons', s:'Hackathon', c:C.pink },
  { k:'edital', n:'Editais', s:'Edital', c:C.green }, { k:'programa', n:'Programas', s:'Programa', c:'#B98CFF' }, { k:'invest', n:'Investimento', s:'Investimento', c:'#FF9E6B' }, { k:'desafio', n:'Desafios', s:'Desafio', c:'#8FA0FF' },
];
const OPP = [
  { k:'evento', n:'Encontro da Quádrupla Hélice', d:'15 OUT 2026', s:'Inscrições abertas' },
  { k:'desafio', n:'Desafio tecnológico: logística urbana', d:'20 OUT 2026', s:'Aberto' },
  { k:'ideathon', n:'Ideathon Cidade Sustentável', d:'24 OUT 2026', s:'Inscrições abertas' },
  { k:'hackathon', n:'Hackathon Indústria 4.0', d:'07 NOV 2026', s:'Em breve' },
  { k:'evento', n:'Semana de Inovação de Paulista', d:'18 NOV 2026', s:'Em breve' },
  { k:'edital', n:'Edital de apoio a startups locais', d:'ATÉ 30 NOV', s:'Aberto' },
  { k:'invest', n:'Rodada de conexão com investidores', d:'03 DEZ 2026', s:'Inscrições abertas' },
  { k:'programa', n:'Programa de pré-incubação', d:'12 JAN 2027', s:'Em breve' },
  { k:'desafio', n:'Banco de desafios: eficiência energética', d:'CONTÍNUO', s:'Aberto' },
  { k:'programa', n:'Trilha de empreendedorismo para estudantes', d:'FEV 2027', s:'Em breve' },
];
const ROWS = 6; const lampC = s => s === 'Em breve' ? C.yellow : '#7CE08A';
(function initOpps(){
  const now = new Date(); const M = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  $('#stamp').innerHTML = `Painel atualizado<br>${String(now.getDate()).padStart(2, '0')} ${M[now.getMonth()]} ${now.getFullYear()} · ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const tabs = $('#oppTabs'); tabs.innerHTML = OT.map((t, i) => `<button role="tab" data-k="${t.k}" class="${i ? '' : 'on'}" aria-selected="${!i}">${t.n}</button>`).join('');
  $('#oppBody').innerHTML = Array.from({ length:ROWS }, () => `<tr><td class="t"></td><td class="n"></td><td class="d"></td><td class="s"></td></tr>`).join('');
  tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', tabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); fillBoard(b.dataset.k, true); });
  fillBoard('all', false);
})();
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function flap(el, text, delay, animate){
  clearInterval(el._t); if (!animate || RM){ el.textContent = text; return; }
  const start = performance.now() + delay, dur = 520;
  el._t = setInterval(() => { const t = (performance.now() - start) / dur; if (t < 0) return; if (t >= 1){ el.textContent = text; clearInterval(el._t); return; }
    const n = Math.floor(t * text.length); el.textContent = text.slice(0, n) + [...text.slice(n)].map(ch => ch === ' ' ? ' ' : GLYPHS[Math.random() * GLYPHS.length | 0]).join(''); }, 40);
}
function fillBoard(k, animate){
  const list = OPP.filter(o => k === 'all' || o.k === k).slice(0, ROWS);
  $$('#oppBody tr').forEach((tr, i) => { const o = list[i]; const [t, n, d, s] = tr.children; tr.classList.toggle('blank', !o);
    const typ = o ? OT.find(x => x.k === o.k) : null; t.style.setProperty('--c', typ ? typ.c : '#fff');
    flap(t, o ? typ.s.toUpperCase() : '—', i * 70, animate); flap(n, o ? o.n : '· · ·', i * 70 + 60, animate); flap(d, o ? o.d : '— — —', i * 70 + 120, animate);
    s.innerHTML = o ? `<span class="lamp" style="--lc:${lampC(o.s)}"></span>${o.s}` : '—'; });
}

/* ---------------- FORM + smart routing ---------------- */
const PERFIS = [['startup','Startup/Empreendedor'],['empresa','Empresa/Indústria'],['academia','Academia/Instituição de Ensino'],['investidor','Investidor/Mentor'],['governo','Governo'],['sociedade','Sociedade Civil'],['outro','Outro']];
const INTS = [['rede','Quero participar da rede'],['solucao','Quero apresentar uma solução'],['desafio','Quero apresentar um desafio'],['invest','Quero buscar investimento'],['programas','Quero participar de programas'],['projeto','Quero desenvolver um projeto'],['outro','Outro']];
const AREAS = [
  { k:'A', n:'Startups e empreendedorismo' }, { k:'B', n:'Inovação aberta e indústria' }, { k:'C', n:'Academia e ICTs' }, { k:'D', n:'Capital e fomento' }, { k:'E', n:'Governança e comunidade' },
];
$('#optPerfil').innerHTML = PERFIS.map(([v, l]) => `<input type="radio" name="perfil" id="p-${v}" value="${v}"><label for="p-${v}">${l}</label>`).join('');
$('#optInt').innerHTML = INTS.map(([v, l]) => `<input type="radio" name="int" id="i-${v}" value="${v}"><label for="i-${v}">${l}</label>`).join('');
function routeFor(p, i){
  if (i === 'invest') return 3;
  if (i === 'desafio') return p === 'academia' ? 2 : 1;
  if (i === 'projeto' && (p === 'academia' || !p)) return 2;
  if (i === 'programas') return 0;
  if (i === 'solucao') return p === 'startup' || !p ? 0 : p === 'academia' ? 2 : 1;
  return { startup:0, empresa:1, academia:2, investidor:3, governo:4, sociedade:4, outro:4 }[p] ?? -1;
}
(function drawRoute(){
  const svg = $('#routeSvg'); const ys = AREAS.map((_, i) => 25 + i * 50);
  svg.innerHTML = AREAS.map((a, i) => `<path id="rp${i}" d="M112 125 C190 125 170 ${ys[i]} 238 ${ys[i]}"/>`).join('') +
    `<g class="you"><rect x="8" y="104" width="104" height="42" rx="12"/><text x="60" y="130" text-anchor="middle">Seu cadastro</text></g>` +
    AREAS.map((a, i) => `<g class="nd" id="rn${i}"><rect x="238" y="${ys[i] - 18}" width="214" height="36" rx="10"/><text x="252" y="${ys[i] + 5}">${a.n}</text></g>`).join('');
})();
function route(){
  const p = $('input[name=perfil]:checked')?.value, i = $('input[name=int]:checked')?.value; const k = p || i ? routeFor(p, i) : -1;
  AREAS.forEach((_, j) => { $('#rp' + j).classList.toggle('on', j === k); $('#rn' + j).classList.toggle('on', j === k); });
  $('#routeTag').textContent = k < 0 ? 'aguardando perfil' : 'rota definida';
  $('#routeOut').innerHTML = k < 0 ? 'Escolha seu perfil e interesse: mostramos para qual área da equipe seu cadastro será enviado.' : `Seu cadastro vai direto para a equipe de <b>${AREAS[k].n}</b>.`;
  return k;
}
$('#joinForm').addEventListener('change', route);
$('#joinForm').addEventListener('submit', e => {
  e.preventDefault(); let ok = true;
  const setErr = (el, msg) => { const f = el.closest('.field'); f.classList.toggle('err', !!msg); $('.msg', f).textContent = msg || ''; if (msg) ok = false; };
  const nome = $('#f-nome'), email = $('#f-email');
  setErr(nome, nome.value.trim().length < 2 ? 'Informe seu nome.' : '');
  setErr(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Informe um e-mail válido, como voce@exemplo.com.');
  setErr($('#optPerfil'), $('input[name=perfil]:checked') ? '' : 'Escolha o perfil que melhor descreve você.');
  setErr($('#optInt'), $('input[name=int]:checked') ? '' : 'Escolha um interesse.');
  if (!ok) return; const k = route(); const card = $('#joinCard'); const first = nome.value.trim().split(' ')[0];
  card.dataset.html = card.innerHTML;
  card.innerHTML = `<div class="done"><div class="ok"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#1F2236" stroke-width="3.5"><path d="M4 14l6 6L22 6"/></svg></div><h3>Bem-vindo à rede, ${first.replace(/[<>&]/g, '')}!</h3><p>Recebemos seu cadastro. A equipe responsável entra em contato pelo e-mail informado.</p><div class="dest">Encaminhado para: <b>${AREAS[k].n}</b></div><p style="font-size:.8rem;font-family:var(--f-mono)">Protótipo · o envio real será integrado depois</p><button class="btn ghost" type="button" id="again" style="color:var(--ink);margin-top:6px">Fazer outro cadastro</button></div>`;
  $('#again').addEventListener('click', () => location.reload());
  build();
});

/* ---------------- BOOK tilt ---------------- */
(function(){ const wrap = $('#bookWrap'), book = $('#book'); if (RM) return;
  wrap.addEventListener('pointermove', e => { const r = wrap.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; book.style.transform = `rotateY(${(-20 + x * 24).toFixed(1)}deg) rotateX(${(6 - y * 14).toFixed(1)}deg)`; });
  wrap.addEventListener('pointerleave', () => book.style.transform = ''); })();

/* ---------------- GOVERNANCE ring ---------------- */
const GOV = [
  ['Governo', 'Articula políticas públicas, incentivos e desburocratização para quem inova.', C.yellow],
  ['Academia', 'Produz conhecimento, pesquisa aplicada e forma os talentos do território.', C.pink],
  ['Empresas', 'Traz demandas reais, investimento e espaço para inovação aberta.', '#2E86D1'],
  ['Sociedade Civil', 'Aponta os desafios da cidade e participa da construção das soluções.', '#6E8012'],
];
function govOn(k){ $$('.node button').forEach(x => x.classList.toggle('on', +x.dataset.k === k)); $$('#actors .actor').forEach(x => x.classList.toggle('on', +x.dataset.k === k)); const [n, t, c] = GOV[k]; $('#core').style.setProperty('--c', c); $('#core p').innerHTML = `<b>${n}</b>${t}`; }
$$('.node button, #actors .actor').forEach(b => { const k = +b.dataset.k; b.addEventListener('mouseenter', () => govOn(k)); b.addEventListener('focus', () => govOn(k)); b.addEventListener('click', () => govOn(k)); });

/* ---------------- NEWSLETTER ---------------- */
$('#nl-email').addEventListener('input', e => { $('#nlThread').style.width = Math.min(100, e.target.value.length * 4) + '%'; });
$('#nlForm').addEventListener('submit', e => { e.preventDefault(); const v = $('#nl-email').value.trim(); const m = $('#nlMsg');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ m.className = 'nl-msg bad'; m.textContent = 'Confira o e-mail: ele precisa ter o formato voce@exemplo.com.'; return; }
  m.className = 'nl-msg ok'; m.textContent = `Pronto! As novidades vão chegar em ${v}. (protótipo: envio real a integrar)`; $('#nlThread').style.width = '100%'; });


/* ---------------- balanced line lengths (works for any number of lines) ---------------- */
function balanceText(){
  $$('.js-balance').forEach(el => {
    el.style.maxWidth = ''; const full = el.getBoundingClientRect().width, h = el.getBoundingClientRect().height;
    let lo = full * .5, hi = full;
    for (let i = 0; i < 14; i++){ const mid = (lo + hi) / 2; el.style.maxWidth = mid + 'px'; if (el.getBoundingClientRect().height > h + 1) lo = mid; else hi = mid; }
    el.style.maxWidth = Math.ceil(hi) + 1 + 'px';
  });
}

/* ---------------- boot / relayout ---------------- */
function relayout(){ balanceText(); layoutHow(); build(); }
let rT; const debounced = () => { clearTimeout(rT); rT = setTimeout(relayout, 120); };
addEventListener('resize', debounced);
new ResizeObserver(debounced).observe(page);
relayout();
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { relayout(); intro0 = performance.now(); kick(); });
setTimeout(() => { if (intro0 == null){ intro0 = performance.now(); kick(); } }, 1200);
})();
