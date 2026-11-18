(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = { yellow:'#FFC400', green:'#A7BA2E', pink:'#EC5E81', blue:'#2041B4', purple:'#903FE1', sky:'#5DAAE7', ink:'#1F2236', grey:'#8A8FA8', teal:'#1F8A7A' };
const root = document.documentElement;
root.classList.add('js');
const PAGE = document.body.dataset.page || 'inicio';
const esc = s => String(s).replace(/[<>&"]/g, ch => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' }[ch]));

/* =====================================================================
   CABEÇALHO E RODAPÉ (iguais em todas as páginas; edite só aqui)
   ===================================================================== */
const MARK = '<svg class="mark" viewBox="154 198 1594 1767" aria-hidden="true"><polygon points="587,463 1700,463 1700,568 465,568" fill="#A7BC2B"/><polygon points="1109,285 1213,285 1213,1860 1109,1964" fill="#2041B4"/><polygon points="1643,285 1748,285 1748,745 1643,745" fill="#5DAAE7"/><polygon points="896,198 1748,198 1748,303 774,303" fill="#FFC400"/><polygon points="276,730 1748,730 1748,835 154,835" fill="#EC5E81"/><polygon points="1379,198 1484,198 1484,1589 1379,1694" fill="#903FE1"/><rect x="1374" y="463" width="115" height="105" fill="#A7BC2B"/></svg>';
const LOCKUP = `<span class="lockup" aria-hidden="true">${MARK}<span class="wm"></span></span>`;
const PAGES = [
  ['inicio', 'index.html', 'Início'],
  ['como-atua', 'como-atua.html', 'Como atua'],
  ['agenda', 'agenda.html', 'Agenda'],
  ['ecossistema', 'ecossistema.html', 'Ecossistema'],
  ['faca-parte', 'faca-parte.html', 'Faça parte'],
];
// Instituições que fazem parte do núcleo: [arquivo em assets/logos, nome, largura máx., altura máx.]
const PARTNERS = [
  ['prefeitura-secti.png', 'Prefeitura do Paulista · Secretaria Executiva de Ciência, Tecnologia e Inovação', 300, 62],
  ['ifpe.png', 'Instituto Federal de Pernambuco · Campus Paulista', 200, 56],
  ['senai.png', 'SENAI', 120, 34],
  ['senac.png', 'Senac', 220, 44],
  ['uninassau.svg', 'UNINASSAU', 190, 42],
  ['fasup.png', 'Faculdade FASUP', 80, 78],
  ['gente-inocente.png', 'Instituto Gente Inocente', 70, 82],
  ['adventux.png', 'AdventuX', 100, 76],
  ['codecrab.png', 'CodeCrab Community', 160, 80],
  ['yc-saude.png', 'YC Saúde', 190, 66],
];
const cur = k => k === PAGE ? ' aria-current="page"' : '';

const nav = $('#nav');
nav.innerHTML = `<div class="wrap nav-in">
  <a class="nav-logo" href="index.html" aria-label="Paulistear, página inicial">${LOCKUP}</a>
  <button class="menu-btn" id="menuBtn" aria-label="Abrir menu" aria-expanded="false" aria-controls="navMenu"><i></i><i></i><i></i></button>
  <nav class="nav-menu" id="navMenu" aria-label="Principal">
    <ul class="nav-links">${PAGES.slice(0, 4).map(([k, h, n]) => `<li><a href="${h}"${cur(k)}>${n}</a></li>`).join('')}</ul>
    <a class="nav-cta" href="faca-parte.html"${cur('faca-parte')}>Faça parte</a>
  </nav>
</div>`;
$('#menuBtn').addEventListener('click', () => { const o = nav.classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); $('#menuBtn').setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')){ nav.classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', false); $('#menuBtn').focus(); } });

$('#site-footer').innerHTML = `<section class="partners" aria-labelledby="partnersTitle"><div class="wrap">
    <h2 id="partnersTitle">Fazem parte do núcleo</h2>
    <ul class="logos">${PARTNERS.map(([f, n, w, h]) => `<li><img src="assets/logos/${f}" alt="${esc(n)}" loading="lazy" style="--w:${w}px;--h:${h}px"></li>`).join('')}</ul>
  </div></section>
  <footer class="foot"><div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="index.html" aria-label="Paulistear, página inicial" style="display:inline-block">${LOCKUP}</a>
        <p class="sub">Hub de Inovação de Paulista — PE<span>Núcleo de Inovação · Quádrupla Hélice</span></p>
      </div>
      <nav aria-label="Páginas"><h3>Navegue</h3><ul>${PAGES.map(([k, h, n]) => `<li><a href="${h}"${cur(k)}>${n}</a></li>`).join('')}</ul></nav>
      <nav aria-label="Perfis"><h3>Para o seu perfil</h3><ul>
        <li><a href="faca-parte.html?perfil=startup">Startups</a></li>
        <li><a href="faca-parte.html?perfil=empresa">Empresas</a></li>
        <li><a href="faca-parte.html?perfil=academia">Academia</a></li>
        <li><a href="faca-parte.html?perfil=investidor">Investidores</a></li>
        <li><a href="faca-parte.html?perfil=governo">Governo</a></li>
        <li><a href="faca-parte.html?perfil=sociedade">Sociedade civil</a></li>
      </ul></nav>
    </div>
    <div class="foot-bottom"><span>© 2026 Paulistear · Núcleo de Inovação de Paulista</span><button class="btn alt sm" id="toTop" type="button">Voltar ao topo ↑</button></div>
  </div></footer>`;
