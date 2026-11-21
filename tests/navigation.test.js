import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readRoute, shouldHandleLink } from '../src/navigation.js';
const origin = 'https://example.com';
const current = new URL(origin + '/index.html');
const routes = ['/', '/index.html', '/cse_semester.html', '/calculator.html', '/blog.html'];

test('SPA route parsing preserves legacy URLs, calculator keys and modes', () => {
  assert.equal(readRoute(origin + '/').file, 'index.html');
  assert.equal(readRoute(origin + '/cse_semester.html').branch, 'cse');
  assert.equal(readRoute(origin + '/calculator.html?key=ece_e3s2&mode=cgpa').key, 'ece_e3s2');
  assert.equal(readRoute(origin + '/calculator.html?key=ece_e3s2&mode=cgpa').mode, 'cgpa');
  assert.equal(readRoute(origin + '/cse(e2s1).html').key, 'cse_e2s1');
  assert.equal(readRoute(origin + '/puc.html').key, 'puc_mpc');
});

test('SPA navigation handles internal pages and anchors', () => {
  for (const path of ['/calculator.html?key=cse_e1s1', '/index.html#departments', '/blog.html#faq']) {
    assert.equal(shouldHandleLink(new URL(origin + path), current, routes), true);
  }
});

test('external links, downloads and modified clicks retain native browser behavior', () => {
  const internal = new URL(origin + '/blog.html');
  for (const options of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { download: true }, { target: '_blank' }, { defaultPrevented: true }]) {
    assert.equal(shouldHandleLink(internal, current, routes, options), false);
  }
  assert.equal(shouldHandleLink(new URL('https://github.com'), current, routes), false);
  assert.equal(shouldHandleLink(new URL(origin + '/subjects.json'), current, routes), false);
});
