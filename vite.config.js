import { canonicalUrl } from './src/site.js';
import { configs, departments } from './src/data.js';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const contentFiles = ['about.html', 'blog.html', 'how-to-calculate-sgpa.html', 'sgpa-vs-cgpa.html', 'disclaimer.html', 'privacy_policy.html', 'terms.html'];
const root = process.cwd();
const aliases = readdirSync(root).filter(name => name.endsWith('.html') && name !== 'index.html');
const titleOf = html => html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'RGUKT Gradebook';
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const trustLinks = '<nav aria-label="Site information"><a href="index.html">Calculators</a> | <a href="about.html">About</a> | <a href="contact.html">Contact</a> | <a href="privacy_policy.html">Privacy policy</a> | <a href="terms.html">Terms</a> | <a href="disclaimer.html">Disclaimer</a></nav>';
function routeContent(file) {
  if (articles[file]) return `<article>${articles[file].html}</article>`;
  if (file === 'contact.html') return '<h1>Contact Raghavendra Arella</h1><p>For private questions or corrections, email <a href="mailto:learnwithhraghava@gmail.com">learnwithhraghava@gmail.com</a>.</p><p>You can also <a href="https://github.com/Raghavendra0348/RGUKT-SGPA-CGPA-Calculator/issues">open a public GitHub issue</a>. Do not include private grades or personal information.</p>';
  const branch = departments.find(department => file === `${department.id}_semester.html`);
  const legacy = file.match(/^([a-z]+)[(_](e\ds\d)\)?\.html$/);
  const key = file === 'puc.html' ? 'puc_mpc' : legacy ? `${legacy[1]}_${legacy[2]}` : '';
  const config = configs[key];
  if (config) return `<h1>${escapeHtml(config.title)} SGPA calculator</h1><p>Multiply credits by grade points, sum the weighted points, and divide by total credits. Check these default subjects against your campus and batch regulations.</p><table><caption>Default subjects and credits</caption><thead><tr><th>Subject</th><th>Credits</th></tr></thead><tbody>${config.subjects.map(subject => `<tr><td>${escapeHtml(subject.name)}</td><td>${subject.credits}</td></tr>`).join('')}</tbody></table><p>Enable JavaScript to enter grades, edit credits, and download a report. REM has no verified grade-point mapping and cannot be calculated.</p><a href="how-to-calculate-sgpa.html">Calculation guide</a>`;
  if (branch || file === 'calculator.html') return `<h1>${branch ? escapeHtml(branch.name) : 'SGPA and CGPA'} calculators</h1><p>Choose a semester to view its subject list. Enable JavaScript to calculate with editable credits. CGPA uses the arithmetic mean of entered semester SGPAs; check your regulations for credit weighting.</p><ul>${Object.entries(configs).filter(([key]) => !branch || key.startsWith(branch.id + '_')).map(([key, config]) => `<li><a href="calculator.html?key=${key}">${escapeHtml(config.title)}</a></li>`).join('')}</ul><a href="how-to-calculate-sgpa.html">How to calculate SGPA</a>`;
  return null;
}
function articleBody(html) {
  return (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|header|footer|nav)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<ins\b[^>]*>[\s\S]*?<\/ins>/gi, '')
    .replace(/<button[^>]*onclick="(?:window\.)?location.href='([^']+)'"[^>]*>([\s\S]*?)<\/button>/gi, '<a href="$1">$2</a>')
    .replace(/\s(?:style|on\w+)="[^"]*"/gi, '')
    .replace(/<i\b[^>]*>[\s\S]*?<\/i>/gi, '')
    .replace(/<link\b[^>]*>/gi, '');
}
const articles = Object.fromEntries(contentFiles.map(name => {
  const html = readFileSync(resolve(root, name), 'utf8');
  let body = articleBody(html).replace(/<\/?main\b[^>]*>/gi, '');
  if (!/<h1\b/i.test(body)) body = (html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/i)?.[0] || '<h1>Resources</h1>') + body;
  return [name, { title: titleOf(html), description: html.match(/<meta\s+name="description"[^>]*content="([^"]*)"/i)?.[1] || '', html: body }];
}));
function pageShell(template, file) {
  const original = readFileSync(resolve(root, file), 'utf8');
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${titleOf(original)}</title>`);
  for (const name of ['description', 'keywords', 'robots']) {
    const tag = original.match(new RegExp(`<meta\\s+name="${name}"[^>]*>`, 'i'))?.[0];
    if (tag) html = html.replace(new RegExp(`<meta\\s+name="${name}"[^>]*>`, 'i'), tag);
  }
  for (const tag of original.matchAll(/<meta\s+[^>]*(?:name|property)="(?:og:|twitter:)[^"]*"[^>]*>/gi)) {
    const field = tag[0].match(/(?:name|property)="([^"]+)"/i)?.[1];
    const pattern = new RegExp('<meta\\s+[^>]*(?:name|property)="' + field + '"[^>]*>', 'i');
    html = pattern.test(html) ? html.replace(pattern, () => tag[0]) : html.replace('</head>', tag[0] + '\n</head>');
  }
  const schema = original.match(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi) || [];
  html = html.replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '') .replace('</head>', schema.join('\n') + '\n</head>');
  html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonicalUrl(file)}">`);
  const content = routeContent(file);
  if (content) html = html.replace(/<div id="root">[\s\S]*?<\/div>/, () => `<div id="root">${content}${trustLinks}</div>`);
  return html;
}
export default defineConfig({
  plugins: [react(), {
    name: 'preserve-static-urls',
    resolveId(id) { if (['virtual:articles', 'virtual:routes'].includes(id)) return '\0' + id; },
    load(id) {
      if (id === '\0virtual:articles') return `export default ${JSON.stringify(articles)}`;
      if (id === '\0virtual:routes') return `export default ${JSON.stringify(['/', '/index.html', ...aliases.map(file => '/' + file)])}`;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const file = decodeURIComponent((req.url || '').split('?')[0]).slice(1);
        if (!aliases.includes(file)) return next();
        try {
          const template = pageShell(readFileSync(resolve(root, 'index.html'), 'utf8'), file);
          const html = await server.transformIndexHtml(req.url, template);
          res.statusCode = 200; res.setHeader('Content-Type', 'text/html'); res.end(html);
        } catch (error) { next(error); }
      });
    },
    writeBundle(options) {
      const output = resolve(root, options.dir || 'dist');
      const html = readFileSync(resolve(output, 'index.html'), 'utf8');
      for (const file of aliases) writeFileSync(resolve(output, file), pageShell(html, file));
      for (const file of ['rgukt.webp', 'robots.txt', 'sitemap.xml', 'ads.txt', 'subjects.json']) copyFileSync(resolve(root, file), resolve(output, file));
    },
  }],
});