$('#toTop').addEventListener('click', () => scrollTo({ top:0, behavior:RM ? 'auto' : 'smooth' }));

/* =====================================================================
   ENTRADA DISCRETA DOS BLOCOS
   ===================================================================== */
let rvEls = $$('main .sec > .wrap > *');
// grades de cards entram um a um
$$('.cards, .trilhas, .steps, .actors, .gov-figs').forEach(g => { rvEls = rvEls.filter(e => e !== g); [...g.children].forEach((c, i) => { c.style.transitionDelay = (i * 80) + 'ms'; rvEls.push(c); }); });
rvEls.forEach(el => el.classList.add('rv'));
// números da governança contam até o valor
const figs = $$('.gov-figs dt').map(el => ({ el, n:+el.textContent, done:false }));
function countUp(){ figs.forEach(f => { if (f.done || f.el.getBoundingClientRect().top > innerHeight * .9) return; f.done = true; if (RM) return; const t0 = performance.now(); const step = t => { const p = Math.min(1, (t - t0) / 900); f.el.textContent = Math.round(f.n * p); if (p < 1) requestAnimationFrame(step); }; f.el.textContent = 0; requestAnimationFrame(step); }); }
const fabricFig = $('#fabric');
function reveal(){
  const vh = innerHeight;
  if (rvEls.length) rvEls = rvEls.filter(el => { if (el.getBoundingClientRect().top < vh * .92){ el.classList.add('in'); return false; } return true; });   // quem já entrou sai da lista
  countUp();
  if (fabricFig && !fabricFig.classList.contains('in')){ const r = fabricFig.getBoundingClientRect(); if (r.top < vh * .8 && r.bottom > 0) fabricFig.classList.add('in'); }
}
addEventListener('resize', reveal);

/* =====================================================================
   INÍCIO · Quádrupla Hélice: quatro fitas que se abrem nas pontas e se trançam no meio
   (desenho 2D em canvas: cor cheia na frente, tom mais escuro no avesso)
   ===================================================================== */
