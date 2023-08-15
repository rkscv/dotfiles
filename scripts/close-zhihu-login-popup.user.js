// ==UserScript==
// @name        close-zhihu-login-popup
// @version     0.1.0
// @match       *://*.zhihu.com/*
// ==/UserScript==

document.body.addEventListener("DOMNodeInserted", function () {
    document.querySelector("div.Modal.Modal--default.signFlowModal > button")?.click();
});
