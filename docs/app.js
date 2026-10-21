'use strict';
(() => {
  const legacyPages = {research: 'research.html', people: 'people.html', publications: 'publications.html', news: 'news.html', join: 'join.html', contact: 'contact.html'};
  if (document.body.dataset.page === 'home' && Object.hasOwn(legacyPages, location.hash.slice(1))) {
    location.replace(new URL(legacyPages[location.hash.slice(1)] + location.search, location.href));
    return;
  }
  let language = 'en';
  let selectedYear = 'all';
  let toastTimer;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const text = (en, zh) => language === 'zh' ? zh : en;
  const menu = $('#main-nav');
  const menuButton = $('.menu-toggle');

  function closeMenu() {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', text('Open navigation', '展开导航'));
  }

  function setLanguage(next, persist = true) {
    language = next === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    $$('[data-en][data-zh]').forEach(el => { el.textContent = el.dataset[language]; });
    $$('[data-lang]').forEach(button => {
      const active = button.dataset.lang === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#main-nav').setAttribute('aria-label', text('Main navigation', '主导航'));
    $('.language-switch').setAttribute('aria-label', text('Language', '语言'));
    $('.publication-filters')?.setAttribute('aria-label', text('Filter publications by year', '按年份筛选论文'));
    $('#close-citation')?.setAttribute('aria-label', text('Close citation', '关闭引用'));
    $('#citation-text')?.setAttribute('aria-label', text('BibTeX citation', 'BibTeX 引用'));
    if ($('#surface-title')) $('#surface-title').textContent = text('Physics and data, connected', '连接物理与数据');
    if ($('#surface-desc')) $('#surface-desc').textContent = text('A conceptual wireframe surface and sampled points, illustrating physical models and observed data. This is not experimental data.', '线框曲面与采样点示意物理模型和观测数据之间的关系；并非实验数据。');
    if ($('.pi-photo img')) $('.pi-photo img').alt = text('Prof. Rainers Yuquan Meng', '孟雨泉老师');
    closeMenu();
    renderPublicationFilters();
    renderPublications();
    filterNews();
    if (persist) { try { localStorage.setItem('imq-language', language); } catch { /* Local files and private sessions may disable storage. */ } }
  }

  function filterNews() {
    const list = $('#news-list');
    if (!list) return;
    const category = $('#news-category').value;
    const member = $('#news-member').value;
    let visible = 0;
    list.querySelectorAll('.news-row').forEach(row => {
      row.hidden = !(category === 'all' || row.dataset.category === category) ||
        !(member === 'all' || row.dataset.members.split(' ').includes(member));
      if (!row.hidden) visible++;
    });
    $('#news-count').textContent = text(`${visible} ${visible === 1 ? 'story' : 'stories'}`, `${visible} 条动态`);
    $('#news-empty').hidden = visible > 0;
  }

  if ($('.news-toolbar')) {
    $('.news-toolbar').hidden = false;
    $('#news-category').addEventListener('change', filterNews);
    $('#news-member').addEventListener('change', filterNews);
  }

  function bibtex(paper) {
    const fields = [
      `  title = {{${paper.title}}}`,
      `  author = {${paper.authors.join(' and ')}}`,
      `  ${paper.type === 'conference' ? 'booktitle' : 'journal'} = {${paper.journal.replaceAll('&', '\\&')}}`,
      `  year = {${paper.year}}`,
      `  volume = {${paper.volume}}`,
      ...(paper.number ? [`  number = {${paper.number}}`] : []),
      ...(paper.pages ? [`  pages = {${paper.pages.replace('–', '--')}}`] : []),
      ...(paper.articleNumber ? [`  eid = {${paper.articleNumber}}`] : []),
      `  doi = {${paper.doi}}`
    ];
    return `@${paper.type === 'conference' ? 'inproceedings' : 'article'}{${paper.id},\n${fields.join(',\n')}\n}`;
  }

  function createElement(tag, className, value) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value !== undefined) el.textContent = value;
    return el;
  }

  function externalLink(label, href) {
    const link = createElement('a', '', label);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function renderPublicationFilters() {
    const filters = $('.publication-filters');
    if (!filters) return;
    const years = [...new Set(window.IMQ_PUBLICATIONS.map(paper => paper.year))].sort((a, b) => b - a);
    filters.replaceChildren();
    ['all', ...years.map(String)].forEach(year => {
      const button = createElement('button', year === selectedYear ? 'active' : '', year === 'all' ? text('All years', '全部年份') : year);
      button.type = 'button';
      button.dataset.year = year;
      button.setAttribute('aria-pressed', String(year === selectedYear));
      filters.append(button);
    });
  }

  function renderPublications() {
    const list = $('#publication-list');
    if (!list) return;
    list.replaceChildren();
    const visible = window.IMQ_PUBLICATIONS.filter(p => selectedYear === 'all' || String(p.year) === selectedYear);
    $('.toolbar-label').textContent = text(`${visible.length} selected publications`, `${visible.length} 篇代表论文`);
    visible.forEach(paper => {
      const article = createElement('article', 'publication');
      article.dataset.year = paper.year;
      const year = createElement('div', 'publication-year', paper.year);
      year.append(createElement('span', 'publication-kind', paper.type === 'conference' ? text('CONFERENCE', '会议论文') : text('JOURNAL', '期刊论文')));
      article.append(year);
      const content = createElement('div', 'publication-content');
      const title = createElement('h3');
      title.append(externalLink(paper.title, `https://doi.org/${paper.doi}`));
      content.append(title);
      const authors = createElement('p', 'publication-authors');
      paper.authors.forEach((author, index) => {
        if (index) authors.append(document.createTextNode(', '));
        authors.append(author === 'Yuquan Meng' ? createElement('strong', '', author) : document.createTextNode(author));
      });
      content.append(authors);
      const location = [paper.volume + (paper.number ? `(${paper.number})` : ''), paper.pages, paper.articleNumber ? text(`Article ${paper.articleNumber}`, `文章编号 ${paper.articleNumber}`) : ''].filter(Boolean).join(', ');
      content.append(createElement('p', 'publication-journal', `${paper.journal} · ${location}`));
      const links = createElement('div', 'publication-links');
      links.append(externalLink('DOI ↗', `https://doi.org/${paper.doi}`));
      const copy = createElement('button', '', text('Copy BibTeX', '复制 BibTeX'));
      copy.type = 'button';
      copy.setAttribute('aria-label', text(`Copy BibTeX for ${paper.title}`, `复制论文引用：${paper.title}`));
      copy.addEventListener('click', () => copyCitation(paper));
      links.append(copy);
      links.append(externalLink(text('Record ↗', '论文记录 ↗'), paper.source));
      content.append(links);
      article.append(content);
      article.append(createElement('span', 'publication-index', String(window.IMQ_PUBLICATIONS.indexOf(paper) + 1).padStart(2, '0')));
      list.append(article);
    });
  }

  async function copyCitation(paper) {
    const citation = bibtex(paper);
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(citation);
      $('#toast').textContent = text('BibTeX citation copied.', 'BibTeX 引用已复制。');
      $('#toast').classList.add('visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2800);
    } catch {
      $('#citation-text').value = citation;
      $('#citation-dialog').showModal();
      $('#citation-text').focus();
      $('#citation-text').select();
    }
  }

  $$('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  $('.publication-filters')?.addEventListener('click', event => {
    const button = event.target.closest('button[data-year]');
    if (!button) return;
    selectedYear = button.dataset.year;
    $$('.publication-filters [data-year]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderPublications();
  });
  menuButton.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? text('Close navigation', '收起导航') : text('Open navigation', '展开导航'));
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  window.matchMedia('(min-width: 921px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  $('#close-citation')?.addEventListener('click', () => $('#citation-dialog').close());
  $('#select-citation')?.addEventListener('click', () => { $('#citation-text').focus(); $('#citation-text').select(); });
  $('#citation-dialog')?.addEventListener('click', event => {
    const dialog = event.currentTarget;
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });

  // A deterministic, illustrative surface. No scientific measurements are implied.
  function drawSurface() {
    const ns = 'http://www.w3.org/2000/svg';
    const svgElement = (type, attrs) => {
      const element = document.createElementNS(ns, type);
      for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
      return element;
    };
    const project = (x, y, z) => [260 + (x - y) * 28, 262 + (x + y) * 12 - z * 51];
    const height = (x, y) => 2.35 * Math.exp(-((x - .5) ** 2 + (y + .4) ** 2) / 5) + .7 * Math.sin(x * .85) * Math.cos(y * .6) + .65;
    const pathFor = points => points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
    for (let i = -4; i <= 4; i++) {
      $('#surface-floor').append(svgElement('path', {d: pathFor([project(i,-4,0),project(i,4,0)]), fill:'none',stroke:'#b5cadc','stroke-width':'.5',opacity:'.65'}));
      $('#surface-floor').append(svgElement('path', {d: pathFor([project(-4,i,0),project(4,i,0)]), fill:'none',stroke:'#b5cadc','stroke-width':'.5',opacity:'.65'}));
    }
    const edge = [];
    for(let x=-4;x<=4;x+=.2) edge.push(project(x,-4,height(x,-4)));
    for(let y=-4;y<=4;y+=.2) edge.push(project(4,y,height(4,y)));
    for(let x=4;x>=-4;x-=.2) edge.push(project(x,4,height(x,4)));
    for(let y=4;y>=-4;y-=.2) edge.push(project(-4,y,height(-4,y)));
    $('#surface-lines').append(svgElement('path',{d:pathFor(edge)+' Z',fill:'url(#surface-fill)',stroke:'none'}));
    for (let i=-4;i<=4.001;i+=.4) {
      for (let axis=0;axis<2;axis++) {
        const points=[];
        for(let j=-4;j<=4.001;j+=.13) { const x=axis?j:i, y=axis?i:j;points.push(project(x,y,height(x,y))); }
        $('#surface-lines').append(svgElement('path',{d:pathFor(points),fill:'none',stroke:axis?'#6998bc':'#32658e','stroke-width':axis?'.7':'.9',opacity:axis?'.6':'.8'}));
      }
    }
    [[-3,-2],[-2.5,1.5],[-1,2.2],[0,-2],[1.2,-.3],[2,2],[3.3,-1],[3,3],[-2.7,-3.2]].forEach(([x,y])=>{
      const [cx,cy]=project(x,y,height(x,y));
      $('#surface-points').append(svgElement('circle',{cx,cy,r:15,fill:'url(#point-glow)'}));
      $('#surface-points').append(svgElement('circle',{cx,cy,r:3.1,fill:'#163c60',stroke:'#f3f7fb','stroke-width':1.5}));
    });
  }

  if ($('.surface-visual')) drawSurface();
  let initialLanguage = 'en';
  try { initialLanguage = localStorage.getItem('imq-language') || 'en'; } catch { /* Storage is optional. */ }
  setLanguage(initialLanguage, false);
  $('#copyright-year').textContent = new Intl.DateTimeFormat('en', {year:'numeric',timeZone:'Asia/Hong_Kong'}).format(new Date());
})();
