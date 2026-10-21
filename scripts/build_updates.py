"""Generate static news and member pages with Python's standard library.

Edit content/updates.json, then run python scripts/build_updates.py.
The existing contact page supplies the shared header/footer; existing page bodies
remain hand-edited. Generated content works without JavaScript.
"""
import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
DATA = json.loads((ROOT / 'content/updates.json').read_text(encoding='utf-8'))
MEMBERS = {member['id']: member for member in DATA['members']}
NEWS = sorted(DATA['news'], key=lambda item: item['date'], reverse=True)
CATEGORIES = DATA['categories']
def with_updates_styles(source):
    if 'href="updates.css"' not in source:
        source = source.replace('<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="updates.css">')
    return source


SHELL = with_updates_styles((DOCS / 'contact.html').read_text(encoding='utf-8'))
NAV = [('home', 'index.html', 'Home', '首页'), ('research', 'research.html', 'Research', '研究方向'),
       ('people', 'people.html', 'People', '团队成员'), ('publications', 'publications.html', 'Publications', '研究成果'),
       ('news', 'news.html', 'News', '新闻动态'), ('join', 'join.html', 'Join us', '加入我们'),
       ('contact', 'contact.html', 'Contact', '联系我们')]


def tr(tag, pair, attrs=''):
    en, zh = pair
    return f'<{tag} data-en="{escape(en, quote=True)}" data-zh="{escape(zh, quote=True)}"{(" " + attrs) if attrs else ""}>{escape(en)}</{tag}>'


def navigation(active, prefix=''):
    links = []
    for key, filename, en, zh in NAV:
        state = ' class="current" aria-current="page"' if key == active else ''
        links.append(tr('a', [en, zh], f'href="{prefix}{filename}"{state}'))
    return '<nav class="main-nav" id="main-nav" aria-label="Main navigation">\n        ' + '\n        '.join(links) + '\n      </nav>'


def page(filename, active, title, description, main):
    prefix = '../' if '/' in filename else ''
    header = SHELL.split('  <main id="main">')[0]
    footer = SHELL.split('  </main>')[1]
    full_title = [f'{title[0]} · IMQ Lab · CityUHK', f'{title[1]} · IMQ Lab · 香港城市大学']
    header = re.sub(r'<title.*?</title>', tr('title', full_title), header)
    header = re.sub(r'<meta name="description"[^>]+>', f'<meta name="description" content="{escape(description, quote=True)}">', header)
    header = re.sub(r'<meta property="og:title"[^>]+>', f'<meta property="og:title" content="{escape(full_title[0], quote=True)}">', header)
    header = re.sub(r'<meta property="og:description"[^>]+>', f'<meta property="og:description" content="{escape(description, quote=True)}">', header)
    if active == 'news' and prefix:
        header = header.replace('content="website"', 'content="article"')
    header = header.replace('data-page="contact"', f'data-page="{active}"')
    for asset in ['assets/favicon.svg', 'styles.css', 'updates.css', 'app.js', 'index.html']:
        header = header.replace(f'="{asset}"', f'="{prefix}{asset}"')
    header = re.sub(r'<nav class="main-nav".*?</nav>', navigation(active, prefix), header, flags=re.S)
    target = DOCS / filename
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(header + '  <main id="main">\n' + main + '\n  </main>' + footer, encoding='utf-8')


def member_link(member_id, prefix=''):
    member = MEMBERS[member_id]
    return tr('a', member['name'], f'class="member-tag" href="{prefix}people/{member_id}.html"')


def news_row(item, prefix='', heading='h2'):
    title = tr('span', item['title'])
    href = f'{prefix}news/{item["slug"]}.html'
    return f'''<article class="news-row" data-category="{item['category']}" data-members="{' '.join(item['members'])}">
      <div class="news-date">{tr('time', item['displayDate'], f'datetime="{item["date"]}"')}{tr('span', CATEGORIES[item['category']], 'class="news-category"')}</div>
      <div class="news-row-content"><{heading}><a href="{href}">{title}<span class="news-arrow" aria-hidden="true">↗</span></a></{heading}>
      {tr('p', item['excerpt'], 'class="news-excerpt"')}
      <div class="member-tags">{''.join(member_link(mid, prefix) for mid in item['members'])}</div></div>
    </article>'''


