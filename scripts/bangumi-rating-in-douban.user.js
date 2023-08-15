// ==UserScript==
// @name        bangumi-rating-in-douban
// @version     0.1.6
// @match       *://movie.douban.com/subject/*
// @match       *://book.douban.com/subject/*
// ==/UserScript==

(async function () {
    'use strict';

    if (!location.pathname.match(/^\/subject\/\d+\/?$/))
        return;
    const isMovie = location.host.startsWith('movie');
    if (isMovie && [...document.querySelectorAll('span[property="v:genre"]')].every(element => element.innerText !== '动画'))
        return;

    const [, keyword] = document.querySelector('meta[name="keywords"]').content.split(',');
    const ogTitle = document.querySelector('meta[property="og:title"]').content;
    const title = (ogTitle.includes(keyword) ? keyword : ogTitle).toLowerCase();
    let subject;
    search: for (let i = 0; ; i++) {
        const resp = await fetch(`https://api.bgm.tv/search/subject/${encodeURIComponent(title)}?type=${isMovie ? 2 : 1}&responseGroup=large&max_results=25&start=${i * 25}`);
        const { results, list } = await resp.json();
        if (!results)
            return;
        else if (!list.length)
            break;
        for (const item of list) {
            let { name, name_cn } = item;
            name = name.toLowerCase();
            name_cn = name_cn.toLowerCase();
            if (name === title || name_cn === title) {
                subject = item;
                break search;
            } else if (!subject && (name.includes(title) || name_cn.includes(title) || title.includes(name) || title.includes(name_cn))) {
                subject = item;
            }
        }
    }
    if (!subject)
        return;
    const { id, name, rating } = subject;

    const doubanRating = document.querySelector('#interest_sectl');
    const bgmRating = doubanRating.parentElement.appendChild(doubanRating.cloneNode(true));
    bgmRating.style.marginTop = '.5em';
    const ratingLogo = bgmRating.querySelector('.rating_logo');
    ratingLogo.innerText = 'Bangumi 评分';
    ratingLogo.title = name;
    bgmRating.querySelector('.output-btn-wrap')?.remove();
    bgmRating.querySelectorAll('.rating_wrap ~ *').forEach(element => element.remove());
    bgmRating.querySelectorAll('.rating_self ~ *').forEach(element => element.remove());

    if (rating) {
        const { score, total, count } = rating;
        bgmRating.querySelector('.rating_num').innerText = score.toFixed(1);
        bgmRating.querySelector('.rating_right').classList.remove('not_showed');
        bgmRating.querySelector('.rating_right .ll').className = `ll bigstar${(Math.round(score) * 5).toString().padStart(2, '0')}`;
        bgmRating.querySelector('.rating_sum').innerHTML = `
            <a href="https://bgm.tv/subject/${id}/comments" class="rating_people">
                <span property="v:votes">${total}</span>人评价
            </a>`;
        const ratingWrap = bgmRating.querySelector('.rating_wrap');
        const titles = ['不忍直视', '很差', '差', '较差', '不过不失', '还行', '推荐', '力荐', '神作', '超神作'];
        for (let score = 10; score >= 1; score--) {
            const power = count[score] / total * 100;
            ratingWrap.innerHTML += `
                <span class="starstop" title="${titles[score - 1]}">${score < 10 ? '&ensp;' + score : score}星</span>
                <div class="power" style="width:${Math.round(power)}px"></div>
                <span class="rating_per">${power.toFixed(1)}%</span>
                <br>`;
        }
    } else {
        bgmRating.querySelector('.rating_num').innerText = '';
        bgmRating.querySelector('.rating_right').classList.add('not_showed');
        bgmRating.querySelector('.rating_right .ll').className = 'll bigstar00';
        bgmRating.querySelector('.rating_sum').innerHTML = '暂无评分';
    }
})();