const HELIX = [['Empresas e Indústria', C.sky], ['Governo', C.yellow], ['Educação e Academia', C.pink], ['Sociedade Civil', C.green]];
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const HRGB = HELIX.map(h => hexRgb(h[1]));
// cor da fita com brilho b (1 = cor pura) e mistura w com branco (0 a 1)
const tone = (c, b, w) => { w = Math.max(0, Math.min(.85, w)); return 'rgb(' + c.map(v => Math.round(Math.min(255, v * b) * (1 - w) + 255 * w)).join(',') + ')'; };
function drawFabric(lite){
  const cv = $('#fabricCv'); const W = Math.round(fabricFig.clientWidth), H = Math.round(fabricFig.clientHeight); if (!W || !H) return;
  const dpr = Math.min(2, devicePixelRatio || 1);
  if (cv.width !== W * dpr || cv.height !== H * dpr){ cv.width = W * dpr; cv.height = H * dpr; }
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); g.lineJoin = 'round';
  const PI = Math.PI, M = lite ? 54 : 160, S = lite ? 3 : 6, cx = W / 2, hH = H / 2;   // durante a rolagem, desenho simplificado; ao parar, o desenho fino
  const w0 = Math.max(24, W * .1), rMin = W * .175, rMax = W * .5 - w0 * 2.6;   // rMax deixa folga para a fita sair só pelo topo e pela base
  const A = 2 * PI * .56, T = Math.tanh(1.5);
  const rect = fabricFig.getBoundingClientRect();
  const prog = RM ? .5 : Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
  const rot = .35 + (prog - .5) * 2.4;                            // a hélice gira devagar com a rolagem
  const Rf = y => rMin + (rMax - rMin) * Math.pow(Math.abs((y - hH) / hH), 2.3);
  const back = [], front = [];
  for (let k = 0; k < 4; k++){
    const ph = k * PI / 2 + rot, C = [];
    // linha central da fita
    for (let i = 0; i <= M; i++){
      const y = -180 + (H + 360) * i / M, v = (y - hH) / hH, u = Math.min(1, Math.abs(v));
      const th = ph + A * Math.tanh(1.5 * v) / T, R = Rf(y);
      const dth = A * 1.5 / (T * Math.pow(Math.cosh(1.5 * v), 2)) / hH;                      // quanto a fita gira por pixel de altura
      const dR = (rMax - rMin) * 2.3 * Math.pow(Math.abs(v), 1.3) * Math.sign(v) / hH, m = Math.hypot(1, dR);
      C.push({ y, u, th, R, dth, m, x:cx + R * Math.cos(th), w:w0 * (1 + .5 * u * u) });
    }
    // grade de pontos: a largura da fita é medida SOBRE a superfície em que ela se enrola (fita plana),
    // por isso ela estreita e mostra o avesso quando vira; nas pontas abertas, passa aos poucos a uma faixa de largura cheia
    const G = C.map((c, i) => {
      const q0 = C[Math.max(0, i - 1)], q1 = C[Math.min(M, i + 1)], dx = q1.x - q0.x, dy = q1.y - q0.y, L = Math.hypot(dx, dy) || 1;
      const nrm = Math.hypot(c.R * c.dth, c.m), dTh = -c.m / nrm / c.R, dY = c.R * c.dth / nrm / c.m;
      const e = Math.max(0, Math.min(1, (c.u - .3) / .65)), mix = e * e * (3 - 2 * e);
      const row = [];
      for (let j = 0; j <= S; j++){
        const o = (j / S - .5) * c.w, th = c.th + dTh * o, y = c.y + dY * o;
        const px = cx + Rf(y) * Math.cos(th), sx = c.x + dy / L * o, sy = c.y - dx / L * o;
        row.push({ x:px + (sx - px) * mix, y:y + (sy - y) * mix, z:mix > .45 ? Math.sin(c.th) : Math.sin(th) });
      }
      return row;
    });
    for (let i = 0; i < M; i++) for (let j = 0; j < S; j++){
      const p = G[i][j], q = G[i + 1][j], r = G[i + 1][j + 1], t = G[i][j + 1];
      ((p.z + q.z + r.z + t.z) >= 0 ? front : back).push([k, p, q, r, t]);
    }
  }
  // 2D chapado: avesso num tom mais escuro (pintado primeiro), frente na cor cheia
  const paint = (list, col) => { for (let k = 0; k < 4; k++){ g.beginPath(); list.forEach(([kk, p, q, r, t]) => { if (kk !== k) return; g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.lineTo(r.x, r.y); g.lineTo(t.x, t.y); g.closePath(); }); const c = col(k); g.fillStyle = c; g.strokeStyle = c; g.lineWidth = .9; g.fill(); g.stroke(); } };
  paint(back, k => tone(HRGB[k], .8, 0));
  paint(front, k => tone(HRGB[k], 1, 0));
  // textura de papel só sobre as fitas (equivale ao modo multiplicar: os vincos escurecem, a cor se mantém)
  if (texDark){ const sc = Math.max(W / texDark.width, H / texDark.height), tw = texDark.width * sc, th = texDark.height * sc; g.globalCompositeOperation = 'source-atop'; g.drawImage(texDark, (W - tw) / 2, (H - th) / 2, tw, th); g.globalCompositeOperation = 'source-over'; }
}
// prepara a textura uma vez: cada ponto vira preto com transparência proporcional ao quanto o papel é escuro ali
let texDark = null;
if (fabricFig){ const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height), p = d.data; for (let i = 0; i < p.length; i += 4){ p[i + 3] = (255 - p[i]) * .38; p[i] = p[i + 1] = p[i + 2] = 0; } x.putImageData(d, 0, 0); texDark = c; drawFabric(); }; im.src = 'assets/textura-papel.jpg'; }
if (fabricFig){
  drawFabric();
  let fT; new ResizeObserver(() => { clearTimeout(fT); fT = setTimeout(() => drawFabric(), 120); }).observe(fabricFig);
}
// giro da hélice na rolagem: só quando ela está na tela, em versão leve; 150 ms depois de parar, redesenha com acabamento
let helixT = 0;
function helixFx(){
  if (!fabricFig || RM) return;
  const r = fabricFig.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
  drawFabric(true); clearTimeout(helixT); helixT = setTimeout(() => drawFabric(), 150);
}

/* =====================================================================
   AGENDA
   ===================================================================== */
