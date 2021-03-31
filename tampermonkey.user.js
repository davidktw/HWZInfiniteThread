// ==UserScript==
// @name         HWZ Infinite Thread
// @namespace    https://forums.hardwarezone.com.sg/infinite/scrolling
// @version      0.2
// @description  Infinite Thread implementation
// @author       davidktw
// @match        https://forums.hardwarezone.com.sg/threads/*
// @match        https://forums.hardwarezone.com.sg/forums/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const forumsregex  = /\/forums\//;
    const threadsregex = /\/threads\//;

    // get current page
    const url       = window.location.href;
    const pageregex = /\/page-(\d+)/;
    let suspend     = false;
    let currentpage = 1;
    let urlprefix;
    let pagematch;
    if (pagematch = pageregex.exec(url)) {
        currentpage = parseInt(pagematch[1]);
        urlprefix   = url.replace(pageregex, '');
    }
    else
        urlprefix   = url;

    // add in end of displayed articles detector
    const infinite_div  = document.createElement("div");
    infinite_div.id   = "infinite";
    const [ after_div ] = document.querySelectorAll("div.block-outer--after");
    after_div.parentElement.insertBefore(infinite_div, after_div);

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    }
    const observer = new IntersectionObserver(async (entries, myobserver) => {

        if (suspend) return;
        suspend = true;

        const newpageurl = urlprefix + 'page-' + (currentpage + 1);
        const newpage = await fetch(newpageurl, { redirect: 'manual' });

        if (newpage.ok) {
            const newpagetext                     = await newpage.text();
            const parser                          = new DOMParser();
            const newpagedoc                      = parser.parseFromString(newpagetext, 'text/html');

            let currpage_articles_container;
            let newpage_articles_container;
            if (url.match(threadsregex)) {
                [ currpage_articles_container ] = document.querySelectorAll("div.block-body.js-replyNewMessageContainer");
                [ newpage_articles_container ]  = newpagedoc.querySelectorAll("div.block-body.js-replyNewMessageContainer");
            }
            else if (url.match(forumsregex)) {
                [ currpage_articles_container ] = document.querySelectorAll("div.structItemContainer-group.js-threadList");
                [ newpage_articles_container ]  = newpagedoc.querySelectorAll("div.structItemContainer-group.js-threadList");
            }

            Array.from(newpage_articles_container.children).forEach(n => currpage_articles_container.appendChild(n));
            currentpage++;
        }
        else if (newpage.status == 0) {
            //console.log("reach end of thread");
            entries.forEach(t => myobserver.unobserve(t.target));
        }

        suspend = false;

    }, options);
    observer.observe(document.querySelector('#infinite'));
})();
