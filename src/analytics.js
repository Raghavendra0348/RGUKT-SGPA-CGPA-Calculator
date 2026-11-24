const MEASUREMENT_ID = 'G-T486B8C5X0';
let lastPage = null;

export function trackPageView(href = window.location.href) {
  // Preserve a visitor's previously saved opt-out and browser privacy signals.
  let optedOut = false;
  try { optedOut = localStorage.getItem('rgukt-analytics-consent') === 'denied'; } catch { /* Storage may be unavailable. */ }
  if (optedOut || navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window['ga-disable-' + MEASUREMENT_ID]) return false;
  const url = new URL(href);
  const page = url.pathname + url.search;
  if (!document.getElementById('google-analytics')) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.id = 'google-analytics'; script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(script);
  }
  if (lastPage === page) return false;
  lastPage = page;
  window.gtag('event', 'page_view', { page_path: page, page_location: url.origin + page, page_title: document.title });
  return true;
}
