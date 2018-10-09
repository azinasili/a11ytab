/**
 * A11yTab - A fully accessible and customizable tabs front-end component
 * @module A11yTab
 */

/**
 * A11yTab
 */
export default class A11yTab {
  /**
   * Create Settings for A11yTab
   * @param {Object} options - Options to customize A11yTab instance
   */
  constructor(options) {
    const defaults = {
      selector: null,
      tabFocus: null,
      tabBlur: null,
      tabPanelFocus: null,
      tabPanelBlur: null,
      focusOnLoad: false,
      afterFocusFunction: null,
      beforeBlurFunction: null,
      addEvents: false,
      eventAfterFocus: 'a11ytab:afterFocus',
      eventBeforeBlur: 'a11ytab:beforeBlur',
      hashNavigation: false,
      tabToFocus: null,
    };

    this.settings = Object.assign({}, defaults, options);
    this.tabList = this.settings.selector;
    this.tabs = [...this.tabList.querySelectorAll('[data-a11ytab-tab]')];
    this.tabPanels = this.tabs.map(item => document.querySelector(item.getAttribute('href')));
  }

  /**
   * Initialize A11yTab
   * @param {HTMLElement} tab          - Tab element to become active
   * @param {Boolean}     focus = true - Focus on current active tab
   * @returns {Object}                 - A11yTab instance
   */
  init(tab = this.settings.tabToFocus) {
    const { isBoolean } = this.constructor;
    const { focusOnLoad } = this.settings;
    const focusTab = focusOnLoad && isBoolean(focusOnLoad) ? focusOnLoad : false;
    let tabToFocus = tab ? this.tabs.find(el => el === tab) : this.tabs[0];

    if (this.loaded) return this;

    if (this.settings.hashNavigation && window.location.hash) {
      tabToFocus = this.tabs.find(el => el.getAttribute('href') === window.location.hash) || tabToFocus;
    }

    this.selected = {
      tab: tabToFocus,
      panel: this.tabPanels.find(el => el.getAttribute('id') === tabToFocus.getAttribute('href')),
    };
    this.addARIA();
    this.focus(this.selected.tab, focusTab);
    this.addEvents();
    this.loaded = true;

    return this;
  }

  /**
   * Remove A11yTab modifications
   * @returns {Object} - A11yTab instance
   */
  destroy() {
    if (!this.loaded) return this;

    this.selected = {};
    this.disableTab();
    this.disablePanel();
    this.removeARIA();
    this.removeEvents();
    this.loaded = false;

    return this;
  }

  /**
   * Make previous tab/panel active
   * @returns {Object} - A11yTab instance
   */
  prev() {
    const { findIndex } = this.constructor;
    const prevIndex = findIndex(this.tabs).prev;
    const prevTab = this.tabs[prevIndex];

    this.focus(prevTab);

    return this;
  }

  /**
   * Make next tab/panel active
   * @returns {Object} - A11yTab instance
   */
  next() {
    const { findIndex } = this.constructor;
    const nextIndex = findIndex(this.tabs).next;
    const nextTab = this.tabs[nextIndex];

    this.focus(nextTab);

    return this;
  }

  /**
   * Refocus on givin tab/panel
   * @param {HTMLElement} tab          - Tab element to become active
   * @param {Boolean}     focus = true - Focus on current active tab
   * @returns {Object}                 - A11yTab instance
   */
  focus(tab = null, focus = true) {
    const { isBoolean } = this.constructor;
    const focusTab = focus && isBoolean(focus) ? focus : false;

    if (tab) {
      this.activateTab(tab, focusTab);
      this.activatePanel(tab);
    }

    return this;
  }

