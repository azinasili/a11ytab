# A11ytab
A fully accessible and customizable tabs front-end component. Apply it a single tab or all of your tabs the page. A11ytab allows you to use whatever markup you like, you can apply your own classes and everything will just work.

## Install

A11ytab is available to install with `npm` and `bower`.

**NPM**

```bash
npm install a11ytab --save
```

**Bower**

```bash
bower install a11tab --save
```

The component will then be available to `import`.

```javascript
import a11ytab from 'a11ytab';
```

## Usage

A11ytab does require a small amount of markup to function, a containing element, and a list of anchors linked to content containers.

```html
<div class="a11ytab">
  <ul class="a11ytab-list">
    <li class="a11ytab-listitem">
      <a class="a11ytab-button" id="tab1" href="#panel1">...</a>
    </li>
    <li class="a11ytab-listitem">
      <a class="a11ytab-button" id="tab2" href="#panel2">...</a>
    </li>
    <li class="a11ytab-listitem">
      <a class="a11ytab-button" id="tab3" href="#panel3">...</a>
    </li>
  </ul>
  <div class="a11ytab-panel" id="panel1">
    ...
  </div>
  <div class="a11ytab-panel" id="panel2">
    ...
  </div>
  <div class="a11ytab-panel" id="panel3">
    ...
  </div>
</div>
```
**Note:** *A11ytab only needs a containing element, a list structure for links, and content panels within containing element. Elements to use, source ordering, and other markup is completely customizable.*

Assign the function invocation to a variable to initialise the tabs.

```js
// Select element to initalise a11ytab on
const tabsEl = document.querySelector('.a11ytab');

// Apply a11ytab to selected element
const tabs = new a11ytab(tabsEl);
```

A11ytab component will handle all ARIA roles/attributes and focus management, transforming the original HTML into the following:

```html
<div class="a11ytab">
  <ul class="a11ytab-list" role="tablist">
    <li class="a11ytab-listitem" role="presentation">
      <a class="a11ytab-button" id="tab1" href="#panel1" role="tab" aria-controls="panel1" tabindex="0" aria-selected="true">...</a>
    </li>
    <li class="a11ytab-listitem" role="presentation">
      <a class="a11ytab-button" id="tab2" href="#panel2" role="tab" aria-controls="panel2" tabindex="-1">...</a>
    </li>
    <li class="a11ytab-listitem" role="presentation">
      <a class="a11ytab-button" id="tab3" href="#panel3" role="tab" aria-controls="panel3" tabindex="-1">...</a>
    </li>
  </ul>
  <section class="a11ytab-panel" id="panel1" role="tabpanel" aria-labelledby="tab1">
    ...
  </section>
  <section class="a11ytab-panel" id="panel2" role="tabpanel" aria-labelledby="tab2" aria-hidden="true">
    ...
  </section>
  <section class="a11ytab-panel" id="panel3" role="tabpanel" aria-labelledby="tab3" aria-hidden="true">
    ...
  </section>
</div>
```

### Methods

```javascript
// Remove all bindings and attributes when no longer needed
tabs.destroy();

// Re-initialise as needed
tabs.init();

// Move focus to previous tab in list
tabs.prev();

// Move focus to next tab in list
tabs.next();

// Refocus back onto element
tabs.focus();
```

### Options

```javascript
const tabs = new a11ytab(tabsEl, {
  // String - List selector to transform into tablist
  tabList: '.a11ytab-list',

  // String - List item selector
  tabListItem: '.a11ytab-listitem',

  // String - Anchor tab element
  tabButton: '.a11ytab-button',

  // String - Class to apply to active tab buttons
  tabButtonFocus: 'a11ytab-button--is-active',

  // String - Class to apply to non-active tab buttons
  tabButtonBlur: 'a11ytab-button--is-disabled',

  // String - Containers to hold tab content, toggled via tabs
  tabPanel: '.a11ytab-panel',

  // String - Class to apply to active tab panels
  tabPanelFocus: 'a11ytab-panel--is-active',

  // String - Class to apply to non-active tab panels
  tabPanelBlur: 'a11ytab-panel--is-disabled',

  // Boolean - Should a11ytab be focused on page load
  focusOnLoad: false,
});
```
