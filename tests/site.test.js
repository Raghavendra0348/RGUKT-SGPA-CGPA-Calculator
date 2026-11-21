import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SITE_URL, canonicalUrl } from '../src/site.js';

test('canonical URLs use the main domain and consolidate duplicate routes', () => {
  for (const path of ['/', 'index.html', 'department.html']) assert.equal(canonicalUrl(path), SITE_URL + '/');
  assert.equal(canonicalUrl('cse(e1s2).html'), SITE_URL + '/calculator.html?key=cse_e1s2');
  assert.equal(canonicalUrl('calculator.html?key=cse_e1s2&mode=cgpa#main'), SITE_URL + '/calculator.html?key=cse_e1s2');
  assert.equal(canonicalUrl('puc.html'), SITE_URL + '/calculator.html?key=puc_mpc');
});

test('sitemap contains unique canonical URLs and matches robots discovery', () => {
  const xml = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.equal(urls.length, new Set(urls).size);
  for (const url of urls) assert.equal(canonicalUrl(url), url);
  assert.ok(readFileSync(new URL('../robots.txt', import.meta.url), 'utf8').includes(SITE_URL + '/sitemap.xml'));
});

test('all configured subject credits agree with total credits and maximum points', () => {
  const configs = JSON.parse(readFileSync(new URL('../subjects.json', import.meta.url), 'utf8'));
  for (const config of Object.values(configs)) {
    const total = config.subjects.reduce((sum, subject) => sum + subject.credits, 0);
    assert.ok(Math.abs(config.divisor - total) < 0.000001);
    assert.ok(Math.abs(config.maxPoints - total * 10) < 0.000001);
  }
});

test('verification remains available while global tracking and advertising scripts are absent', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('name="google-adsense-account"'));
  assert.ok(!/<script[^>]+src="https:\/\/(?:pagead2\.googlesyndication|www\.googletagmanager)/.test(html));
});
