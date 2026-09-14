/**
 * SwymEducationTooltipManager
 *
 * Reusable tooltip component for Wishlist Save Education, modelled after
 * SwymConsentPopupManager. Positions a tooltip above the target wishlist
 * button with an arrow pointing down. Supports auto-dismiss, close button,
 * and repositioning on scroll/resize.
 *
 * Usage:
 *   SwymEducationTooltipManager.show(targetElement, { message, duration });
 *   SwymEducationTooltipManager.hide();
 *
 * The tooltip DOM lives in swymEducationTooltip.liquid and is rendered once
 * globally via wishlist-app-embed.liquid.
 */
(function () {
  'use strict';

  var _rafId = null;
  function rafThrottle(fn) {
    return function () {
      if (_rafId) return;
      _rafId = requestAnimationFrame(function () { _rafId = null; fn(); });
    };
  }

  window.SwymEducationTooltipManager = {

    _tooltipEl: null,
    _messageEl: null,
    _closeBtn: null,
    _autoHideTimer: null,
    _scrollHandler: null,
    _resizeHandler: null,
    _targetEl: null,
    _visible: false,
    _onDismissCallback: null,

    // ── Lazy element lookup ────────────────────────────────────────────

    _ensureElements: function () {
      if (this._tooltipEl) return true;

      this._tooltipEl = document.getElementById('swym-education-tooltip-bubble');
      if (!this._tooltipEl) return false;

      this._messageEl = this._tooltipEl.querySelector('.swym-education-tooltip-message');
      this._closeBtn = this._tooltipEl.querySelector('[data-swym-education-tooltip-close]');

      if (this._closeBtn) {
        const self = this;
        this._closeBtn.addEventListener('click', function () { self.hide(); });
      }

      return true;
    },

    // ── Public API ─────────────────────────────────────────────────────

    /**
     * Show the tooltip above targetElement.
     *
     * @param {HTMLElement} targetElement — the wishlist button
     * @param {Object}      opts
     * @param {string}       opts.message   — text to display
     * @param {number}      [opts.duration] — auto-dismiss ms (default 30000)
     */
    show: function (targetElement, opts) {
      if (!targetElement || !opts || !opts.message) return false;
      if (!this._ensureElements()) return false;

      this._targetEl = targetElement;
      this._onDismissCallback = opts.onDismiss || null;

      // Set message (innerHTML to support inline SVG icon)
      if (this._messageEl) {
        this._messageEl.innerHTML = opts.message;
      }

      // Remove previous scroll/resize handlers
      this._removePositionListeners();

      // Position and show
      this._position();
      this._tooltipEl.classList.add('swym-education-tooltip-visible');
      this._tooltipEl.setAttribute('aria-hidden', 'false');
      this._visible = true;

      // Auto-dismiss
      const duration = opts.duration || 30000;
      clearTimeout(this._autoHideTimer);
      const self = this;
      this._autoHideTimer = setTimeout(function () { self.hide(); }, duration);

      // Reposition on scroll / resize
      this._scrollHandler = rafThrottle(function () { self._position(); });
      this._resizeHandler = rafThrottle(function () { self._position(); });
      window.addEventListener('scroll', this._scrollHandler, { passive: true });
      window.addEventListener('resize', this._resizeHandler, { passive: true });
      
      return true;
    },

    /**
     * Hide the tooltip.
     */
    hide: function () {
      if (!this._tooltipEl) return;
      this._tooltipEl.classList.remove('swym-education-tooltip-visible');
      this._tooltipEl.setAttribute('aria-hidden', 'true');
      this._visible = false;

      clearTimeout(this._autoHideTimer);
      this._removePositionListeners();
      
      // Invoke onDismiss callback if provided
      if (this._onDismissCallback && typeof this._onDismissCallback === 'function') {
        this._onDismissCallback();
        this._onDismissCallback = null;
      }
    },

    // ── Positioning ────────────────────────────────────────────────────

    _position: function () {
      if (!this._tooltipEl || !this._targetEl) return;

      const targetRect = this._targetEl.getBoundingClientRect();
      const tooltipRect = this._tooltipEl.getBoundingClientRect();
      const arrowSize = 8;

      // Position above the target, centred horizontally
      let top = targetRect.top - tooltipRect.height - arrowSize;
      let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);

      // If tooltip would go off-screen top, place it below instead
      if (top < 8) {
        top = targetRect.bottom + arrowSize;
        this._tooltipEl.classList.add('swym-education-tooltip-below');
        this._tooltipEl.classList.remove('swym-education-tooltip-above');
      } else {
        this._tooltipEl.classList.add('swym-education-tooltip-above');
        this._tooltipEl.classList.remove('swym-education-tooltip-below');
      }

      // Clamp horizontal
      const margin = 8;
      if (left < margin) left = margin;
      if (left + tooltipRect.width > window.innerWidth - margin) {
        left = window.innerWidth - tooltipRect.width - margin;
      }

      this._tooltipEl.style.top = top + 'px';
      this._tooltipEl.style.left = left + 'px';
    },

    _removePositionListeners: function () {
      if (this._scrollHandler) {
        window.removeEventListener('scroll', this._scrollHandler);
        this._scrollHandler = null;
      }
      if (this._resizeHandler) {
        window.removeEventListener('resize', this._resizeHandler);
        this._resizeHandler = null;
      }
    }
  };
})();