// Tipos de oportunidade (k = chave, n = nome do filtro, s = nome no singular, c = cor do marcador)
const OT = [
  { k:'evento', n:'Eventos', s:'Evento', c:C.sky }, { k:'ideathon', n:'Ideathons', s:'Ideathon', c:C.yellow }, { k:'hackathon', n:'Hackathons', s:'Hackathon', c:C.pink },
  { k:'edital', n:'Editais', s:'Edital', c:C.green }, { k:'programa', n:'Programas', s:'Programa', c:C.purple }, { k:'invest', n:'Investimento', s:'Investimento', c:C.blue }, { k:'desafio', n:'Desafios', s:'Desafio', c:C.ink },
];
// Oportunidades. date: 'AAAA-MM-DD' (dia exato), 'AAAA-MM' (só o mês) ou null (fluxo contínuo). until:true = prazo final ("até").
// s: 'Aberto', 'Inscrições abertas' ou 'Em breve'. Itens com data já passada vão sozinhos para "Encerradas".
const OPP = [
  { k:'evento', n:'Encontro da Quádrupla Hélice', date:'2026-10-15', s:'Inscrições abertas' },
  { k:'desafio', n:'Desafio tecnológico: logística urbana', date:'2026-10-20', s:'Aberto' },
  { k:'ideathon', n:'Ideathon Cidade Sustentável', date:'2026-10-24', s:'Inscrições abertas' },
  { k:'hackathon', n:'Hackathon Indústria 4.0', date:'2026-11-07', s:'Em breve' },
  { k:'evento', n:'Semana de Inovação de Paulista', date:'2026-11-18', s:'Em breve' },
  { k:'edital', n:'Edital de apoio a startups locais', date:'2026-11-30', until:true, s:'Aberto' },
  { k:'invest', n:'Rodada de conexão com investidores', date:'2026-12-03', s:'Inscrições abertas' },
  { k:'programa', n:'Programa de pré-incubação', date:'2027-01-12', s:'Em breve' },
  { k:'programa', n:'Trilha de empreendedorismo para estudantes', date:'2027-02', s:'Em breve' },
  { k:'desafio', n:'Banco de desafios: eficiência energética', date:null, s:'Aberto' },
];
const MON = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
if ($('#agenda')) (function initAgenda(){
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const typ = k => OT.find(t => t.k === k);
  const items = OPP.map(o => { if (!o.date) return { ...o, cont:true };
    const [y, m, d] = o.date.split('-').map(Number);
    return { ...o, y, m, d:d || 0, start:new Date(y, m - 1, d || 1), end:d ? new Date(y, m - 1, d) : new Date(y, m, 0) }; });
  const future = items.filter(o => !o.cont && o.end >= today).sort((a, b) => a.start - b.start);
  const cont = items.filter(o => o.cont);
  const past = items.filter(o => !o.cont && o.end < today).sort((a, b) => b.start - a.start);
  let filter = 'all';
  const dateCell = o => o.cont ? 'Contínuo' : `${o.until ? 'até ' : ''}${o.d ? `<b>${String(o.d).padStart(2, '0')}</b>` : ''}${MON[o.m - 1]}`;
  const row = (o, done) => { const t = typ(o.k); const st = done ? 'Encerrado' : o.s;
    return `<li class="ag-row"><${o.cont ? 'span' : `time datetime="${o.date}"`} class="ag-date">${dateCell(o)}</${o.cont ? 'span' : 'time'}><span class="ag-type" style="--c:${t.c}"><i></i>${t.s}</span><span class="ag-name">${esc(o.n)}</span><span class="ag-status ${done ? 'done' : st === 'Em breve' ? 'soon' : ''}">${st}</span></li>`; };
  const ok = o => filter === 'all' || o.k === filter;

  const now = new Date();
  $('#stamp').textContent = `Painel atualizado em ${String(now.getDate()).padStart(2, '0')} ${MON[now.getMonth()]} ${now.getFullYear()}`;

  const nx = future[0], box = $('#agNext');
  if (nx){ const t = typ(nx.k);
    box.innerHTML = `<div class="when"><span class="day">${nx.d ? String(nx.d).padStart(2, '0') : MON[nx.m - 1]}</span><span class="mon">${nx.until ? 'ATÉ · ' : ''}${nx.d ? MON[nx.m - 1] + ' ' : ''}${nx.y}</span></div>
      <div><h3>${esc(nx.n)}</h3><p class="meta"><span>${t.s}</span><span>${nx.s}</span></p></div>
      <a class="btn" href="faca-parte.html?interesse=programas#conecte">Quero participar →</a>`;
  } else { box.hidden = true; $('#agNextTitle').hidden = true; }

  const tabs = $('#agTabs');
  tabs.innerHTML = `<button class="chip on" data-k="all" aria-pressed="true">Todas</button>` + OT.map(t => `<button class="chip" data-k="${t.k}" aria-pressed="false"><i style="--c:${t.c}"></i>${t.n}</button>`).join('');
  tabs.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; filter = b.dataset.k; $$('.chip', tabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); render(); });

  function render(){
    const groups = []; future.filter(ok).forEach(o => { const key = `${MONTHS[o.m - 1]} de ${o.y}`; let g = groups.find(x => x.key === key); if (!g) groups.push(g = { key, rows:[] }); g.rows.push(o); });
    const c = cont.filter(ok); if (c.length) groups.push({ key:'Fluxo contínuo', rows:c });
    $('#agList').innerHTML = groups.length ? groups.map(g => `<section class="ag-group"><h3>${g.key}</h3><ul class="ag-list">${g.rows.map(o => row(o)).join('')}</ul></section>`).join('')
      : `<p class="ag-empty">Nenhuma oportunidade ${filter === 'all' ? '' : 'deste tipo '}em aberto no momento.</p>`;
    const p = past.filter(ok), pastEl = $('#agPast'); pastEl.hidden = !p.length;
    $('summary', pastEl).textContent = `Encerradas (${p.length})`;
    $('.ag-list', pastEl).innerHTML = p.map(o => row(o, true)).join('');
  }
  render();
})();

/* =====================================================================
   NEWSLETTER
   ===================================================================== */
if ($('#nlForm')) $('#nlForm').addEventListener('submit', e => { e.preventDefault(); const v = $('#nl-email').value.trim(), m = $('#nlMsg');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ m.className = 'nl-msg bad'; m.textContent = 'Confira o e-mail: ele precisa ter o formato voce@exemplo.com.'; return; }
  m.className = 'nl-msg ok'; m.textContent = `Pronto! As novidades vão chegar em ${v}. (protótipo: envio real a integrar)`; });

/* =====================================================================
   ECOSSISTEMA · mapa
   ===================================================================== */