def backlink(href, pair):
    return '<a class="text-link back-link" href="' + href + '"><span aria-hidden="true">←</span>' + tr('span', pair) + '</a>'


# Keep the seven navigation links consistent on all existing top-level pages.
for path in DOCS.glob('*.html'):
    source = with_updates_styles(path.read_text(encoding='utf-8'))
    active = re.search(r'<body data-page="([^"]+)"', source).group(1)
    source = re.sub(r'<nav class="main-nav".*?</nav>', navigation(active), source, flags=re.S)
    path.write_text(source, encoding='utf-8')

# Team cards open the lab profiles; external academic profiles remain on them.
team = DOCS / 'people.html'
source = team.read_text(encoding='utf-8')
for member in DATA['members'][1:]:
    source = source.replace(f'class="student" href="{member["profile"]}" target="_blank" rel="noopener noreferrer"', f'class="student" href="people/{member["id"]}.html"')
profile_cta = tr('a', ['Profile & news →', '个人主页与动态 →'], 'class="text-link small" href="people/yuquan-meng.html"')
if 'href="people/yuquan-meng.html"' not in source:
    source = source.replace('<div class="profile-links">', '<div class="profile-links">' + profile_cta, 1)
team.write_text(source, encoding='utf-8')

# Home retains its original content; only this bounded news block is generated.
home = DOCS / 'index.html'
source = home.read_text(encoding='utf-8')
start, end = '<!-- NEWS:START -->', '<!-- NEWS:END -->'
block = f'''{start}
    <section class="home-news container" aria-labelledby="latest-news-title">
      <div class="section-heading"><div>{tr('p', ['FROM THE LAB', '课题组动态'], 'class="eyebrow"')}{tr('h2', ['Latest news.', '最新动态。'], 'id="latest-news-title"')}</div>
      <a class="text-link" href="news.html">{tr('span', ['All news', '全部新闻'])}<span aria-hidden="true">→</span></a></div>
      <div class="news-list">{''.join(news_row(item, heading='h3') for item in NEWS[:3])}</div>
    </section>
    {end}'''
if start in source:
    source = re.sub(re.escape(start) + '.*?' + re.escape(end), lambda _: block, source, flags=re.S)
else:
    source = source.replace('    <section class="home-explore', block + '\n    <section class="home-explore')
home.write_text(source, encoding='utf-8')

category_options = tr('option', ['All topics', '全部类别'], 'value="all"') + ''.join(tr('option', pair, f'value="{key}"') for key, pair in CATEGORIES.items())
member_options = tr('option', ['Everyone', '全部成员'], 'value="all"') + ''.join(tr('option', m['name'], f'value="{m["id"]}"') for m in DATA['members'])
page('news.html', 'news', ['News', '新闻动态'], 'Awards, research and events from IMQ Lab and its members at CityUHK.', f'''
    <section class="page-section container" id="news" aria-labelledby="news-title">
      <div class="section-heading"><div>{tr('p', ['NEWS & HIGHLIGHTS', '新闻与动态'], 'class="eyebrow"')}{tr('h1', ['Stories from our lab.', '记录我们的探索。'], 'class="page-title" id="news-title"')}</div>{tr('p', ['Research, achievements and the people behind them.', '研究进展、学术荣誉，以及背后的人。'], 'class="section-intro"')}</div>
      <div class="news-toolbar" hidden><div><label for="news-category">{tr('span', ['Topic', '类别'])}</label><select id="news-category">{category_options}</select></div>
      <div><label for="news-member">{tr('span', ['Member', '成员'])}</label><select id="news-member">{member_options}</select></div><p id="news-count" role="status" aria-live="polite"></p></div>
      <div class="news-list" id="news-list">{''.join(news_row(item) for item in NEWS)}</div>
      {tr('p', ['No stories match this selection. Try another topic or member.', '此筛选组合暂无新闻，请选择其他类别或成员。'], 'id="news-empty" class="news-empty" hidden')}
    </section>''')

