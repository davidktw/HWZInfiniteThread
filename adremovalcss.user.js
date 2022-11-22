// ==UserScript==
// @name         HWZ Ad Removal CSS
// @namespace    https://forums.hardwarezone.com.sg/ad-removal-css
// @version      0.1
// @description  Remove Ads and whitespace removal via css
// @author       You
// @match        https://forums.hardwarezone.com.sg/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let s = document.createElement('style');
    let csstext = `
.message-signature img {
  max-width: 100px;
  max-height: 100px;
}
div.p-body-content {
  width: 100%;
  padding: 0;
}
div.p-body {
  display: block;
}
div.p-body-inner {
  max-width: 100%;
}
div.message-cell {
  padding: 5px;
}
div.gpt-ad-fpi-container {
  margin: 2px auto;
}
.actionBar-action {
  padding: 0px 2px;
}
.bbCodeBlock {
  padding: 0
}
.structItem-cell {
  padding: 3px 9px;
}
.avatar.avatar--m {
  width: 50px;
  height: 50px;
  font-size: 30px;
}
.actionBar-set.actionBar-set--external .actionBar-action {
  padding: 0px 3px;
}
.message .reactionsBar {
  padding: 4px;
}
.node-body {
  padding: 0;
}
.node-main {
  padding: 5px 12px;
}
.block {
  margin-bottom: 10px;
}
.p-body-header {
  margin-bottom: 10px;
  padding: 10px;
}
.structItemContainer-group--sticky::before,
.structItemContainer-group--sticky::after {
  padding: 2px 10px;
}
.block-row.block-row--separated {
  padding-top: 5px;
  padding-bottom: 5px;
}
.focus-ad {
  display: none;
}
@media (max-width: 650px) {
  .pairs {
    display: inline-block;
  }
  .structItem-cell.structItem-cell--meta .structItem-minor {
    display: inline-block;
    margin: 0 3px;
  }
}
`;
    s.innerText = csstext.replaceAll(/[\r\n]/ig, "");
    document.head.appendChild(s);
})();
