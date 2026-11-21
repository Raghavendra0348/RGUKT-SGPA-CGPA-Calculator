import { useEffect, useSyncExternalStore } from 'react';

const navigationEvent = 'gradebook:navigate';

export function readRoute(href = window.location.href) {
  const url = new URL(href);
  const file = decodeURIComponent(url.pathname.split('/').pop() || 'index.html');
  const legacy = file.match(/^([a-z]+)[(_](e\ds\d)\)?\.html$/);
  const key = url.searchParams.get('key') || (file === 'puc.html' ? 'puc_mpc' : legacy ? `${legacy[1]}_${legacy[2]}` : '');
  const branch = url.searchParams.get('branch') || (key ? key.split('_')[0] : file.replace('_semester.html', ''));
  return { file, key, branch, mode: url.searchParams.get('mode') === 'cgpa' ? 'cgpa' : 'sgpa' };
}

export function shouldHandleLink(url, current, routes, options = {}) {
  return !options.defaultPrevented && (options.button ?? 0) === 0 &&
    !options.metaKey && !options.ctrlKey && !options.shiftKey && !options.altKey &&
    !options.download && (!options.target || options.target.toLowerCase() === '_self') &&
    url.origin === current.origin && routes.includes(url.pathname);
}

export function navigate(href, { replace = false, scroll = true } = {}) {
  const url = new URL(href, window.location.href);
  const state = { ...window.history.state, gradebookScroll: scroll };
  window.history[replace ? 'replaceState' : 'pushState'](state, '', url);
  window.dispatchEvent(new Event(navigationEvent));
}

function subscribe(listener) {
  window.addEventListener('popstate', listener);
  window.addEventListener('hashchange', listener);
  window.addEventListener(navigationEvent, listener);
  return () => {
    window.removeEventListener('popstate', listener);
    window.removeEventListener('hashchange', listener);
    window.removeEventListener(navigationEvent, listener);
  };
}

function scrollToDestination(url) {
  let target = document.getElementById('main');
  if (url.hash) {
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))) || target; } catch { /* Keep the main-content fallback for malformed hashes. */ }
  }
  if (url.hash) target?.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 0);
  if (target) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

export function useBrowserNavigation(routes) {
  const href = useSyncExternalStore(subscribe, () => window.location.href);
  useEffect(() => {
    const click = event => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link) return;
      const url = new URL(link.href);
      if (!shouldHandleLink(url, new URL(window.location.href), routes, {
        defaultPrevented: event.defaultPrevented, button: event.button,
        metaKey: event.metaKey, ctrlKey: event.ctrlKey, shiftKey: event.shiftKey, altKey: event.altKey,
        target: link.target, download: link.hasAttribute('download'),
      })) return;
      event.preventDefault();
      if (url.href === window.location.href) scrollToDestination(url);
      else navigate(url.href);
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, [routes]);
  useEffect(() => {
    if (window.history.state?.gradebookScroll === false) return;
    const frame = requestAnimationFrame(() => scrollToDestination(new URL(href)));
    return () => cancelAnimationFrame(frame);
  }, [href]);
  return href;
}
