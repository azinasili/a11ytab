/**
 * Create a new A11yTab instance.
 *
 * @class  A11yTab
 * @param  {HTMLElement} selector - Element to initialise A11yTab
 * @param  {Object} options       - Options to customize A11yTab instance
 * @return {Object}               - Public init(), destroy(), prev(), next(), and focus() methods
 */
function A11yTab(selector, options) {

  /**
   * Default options used in A11yTab.
   */
  const defaults = {
    tabList: '.a11ytab-list',
    tabListItem: '.a11ytab-listitem',
    tabButton: '.a11ytab-button',
    tabButtonFocus: null,
    tabButtonBlur: null,
    tabPanel: '.a11ytab-panel',
    tabPanelFocus: null,
    tabPanelBlur: null,
    focusOnLoad: false,
  }

  /**
   * Combined defaults and user options
   */
  let settings;

  /**
   * If options object passed to A11yTab
   * Combine options with defaults.
   */
  if (options && typeof options == 'object') {
    // settings = _extendDefaults(defaults, options);
    settings = {...defaults, ...options};
  } else {
    settings = {...defaults};
  }

  /**
   * Collect elements
   */
  let selected;
  let tabContainer = selector;
  let listContainer = _queryToArray(settings.tabList, tabContainer);
  let listItem = _queryToArray(settings.tabListItem, tabContainer);
  let tabs = _queryToArray(settings.tabButton, tabContainer);
  let panels = _queryToArray(settings.tabPanel, tabContainer);
  let buttonFocus = settings.tabButtonFocus;
  let buttonBlur = settings.tabButtonBlur;
  let panelFocus = settings.tabPanelFocus;
  let panelBlur = settings.tabPanelBlur;
  let focusOnLoad = settings.focusOnLoad;

  /**
   * Find if tab should be focused on inititalization
   * If no tab is defaulted, focus on first tab.
   */
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].classList.contains(buttonFocus)) {
      selected = tabs[i];
      break;
    }

    selected = tabs[0];
  }

  /**
   * Initialize A11yTab.
   *
   * @method
   */
  function init() {
    _addARIA();
    _disableTab();
    _disablePanel();
    _activateTab(selected, focusOnLoad);
    _activatePanel(selected);
    _addEvents();
  }
  init();

  /**
   * Remove all added ARIA attributes and events.
   *
   * @method
   */
  function destroy() {
    _removeARIA();
    _removeEvents();
  }

  /**
   * Make previous tab/panel in list active.
   *
   * @method
   */
  function prev() {
    let prevIndex = _findIndex(listItem).prevIndex;
    let prevTab = listItem[prevIndex].firstElementChild;

    _disableTab();
    _disablePanel();
    _activateTab(prevTab);
    _activatePanel(prevTab);
  }

  /**
   * Make next tab/panel in list active.
   *
   * @method
   */
  function next() {
    let nextIndex = _findIndex(listItem).nextIndex;
    let nextTab = listItem[nextIndex].firstElementChild;

    _disableTab();
    _disablePanel();
    _activateTab(nextTab);
    _activatePanel(nextTab);
  }

  /**
   * Refocus on active tab/panel.
   *
   * @method
   */
  function focus() {
    tabs.forEach((tab) => {
      if (tab.getAttribute('aria-selected') === 'true') {
        _activateTab(tab);
        _activatePanel(tab);
      }
    });
  }

  /**
   * Convert a NodeList selection into an array.
   *
   * Take a NodeList and convert it to an array
   * to expose useful array methods and properties.
   *
   * @param  {HTMLElement} el             - NodeList to convert to array
   * @param  {HTMLElement} ctx = document - Context to query for element
   * @return {Array}                      - Array of nodes
   */
  function _queryToArray(el, ctx = document) {
    return [].slice.call(ctx.querySelectorAll(el));
  }

  /**
   * Get the closest element of a given element.
   *
   * Take an element (the first param), and traverse the DOM upward
   * from it until it finds the given element (second parameter).
   *
   * @param  {HTMLElement} el       - The element to start from
   * @param  {HTMLElement} parentEl - The class name
   * @return {HTMLElement}          - The closest element
   */
  function _closestEl(el, parentEl) {
    while (el) {
      if (el.matches(parentEl)) break;

      el = el.parentElement;
    }

    return el;
  }

  /**
   * Get current previous, and next index based on selected element.
   *
   * Take an array of elements and return the index of an item(s).
   *
   * @todo   Fix prevIndex/nextIndex situation
   * @todo   Abstract if statement so function can be reusable
   *
   * @param  {Array} list - Array of elements
   * @return {Object}     - Object containing currentIndex, prevIndex, and nextIndex
   */
  function _findIndex(list) {
    let currentIndex;
    let prevIndex;
    let nextIndex;

    list.forEach((item, i) => {
      if (item.firstElementChild.getAttribute('aria-selected') === 'true') {
        currentIndex = i;
        prevIndex = --i;
        nextIndex = ++currentIndex;

        if (prevIndex === -1) {
          prevIndex = list.length - 1;
        }

        if (nextIndex === list.length) {
          nextIndex = 0;
        }
      }
    });

    return {
      currentIndex,
      prevIndex,
      nextIndex,
    }
  }

  /**
   * Add ARIA and accessibility attributes.
   *
   * @func
   */
  function _addARIA() {
    listContainer.forEach((container) => {
      container.setAttribute('role', 'tablist');
    });

    listItem.forEach((item) => {
      item.setAttribute('role', 'presentation');
    });

    tabs.forEach((tab) => {
      let ariaControlValue = tab.getAttribute('href').slice(1);

      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('aria-controls', ariaControlValue);
    });

    panels.forEach((panel, i) => {
      let ariaLabelValue = tabs[i].getAttribute('id');

      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('aria-labelledby', ariaLabelValue);
    });
  }

  /**
   * Remove ARIA and accessibility attributes.
   *
   * @func
   */
  function _removeARIA() {
    listContainer.forEach((container) => {
      container.removeAttribute('role');
    });

    listItem.forEach((item) => {
      item.removeAttribute('role');
    });

    tabs.forEach((tab) => {
      tab.removeAttribute('role');
      tab.removeAttribute('aria-controls');
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('tabindex');
    });

    panels.forEach((panel) => {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-hidden');
      panel.removeAttribute('aria-labelledby');
    });
  }

  /**
   * Update attributes on buttons and add focus.
   *
   * @func
   * @param {HTMLElement} target   - Tab element to add active attributes on
   * @param {Boolean} focus = true - Focus on active tab
   */
  function _activateTab(target, focus = true) {
    if (buttonBlur) target.classList.remove(buttonBlur);
    if (buttonFocus) target.classList.add(buttonFocus);
    if (focus) target.focus();

    target.setAttribute('tabindex', 0);
    target.setAttribute('aria-selected', 'true');
  }

  /**
   * Update attributes on buttons and remove focus.
   *
   * @func
   */
  function _disableTab() {
    tabs.forEach((tab) => {
      if (buttonFocus) tab.classList.remove(buttonFocus);
      if (buttonBlur) tab.classList.add(buttonBlur);

      tab.setAttribute('tabindex', -1);
      tab.setAttribute('aria-selected', 'false');
    });
  }

  /**
   * Update attributes on panels and add focus.
   *
   * @func
   * @param {HTMLElement} target - Panel element to add active attributes
   */
  function _activatePanel(target) {
    let panel = document.getElementById(target.getAttribute('aria-controls'));

    if (panelBlur) panel.classList.remove(panelBlur);
    if (panelFocus) panel.classList.add(panelFocus);

    panel.setAttribute('aria-hidden', 'false');
  }

  /**
   * Update attributes on panels and remove focus.
   *
   * @func
   */
  function _disablePanel() {
    panels.forEach((panel) => {
      if (panelFocus) panel.classList.remove(panelFocus);
      if (panelBlur) panel.classList.add(panelBlur);

      panel.setAttribute('aria-hidden', 'true');
    });
  }

  /**
   * Click event callback.
   *
   * @func
   * @param {Event} event - Get current target of event
   */
  function _tabClick(event) {
    let target = event.currentTarget;

    event.preventDefault();
    _disableTab();
    _disablePanel();
    _activateTab(target);
    _activatePanel(target);
  }

  /**
   * Keyboard navigation callback.
   *
   * @func
   * @param {Event} event - Get current target of event
   */
  function _tabKeydown(event) {
    if (event.metaKey || event.altKey) return;

    switch(event.keyCode) {
      case 37:
      case 38:
        event.preventDefault();
        prev();
        break;
      case 39:
      case 40:
        event.preventDefault();
        next();
        break;
      default:
        break;
    }
  }

  /**
   * Add events to A11yTab instance.
   *
   * @func
   */
  function _addEvents() {
    tabs.forEach((tab) => {
      tab.addEventListener('click', _tabClick, false);
      tab.addEventListener('keydown', _tabKeydown, false);
    });
  }

  /**
   * Remove events to A11yTab instance.
   *
   * @func
   */
  function _removeEvents() {
    tabs.forEach((tab) => {
      tab.removeEventListener('click', _tabClick, false);
      tab.removeEventListener('keydown', _tabKeydown, false);
    });
  }

  /**
   * Expose A11yTab public methods.
   */
  return {
    init,
    destroy,
    next,
    prev,
    focus,
  }
}

/**
 * Export A11yTab component.
 */
export default A11yTab;