  /**
   * Add ARIA attributes to DOM elements
   * @private
   */
  addARIA() {
    this.tabList.setAttribute('role', 'tablist');

    this.tabs.forEach((tab) => {
      const ariaControls = tab.getAttribute('href').slice(1);

      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', false);
      tab.setAttribute('aria-controls', ariaControls);
      tab.setAttribute('tabindex', -1);
    });

    this.tabPanels.forEach((panel, index) => {
      const ariaLabelValue = this.tabs[index].getAttribute('id');

      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-hidden', true);
      panel.setAttribute('aria-labelledby', ariaLabelValue);
    });
  }

  /**
   * Remove ARIA attributes from DOM
   * @private
   */
  removeARIA() {
    this.tabList.removeAttribute('role');

    this.tabs.forEach((tab) => {
      tab.removeAttribute('role');
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('aria-controls');
      tab.removeAttribute('tabindex');
    });

    this.tabPanels.forEach((panel) => {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-hidden');
      panel.removeAttribute('aria-labelledby');
    });
  }

  /**
   * Focus on given tab
   * @private
   * @param {HTMLElement} target       - Tab element to add active attributes on
   * @param {Boolean}     focus = true - Focus on active tab
   */
  activateTab(target, focus = true) {
    this.disableTab();

    const url = document.URL;
    const urlHash = url.substring(url.indexOf('#'));
    const {
      fireEvent,
      isFunction,
      isString,
      isBoolean,
    } = this.constructor;
    const {
      addEvents,
      afterFocusFunction,
      eventAfterFocus,
      hashNavigation,
      tabBlur,
      tabFocus,
    } = this.settings;

    if (tabBlur && isString(tabBlur)) {
      target.classList.remove(tabBlur);
    }

    if (tabFocus && isString(tabFocus)) {
      target.classList.add(tabFocus);
    }

    if (focus && isBoolean(focus)) {
      target.focus();
    }

    target.setAttribute('tabindex', 0);
    target.setAttribute('aria-selected', true);
    this.selected.tab = target;

    if (hashNavigation && isBoolean(hashNavigation)) {
      window.location.hash = target.getAttribute('href');
    }

    if (
      hashNavigation
      && isBoolean(hashNavigation)
      && urlHash === target.getAttribute('id')
    ) {
      target.focus();
    }

    // Create after focus event
    if (
      this.loaded
      && addEvents
      && eventAfterFocus
      && isBoolean(addEvents)
      && isString(eventAfterFocus)
    ) {
      fireEvent(eventAfterFocus);
    }

    // Run afterFocusFunction function
    if (this.loaded && afterFocusFunction && isFunction(afterFocusFunction)) {
      afterFocusFunction();
    }
  }

  /**
   * Show panel based on given tab
   * @private
   * @param {HTMLElement} target - Panel element to add active attributes
   */
  activatePanel(target) {
    this.disablePanel();

    const { isString } = this.constructor;
    const { tabPanelBlur, tabPanelFocus } = this.settings;
    const panel = this.tabPanels.find(item => item.getAttribute('id') === target.getAttribute('aria-controls'));

    if (tabPanelBlur && isString(tabPanelBlur)) {
      panel.classList.remove(tabPanelBlur);
    }

    if (tabPanelFocus && isString(tabPanelFocus)) {
      panel.classList.add(tabPanelFocus);
    }

    panel.setAttribute('aria-hidden', false);
    this.selected.panel = panel;
  }

  /**
   * Remove focus from tabs
   * @private
   */
  disableTab() {
    const {
      fireEvent,
      isFunction,
      isString,
      isBoolean,
    } = this.constructor;
    const {
      addEvents,
      beforeBlurFunction,
      eventBeforeBlur,
      tabFocus,
      tabBlur,
    } = this.settings;

    this.tabs.forEach((tab) => {
      if (tabFocus && isString(tabFocus)) {
        tab.classList.remove(tabFocus);
      }

      if (tabBlur && isString(tabBlur)) {
        tab.classList.add(tabBlur);
      }

      tab.setAttribute('tabindex', -1);
      tab.setAttribute('aria-selected', false);
    });

    // Create before blur event
    if (
      this.loaded
      && addEvents
      && eventBeforeBlur
      && isBoolean(addEvents)
      && isString(eventBeforeBlur)
    ) {
      fireEvent(eventBeforeBlur);
    }

    // Run beforeBlurFunction function
    if (this.loaded && beforeBlurFunction && isFunction(beforeBlurFunction)) {
      beforeBlurFunction();
    }
  }

