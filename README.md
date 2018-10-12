# A11yTab
A fully accessible and customizable front-end component for tabs. A11yTab has minimal markup requirements so it can be used however your project demands.

[DEMO](https://codepen.io/azinasili/pen/MKGwgX?editors=0100)

## Installation
A11yTab is available at the:

| Source |  |
|:-------|:-|
| NPM    | `npm install a11ytab --save` |
| Yarn   | `yarn add a11ytab` |
| unpkg  | [`https://unpkg.com/a11ytab`](https://unpkg.com/a11ytab) |


## Usage
A11yTab does require minimal amount of markup to function:

```html
<!--
  A containing element is required. This is used when initializing A11yTab
-->
<div id="a11ytab-list">
  <!--
    - A11yTab requires anchors to be used for accessibility reasons
    - Each link must have a unique id
    - The `href` attribute must point to the id of it's corresponding panel
    - Each link must have the `data-a11ytab-tab` attribute
  -->
  <a id="tab1" href="#panel1" data-a11ytab-tab>...</a>
  <a id="tab2" href="#panel2" data-a11ytab-tab>...</a>
  <a id="tab3" href="#panel3" data-a11ytab-tab>...</a>
</div>
<!--
  Each tab panel must have an unique id
-->
<div id="panel1">...</div>
<div id="panel2">...</div>
<div id="panel3">...</div>
```

```javascript
// Import A11yTab if utilizing JS modules
import A11yTab from 'a11ytab';

// Create a new instance of A11yTab
// See all the A11yTab options below
const tabs = new A11yTab({
  selector: document.querySelector('#a11ytab-list'),
});

// Initialize your new tabs
tabs.init();
```

A11yTab will handle all ARIA roles/attributes, focus management, and events, which transform the original HTML into the following:

```html
<div id="a11ytab-list" role="tablist">
  <a href="#panel1" id="tab1" data-a11ytab-tab role="tab" aria-controls="panel1" aria-selected="true" tabindex="0">...</a>
  <a href="#panel2" id="tab2" data-a11ytab-tab role="tab" aria-controls="panel2" aria-selected="false" tabindex="-1">...</a>
  <a href="#panel3" id="tab3" data-a11ytab-tab role="tab" aria-controls="panel3" aria-selected="false" tabindex="-1">...</a>
</div>
<div id="panel1" role="tabpanel" aria-labelledby="tab1" aria-hidden="false">...</div>
<div id="panel2" role="tabpanel" aria-labelledby="tab2" aria-hidden="true">...</div>
<div id="panel3" role="tabpanel" aria-labelledby="tab3" aria-hidden="true">...</div>
```

## A11yTab API

### Options
| Property            | Type        | Default              | Description |
|:------------------- |:----------- |:-------------------- |:----------- |
| selector            | HTMLElement | `null`               | Containing element for tabs |
| tabFocus            | String      | `null`               | Class to add to tabs when focused |
| tabBlur             | String      | `null`               | Class to add to tabs when not focused |
| tabPanelFocus       | String      | `null`               | Class to add to panel when active |
| tabPanelBlur        | String      | `null`               | Class to add to panel when not active |
| focusOnLoad         | Boolean     | `false`              | Move users focus to tab component on page load |
| afterFocusFunction  | Function    | `null`               | Function to run after focusing on tab |
| beforeFocusFunction | Function    | `null`               | Function to run before focusing on tab |
| addEvents           | Boolean     | `false`              | Add custom A11yTab events |
| eventAfterFocus     | String      | `a11ytab:afterFocus` | Name of custom event to fire after focusing on tab |
| eventBeforeBlur     | String      | `a11ytab:beforeBlur` | Name of custom event to fire before leaving focus on tab |
| hashNavigation      | Boolean     | `false`              | Append focused tab id to URL |
| tabToFocus          | HTMLElement | `null`               | Tab element to initially make active |

### Methods
| Name    | Description |
|:------- |:----------- |
| init    | Initializes instance of A11yTab |
| destroy | Kills instance of A11yTab |
| prev    | Focus on previously focusable tab |
| next    | Focus on following focusable tab |
| focus   | Focus on given tab |

## License
MIT License
