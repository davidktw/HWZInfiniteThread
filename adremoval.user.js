// ==UserScript==
// @name         HWZ Ad Removal
// @namespace    https://forums.hardwarezone.com.sg/ad-removal
// @version      0.4
// @description  Remove Ads and whitespace removal
// @author       You
// @match        https://forums.hardwarezone.com.sg/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

var n_runs = 0;
var n_inserted = 0
var ff;

function f($) {
    if (typeof jQuery == "function") {

        if (n_inserted == 0) {
            n_inserted = 1;
            $.expr[':'].regex = function(elem, index, match) {
                let matchParams = match[3].split(','),
                    validLabels = /^(data|css):/,
                    attr = {
                        method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
                        property: matchParams.shift().replace(validLabels,'')
                    },
                    regexFlags = 'ig',
                    regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
                return regex.test($(elem)[attr.method](attr.property));
            }
        }

        document.body.removeClass('gotoverlay');
        document.body.removeAttribute('style');
        let ids = [
            'hwz_ad_notice_cont', 'hwz_dynamic_widget', 'hwz-facebook-page-like', 'sponsored-links',
            'cookie-notice', 'right-ads', 'ads-leaderboard', 'ads-bottom-leaderboard', 'div-gpt-ad-native',
            'gwd-ad'
        ];

        ids.forEach(function(item,idx) {
            try {
                let i = document.getElementById(item);
                if (i) i.remove();
            } catch(err) { console.log(err) }
        });

        $("div.hwz-trending-block").parent().remove();
        $("div.shareButtons").parent().remove();
        $("div:regex(class, ^OUTBRAIN$),\
          div:regex(class, ^hwz-ad-.*),\
          div:regex(id, ^innity_adslot_.*),\
          div.widget_highlight_forum,\
          #widget_highlight_forum_small,\
          div.p-body-sidebar,\
          #sponsored-links-alt,\
          h2.block-header,\
          div.popular-body-inner").remove();

        Array.from(document.querySelectorAll("section.message-user")).each(i=>i.style.position='relative');

        setTimeout(()=>{
            $("img").each(function (i,oo) {oo.setAttribute('loading','lazy')});
            document.querySelector("input[value=date]")?.click();
        },0);
    }

    n_runs++;
    console.debug(n_runs);
    if (n_runs < 10) {
        setTimeout(ff, parseInt(100 + 50 * n_runs));
    }
}

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
  padding: 1px;
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
.node-main {
  padding: 0;
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
`;
    s.innerText = csstext.replaceAll(/[\r\n]/ig, "");
    document.head.appendChild(s);

    s = document.createElement('script');
    s.setAttribute('src','//code.jquery.com/jquery-3.6.0.slim.min.js');
    document.head.appendChild(s);
    s = document.createElement('script');
    s.innerText = "jQuery.noConflict()";
    document.head.appendChild(s);

    s = document.createElement('script');
    s.setAttribute('src','//cdnjs.cloudflare.com/ajax/libs/loading-attribute-polyfill/1.5.4/loading-attribute-polyfill.min.js');
    document.head.appendChild(s);

    ff = f.bind(null, jQuery);
    setTimeout(ff, 0);
})();
