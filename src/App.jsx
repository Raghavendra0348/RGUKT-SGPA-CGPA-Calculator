import PrivacyChoices, { startAnalytics } from './PrivacyChoices.jsx';
import { canonicalUrl } from './site.js';
import collegeLogo from '../rgukt.webp';
import React, { useEffect, useRef, useState } from 'react';
import { configs, departments, readRoute } from './data.js';
import { GRADES, calculateSGPA, calculateCGPA, division, withCredits } from './calculations.js';
import { exportPDF, exportImage } from './exports.js';
import articles from 'virtual:articles';
import routes from 'virtual:routes';
import { navigate, useBrowserNavigation } from './navigation.js';

function Icon({ name = 'book', size = 24, ...props }) {
  const paths = {
    arrow: 'M5 12h14m-5-5 5 5-5 5', search: 'm16 16 4 4M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    book: 'M3 4h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v15h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3zM12 6v15',
    code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18', bolt: 'm13 2-9 12h7l-1 8 10-12h-7z',
    building: 'M3 21h18M5 21V9l7-6 7 6v12M9 12h1m4 0h1m-6 4h1m4 0h1',
    gear: 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
    layers: 'm12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5',
    flask: 'M9 3h6m-5 0v7L4 20h16l-6-10V3M7 15h10', leaf: 'M20 3C9 2 2 8 5 16c8 5 16-3 15-13ZM4 21 16 9',
    chip: 'M7 7h10v10H7zM3 9h4m-4 6h4m10-6h4m-4 6h4M9 3v4m6-4v4M9 17v4m6-4v4',
    check: 'm5 12 4 4L19 6', download: 'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4',
    shield: 'm12 2 8 3v6c0 6-8 11-8 11S4 17 4 11V5zM8 11l3 3 5-5',
    calculator: 'M5 2h14v20H5zM8 5h8v4H8zM8 13h1m6 0h1m-8 4h1m6 0h1',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.book} /></svg>;
}
function Header({ file }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    const escape = event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, []);
  return <header className="site-header"><div className="header-inner">
    <a className="brand" href="index.html"><span className="brand-symbol"><img src={collegeLogo} alt="RGUKT college logo" width="43" height="43" /></span><span>RGUKT<span className="brand-subtitle">Gradebook</span></span></a>
    <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
    <nav id="site-nav" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
      <a href="index.html" aria-current={['index.html', 'department.html'].includes(file) ? 'page' : undefined}>Calculator</a>
      <a href="how-to-calculate-sgpa.html" aria-current={file === 'how-to-calculate-sgpa.html' ? 'page' : undefined}>GPA guide</a>
      <a href="blog.html" aria-current={file === 'blog.html' ? 'page' : undefined}>Resources</a>
      <a href="about.html" aria-current={file === 'about.html' ? 'page' : undefined}>About</a>
      <a className="nav-action" href="calculator.html?key=cse_e1s1&mode=cgpa">Calculate CGPA <Icon name="arrow" size={17} /></a>
    </nav>
  </div></header>;
}
function Footer() {
  return <footer className="site-footer"><div className="footer-top"><a className="brand" href="index.html"><span className="brand-symbol"><img src={collegeLogo} alt="RGUKT college logo" width="43" height="43" /></span><span>RGUKT<span className="brand-subtitle">Gradebook</span></span></a><p>A little clarity for your academic journey.</p><a href="contact.html">Get in touch <Icon name="arrow" size={16} /></a></div><div className="footer-bottom"><p>Made for RGUKT students. Free to use, always.</p><nav aria-label="Legal"><a href="disclaimer.html">Disclaimer</a><a href="privacy_policy.html">Privacy</a><a href="terms.html">Terms</a></nav></div></footer>;
}
function Preview() {
  return <div className="hero-art" aria-label="Illustrative example of a semester grade report">
    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
    <div className="grade-paper"><div className="paper-top"><span><Icon name="book" size={18} /> Semester overview</span><span className="example-label">Example</span></div>
      <div className="paper-score"><span>Looking good.</span><strong>8.750<small> / 10</small></strong><span className="distinction"><Icon name="check" size={14} /> Distinction</span></div>
      <div className="paper-row"><span>Subject</span><span>Grade</span></div>
      {[['Programming', 'EX'], ['Mathematics', 'A'], ['Engineering graphics', 'EX']].map(([name, grade]) => <div className="paper-row" key={name}><span>{name}</span><b>{grade}</b></div>)}
      <div className="mini-chart" aria-hidden="true">{[48, 75, 60, 90, 80, 100, 85].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div>
    </div>
    <div className="art-note"><span className="note-icon"><Icon name="check" size={18} /></span><span>Less number crunching.<br /><strong>More looking ahead.</strong></span></div>
  </div>;
}
function Resources() {
  return <section className="resources wrap"><div className="section-heading"><div><p className="section-kicker">A little guidance</p><h2>Know your numbers.</h2></div><a className="text-link" href="blog.html">All resources <Icon name="arrow" size={17} /></a></div><div className="resource-grid">
    {[
      ['how-to-calculate-sgpa.html', 'The SGPA, explained.', 'A step-by-step guide to credits, grade points, and your semester result.', 'book', 'Read the guide'],
      ['sgpa-vs-cgpa.html', 'One semester. The bigger picture.', 'Understand how SGPA and CGPA fit together throughout your degree.', 'layers', 'Compare SGPA & CGPA'],
      ['blog.html', 'Your questions, answered.', 'Explore grading tips, common questions, and useful academic resources.', 'leaf', 'Explore resources'],
    ].map(([url, title, text, icon, label]) => <article className="resource" key={url}><Icon name={icon} size={28} /><h3>{title}</h3><p>{text}</p><a className="text-link" href={url}>{label} <Icon name="arrow" size={16} /></a></article>)}
  </div></section>;
}
function Home() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const semesterMatches = normalized && /[0-9]/.test(normalized) ? Object.entries(configs).filter(([key, config]) => (key + config.title).toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalized)).slice(0, 8) : [];
  const shown = departments.filter(d => (filter === 'all' || (filter === 'puc' ? d.id.startsWith('puc') : !d.id.startsWith('puc'))) && `${d.code} ${d.name} ${d.detail}`.toLowerCase().includes(query.toLowerCase()));
  return <><section className="hero wrap"><div className="hero-copy"><p className="hero-badge"><span /> Your RGUKT academic companion</p><h1>Your grades.<br />A clearer picture.</h1><p className="hero-description">From this semester to the bigger picture. Calculate your SGPA and CGPA with your department’s subjects and credits already in place.</p><a className="primary-button" href="#departments">Find your calculator <Icon name="arrow" size={19} /></a><div className="hero-reassurance"><span><Icon name="check" size={16} /> No sign-up</span><span><Icon name="shield" size={16} /> Calculated on your device</span></div></div><Preview /></section>
    <div className="feature-strip"><div className="wrap feature-strip-inner"><span><Icon name="book" size={19} /> PUC + all 7 engineering branches</span><span><Icon name="calculator" size={19} /> SGPA & CGPA, in one place</span><span><Icon name="download" size={19} /> Reports you can keep</span></div></div>
    <section id="departments" className="departments wrap"><div className="section-heading"><div><p className="section-kicker">Start where you are</p><h2>Choose your department.</h2><p>Pick your branch. We’ll take care of the subjects and credits.</p></div><label className="search-field"><Icon name="search" size={19} /><span className="sr-only">Search departments or semesters</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Department or semester…" autoComplete="off" /></label></div>
      <div className="filter-row" role="group" aria-label="Filter departments">{[['all', 'All departments'], ['engineering', 'Engineering'], ['puc', 'Pre-university']].map(([value, label]) => <button aria-pressed={filter === value} className={filter === value ? 'selected' : ''} key={value} onClick={() => setFilter(value)}>{label}</button>)}<span aria-live="polite">{shown.length} departments</span></div>
      {semesterMatches.length > 0 && <div className="semester-search" aria-label="Matching semester calculators">{semesterMatches.map(([key, config]) => <a href={`calculator.html?key=${key}`} key={key}><span>{config.title}</span><Icon name="arrow" size={18} /></a>)}</div>}
      <div className="department-grid">{shown.map((d, i) => <a className="department-card" href={d.id.startsWith('puc') ? `calculator.html?key=${d.id}` : `${d.id}_semester.html`} key={d.id}><div><h3>{d.code}</h3><p>{d.name}</p><span className="department-level">{d.detail}</span></div><Icon name="arrow" className="card-arrow" size={19} /></a>)}</div>
      {!shown.length && !semesterMatches.length && <div className="empty-state"><h3>No departments found</h3><p>Try a branch name such as CSE, Civil, or MPC.</p><button className="secondary-button" onClick={() => { setQuery(''); setFilter('all'); }}>Show all departments</button></div>}
      <div className="department-help"><Icon name="book" size={23} /><p>New to grade points? <a href="how-to-calculate-sgpa.html">Our GPA guide is a good place to start.</a></p></div>
    </section><section className="wrap calculation-guide"><h2>Check the calculation, not just the result.</h2><p>SGPA is the sum of each subject’s credits multiplied by its grade points, divided by the total subject credits. Review the listed credits against your course registration before you calculate.</p><div className="worked-example"><h3>A worked example</h3><p>A 4-credit subject with EX contributes 40 points; a 3-credit subject with A contributes 27; a 1-credit subject with B contributes 8. Together, that is 75 weighted points across 8 credits: <strong>75 ÷ 8 = 9.375 SGPA</strong>.</p></div><details><summary>What happens when I edit credits?</summary><p>The total credits and each subject’s contribution update together. Reports include the edited values. Reset restores the defaults for this semester.</p></details><details><summary>How does the CGPA calculator combine semesters?</summary><p>It averages the semester SGPAs you enter and skips empty semesters. If your academic regulations require weighting semesters by their credits, check the result using that prescribed method instead.</p></details><p>Subject lists are provided as a starting point. Credit values, grade rules, and academic division labels should be checked against your official regulations. This tool does not issue an official transcript.</p></section><Resources /><div className="academic-note wrap"><Icon name="shield" size={20} /><p>An independent student tool. Always verify results with your official RGUKT academic regulations.</p></div></>;
}
function Semesters({ branch }) {
  const department = departments.find(d => d.id === branch);
  if (!department) return <NotFound />;
  return <section className="wrap page-section"><a className="back-link" href="index.html#departments">← All departments</a><p className="section-kicker">{department.name}</p><h1>One semester at a time.</h1><p className="page-description">Choose your semester to load its subjects and credits.</p><div className="semester-grid">{[1, 2, 3, 4].map(year => <section className="year-group" key={year}><h2>Engineering year {year}</h2>{[1, 2].map(sem => <a key={sem} href={`calculator.html?key=${branch}_e${year}s${sem}`}><span>Semester {sem}<small>{configs[`${branch}_e${year}s${sem}`].subjects.length} subjects</small></span><Icon name="arrow" size={20} /></a>)}</section>)}</div></section>;
}
function Calculator({ route }) {
  const config = configs[route.key];
  const mode = route.mode;
  const [credits, setCredits] = useState(config?.subjects.map(subject => String(subject.credits)) || []);
  const [grades, setGrades] = useState(config?.subjects.map(() => 'EX') || []);
  const [semesters, setSemesters] = useState(Array(config?.cgpaSemesters || (config?.year || 4) * 2).fill(''));
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const resultRef = useRef(null);
  useEffect(() => { setScore(null); setError(''); }, [route.mode]);
  if (!config) return <NotFound message="Choose a department and semester to open your calculator." />;
  let totalCredits = null;
  try { totalCredits = withCredits(config, credits).divisor; } catch { /* Incomplete credit input is validated below. */ }
  const updateSGPA = (nextGrades, nextCredits) => {
    try { setScore(calculateSGPA(withCredits(config, nextCredits), nextGrades)); setError(''); }
    catch (err) { setScore(null); setError(err.message); }
  };
  const changeMode = value => { setScore(null); setError(''); const url = new URL(location.href); url.searchParams.set('mode', value); navigate(url.href, { replace: true, scroll: false }); };
  const submit = event => { event.preventDefault(); try { setScore(mode === 'sgpa' ? calculateSGPA(withCredits(config, credits), grades) : calculateCGPA(semesters)); setError(''); } catch (err) { setError(err.message); } };
  const download = async type => { setExporting(true); setError(''); try { await (type === 'pdf' ? exportPDF : exportImage)(mode === 'sgpa' ? withCredits(config, credits) : config, mode === 'sgpa' ? grades : semesters, score, mode); } catch { setError('The report could not be downloaded. Please try again.'); } finally { setExporting(false); } };
  return <section className="wrap page-section"><a className="back-link" href={route.key.startsWith('puc') ? 'index.html#departments' : `${config.branch.toLowerCase()}_semester.html`}>← Change semester</a><div className="calculator-heading"><div><p className="section-kicker">Your academic workspace</p><h1>{config.title}</h1><p className="page-description">A little input. A lot more clarity.</p></div><span className="local-badge"><Icon name="shield" size={17} /> Stays on your device</span></div>
    <div className="calculator-layout"><div className="calculator-panel"><div className="calculator-tabs" role="group" aria-label="Calculator type">{['sgpa', 'cgpa'].map(value => <button key={value} aria-pressed={mode === value} className={mode === value ? 'active' : ''} onClick={() => changeMode(value)}>{value.toUpperCase()}<span>{value === 'sgpa' ? 'This semester' : 'Across semesters'}</span></button>)}</div><form onSubmit={submit}><div className="panel-heading"><h2>{mode === 'sgpa' ? 'Add your grades' : 'Add your semester results'}</h2><p>{mode === 'sgpa' ? `${config.subjects.length} subjects · ${totalCredits === null ? '—' : Number(totalCredits.toFixed(3))} total credits` : 'Leave semesters you have not completed empty.'}</p></div>
    {mode === 'sgpa' ? <><div className="grade-row grade-table-header"><span>Subject</span><span>Credits</span><span>Grade</span></div>{config.subjects.map((subject, i) => <div className="grade-row" key={`${subject.id}-${i}`}><label htmlFor={`grade-${i}`}>{subject.name}</label><input className="credit-input" type="number" id={`credit-${i}`} name={`credit-${i}`} aria-label={`${subject.name} credits`} inputMode="decimal" min="0" step="any" required value={credits[i]} onChange={event => { const next = credits.map((value, j) => j === i ? event.target.value : value); setCredits(next); updateSGPA(grades, next); }} /><select id={`grade-${i}`} value={grades[i]} onChange={event => { const next = grades.map((g, j) => j === i ? event.target.value : g); setGrades(next); updateSGPA(next, credits); }} aria-label={`${subject.name} grade`}>{GRADES.map(grade => <option key={grade}>{grade}</option>)}</select></div>)}<p className="grade-help">Edit credits as needed; Reset restores the original values. EX = 10, A = 9, B = 8, C = 7, D = 6, E = 5. REM follows the existing calculator’s zero-deduction rule.</p></> : <div className="semester-inputs">{semesters.map((value, i) => <label key={i}>Year {Math.floor(i / 2) + 1} · Semester {i % 2 + 1}<input type="number" inputMode="decimal" min="0" max="10" step="0.001" placeholder="e.g. 8.750" value={value} onChange={event => { setSemesters(semesters.map((v, j) => i === j ? event.target.value : v)); setScore(null); }} /></label>)}</div>}
    {error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions"><button className="primary-button" type="submit">Calculate {mode.toUpperCase()} <Icon name="arrow" size={18} /></button><button type="button" className="reset-button" onClick={() => { setGrades(config.subjects.map(() => 'EX')); setCredits(config.subjects.map(subject => String(subject.credits))); setSemesters(semesters.map(() => '')); setScore(null); setError(''); }}>Reset</button></div></form></div>
    <aside className="result-column"><div className="result-panel" ref={resultRef} aria-live="polite"><Icon name="calculator" size={28} /><p>Your {mode.toUpperCase()}</p><strong className="result-score">{score === null ? '—' : score.toFixed(3)}</strong><span>out of 10.000</span>{score === null ? <p className="result-hint">Your result will appear here.<br />Ready when you are.</p> : <><p className="result-division"><Icon name="check" size={16} /> {division(score)}</p><div className="score-track" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, score * 10))}%` }} /></div><div className="download-buttons"><button disabled={exporting} onClick={() => download('pdf')}><Icon name="download" size={16} /> {exporting ? 'Preparing…' : 'PDF report'}</button><button disabled={exporting} onClick={() => download('image')}>Save image</button></div></>}</div>
    {score !== null && mode === 'sgpa' && <div className="distribution"><h3>Grade distribution</h3>{GRADES.map(grade => { const count = grades.filter(g => g === grade).length; return <div key={grade}><span>{grade}</span><meter min="0" max={grades.length} value={count} aria-label={`${grade}: ${count} subjects`} /><b>{count}</b></div>; })}</div>}
    <div className="calculation-note"><h3>How it adds up</h3><p>{mode === 'sgpa' ? 'Your result uses this semester’s grade-point formula. Changing credits recalculates the total and weighting using your entered values.' : 'Your CGPA is the arithmetic mean of the semester SGPAs you enter, matching the existing calculator.'}</p><a href="how-to-calculate-sgpa.html">Understand the formula</a></div></aside></div></section>;
}
function Article({ article }) {
  const content = useRef(null);
  const [query, setQuery] = useState('');
  useEffect(() => {
    content.current?.querySelectorAll('article, section#faq').forEach(section => {
      section.hidden = Boolean(query && !(section.textContent + ' ' + (section.dataset.tags || '')).toLowerCase().includes(query));
    });
  }, [query, article]);
  return <article className="article-page wrap"><a className="back-link" href="index.html">← Back to Gradebook</a><div className="prose" ref={content} onInput={event => { if (event.target.type === 'search') setQuery(event.target.value.trim().toLowerCase()); }} dangerouslySetInnerHTML={{ __html: article.html }} /></article>;
}
function Contact() {
  const [copied, setCopied] = useState('');
  return <section className="wrap page-section contact-page"><p className="section-kicker">Get in touch</p><h1>Help make Gradebook better.</h1><p className="page-description">Found a subject mismatch or have an idea? Share it with the project maintainer.</p><a className="primary-button" href="https://github.com/Raghavendra0348/RGUKT-SGPA-CGPA-Calculator/issues">Open a GitHub issue <Icon name="arrow" size={18} /></a><form className="contact-form" onSubmit={async event => { event.preventDefault(); const data = new FormData(event.currentTarget); try { await navigator.clipboard.writeText(`${data.get('name')} (${data.get('email')})\n\n${data.get('message')}`); setCopied('Message copied. Paste it into a GitHub issue to share it.'); } catch { setCopied('Copy your message manually and share it in a GitHub issue.'); } }}><h2>Prepare your feedback</h2><p>This form copies a draft. It does not send email.</p><label>Your name<input name="name" autoComplete="name" required /></label><label>Email<input type="email" name="email" autoComplete="email" required /></label><label>Message<textarea name="message" rows="5" required /></label><button className="secondary-button">Copy message</button><p role="status">{copied}</p></form><details><summary>Can I suggest improvements?</summary><p>Yes. Include your branch, semester, and the change you would like to see.</p></details><details><summary>Where do my grades go?</summary><p>Your calculator inputs stay in your browser. They are not submitted to a server.</p></details></section>;
}
function NotFound({ message = 'This calculator could not be found.' }) { return <section className="wrap page-section"><h1>Let’s find your calculator.</h1><p className="page-description">{message}</p><a className="primary-button" href="index.html#departments">Browse departments <Icon name="arrow" size={18} /></a></section>; }
export default function App() {
  const href = useBrowserNavigation(routes);
  const route = readRoute(href);
  const article = articles[route.file];
  useEffect(() => { document.title = configs[route.key] ? `${configs[route.key].title} — RGUKT Gradebook` : article?.title || (route.file.includes('_semester') ? `${route.branch.toUpperCase()} Semesters — RGUKT Gradebook` : 'RGUKT SGPA & CGPA Calculator | Gradebook'); }, [route.file, route.key, route.branch, article]);
  useEffect(() => {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = canonicalUrl(href);
    const description = article?.description || (configs[route.key] ? `Calculate SGPA and CGPA for ${configs[route.key].title} using editable subject credits.` : 'Free SGPA and CGPA calculators for RGUKT students, with subjects and credits for PUC and every engineering department.');
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', document.title],
      ['meta[property="og:description"]', description],
      ['meta[property="og:url"]', canonical?.href || href],
      ['meta[name="twitter:title"]', document.title],
      ['meta[name="twitter:description"]', description],
    ]) document.querySelector(selector)?.setAttribute('content', content);
    const analyticsStarted = startAnalytics();
    if (!analyticsStarted && !window['ga-disable-G-T486B8C5X0']) window.gtag?.('event', 'page_view', { page_path: new URL(href).pathname + new URL(href).search });
  }, [href, route.file]);
  let page;
  if (route.file === 'contact.html') page = <Contact />;
  else if (article) page = <Article key={route.file} article={article} />;
  else if (route.key || route.file === 'calculator.html') page = <Calculator key={route.key} route={route} />;
  else if (route.file.endsWith('_semester.html')) page = <Semesters branch={route.branch} />;
  else if (['index.html', 'department.html', ''].includes(route.file)) page = <Home />;
  else page = <NotFound />;
  return <><a className="skip-link" href="#main">Skip to content</a><Header key={href} file={route.file} /><main id="main" tabIndex="-1">{page}</main><PrivacyChoices /><Footer /></>;
}
