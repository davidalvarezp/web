/* ============================================================
   DAVIDALVAREZP.COM — COOKIE CONSENT MANAGER
   GDPR / LSSI-CE (Spain) compliant
   Stores consent in localStorage under 'dap-cookies-consent'
   ============================================================ */

'use strict';

const CookieConsent = (() => {
  const STORAGE_KEY   = 'dap-cookies-consent';
  const VERSION       = '1.0';   // bump this to re-ask on policy changes

  /* --- Default state --- */
  const DEFAULTS = {
    version:   VERSION,
    date:      null,
    necessary: true,   // always on — cannot be disabled
    analytics: false,
    marketing: false,
  };

  /* ---- Internal helpers ---- */
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.version !== VERSION) return null;  // re-ask on policy change
      return data;
    } catch { return null; }
  };

  const save = (prefs) => {
    prefs.date    = new Date().toISOString();
    prefs.version = VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  };

  const getConsent = () => load();

  /* ---- Third-party scripts ---- */
  const loadAnalytics = () => {

    const GA_ID = G-PHZELV71D8;
    
    if (!GA_ID) return;

    if (document.querySelector(`script[src*="${GA_ID}"]`)) return; // already loaded

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  };

  const applyConsent = (prefs) => {
    if (prefs.analytics) loadAnalytics();
    // add marketing script loader here if needed in the future
  };

  /* ---- Banner DOM ---- */
  const injectBanner = () => {
    if (document.getElementById('cookie-banner')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cookie-overlay';

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.innerHTML = `
      <div class="cookie-banner__header">
        <div class="cookie-banner__icon" aria-hidden="true">🍪</div>
        <div>
          <div class="cookie-banner__title" id="cookie-banner-title">We use cookies</div>
          <div class="cookie-banner__subtitle">// GDPR · LSSI-CE compliant</div>
        </div>
      </div>

      <div class="cookie-banner__body">
        <p class="cookie-banner__desc">
          This website uses cookies to function properly and to help us improve your experience.
          You can accept all, reject non-essential cookies, or manage your preferences.
          Read our <a href="/legal/cookies.html">Cookie Policy</a> and
          <a href="/legal/privacy.html">Privacy Policy</a> for full details.
        </p>

        <div class="cookie-banner__prefs" id="cookie-prefs-panel" aria-live="polite">

          <div class="cookie-pref-item">
            <div class="cookie-pref-item__info">
              <div class="cookie-pref-item__name">Necessary cookies</div>
              <div class="cookie-pref-item__desc">Required for the site to function: theme preference, cookie consent state. Cannot be disabled.</div>
            </div>
            <label class="cookie-toggle" aria-label="Necessary cookies (always enabled)">
              <input type="checkbox" id="toggle-necessary" checked disabled />
              <span class="cookie-toggle__track"></span>
            </label>
          </div>

          <div class="cookie-pref-item">
            <div class="cookie-pref-item__info">
              <div class="cookie-pref-item__name">Analytics cookies</div>
              <div class="cookie-pref-item__desc">Help us understand how visitors use the site (page views, time on page). Data is anonymised.</div>
            </div>
            <label class="cookie-toggle" aria-label="Analytics cookies toggle">
              <input type="checkbox" id="toggle-analytics" />
              <span class="cookie-toggle__track"></span>
            </label>
          </div>

          <div class="cookie-pref-item">
            <div class="cookie-pref-item__info">
              <div class="cookie-pref-item__name">Marketing cookies</div>
              <div class="cookie-pref-item__desc">Used to show relevant content. Currently not active on this site.</div>
            </div>
            <label class="cookie-toggle" aria-label="Marketing cookies toggle">
              <input type="checkbox" id="toggle-marketing" />
              <span class="cookie-toggle__track"></span>
            </label>
          </div>

        </div>
      </div>

      <div class="cookie-banner__actions">
        <button class="cookie-btn cookie-btn--prefs" id="cookie-btn-prefs">Manage preferences</button>
        <button class="cookie-btn cookie-btn--save"   id="cookie-btn-save"  style="display:none">Save selection</button>
        <button class="cookie-btn cookie-btn--reject" id="cookie-btn-reject">Reject non-essential</button>
        <button class="cookie-btn cookie-btn--accept" id="cookie-btn-accept">Accept all</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(banner);

    /* Floating manage button */
    const manageBtnHtml = `
      <button id="cookie-manage-btn" aria-label="Manage cookie preferences" title="Cookie preferences">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 1 1-14.14 14.14A10 10 0 0 1 19.07 4.93"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        </svg>
      </button>
    `;
    document.body.insertAdjacentHTML('beforeend', manageBtnHtml);

    bindEvents();
    return banner;
  };

  const showBanner = () => {
    const banner  = document.getElementById('cookie-banner');
    const overlay = document.getElementById('cookie-overlay');
    if (!banner) return;
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      banner.classList.add('visible');
      banner.focus();
    });
    document.getElementById('cookie-manage-btn')?.classList.remove('visible');
  };

  const hideBanner = () => {
    const banner  = document.getElementById('cookie-banner');
    const overlay = document.getElementById('cookie-overlay');
    banner?.classList.remove('visible');
    overlay?.classList.remove('visible');
    setTimeout(() => {
      document.getElementById('cookie-manage-btn')?.classList.add('visible');
    }, 400);
  };

  const bindEvents = () => {
    const btnAccept = document.getElementById('cookie-btn-accept');
    const btnReject = document.getElementById('cookie-btn-reject');
    const btnPrefs  = document.getElementById('cookie-btn-prefs');
    const btnSave   = document.getElementById('cookie-btn-save');
    const manageBtn = document.getElementById('cookie-manage-btn');
    const panel     = document.getElementById('cookie-prefs-panel');

    btnAccept?.addEventListener('click', () => {
      const prefs = { ...DEFAULTS, analytics: true, marketing: true };
      save(prefs);
      applyConsent(prefs);
      hideBanner();
    });

    btnReject?.addEventListener('click', () => {
      const prefs = { ...DEFAULTS };
      save(prefs);
      applyConsent(prefs);
      hideBanner();
    });

    btnPrefs?.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      btnPrefs.textContent = open ? 'Hide preferences' : 'Manage preferences';
      btnSave.style.display = open ? 'inline-block' : 'none';
    });

    btnSave?.addEventListener('click', () => {
      const analytics = document.getElementById('toggle-analytics')?.checked || false;
      const marketing = document.getElementById('toggle-marketing')?.checked || false;
      const prefs = { ...DEFAULTS, analytics, marketing };
      save(prefs);
      applyConsent(prefs);
      hideBanner();
    });

    manageBtn?.addEventListener('click', () => {
      const existing = load();
      if (existing) {
        const analyticsToggle = document.getElementById('toggle-analytics');
        const marketingToggle = document.getElementById('toggle-marketing');
        if (analyticsToggle) analyticsToggle.checked = existing.analytics;
        if (marketingToggle) marketingToggle.checked = existing.marketing;
        panel.classList.add('open');
        document.getElementById('cookie-btn-prefs').textContent = 'Hide preferences';
        document.getElementById('cookie-btn-save').style.display = 'inline-block';
      }
      showBanner();
    });
  };

  /* ---- Public init ---- */
  const init = () => {
    injectBanner();

    const existing = load();

    if (!existing) {
      /* First visit — show banner after short delay */
      setTimeout(showBanner, 800);
    } else {
      /* Returning visitor — apply saved consent silently */
      applyConsent(existing);
      setTimeout(() => {
        document.getElementById('cookie-manage-btn')?.classList.add('visible');
      }, 600);
    }
  };

  return { init, getConsent, showBanner };
})();

document.addEventListener('DOMContentLoaded', CookieConsent.init);