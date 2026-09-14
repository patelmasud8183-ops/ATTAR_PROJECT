/**
 * SwymEducationManager
 *
 * Coordinates "Wishlist Save Education" nudges for first-time shoppers with
 * empty wishlists. Behaviour differs by page context:
 *
 * COLLECTIONS PAGE:
 *   - Visit 1: toast (no add-to-wishlist CTA)
 *   - Visit 2: tooltip
 *   - Visit 3: toast again ... alternating, up to 3 rounds (6 impressions)
 *   - If user adds any item to wishlist mid-session, stop everything.
 *
 * PDP PAGE:
 *   - Tooltip and button-text transition alternate, up to 3 rounds.
 *   - Both only show when the advanced PDP button is in viewport.
 *   - After 5 seconds on page AND >70% scroll, show toast WITH add-to-wishlist CTA.
 *   - If product is added to wishlist mid-session, stop everything.
 *
 * Toast uses the existing SwymStorefrontLayoutNotification with status="neutral"
 * (same colours as the "added to wishlist" notification) and showProgress for
 * the animated progress bar.
 *
 * Depends on:
 *   - SwymStorefrontLayoutExtensions.Notification  (existing toast component)
 *   - SwymEducationTooltipManager                  (companion tooltip component)
 *   - sessionStorage for frequency caps
 */
