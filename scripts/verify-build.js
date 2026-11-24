import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = file => readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const files = readdirSync(new URL('../dist/', import.meta.url)).filter(file => file.endsWith('.html'));
for (const file of files) {
  const html = read(file);
  assert.match(html, /name="google-adsense-account" content="ca-pub-7812693991042173"/, file);
  assert.doesNotMatch(html, /<script[^>]+src="https:\/\/(?:pagead2\.googlesyndication|www\.googletagmanager)/, file);
  for (const link of ['about.html', 'contact.html', 'privacy_policy.html', 'terms.html', 'disclaimer.html']) {
    assert.ok(html.includes(`href="${link}"`), `${file}: missing static ${link}`);
  }
  for (const match of html.matchAll(/href="([^"?#]+\.html)(?:[?#][^"]*)?"/g)) {
    if (!match[1].includes('://')) assert.ok(files.includes(match[1]), `${file}: broken link ${match[1]}`);
  }
}
assert.match(read('cse_e1s1.html'), /Default subjects and credits/);
assert.match(read('cse_semester.html'), /calculator.html\?key=cse_e1s1/);
assert.match(read('calculator.html'), /calculator.html\?key=puc_mpc/);
assert.match(read('contact.html'), /mailto:learnwithhraghava@gmail.com/);
assert.match(read('privacy_policy.html'), /Ad serving is currently paused/);
assert.equal(read('ads.txt').trim(), 'google.com, pub-7812693991042173, DIRECT, f08c47fec0942fa0');
console.log(`Verified ${files.length} built HTML pages: verification, paused ads, static content and local links.`);
