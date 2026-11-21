import React, { useState } from 'react';

const STORAGE_KEY = 'rgukt-analytics-consent';
const MEASUREMENT_ID = 'G-T486B8C5X0';
function storedChoice() {
  try { const value = localStorage.getItem(STORAGE_KEY); return ['granted', 'denied'].includes(value) ? value : null; }
  catch { return null; }
}
export function startAnalytics(consented = storedChoice() === 'granted') {
  if (!consented || document.getElementById('google-analytics')) return false;
  window['ga-disable-' + MEASUREMENT_ID] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement('script');
  script.id = 'google-analytics'; script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(script);
  window.gtag('event', 'page_view', { page_path: location.pathname + location.search });
  return true;
}
export default function PrivacyChoices() {
  const [choice, setChoice] = useState(storedChoice);
  const [open, setOpen] = useState(() => !storedChoice());
  function choose(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* Respect the choice for this visit when storage is unavailable. */ }
    setChoice(value); setOpen(false);
    if (value === 'granted') {
      // Initialize immediately, including when browser storage is unavailable.
      window['ga-disable-' + MEASUREMENT_ID] = false;
      startAnalytics(true);
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    } else {
      window['ga-disable-' + MEASUREMENT_ID] = true;
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      document.getElementById('google-analytics')?.remove();
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (!name.startsWith('_ga')) continue;
        for (const domain of ['', `; domain=${location.hostname}`]) document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
      }
    }
  }
  return <section className="privacy-choices" aria-label="Privacy choices">{open ? <div className="wrap privacy-inner"><div><h2>Optional analytics</h2><p>With your permission, Google Analytics helps us understand site usage. Your grades stay on your device. <a href="privacy_policy.html">Read our privacy policy</a>.</p></div><div className="privacy-actions"><button onClick={() => choose('denied')}>Decline analytics</button><button onClick={() => choose('granted')}>Allow analytics</button></div></div> : <div className="wrap privacy-summary"><span>Analytics {choice === 'granted' ? 'allowed' : 'off'}</span><button onClick={() => setOpen(true)}>Privacy choices</button></div>}</section>;
}