(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────
  var SESSION_KEY = 'swym-education-session';
  var TRIGGER_DELAY_MS = 10000;         // 10 seconds on page before first nudge
  var TOAST_DURATION_MS = 15000;        // 15 seconds toast visible
  var TOOLTIP_DURATION_MS = 30000;      // 30 seconds tooltip visible
  var MAX_ROUNDS = 3;                   // 3 rounds of alternating nudges
  var TRANSITION_DISPLAY_MS = 7000;     // 7 seconds button text shown
  var PDP_TOAST_DELAY_MS = 5000;        // 5 seconds before PDP toast eligible
  var PDP_SCROLL_THRESHOLD = 0.7;       // 70% of page scrolled

  // ── Session helpers ──────────────────────────────────────────────
  function loadSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) { /* ignore */ }
    return {
      collectionsNudgeCount: 0,
      pdpNudgeCount: 0,
      pdpToastShown: false,
      wishlistActionRegistered: false
    };
  }

  function saveSession(state) {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)); } catch (_) { /* ignore */ }
  }

  // ── Manager singleton ──────────────────────────────────────────────
  window.SwymEducationManager = {

    // State
    _initialized: false,
    _hasFired: false,
    _observer: null,
    _pageTimer: null,
    _pdpToastTimer: null,
    _scrollHandler: null,
    _isButtonVisible: false,
    _pageTimeElapsed: false,
    _pdpToastTimeElapsed: false,
    _visibleButtons: null,
    _wishlistName: 'Wishlist',
    _context: null,
    _buttonElement: null,
    _swat: null,
    _wishlistActionListener: null,
    _transitionTimers: [],
    _originalButtonText: null,
    _iconHtml: '',

    // ── Public API ───────────────────────────────────────────────────

    init: function (opts) {
      if (this._initialized) return;

      var session = loadSession();
      if (session.wishlistActionRegistered) return;

      if (!opts.isWishlistEmpty || opts.isProductWishlisted) return;
      if (!opts.buttonElement) return;

      if (opts.context === 'collections' && session.collectionsNudgeCount >= MAX_ROUNDS * 2) return;
      if (opts.context === 'pdp' && session.pdpNudgeCount >= MAX_ROUNDS * 2 && session.pdpToastShown) return;

      this._initialized = true;
      this._context = opts.context;
      this._buttonElement = opts.buttonElement;
      this._swat = opts.swat;

      this._extractButtonIcon();
      this._fetchWishlistName();
      this._listenForWishlistActions();
      this._startTrigger();
    },

    destroy: function () {
      if (this._observer) { this._observer.disconnect(); this._observer = null; }
      if (this._pageTimer) { clearTimeout(this._pageTimer); this._pageTimer = null; }
      if (this._pdpToastTimer) { clearTimeout(this._pdpToastTimer); this._pdpToastTimer = null; }
      this._clearTransitionTimers();
      this._removePdpScrollListener();

      if (this._swat && this._wishlistActionListener) {
        try {
          this._swat.evtLayer.removeEventListener(
            this._swat.JSEvents.addedToWishlist,
            this._wishlistActionListener
          );
        } catch (_) { /* ignore */ }
      }
      this._wishlistActionListener = null;
      this._visibleButtons = null;
      this._initialized = false;
      this._hasFired = false;
      this._isButtonVisible = false;
      this._pageTimeElapsed = false;
      this._pdpToastTimeElapsed = false;
    },

    // ── Trigger logic ────────────────────────────────────────────────

    _startTrigger: function () {
      var self = this;

      if (this._context === 'collections') {
        var allButtons = document.querySelectorAll('.swym-advanced-wishlist-collections-container');
        this._visibleButtons = new Set();
        this._observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                self._visibleButtons.add(entry.target);
              } else {
                self._visibleButtons.delete(entry.target);
              }
            });
            self._isButtonVisible = self._visibleButtons.size > 0;
            self._checkAndFire();
          },
          { threshold: 0.5 }
        );
        allButtons.forEach(function (btn) { self._observer.observe(btn); });
      } else {
        this._observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              self._isButtonVisible = entry.isIntersecting;
              self._checkAndFire();
            });
          },
          { threshold: 0.5 }
        );
        this._observer.observe(this._buttonElement);
      }

      this._pageTimer = setTimeout(function () {
        self._pageTimeElapsed = true;
        self._checkAndFire();
      }, TRIGGER_DELAY_MS);

      if (this._context === 'pdp') {
        this._pdpToastTimer = setTimeout(function () {
          self._pdpToastTimeElapsed = true;
          self._checkPdpToast();
        }, PDP_TOAST_DELAY_MS);

        this._scrollHandler = function () {
          self._checkPdpToast();
        };
        window.addEventListener('scroll', this._scrollHandler, { passive: true });
      }
    },

    _checkAndFire: function () {
      if (this._hasFired) return;
      if (!this._isButtonVisible || !this._pageTimeElapsed) return;

      var session = loadSession();
      if (session.wishlistActionRegistered) return;

      if (this._context === 'collections' && this._visibleButtons && this._visibleButtons.size > 0) {
        var allButtons = document.querySelectorAll('.swym-advanced-wishlist-collections-container');
        for (var i = 0; i < allButtons.length; i++) {
          if (this._visibleButtons.has(allButtons[i])) {
            this._buttonElement = allButtons[i];
            break;
          }
        }
      }

      this._hasFired = true;
      this._showEducationNudge(session);
    },

    // ── Show nudge (context-aware) ────────────────────────────────────

    _showEducationNudge: function (session) {
      if (this._context === 'collections') {
        this._showCollectionsNudge(session);
      } else if (this._context === 'pdp') {
        this._showPdpNudge(session);
      }
    },

    _showCollectionsNudge: function (session) {
      if (session.collectionsNudgeCount >= MAX_ROUNDS * 2) return;

      var isToastTurn = session.collectionsNudgeCount % 2 === 0;
      var shown = false;

      if (isToastTurn) {
        shown = this._showToast(false);
        if (shown) {
          // Instrument: Education toast shown (collections)
          this._instrumentEducation('EducationLayerToastShownCollections', {
            context: 'collections',
            nudgeCount: session.collectionsNudgeCount,
            nudgeType: 'toast'
          });
        }
      } else {
        shown = this._showTooltip();
        if (shown) {
          // Instrument: Education tooltip shown (collections)
          this._instrumentEducation('EducationLayerTooltipShownCollections', {
            context: 'collections',
            nudgeCount: session.collectionsNudgeCount,
            nudgeType: 'tooltip'
          });
        }
      }

      // Only increment counter if something was actually shown
      if (shown) {
        session.collectionsNudgeCount++;
        saveSession(session);
      }
    },

    _showPdpNudge: function (session) {
      if (session.pdpNudgeCount >= MAX_ROUNDS * 2) return;

      var isTooltipTurn = session.pdpNudgeCount % 2 === 0;
      var buttonTextRound = Math.floor(session.pdpNudgeCount / 2) + 1;
      var shown = false;

      if (isTooltipTurn) {
        shown = this._showTooltip();
        if (shown) {
          // Instrument: Education tooltip shown (PDP)
          this._instrumentEducation('EducationLayerTooltipShownPDP', {
            context: 'pdp',
            nudgeCount: session.pdpNudgeCount,
            nudgeType: 'tooltip'
          });
        }
      } else {
        shown = this._startButtonCopyTransition(buttonTextRound) === true;
        if (shown) {
          // Instrument: Education button text transition shown (PDP)
          this._instrumentEducation('EducationLayerButtonTransitionShownPDP', {
            context: 'pdp',
            nudgeCount: session.pdpNudgeCount,
            round: buttonTextRound
          });
        }
      }

      // Only count this as a nudge if something was actually shown
      if (shown) {
        session.pdpNudgeCount++;
        saveSession(session);
      }
    },

    // ── PDP scroll toast (5s + 70% scroll) ──────────────────────────────────

    _checkPdpToast: function () {
      if (this._context !== 'pdp') return;

      var session = loadSession();
      if (session.wishlistActionRegistered) return;
      if (session.pdpToastShown) return;
      if (!this._pdpToastTimeElapsed) return;

      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight
      );
      var viewportHeight = window.innerHeight;
      var scrollableHeight = docHeight - viewportHeight;
      if (scrollableHeight <= 0) return;

      var scrollPercent = scrollTop / scrollableHeight;
      if (scrollPercent < PDP_SCROLL_THRESHOLD) return;

      session.pdpToastShown = true;
      saveSession(session);

      if (window.SwymEducationTooltipManager && window.SwymEducationTooltipManager.hide) {
        window.SwymEducationTooltipManager.hide();
      }

      this._clearTransitionTimers();
      var textEl = this._buttonElement && this._buttonElement.querySelector('.swym-custom-btn-txt');
      if (textEl && this._originalButtonText) {
        textEl.textContent = this._originalButtonText;
      }

      var shown = this._showToast(true);
      if (shown) {
        // Instrument: Education toast shown (PDP) with CTA
        this._instrumentEducation('EducationLayerToastShownPDP', {
          context: 'pdp',
          nudgeType: 'toast',
          withCTA: true,
          scrollPercent: Math.round(scrollPercent * 100)
        });
      }
      this._removePdpScrollListener();
    },

    _removePdpScrollListener: function () {
      if (this._scrollHandler) {
        window.removeEventListener('scroll', this._scrollHandler);
        this._scrollHandler = null;
      }
    },

    // ── Toast (reuses existing StorefrontLayoutNotification) ─────────────────

    _showToast: function (withCta) {
      var notificationEl = this._getNotificationElement();
      if (!notificationEl) return false;

      if (!customElements.get('swym-storefront-layout-notification')) {
        let self = this;
        customElements.whenDefined('swym-storefront-layout-notification').then(function () {
          const session = loadSession();
          if (session.wishlistActionRegistered) return;
          const shown = self._showToast(withCta);
          // When deferred, the caller's count increment was skipped (it saw shown=false).
          // Increment collections nudge count here to preserve toast→tooltip alternation.
          // PDP scroll toast doesn't need this — it guards via pdpToastShown flag instead.
          if (shown && !withCta) {
            session.collectionsNudgeCount = (session.collectionsNudgeCount || 0) + 1;
            saveSession(session);
          }
        });
        return false;
      }

      var message = this._getEducationText('toast');
      if (!message) return false;

      var toastData = {
        message: message,
        status: SwymStorefrontLayoutContext?.NotificationStatusTypes?.Neutral || 'neutral',
        duration: TOAST_DURATION_MS,
        actionType: 'education-nudge'
      };

      var config = {
        showMessage: true,
        showActionButton: false,
        showProgress: true
      };

      if (withCta) {
        var ctaLabel = this._getEducationText('toastCta');
        if (ctaLabel) {
          var self = this;
          toastData.action = {
            label: ctaLabel,
            onClick: function () { self._handleToastCta(); }
          };
          config.showActionButton = true;
        }
      }

      notificationEl.setMessage(toastData, config);

      this._fixProgressBarDuration(notificationEl, TOAST_DURATION_MS);
      return true;
    },

    _fixProgressBarDuration: function (notificationEl, durationMs) {
      var progressBar = notificationEl.querySelector('.swym-storefront-layout-notification-progress-bar');
      if (progressBar) {
        var durationSec = (durationMs / 1000) + 's';
        progressBar.style.animationDuration = durationSec;
      }
    },

    _getNotificationElement: function () {
      return SwymStorefrontLayoutExtensions?.Notification ||
        document.getElementById('swym-storefront-layout-notification');
    },

    _handleToastCta: function () {
      // Instrument: Education toast CTA clicked
      this._instrumentEducation('EducationLayerToastCTAClicked', {
        context: this._context
      });
      
      var swat = this._swat;
      if (!swat) return;

      if (this._context === 'pdp') {
        var pageData = swat.currentPageData;
        if (pageData) {
          swat.addToWishlistUsingDu({
            du: pageData.du,
            epi: pageData.epi,
            source: swat.wishlistSources?.pdp || 'pdp'
          }, function () {}, function () {});
        }
      }

      this._onWishlistAction();
    },

    // ── Tooltip ────────────────────────────────────────────────────

    _showTooltip: function () {
      if (!window.SwymEducationTooltipManager) return false;

      var message = this._getEducationText('tooltip');
      if (!message) return false;

      var self = this;
      var dismissCode = this._context === 'collections'
        ? 'EducationLayerTooltipDismissedCollections'
        : 'EducationLayerTooltipDismissedPDP';
      var shown = window.SwymEducationTooltipManager.show(this._buttonElement, {
        message: message,
        duration: TOOLTIP_DURATION_MS,
        onDismiss: function () {
          self._instrumentEducation(dismissCode, { context: self._context });
        }
      });
      return shown === true;
    },

    // ── Button copy transition ─────────────────────────────────────────────

    _startButtonCopyTransition: function (round) {
      var buttonEl = this._buttonElement;
      var textEl = buttonEl.querySelector('.swym-custom-btn-txt');
      if (!textEl || !textEl.textContent.trim()) return false;

      var educationText = this._getEducationText('buttonTransition', round || 1);
      if (!educationText) return false;

      var originalText = textEl.textContent;
      this._originalButtonText = originalText;

      textEl.classList.add('swym-btn-text-fade-out');
      var self = this;
      setTimeout(function () {
        textEl.textContent = educationText;
        textEl.classList.remove('swym-btn-text-fade-out');
        textEl.classList.add('swym-btn-text-fade-in');
        setTimeout(function () { textEl.classList.remove('swym-btn-text-fade-in'); }, 300);
      }, 200);

      var revertTimer = setTimeout(function () {
        var currentSession = loadSession();
        if (!currentSession.wishlistActionRegistered) {
          textEl.classList.add('swym-btn-text-fade-out');
          setTimeout(function () {
            textEl.textContent = originalText;
            textEl.classList.remove('swym-btn-text-fade-out');
            textEl.classList.add('swym-btn-text-fade-in');
            setTimeout(function () { textEl.classList.remove('swym-btn-text-fade-in'); }, 300);
          }, 200);
        }
      }, TRANSITION_DISPLAY_MS);

      this._transitionTimers.push(revertTimer);
      return true;
    },

    _clearTransitionTimers: function () {
      this._transitionTimers.forEach(function (t) { clearTimeout(t); });
      this._transitionTimers = [];
    },

    // ── Education text resolution ──────────────────────────────────────────

    _getEducationText: function (type, round) {
      var dataEl = this._getEducationDataElement();
      var name = this._wishlistName || 'Wishlist';
      var text = '';
      var isMobile = window.innerWidth <= 768;

      if (type === 'toast') {
        var toastKey = isMobile ? 'EducationToastMobileMessage' : 'EducationToastDesktopMessage';
        var toastAttr = isMobile ? 'data-toast-mobile-message' : 'data-toast-desktop-message';
        text = this._getSharedEducationString(toastKey) ?? (dataEl && dataEl.getAttribute(toastAttr)) ?? '';
      } else if (type === 'toastCta') {
        text = this._getSharedEducationString('EducationToastCTA') ?? (dataEl && dataEl.getAttribute('data-toast-cta')) ?? '';
      } else if (type === 'tooltip') {
        var tooltipKey = isMobile ? 'EducationTooltipMobileMessage' : 'EducationTooltipDesktopMessage';
        var tooltipAttr = isMobile ? 'data-tooltip-mobile-message' : 'data-tooltip-desktop-message';
        text = this._getSharedEducationString(tooltipKey) ?? (dataEl && dataEl.getAttribute(tooltipAttr)) ?? '';
      } else if (type === 'buttonTransition') {
        var roundNum = Math.min(Math.max(round || 1, 1), 3);
        var buttonTransitionKey = 'EducationButtonTransitionText' + roundNum;
        var attr = 'data-button-transition-text-' + roundNum;
        text = this._getSharedEducationString(buttonTransitionKey) ?? (dataEl && dataEl.getAttribute(attr)) ?? '';
      }

      text = text || '';
      text = text.replace(/\{\{wishlistName\}\}/g, name);
      text = text.replace(/\{\{wishlistIcon\}\}/g, this._iconHtml);
      return text;
    },

    _getSharedEducationString: function (key) {
      var strings = this._swat && this._swat.retailerSettings && this._swat.retailerSettings.Strings;
      if (!strings && window._swat && window._swat.retailerSettings) {
        strings = window._swat.retailerSettings.Strings;
      }

      if (!strings) return null;

      var localeInfo = this._getLocaleInfo();
      var localeRegion = localeInfo.localeRegion;
      var locale = localeInfo.locale;

      // Try exact locale (e.g. pt-BR from Shopify)
      var localeScopedValue = this._readLocaleScopedString(strings, localeRegion, key);
      if (localeScopedValue !== null) return localeScopedValue;

      // Try language-only (e.g. pt)
      localeScopedValue = this._readLocaleScopedString(strings, locale, key);
      if (localeScopedValue !== null) return localeScopedValue;

      // For English only, allow general top-level strings as fallback
      if (locale === 'en') {
        return this._readTopLevelString(strings, key);
      }

      return null;
    },

    _readLocaleScopedString: function (strings, localeKey, key) {
      if (!localeKey) return null;
      if (!Object.prototype.hasOwnProperty.call(strings, localeKey)) return null;

      var localeBlock = strings[localeKey];
      if (!localeBlock || typeof localeBlock !== 'object') return null;

      if (Object.prototype.hasOwnProperty.call(localeBlock, key)) {
        var directValue = localeBlock[key];
        return (directValue === undefined || directValue === null || directValue === '') ? null : directValue;
      }

      var stringMapValue = this._readStringMapString(localeBlock, key);
      if (stringMapValue !== null) return stringMapValue;

      return null;
    },

    _readTopLevelString: function (strings, key) {
      if (!Object.prototype.hasOwnProperty.call(strings, key)) return null;

      var value = strings[key];
      return (value === undefined || value === null || value === '') ? null : value;
    },

    _readStringMapString: function (localeBlock, key) {
      var stringMap = localeBlock && localeBlock['string-map'];
      if (!stringMap || typeof stringMap !== 'object') return null;

      var categories = Object.keys(stringMap);
      for (var i = 0; i < categories.length; i++) {
        var categoryItems = stringMap[categories[i]];
        if (!Array.isArray(categoryItems)) continue;

        for (var j = 0; j < categoryItems.length; j++) {
          var stringItem = categoryItems[j];
          if (!stringItem || stringItem.key !== key) continue;

          var stringValue = stringItem.value;
          return (stringValue === undefined || stringValue === null || stringValue === '') ? null : stringValue;
        }
      }

      return null;
    },

    _getLocaleInfo: function () {
      var localeRaw = '';

      if (window.Shopify && typeof window.Shopify.locale === 'string') {
        localeRaw = window.Shopify.locale;
      } else if (document && document.documentElement && typeof document.documentElement.lang === 'string') {
        localeRaw = document.documentElement.lang;
      }

      localeRaw = localeRaw || 'en';
      var localeRegion = localeRaw;  // Keep original case from Shopify

      var splitLocale = localeRaw.toLowerCase().split('-');
      var locale = splitLocale[0] || 'en';

      return {
        localeRegion: localeRegion,
        locale: locale
      };
    },

    _getEducationDataElement: function () {
      return document.getElementById('swym-education-tooltip');
    },

    // ── Button icon extraction ──────────────────────────────────────────

    _extractButtonIcon: function () {
      if (!this._buttonElement) return;
      var svgEl = this._buttonElement.querySelector('svg');
      if (!svgEl) return;

      var clone = svgEl.cloneNode(true);
      clone.removeAttribute('class');
      clone.setAttribute('width', '14');
      clone.setAttribute('height', '14');
      clone.style.display = 'inline-block';
      clone.style.verticalAlign = 'middle';
      clone.style.marginTop = '-2px';
      clone.style.color = 'inherit';

      var tmp = document.createElement('span');
      tmp.appendChild(clone);
      this._iconHtml = tmp.innerHTML;
    },

    // ── Wishlist name ──────────────────────────────────────────────────────

    _fetchWishlistName: function () {
      var swat = this._swat;
      if (!swat || !swat.api || !swat.api.fetchLists) return;

      var self = this;
      try {
        swat.api.fetchLists({
          callbackFn: function (lists) {
            if (lists && lists.length > 0 && lists[0].lname) {
              self._wishlistName = lists[0].lname;
            }
          },
          errorFn: function () { /* keep default */ }
        });
      } catch (_) { /* keep default */ }
    },

    // ── Wishlist action listener ─────────────────────────────────────────────

    _listenForWishlistActions: function () {
      var swat = this._swat;
      if (!swat || !swat.evtLayer) return;

      var self = this;
      this._wishlistActionListener = function () {
        self._onWishlistAction();
      };
      swat.evtLayer.addEventListener(swat.JSEvents.addedToWishlist, this._wishlistActionListener);
    },

    _onWishlistAction: function () {
      var session = loadSession();
      session.wishlistActionRegistered = true;
      saveSession(session);

      // Instrument: Education session stopped (user added to wishlist)
      this._instrumentEducation('EducationLayerSessionStopped', {
        context: this._context,
        collectionsNudgeCount: session.collectionsNudgeCount,
        pdpNudgeCount: session.pdpNudgeCount,
        pdpToastShown: session.pdpToastShown,
        epi: window.SwymPageData?.epi,
        empi: window.SwymPageData?.empi
      });

      var notificationEl = this._getNotificationElement();
      if (notificationEl && notificationEl.hideNotification) {
        notificationEl.hideNotification();
      }

      if (window.SwymEducationTooltipManager && window.SwymEducationTooltipManager.hide) {
        window.SwymEducationTooltipManager.hide();
      }

      this._clearTransitionTimers();
      var textEl = this._buttonElement && this._buttonElement.querySelector('.swym-custom-btn-txt');
      if (textEl && this._originalButtonText) {
        textEl.textContent = this._originalButtonText;
      }

      this._removePdpScrollListener();
    },

    // ── Instrumentation helper ───────────────────────────────────────────────

    _instrumentEducation: function (actionCode, additionalData) {
      if (!window._swat || !window._swat.instrumentV3) return;
      if (!window.SwymStorefrontLayoutExtensions || !window.SwymStorefrontLayoutExtensions.InstrumentActionCodes) return;
      
      var ratCode = window.SwymStorefrontLayoutExtensions.InstrumentActionCodes[actionCode];
      if (!ratCode) return;

      var data = {
        "utm-term": window.SwymStorefrontLayoutExtensions.InstrumentUtmTerms.EducationLayerEngagement || "education",
        "utm-source": "swym-Wishlist",
        "utm-medium": "education"
      };

      if (additionalData && typeof additionalData === 'object') {
        for (var key in additionalData) {
          if (additionalData.hasOwnProperty(key)) {
            data[key] = additionalData[key];
          }
        }
      }

      window._swat.instrumentV3(ratCode, data);
    }
  };
})();