const CATS = [
  { k:'ensino', n:'Instituições de ensino', c:C.purple }, { k:'lab', n:'Laboratórios', c:C.sky }, { k:'cowork', n:'Coworkings', c:C.pink }, { k:'maker', n:'Espaços makers', c:C.yellow },
  { k:'empresa', n:'Empresas', c:C.green }, { k:'industria', n:'Indústrias', c:C.grey }, { k:'centro', n:'Centros de inovação', c:C.blue }, { k:'parque', n:'Parques tecnológicos', c:C.teal },
];
const PTS = [
  { c:'ensino', n:'Campus de ensino superior', b:'Centro', x:535, y:337, d:'Cursos de graduação e pós-graduação com núcleos de extensão abertos a desafios do território.' },
  { c:'ensino', n:'Instituto Federal · campus', b:'Arthur Lundgren', x:467, y:335, d:'Formação técnica e tecnológica com projetos de pesquisa aplicada junto às empresas locais.' },
  { c:'ensino', n:'Unidade do Sistema S', b:'Paratibe', x:434, y:325, d:'Qualificação profissional e serviços de apoio à indústria e ao comércio.' },
  { c:'lab', n:'Laboratório de pesquisa aplicada', b:'Centro', x:518, y:366, d:'Estrutura para testes, prototipagem e validação de soluções com empresas parceiras.' },
  { c:'lab', n:'Laboratório de materiais', b:'Arthur Lundgren', x:485, y:307, d:'Ensaios e análises de materiais, com foco em processos industriais.' },
  { c:'cowork', n:'Cowork Janga', b:'Janga', x:707, y:327, d:'Espaço compartilhado para startups e profissionais independentes, com agenda de eventos.' },
  { c:'cowork', n:'Cowork Centro', b:'Centro', x:500, y:394, d:'Estações de trabalho, salas de reunião e programação de conexões.' },
  { c:'maker', n:'Espaço maker Pau Amarelo', b:'Pau Amarelo', x:675, y:242, d:'Impressoras 3D, corte a laser e oficinas abertas à comunidade.' },
  { c:'maker', n:'Fab lab escolar', b:'Mirueira', x:464, y:435, d:'Laboratório de fabricação digital para estudantes da rede pública.' },
  { c:'empresa', n:'Polo de comércio e serviços', b:'Centro', x:484, y:364, d:'Concentração de empresas de comércio e serviços com demandas de digitalização.' },
  { c:'empresa', n:'Startup de tecnologia', b:'Janga', x:682, y:305, d:'Negócio de base tecnológica nascido no ecossistema local.' },
  { c:'industria', n:'Distrito industrial', b:'Paratibe', x:441, y:358, d:'Área industrial com demandas reais para inovação aberta e parcerias com startups.' },
  { c:'industria', n:'Indústria de alimentos', b:'Mirueira', x:433, y:421, d:'Planta industrial com desafios de eficiência operacional e sustentabilidade.' },
  { c:'centro', n:'Centro de Inovação', b:'Centro', x:502, y:336, d:'Em implantação. Será a casa do Paulistear e dos programas do ecossistema.' },
  { c:'centro', n:'Instituto de Ciência e Tecnologia', b:'Maranguape', x:569, y:370, d:'Em implantação. Foco em pesquisa, desenvolvimento e transferência de tecnologia.' },
  { c:'parque', n:'Parque Tecnológico', b:'Maria Farinha', x:654, y:53, d:'Projeto em andamento para atrair empresas de base tecnológica.' },
];
if ($('#mapChips')) (function initMap(){
  const catOf = k => CATS.find(c => c.k === k); let mapFilter = 'all', mapSel = 13;
  const chips = $('#mapChips');
  chips.innerHTML = `<button class="chip on" data-k="all" aria-pressed="true">Todos</button>` + CATS.map(c => `<button class="chip" data-k="${c.k}" aria-pressed="false"><i style="--c:${c.c}"></i>${c.n}</button>`).join('');
  chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; mapFilter = b.dataset.k; $$('.chip', chips).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    if (mapFilter !== 'all' && PTS[mapSel].c !== mapFilter) mapSel = PTS.findIndex(p => p.c === mapFilter); render(); });
  const g = $('#pins');
  g.innerHTML = PTS.map((p, i) => `<g class="pin" data-i="${i}" transform="translate(${p.x} ${p.y})" style="--c:${catOf(p.c).c}" tabindex="0" role="button" aria-label="${esc(p.n)}"><circle class="halo" r="22"/><rect class="sh" x="-7" y="-5" width="16" height="16" rx="2"/><rect class="pt" x="-8" y="-8" width="16" height="16" rx="2"/></g>`).join('');
  g.addEventListener('click', e => { const p = e.target.closest('.pin'); if (p){ mapSel = +p.dataset.i; render(); } });
  g.addEventListener('keydown', e => { const p = e.target.closest('.pin'); if (p && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); mapSel = +p.dataset.i; render(); } });
  $('#mapPanel').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b){ mapSel = +b.dataset.i; render(); } });
  function render(){
    $$('#pins .pin').forEach(el => { const i = +el.dataset.i; el.classList.toggle('off', mapFilter !== 'all' && PTS[i].c !== mapFilter); el.classList.toggle('sel', i === mapSel); });
    const p = PTS[mapSel], c = catOf(p.c); $('#mapPanel').parentElement.style.setProperty('--pc', c.c); const vis = PTS.map((x, i) => [x, i]).filter(([x]) => mapFilter === 'all' || x.c === mapFilter);
    $('#mapPanel').innerHTML = `<span class="cat"><i style="--c:${c.c}"></i>${c.n}</span><h3>${esc(p.n)}</h3><span class="where">Bairro · ${p.b}</span><p class="desc">${p.d}</p><span class="ex">Ponto de exemplo</span>
      <ul class="map-list">${vis.map(([x, i]) => `<li><button data-i="${i}" class="${i === mapSel ? 'on' : ''}"><i style="--c:${catOf(x.c).c}"></i>${esc(x.n)}</button></li>`).join('')}</ul>`;
  }
  // no celular o mapa mostra só o município, inteiro; na tela larga, abre para os lados (mar e vizinhos)
  const svg = $('#mapSvg'), fit = () => svg.setAttribute('viewBox', innerWidth <= 900 ? '-24 -24 768 534.7' : '-80 -60 1350 606.7');
  fit(); addEventListener('resize', fit);
  render();
})();