for index, item in enumerate(NEWS):
    facts = ''.join('<div>' + tr('dt', label) + tr('dd', value) + '</div>' for label, value in item['facts'])
    sources = ''.join(tr('a', source['label'], f'href="{escape(source["url"], quote=True)}" target="_blank" rel="noopener noreferrer"') for source in item['sources'])
    related = NEWS[index + 1] if index + 1 < len(NEWS) else NEWS[0]
    page(f'news/{item["slug"]}.html', 'news', item['title'], item['excerpt'][0], f'''
    <article class="page-section container news-article">
      {backlink('../news.html', ['All news', '全部新闻'])}
      <header class="article-heading">{tr('p', CATEGORIES[item['category']], 'class="eyebrow"')}{tr('h1', item['title'], 'class="page-title article-title"')}<p class="article-date">{tr('span', item['dateLabel'])} · {tr('time', item['displayDate'], f'datetime="{item["date"]}"')}</p></header>
      <div class="article-layout"><div class="article-body">{''.join(tr('p', paragraph) for paragraph in item['paragraphs'])}
      <div class="article-sources">{tr('h2', ['Explore the source', '查看原始资料'])}{sources}</div></div>
      <aside class="article-sidebar">{tr('h2', ['At a glance', '新闻概要'])}<dl class="article-facts">{facts}</dl>{tr('h2', ['People in this story', '相关成员'])}<div class="story-members">{''.join(member_link(mid, '../') for mid in item['members'])}</div></aside></div>
      <div class="more-news">{tr('p', ['MORE FROM IMQ LAB', '更多课题组动态'], 'class="eyebrow"')}{news_row(related, '../')}</div>
    </article>''')

for member in DATA['members']:
    member_id = member['id']
    related = [item for item in NEWS if member_id in item['members']]
    portrait = f'<img src="../{member["portrait"]}" alt="{member["name"][0]}" width="640" height="640">' if member.get('portrait') else f'<div class="member-monogram" aria-hidden="true">{member["initials"]}</div>'
    links = tr('a', ['CityUHK profile ↗', '城大学者主页 ↗'], f'class="text-link" href="{member["profile"]}" target="_blank" rel="noopener noreferrer"')
    if member.get('orcid'):
        links += f'<a class="text-link" href="{member["orcid"]}" target="_blank" rel="noopener noreferrer">ORCID ↗</a>'
    if member_id == 'yuquan-meng':
        links += '<a class="text-link" href="mailto:yuqumeng@cityu.edu.hk">Email ↗</a>'
    page(f'people/{member_id}.html', 'people', member['name'], member['bio'][0], f'''
    <section class="page-section container member-page" aria-labelledby="member-title">
      {backlink('../people.html', ['All people', '团队成员'])}
      <div class="member-profile"><div class="member-portrait">{portrait}</div><div>
        {tr('p', member['role'], 'class="eyebrow"')}{tr('h1', member['name'], 'class="page-title" id="member-title"')}
        <p class="member-native-name" lang="zh-CN">{member['name'][1]}</p>
        {tr('p', ['IMQ Lab · Department of Systems Engineering · CityUHK', 'IMQ Lab · 系统工程学系 · 香港城市大学'], 'class="member-affiliation"')}
        {tr('p', member['bio'], 'class="member-bio"')}<div class="profile-links">{links}</div></div></div>
      <section class="member-news" aria-labelledby="member-news-title"><div class="section-heading"><div>{tr('p', ['NEWS & HIGHLIGHTS', '新闻与动态'], 'class="eyebrow"')}{tr('h2', ['News featuring ' + member['name'][0], member['name'][1] + '的相关动态'], 'id="member-news-title"')}</div></div><div class="news-list">{''.join(news_row(item, '../', 'h3') for item in related)}</div></section>
    </section>''')

print(f'Generated {len(NEWS)} news articles, {len(MEMBERS)} member profiles, News index and home highlights.')
