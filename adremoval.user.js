// ==UserScript==
// @name         HWZ Ad Removal
// @namespace    https://forums.hardwarezone.com.sg/ad-removal
// @version      0.22
// @description  Remove Ads and whitespace removal
// @author       You
// @match        https://forums.hardwarezone.com.sg/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

var n_runs = 0;
var n_inserted = 0
var ff;
var handler = null;

var touchstartX = 0
var touchendX = 0
var touchstartY = 0
var touchendY = 0
var scrollstartY = 0
var scrollendY = 0
var timestart = new Date().getTime();
var hammertime;
var searchsettled = false;


function handleGesture() {
    let minXdist = 120;
    let maxYdist = 40;

    // skip gesture if the swipe is not sufficiently linearly horizontal
    //alert('swiped vert! ' + (Math.abs(touchstartY - touchendY) + Math.abs(scrollstartY - scrollendY)) + 'px');
    if ((Math.abs(touchstartY - touchendY) + Math.abs(scrollstartY - scrollendY)) > maxYdist) {
        return;
    }

    if ((touchendX < touchstartX) && (touchstartX - touchendX) > minXdist) {
        //alert('swiped left! ' + (touchstartX - touchendX) + 'px');
        history.forward();
    }
    if ((touchendX > touchstartX) && (touchendX - touchstartX) > minXdist) {
        //alert('swiped right! ' + (touchendX - touchstartX) + 'px');
        history.back();
    }
}

function f($) {
    console.debug("Running FF");
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

            /* OWN BREW OF DETECTING GESTURE
            const slider = $(".focus-width")[0];
            slider.addEventListener('touchstart', e => {
                touchstartX = e.changedTouches[0].screenX;
                touchstartY = e.changedTouches[0].screenY;
                scrollstartY = window.scrollY;
            })
            slider.addEventListener('touchend', e => {
                touchendX = e.changedTouches[0].screenX;
                touchendY = e.changedTouches[0].screenY;
                scrollendY = window.scrollY;
                handleGesture()
            })
            */
        }

        document.body.removeClass('gotoverlay');
        document.body.removeAttribute('style');

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
          div.popular-body-inner,\
          .GoogleActiveViewInnerContainer,\
          .focus-ad,\
          #hwzForumRelated,\
          div:regex(id, ^gpt-ad-.*-container$),\
          div:regex(class, ^gpt-ad-.*-container$),\
          div:regex(id, ^google_ads_iframe_.*),\
          #sphm_overlay,\
          #hwz_ad_notice_cont,\
          #hwz_dynamic_widget,\
          #hwz-facebook-page-like,\
          #sponsored-links,\
          #cookie-notice,\
          #right-ads,\
          #ads-leaderboard,\
          #ads-bottom-leaderboard,\
          #div-gpt-ad-native,\
          #gwd-ad,\
          script:regex(src, .*s\.skimresources\.com.*),\
          script:regex(src, .*adtag\.sphdigital\.com.*),\
          script:regex(src, .*secure\.quantserve\.com.*),\
          script:regex(src, .*www\.googletagmanager\.com.*),\
          script:regex(src, .*www\.googletagservices\.com.*),\
          script:regex(src, .*sb\.scorecardresearch\.com.*)").remove();

        if (!searchsettled) {
            Array.from(document.querySelectorAll("section.message-user")).each(i=>i.style.position='relative');
            Array.from(document.querySelectorAll('a[href="/search/"]')).each(i=>{
                let ni = i.cloneNode(true);
                i.parentNode.replaceChild(ni, i);
                ni.addEventListener('click', (event)=>{
                    event.preventDefault();
                    event.stopPropagation();
                    document.location.href = '/search/?type=post';
                });
                searchsettled = true;
            });
        }

        Array.from(document.querySelectorAll('li.notice img')).each(i=>{
            i.style.maxHeight = '50px';
        });

        //queueMicrotask(()=>{
            $("img").each(function (i,oo) {oo.setAttribute('loading','lazy')});
            document.querySelector("input[value=date]")?.click();
        //});
    }
}

void function() {
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
`;
    s.innerText = csstext.replaceAll(/[\r\n]/ig, "");
    document.head.appendChild(s);

    s = document.createElement('script');
    s.setAttribute('src','//cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.slim.min.js');
    //s.setAttribute('integrity', 'sha512-yBpuflZmP5lwMzZ03hiCLzA94N0K2vgBtJgqQ2E1meJzmIBfjbb7k4Y23k2i2c/rIeSUGc7jojyIY5waK3ZxCQ==');
    document.head.appendChild(s);
    s = document.createElement('script');
    s.innerText = "jQuery.noConflict()";
    document.head.appendChild(s);

    s = document.createElement('script');
    s.setAttribute('src','//cdnjs.cloudflare.com/ajax/libs/loading-attribute-polyfill/1.5.4/loading-attribute-polyfill.min.js');
    document.head.appendChild(s);

    s = document.createElement('script');
    s.setAttribute('src','//cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js');
    //s.setAttribute('integrity', 'sha512-UXumZrZNiOwnTcZSHLOfcTs0aos2MzBWHXOHOuB0J/R44QB0dwY5JgfbvljXcklVf65Gc4El6RjZ+lnwd2az2g==');
    s.onload = function() {
        hammertime = new Hammer(document.body);
        hammertime.on('swipe', function(ev) {
            switch (ev.direction) {
                case Hammer.DIRECTION_LEFT:
                    history.forward();
                    break;
                case Hammer.DIRECTION_RIGHT:
                    history.back();
                    break;
            }
            console.log(ev.direction);
        });
    };
    document.body.appendChild(s);

    if (jQuery) {
        ff = f.bind(null, jQuery);
    }

    // create a new instance of `MutationObserver` named `observer`,
    // passing it a callback function
    const observer = new MutationObserver(function(mutationList) {
        console.debug('callback that runs when observer is triggered ');

        let addednodes = 0;
        for (const rec of mutationList)
            addednodes += rec.addedNodes.length;

        if (addednodes > 0) {
            //if (handler != null)
            //    clearTimeout(handler);
            //handler = setTimeout(ff, 10);
            queueMicrotask(ff);
        }
        else {
            console.debug("Not calling FF");
        }
        if (new Date().getTime() - timestart > 4 * 1000)
            observer.disconnect();

    });

    // call `observe()` on that MutationObserver instance,
    // passing it the element to observe, and the options object
    observer.observe(document.body, {subtree: true, childList: true});
    queueMicrotask(ff);
}();

/*
window.addEventListener('load', (event) => {
  let search = document.querySelector("input[type=search][class=input]");
  let mysearchlist = document.createElement("datalist");
  mysearchlist.id = 'mysearchlist';
  ['davidktw', 'laybit',
   'programming', 'programmers', 'programmer',
   'comp sci', 'computer science', 'computing',
   'java', 'javascript', 'perl', 'php',
   'database', 'sql',
   'cloud', 'aws', 'azure', 'gcp' ].sort().forEach((v)=> {
    let myopt = document.createElement('option');
    myopt.value = v;
    mysearchlist.appendChild(myopt);
  });
  document.body.appendChild(mysearchlist);
  search?.setAttribute('list', 'mysearchlist');
  console.log('DOM fully loaded and parsed', search);
});
*/