/* =====================================================================
   FAÇA PARTE · perfis e formulário
   ===================================================================== */
const ROLE_KEYS = ['startup', 'empresa', 'academia', 'investidor', 'governo', 'sociedade'];
function setRole(i, focus){
  $$('#roleTabs .chip').forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-selected', j === i); b.tabIndex = j === i ? 0 : -1; if (focus && j === i) b.focus(); });
  $$('#roles .role').forEach((p, j) => p.hidden = j !== i);
}
if ($('#roles')){
  const tabs = $$('#roleTabs .chip');
  tabs.forEach((b, i) => b.addEventListener('click', () => setRole(i)));
  $('#roleTabs').addEventListener('keydown', e => { const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const d = { ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1 }[e.key]; if (!d) return; e.preventDefault(); setRole((i + d + tabs.length) % tabs.length, true); });
}

const PERFIS = [['startup','Startup/Empreendedor'],['empresa','Empresa/Indústria'],['academia','Academia/Instituição de Ensino'],['investidor','Investidor/Mentor'],['governo','Governo'],['sociedade','Sociedade Civil'],['outro','Outro']];
const INTS = [['rede','Quero participar da rede'],['solucao','Quero apresentar uma solução'],['desafio','Quero apresentar um desafio'],['invest','Quero buscar investimento'],['programas','Quero participar de programas'],['projeto','Quero desenvolver um projeto'],['divulgar','Quero divulgar um edital ou oportunidade'],['outro','Outro']];
// Áreas da equipe que recebem cada cadastro
const AREAS = ['Startups e empreendedorismo', 'Inovação aberta e indústria', 'Academia e ICTs', 'Capital e fomento', 'Governança e comunidade'];
function routeFor(p, i){
  if (i === 'invest') return 3;
  if (i === 'divulgar') return { empresa:1, academia:2, sociedade:4 }[p] ?? 3;
  if (i === 'desafio') return p === 'academia' ? 2 : 1;
  if (i === 'projeto' && (p === 'academia' || !p)) return 2;
  if (i === 'programas') return 0;
  if (i === 'solucao') return p === 'startup' || !p ? 0 : p === 'academia' ? 2 : 1;
  return { startup:0, empresa:1, academia:2, investidor:3, governo:4, sociedade:4, outro:4 }[p] ?? 4;
}
if ($('#joinForm')){
  $('#optPerfil').innerHTML = PERFIS.map(([v, l]) => `<input type="radio" name="perfil" id="p-${v}" value="${v}"><label for="p-${v}">${l}</label>`).join('');
  $('#optInt').innerHTML = INTS.map(([v, l]) => `<input type="radio" name="int" id="i-${v}" value="${v}"><label for="i-${v}">${l}</label>`).join('');
  const prefill = (perfil, int) => { const p = perfil && $(`#optPerfil input[value="${perfil}"]`), i = int && $(`#optInt input[value="${int}"]`); if (p) p.checked = true; if (i) i.checked = true;
    const r = ROLE_KEYS.indexOf(perfil); if (r >= 0 && $('#roles')) setRole(r); };
  const q = new URLSearchParams(location.search); prefill(q.get('perfil'), q.get('interesse'));
  // botões dos perfis desta página: preenchem o formulário e descem até ele
  $$('[data-go],[data-int]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); prefill(b.dataset.go, b.dataset.int); $('#conecte').scrollIntoView({ behavior:RM ? 'auto' : 'smooth' }); }));
  $('#joinForm').addEventListener('submit', e => {
    e.preventDefault(); let ok = true, firstBad = null;
    const setErr = (el, msg) => { const f = el.closest('.field'); f.classList.toggle('err', !!msg); $('.msg', f).textContent = msg || ''; if (msg){ ok = false; firstBad ||= el; } };
    const nome = $('#f-nome'), email = $('#f-email');
    setErr(nome, nome.value.trim().length < 2 ? 'Informe seu nome.' : '');
    setErr(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Informe um e-mail válido, como voce@exemplo.com.');
    setErr($('#optPerfil'), $('input[name=perfil]:checked') ? '' : 'Escolha o perfil que melhor descreve você.');
    setErr($('#optInt'), $('input[name=int]:checked') ? '' : 'Escolha um interesse.');
    if (!ok){ (firstBad.matches('input') ? firstBad : $('input', firstBad)).focus(); return; }
    const k = routeFor($('input[name=perfil]:checked').value, $('input[name=int]:checked').value), first = nome.value.trim().split(' ')[0];
    $('#joinCard').innerHTML = `<div class="done" role="status"><h3>Bem-vindo à rede, ${esc(first)}!</h3><p>Recebemos seu cadastro. A equipe responsável entra em contato pelo e-mail informado.</p><p class="dest">Encaminhado para: <b>${AREAS[k]}</b></p><p class="mono">Protótipo · o envio real será integrado depois</p><a class="btn alt" href="faca-parte.html#conecte" id="again">Fazer outro cadastro</a></div>`;
    $('#again').addEventListener('click', ev => { ev.preventDefault(); location.href = 'faca-parte.html'; });
  });
}

/* =====================================================================
   ROLAGEM · suave na roda do mouse, parallax da foto e fitas do hero
   ===================================================================== */
const heroBg = $('#heroBg'), weave = $('#weave');
function heroFx(){
  if (!weave || RM) return;
  const y = scrollY;
  if (y > innerHeight * 1.3) return;              // fora da tela: nada a atualizar
  heroBg.style.transform = `translate3d(0,${(y * .28).toFixed(1)}px,0)`;
  weave.style.setProperty('--sx', (y * .45).toFixed(1) + 'px');
  heroBg.nextElementSibling.style.transform = `translate3d(0,${(y * .42).toFixed(1)}px,0)`;   // texto e botão descem com a rolagem
}
heroFx();

if (!RM && matchMedia('(hover:hover) and (pointer:fine)').matches){
  let target = scrollY, pos = scrollY, raf = 0;
  const maxY = () => root.scrollHeight - innerHeight;
  const canScroll = el => { for (; el && el !== document.body; el = el.parentElement){ const o = getComputedStyle(el).overflowY; if ((o === 'auto' || o === 'scroll') && el.scrollHeight > el.clientHeight) return true; } return false; };
  const tick = () => {
    pos += (target - pos) * .16;
    if (Math.abs(target - pos) < .5){ pos = target; raf = 0; } else raf = requestAnimationFrame(tick);
    scrollTo({ top:pos, behavior:'instant' });
  };
  addEventListener('wheel', e => {
    if (e.ctrlKey || e.defaultPrevented || e.deltaMode === 0 && Math.abs(e.deltaY) < 40 || Math.abs(e.deltaX) > Math.abs(e.deltaY) || canScroll(e.target)) return;   // zoom, touchpad e áreas com rolagem própria ficam nativos
    e.preventDefault();
    if (!raf){ target = pos = scrollY; }
    const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    target = Math.max(0, Math.min(maxY(), target + d));
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive:false });
  // teclado, âncoras e arrasto interrompem a animação
  addEventListener('keydown', () => { if (raf){ cancelAnimationFrame(raf); raf = 0; } });
  addEventListener('pointerdown', () => { if (raf){ cancelAnimationFrame(raf); raf = 0; } });
}

// a barra (altura, logotipo e links) encolhe aos poucos com a rolagem, do tamanho grande ao compacto
const firstBlock = $('main > :first-child');
const navBlocks = $$('main > *, #site-footer > *');
function navFx(){
  const range = Math.max(160, Math.min(firstBlock.offsetHeight - nav.offsetHeight, innerHeight * .7));
  const k = RM ? (scrollY > 40 ? 1 : 0) : Math.max(0, Math.min(1, scrollY / range));
  nav.style.setProperty('--k', k.toFixed(3)); nav.classList.toggle('compact', k === 1);
  const h = nav.offsetHeight, under = navBlocks.find(e => { const r = e.getBoundingClientRect(); return r.top <= h && r.bottom > h; });   // bloco logo abaixo da barra
  nav.classList.toggle('on-white', !!under && under.matches('.white, .light, .partners'));
}
addEventListener('resize', navFx); navFx();

// barra: fixa enquanto o hero (ou o cabeçalho da página) está na tela; depois some ao rolar para baixo,
// volta ao rolar para cima e se recolhe sozinha após alguns segundos sem uso
let lastY = scrollY, acc = 0, hideT = 0;
const navBusy = () => nav.classList.contains('open') || nav.matches(':hover') || nav.contains(document.activeElement);
const pastHero = () => firstBlock.getBoundingClientRect().bottom <= nav.offsetHeight;
const armHide = () => { clearTimeout(hideT); hideT = setTimeout(() => { if (!pastHero()) return; if (navBusy()) return armHide(); nav.classList.add('away'); }, 2600); };
function navHide(){
  const y = scrollY, d = y - lastY; lastY = y;
  if (!pastHero()){ clearTimeout(hideT); acc = 0; nav.classList.remove('away'); return; }
  acc = Math.sign(d) === Math.sign(acc) ? acc + d : d;
  if (acc > 24 && !navBusy()){ clearTimeout(hideT); nav.classList.add('away'); }
  else if (acc < -24){ if (nav.classList.contains('away')) nav.classList.remove('away'); armHide(); }
}
// seção da missão: enquanto ela sai por cima da tela, o texto desce um pouco (mesmo efeito do hero)
const missao = $('#missao'), missaoWrap = missao && $('.wrap', missao);
function missaoFx(){
  if (!missao || RM) return;
  const r = missao.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
  const out = Math.max(0, nav.offsetHeight - r.top);            // quanto da seção já passou do topo
  missaoWrap.style.transform = out ? `translate3d(0,${(out * .36).toFixed(1)}px,0)` : '';
}
// cabeçalho com foto: a imagem desce mais devagar que a página, como a igreja do Início
// (vale para todo cabeçalho com foto: Como atua, Agenda e Ecossistema)
const croche = $('.tex-croche');
function crocheFx(){
  if (!croche || RM) return;
  const y = scrollY; if (y > croche.offsetHeight + 200) return;
  croche.style.setProperty('--py', (y * .28).toFixed(1) + 'px');
}
crocheFx();
// fitas penduradas dos cabeçalhos: cada uma é um pêndulo amortecido preso no topo.
// um "vento" fraco e contínuo as mantém balançando de leve; a rolagem dá um empurrão proporcional à velocidade.
// o laço só roda enquanto o cabeçalho está na tela e para sozinho fora dela.
const bandEls = $$('.page-head .bands i');
let bandsRaf = 0, bandsLastY = scrollY, bandsT0 = performance.now(), bandsPrev = 0;
const bandsState = bandEls.map((el, i) => ({ el, a:0, v:0, ph:i * 1.7 + .4, f:.55 + i * .13 }));
const bandsHead = bandEls.length ? bandEls[0].closest('.page-head') : null;
// medidas lidas só ao abrir e ao redimensionar (ler o layout a cada quadro custaria caro)
let bandsBottom = 0, bandsShown = false;
function bandsMeasure(){ if (!bandsHead) return; bandsBottom = bandsHead.offsetTop + bandsHead.offsetHeight; bandsShown = getComputedStyle(bandEls[0].parentElement).display !== 'none'; bandsState.forEach(b => { b.L = Math.max(80, b.el.offsetHeight) / 100; }); }
bandsMeasure();
const bandsVisible = () => bandsShown && scrollY < bandsBottom;
function bandsStep(t){
  bandsRaf = 0;
  if (!bandsVisible()) return;
  const dt = Math.min(.05, bandsPrev ? (t - bandsPrev) / 1000 : .016); bandsPrev = t;
  const y = scrollY, dy = y - bandsLastY; bandsLastY = y;
  const tt = (t - bandsT0) / 1000;
  bandsState.forEach(b => {
    const L = b.L;                                             // fitas mais longas balançam mais devagar
    const k = 9 / L, c = 1.6;                                  // rigidez e amortecimento
    const wind = 1.6 * Math.sin(tt * b.f + b.ph) + .8 * Math.sin(tt * b.f * 2.3 + b.ph * 1.9);
    b.v += (-k * b.a - c * b.v + wind) * dt;
    b.v -= dy * .08 / L;                                       // empurrão da rolagem
    b.a += b.v * dt;
    b.a = Math.max(-6, Math.min(6, b.a));
    b.el.style.setProperty('--a', b.a.toFixed(2) + 'deg');
  });
  bandsRaf = requestAnimationFrame(bandsStep);
}
function bandsWake(){ if (!bandEls.length || RM || bandsRaf) return; bandsPrev = 0; bandsLastY = scrollY; bandsRaf = requestAnimationFrame(bandsStep); }
bandsWake();
addEventListener('resize', () => { bandsMeasure(); bandsWake(); });
// FAÇA PARTE: ao abrir, o logotipo sai da aba da barra, cresce e voa até o centro do topo da página;
// enquanto ele está à vista, os links da barra deslizam para o centro. Ao rolar para baixo, tudo volta ao normal.
const fpHero = $('#fpHero');
let fpFx = () => {};
if (fpHero){
  const big = $('#fpLogo'); big.innerHTML = LOCKUP; const bigL = $('.lockup', big);
  const small = $('.nav-logo .lockup', nav), menu = $('#navMenu'), navIn = $('.nav-in', nav);
  const centerMenu = () => { menu.style.setProperty('--mx', innerWidth > 900 ? ((navIn.clientWidth - menu.offsetWidth) / 2 - menu.offsetLeft).toFixed(1) + 'px' : '0px'); };
  centerMenu(); addEventListener('resize', centerMenu);
  const outNow = () => fpHero.getBoundingClientRect().bottom > nav.offsetHeight + 24;
  fpFx = () => document.body.classList.toggle('logo-out', outNow());
  const fly = () => {
    if (RM || !outNow()){ fpFx(); return; }
    const a = small.getBoundingClientRect(), b = bigL.getBoundingClientRect();
    bigL.style.transition = 'none';
    bigL.style.transform = `translate(${(a.left - b.left).toFixed(1)}px,${(a.top - b.top).toFixed(1)}px) scale(${(a.height / b.height).toFixed(3)})`;
    bigL.offsetWidth;                                  // aplica a posição de partida antes de animar
    document.body.classList.add('logo-out', 'logo-flying'); setTimeout(() => document.body.classList.remove('logo-flying'), 1700);
    bigL.style.transition = ''; bigL.style.transform = '';
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(() => { centerMenu(); fly(); }));

}

// um único ouvinte de rolagem, no máximo uma atualização por quadro
let scrollRaf = 0;
addEventListener('scroll', () => { if (scrollRaf) return; scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; heroFx(); navFx(); navHide(); reveal(); helixFx(); missaoFx(); crocheFx(); bandsWake(); fpFx(); }); }, { passive:true });
nav.addEventListener('focusin', () => { nav.classList.remove('away'); });
nav.addEventListener('mouseleave', () => { if (pastHero() && !nav.classList.contains('away')) armHide(); });

/* ---------------- início ---------------- */
reveal();
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { if (fabricFig) drawFabric(); reveal(); });
})();
