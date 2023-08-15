// ==UserScript==
// @name        bilibili-live-show-online-num
// @version     0.1.3
// @match       *://live.bilibili.com/*
// ==/UserScript==

(async function () {
    'use strict';

    const roomID = location.pathname.match(/\/(\d+)/)?.[1];
    if (!roomID)
        return;
    const response = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomID}`);
    const data = await response.json();
    if (data.code !== 0)
        throw new Error(data.message);
    const uid = data.data.uid;
    setInterval(async () => {
        const response = await fetch(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=${uid}&roomId=${roomID}&page=1&pageSize=50`);
        const data = await response.json();
        if (data.code !== 0)
            throw new Error(data.message);
        document.querySelector("#rank-list-ctnr-box > div > ul > li").innerHTML = `高能用户(${data.data.onlineNum})`;
    }, 5000);
})();
