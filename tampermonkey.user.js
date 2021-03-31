// ==UserScript==
// @name         HWZ Infinite Thread
// @namespace    https://forums.hardwarezone.com.sg/infinite/scrolling
// @version      0.3
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
    const pageregex = /page-(\d+)/;
    let currentpage = 1;
    let urlprefix;
    let pagematch;
    if (pagematch = pageregex.exec(url)) {
        currentpage = parseInt(pagematch[1]);
        urlprefix   = url.replace(pageregex, '');
    }
    else
        urlprefix   = url;

    // global attribute
    document.documentElement.setAttribute("data-infinitescrolling", true);

    // add in end of displayed articles detector
    const infinite_div  = document.createElement("div");
    infinite_div.id   = "infinite";
    const [ after_div ] = document.querySelectorAll("div.block-outer--after");
    after_div.parentElement.insertBefore(infinite_div, after_div);

    if (url.match(threadsregex)) {
        // buttons to resume infinite scrolling
        const resume_parents = document.querySelectorAll("ul.pageNav-main");
        resume_parents.forEach(p => {
            const resume_div  = document.createElement("li");
            resume_div.innerHTML = "<a href='javascript:void(0)'>Resume Infinite Scroll</a>";
            resume_div.classList.add("pageNav-page");
            p.insertBefore(resume_div, null);
            resume_div.addEventListener("click", () => {
                document.documentElement.setAttribute("data-infinitescrolling", true);
                resume_div.scrollIntoView(false);
                window.scrollBy(0, -1.5 * resume_div.getHeight());
            });
        });
    }


    //document.queryselector(".fr-element.fr-view").addEventListener("focus", (event) => console.log(event));
    window.addEventListener('load', () => {
        //document.documentElement.setAttribute("data-infinitescrolling", "true");
        document.querySelectorAll(".fr-element.fr-view").forEach((node) => {
            node.addEventListener("focus", (event) => {
                if (event.type === "focus") {
                    document.documentElement.setAttribute("data-infinitescrolling", false);
                }
                console.log(event.type)
            });
        });
    });

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    }
    const observer = new IntersectionObserver(async (entries, myobserver) => {

        const suspend = document.documentElement.getAttribute("data-infinitescrolling") === "false";
        if (suspend) return;
        document.documentElement.setAttribute("data-infinitescrolling", false);

        const newpageurl = urlprefix + 'page-' + (currentpage + 1);
        const newpage = await fetch(newpageurl, { redirect: 'manual' });

        console.log("OK " + newpageurl);

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

        document.documentElement.setAttribute("data-infinitescrolling", true);

    }, options);
    observer.observe(document.querySelector('#infinite'));
})();
