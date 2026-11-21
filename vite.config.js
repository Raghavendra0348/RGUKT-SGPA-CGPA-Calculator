import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const contentFiles = ['about.html', 'blog.html', 'how-to-calculate-sgpa.html', 'sgpa-vs-cgpa.html', 'disclaimer.html', 'privacy_policy.html', 'terms.html'];
const root = process.cwd();
const aliases = readdirSync(root).filter(name => name.endsWith('.html') && name !== 'index.html');
const titleOf = html => html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'RGUKT Gradebook';
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
  return [name, { title: titleOf(html), html: body }];
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
  html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="https://www.rgukt-sgpa-cgpa-calculator.tech/${file}">`);
  if (articles[file]) html = html.replace(/<div id="root">[\s\S]*?<\/div>/, () => `<div id="root"><article>${articles[file].html}</article></div>`);
  return html;
}
export default defineConfig({
  plugins: [react(), {
    name: 'preserve-static-urls',
    resolveId(id) { if (id === 'virtual:articles') return '\0virtual:articles'; },
    load(id) { if (id === '\0virtual:articles') return `export default ${JSON.stringify(articles)}`; },
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