  /**
   * Remove focus from panels
   * @private
   */
  disablePanel() {
    const { isString } = this.constructor;
    const { tabPanelBlur, tabPanelFocus } = this.settings;

    this.tabPanels.forEach((panel) => {
      if (tabPanelFocus && isString(tabPanelFocus)) {
        panel.classList.remove(tabPanelFocus);
      }

      if (tabPanelBlur && isString(tabPanelBlur)) {
        panel.classList.add(tabPanelBlur);
      }

      panel.setAttribute('aria-hidden', true);
    });
  }

  /**
   * Add events to A11yTab instance
   * @private
   */
  addEvents() {
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', this, false);
      tab.addEventListener('keydown', this, false);
    });
  }

  /**
   * Remove events from A11yTab instance
   * @private
   */
  removeEvents() {
    this.tabs.forEach((tab) => {
      tab.removeEventListener('click', this, false);
      tab.removeEventListener('keydown', this, false);
    });
  }

  /**
   * Handle click events for tabs
   * @private
   * @param {Event} event - Get current target of event
   */
  handleClickEvent(event) {
    const { target } = event;

    event.preventDefault();
    this.focus(target);
  }

  /**
   * Handle Keyboard navigation for tabs
   * @prevent
   * @param {Event} event - Get current target of event
   */
  handleKeydownEvent(event) {
    if (event.metaKey || event.altKey) return;

    switch (event.which) {
      case 37:
      case 38:
        event.preventDefault();
        this.prev();
        break;
      case 39:
      case 40:
        event.preventDefault();
        this.next();
        break;
      default:
        break;
    }
  }

  /**
   * Custom event handler
   * `this` can be passed as the second param to `addEventListener()`
   * for it to work a function named `handleEvent` must be added to object
   * @see
   *   https://medium.com/@photokandy/til-you-can-pass-an-object-instead-of-a-function-to-addeventlistener-7838a3c4ec62
   * @private
   * @param {Event} event - Get current target of event
   */
  handleEvent(event) {
    switch (event.type) {
      case 'click':
        this.handleClickEvent(event);
        break;
      case 'keydown':
        this.handleKeydownEvent(event);
        break;
      default:
        break;
    }
  }

  /**
   * Check if passed item is a function
   * @private
   * @param {Function} func - Item to check
   * @returns {boolean}
   */
  static isFunction(func) {
    return func && {}.toString.call(func) === '[object Function]';
  }

  /**
   * Check if passed item is a string
   * @private
   * @param {String} str - Item to check
   * @returns {boolean}
   */
  static isString(str) {
    return str && {}.toString.call(str) === '[object String]';
  }

  /**
   * Check if passed item is a boolean
   * @private
   * @param {Boolean} bool - Item to check
   * @returns {boolean}
   */
  static isBoolean(bool) {
    return bool && {}.toString.call(bool) === '[object Boolean]';
  }

  /**
   * Take an array of elements and return the prev, next, and current index of an item(s)
   * @private
   * @param  {Array} list - Array of elements
   * @return {Object}     - Object containing current, prev, and next
   */
  static findIndex(list) {
    let current;
    let prev;
    let next;

    list.filter((item, index) => {
      if (item.getAttribute('aria-selected') === 'true') {
        current = index;
        prev = index - 1;
        next = index + 1;
      }

      return true;
    });

    if (prev === -1) {
      prev = list.length - 1;
    }

    if (next === list.length) {
      next = 0;
    }

    return {
      current,
      prev,
      next,
    };
  }

  /**
   * Create custom event for elements
   * @private
   * @param {String} eventName - Name of event to fire
   */
  static fireEvent(eventName) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event);
  }
}
