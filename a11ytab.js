'use strict';

// Convert element selection to an array
function _queryToArray(el, ctx = document) {
  return [].slice.call(ctx.querySelectorAll(el));
}

// Find closest parent element based on given element
function _closestEl(el, parentEl) {
  while (el) {
    if (el.matches(parentEl)) break;

    el = el.parentElement;
  }

  return el;
}

// Get current previous, and next index based on selected element
// TODO:
//   1. Fix prevIndex/nextIndex situation
//   2. Abstract if (condition) so function can be reusable
function _findIndex(list) {
  let currentIndex;
  let prevIndex;
  let nextIndex;

  list.forEach((item, i) => {
    if (item.firstElementChild.getAttribute('aria-selected')) {
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

// Component to build tabs
function a11ytab(selector, {
  tabList: tabList = '.a11ytb-list',
  tabListItem: tabListItem = '.a11ytb-listitem',
  tabButton: tabButton = '.a11ytb-button',
  tabButtonFocus: tabButtonFocus = null,
  tabButtonBlur: tabButtonBlur = null,
  tabPanel: tabPanel = '.a11ytb-panel',
  tabPanelFocus: tabPanelFocus = null,
  tabPanelBlur: tabPanelBlur = null,
  focusOnLoad: focusOnLoad = false,
} = {}) {

  // Collect elements
  let tabContainer = selector;
  let listContainer = _queryToArray(tabList, selector);
  let listItem = _queryToArray(tabListItem, selector);
  let tabs = _queryToArray(tabButton, selector);
  let panels = _queryToArray(tabPanel, selector);
  let selected;

  // Find if tab should be focused on inititalization
  // If no tab is defaulted, focus on first tab
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].classList.contains(tabButtonFocus)) {
      selected = tabs[i];
      break;
    }

    selected = tabs[0];
  }

  // Method: Initialize tab component
  function init() {
    _addAlly();
    _disableTab();
    _disablePanel();
    _activateTab(selected, focusOnLoad);
    _activatePanel(selected);
    _addEvents();
  }
  init();

  // Method: Destroy tab component
  function destroy() {
    _removeAlly();
    _removeEvents();
  }

  // Method: Focus on previous tab
  function prev() {
    let prevIndex = _findIndex(listItem).prevIndex;
    let prevTab = listItem[prevIndex].firstElementChild;

    _disableTab();
    _disablePanel();
    _activateTab(prevTab);
    _activatePanel(prevTab);
  }

  // Method: Focus on next tab
  function next() {
    let nextIndex = _findIndex(listItem).nextIndex;
    let nextTab = listItem[nextIndex].firstElementChild;

    _disableTab();
    _disablePanel();
    _activateTab(nextTab);
    _activatePanel(nextTab);
  }

  // Method: Programically focus on a tab
  function focus() {
    tabs.forEach((tab) => {
      if (tab.getAttribute('aria-selected')) {
        _activateTab(tab);
        _activatePanel(tab);
      }
    });
  }

  // Add ARIA and accessibility attributes
  function _addAlly() {
    listContainer.forEach((elm) => {
      elm.setAttribute('role', 'tablist');
    });

    listItem.forEach((elm) => {
      elm.setAttribute('role', 'presentation');
    });

    tabs.forEach((elm) => {
      let ariaControlValue = elm.getAttribute('href').slice(1);

      elm.setAttribute('role', 'tab');
      elm.setAttribute('aria-controls', ariaControlValue);
    });

    panels.forEach((elm, i) => {
      let ariaLabelValue = tabs[i].getAttribute('id');

      elm.setAttribute('role', 'tabpanel');
      elm.setAttribute('aria-labelledby', ariaLabelValue);
    });
  }

  // Remove ARIA and accessibility attributes
  function _removeAlly() {
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

  // Update attributes on buttons and add focus
  function _activateTab(target, focus = true) {
    target.setAttribute('tabindex', 0);
    target.setAttribute('aria-selected', 'true');

    if (tabButtonBlur) target.classList.remove(tabButtonBlur);
    if (tabButtonFocus) target.classList.add(tabButtonFocus);

    if (focus) {
      target.focus();
    }
  }

  // Update attributes on buttons and remove focus
  function _disableTab() {
    tabs.forEach((tab) => {
      tab.setAttribute('tabindex', -1);
      tab.removeAttribute('aria-selected');

      if (tabButtonFocus) tab.classList.remove(tabButtonFocus);
      if (tabButtonBlur) tab.classList.add(tabButtonBlur);
    });
  }

  function _activatePanel(target) {
    let panel = document.getElementById(target.getAttribute('aria-controls'));

    panel.removeAttribute('aria-hidden');

    if (tabPanelBlur) panel.classList.remove(tabPanelBlur);
    if (tabPanelFocus) panel.classList.add(tabPanelFocus);
  }

  function _disablePanel() {
    panels.forEach((panel) => {
      panel.setAttribute('aria-hidden', 'true');

      if (tabPanelFocus) panel.classList.remove(tabPanelFocus);
      if (tabPanelBlur) panel.classList.add(tabPanelBlur);
    });
  }

  // Click event callback
  function _tabClick(event) {
    event.preventDefault();

    let target = event.currentTarget;

    _disableTab();
    _disablePanel();
    _activateTab(target);
    _activatePanel(target);
  }

  // Keyboard navigation callback
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

  // Add events to component
  function _addEvents() {
    tabs.forEach((tab) => {
      tab.addEventListener('click', _tabClick, false);
      tab.addEventListener('keydown', _tabKeydown, false);
    });
  }

  // Remove component events
  function _removeEvents() {
    tabs.forEach((tab) => {
      tab.removeEventListener('click', _tabClick, false);
      tab.removeEventListener('keydown', _tabKeydown, false);
    });
  }

  // Expose public methods
  return {
    init,
    destroy,
    next,
    prev,
    focus,
  }
}

export { a11ytab };
