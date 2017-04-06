# A11yTab
A fully accessible and customizable tabs front-end component. Apply it a single tab or all of your tabs the page. A11yTab allows you to use whatever markup you like, you can apply your own classes and everything will just work.

[DEMO](https://codepen.io/azinasili/pen/MKGwgX?editors=0100)

## Installation
With [NPM](https://www.npmjs.com/package/a11ytab):

```bash
npm install a11ytab --save
```

With [Bower](https://bower.io/):

```bash
bower install a11ytab --save
```

Or include A11yTab directly:

```html
<script src="/path/to/a11ytab.js"></script>
```

A11yTab is written using [ES2015 modules](http://2ality.com/2014/09/es6-modules-final.html). To import A11ytab into an ES2015 application:

```javascript
import A11yTab from 'a11ytab';
```


## Usage
A11yTab does require a small amount of markup to function, a containing element, and a list of anchors linked to content containers.

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
**Note:** *A11yTab only needs a list structure for links and content panels all within a containing element. Elements to use, source ordering, and other markup is completely customizable.*

**Note:** *If a specific tab needs to be "activated" on page load, add a class to that tab and pass it to `tabButtonFocus` option.*

Select element to initalise A11yTab on.

```javascript
const tabsEl = document.querySelector('.a11ytab');
```

Apply A11yTab to selected element (all options with default values are shown).

```javascript
const tabs = new A11yTab(tabsEl, {
  tabList: '.a11ytab-list',
  tabListItem: '.a11ytab-listitem',
  tabButton: '.a11ytab-button',
  tabButtonFocus: null,
  tabButtonBlur: null,
  tabPanel: '.a11ytab-panel',
  tabPanelFocus: null,
  tabPanelBlur: null,
  focusOnLoad: false,
});
```

A11yTab will handle all ARIA roles/attributes and focus management, transforming the original HTML into the following:

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
  <div class="a11ytab-panel" id="panel1" role="tabpanel" aria-labelledby="tab1">
    ...
  </div>
  <div class="a11ytab-panel" id="panel2" role="tabpanel" aria-labelledby="tab2" aria-hidden="true">
    ...
  </div>
  <div class="a11ytab-panel" id="panel3" role="tabpanel" aria-labelledby="tab3" aria-hidden="true">
    ...
  </div>
</div>
```


### Configuration options
#### tabList
**Type:** `String` **Default:** `.a11ytab-list`

**Usage:** List element selector.

#### tabListItem
**Type:** `String` **Default:** `.a11ytab-listitem`

**Usage:** List item element selector.

#### tabButton
**Type:** `String` **Default:** `.a11ytab-button`

**Usage:** Anchor element of tab.

#### tabButtonFocus
**Type:** `String` **Default:** `null`

**Usage:** Class to add to anchor when tab is selector.

#### tabButtonBlur
**Type:** `String` **Default:** `null`

**Usage:** Class to add to anchor when tab is not selector.

#### tabPanel
**Type:** `String` **Default:** `.a11ytab-panel`

**Usage:** Container element of panel.

#### tabPanelFocus
**Type:** `String` **Default:** `null`

**Usage:** Class to add to anchor when panel is selector.

#### tabPanelBlur
**Type:** `String` **Default:** `null`

**Usage:** Class to add to anchor when panel is not selector.

#### focusOnLoad
**Type:** `Boolean` **Default:** `false`

**Usage:** Wheather A11ytab should be focused on page load.


### Methods
#### destroy()
**Usage:** Kills the instance of A11yTab, removes all event listerners and reverts `HTML` back to intial state.

#### init()
**Usage:** Creates new instance of A11yTab, adds event listeners, and adds ARIA attributes to passed element.

#### prev()
**Usage:** Focus tab on previous element in list.

#### next()
**Usage:** Focus tab on next element in list.

#### focus()
**Usage:** Focus on currently active tab.


## License
MIT License
