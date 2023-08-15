// ==UserScript==
// @name        duckduckgo-settings
// @version     0.1.1
// @match       *://*.duckduckgo.com/*
// @require     https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @run-at      document-start
// ==/UserScript==

{
    Cookies.set('av', '1');
    Cookies.set('p', '-2');
    Cookies.set('1', '-1');
    Cookies.set('n', '1');
    Cookies.set('ah', 'cn-zh');
};
