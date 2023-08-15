// ==UserScript==
// @name        download-nitter-attachments
// @version     0.3.0
// @match       *://*/*
// ==/UserScript==

(function () {
    'use strict';
    if (document.querySelector('meta[property="og:site_name"]')?.content !== 'Nitter')
        return;

    const createButton = (attachment, onclick) => {
        const button = document.createElement('a');
        button.style.marginRight = '.5em';
        button.innerText = '[download attachments]';
        button.href = 'javascript:;';
        let item = attachment.parentElement;
        while (!item.classList.contains('tweet-body')) {
            item = item.parentElement;
        }
        item.querySelector('.tweet-date').prepend(button);
        button.onclick = async function () {
            this.innerText = '[downloading...]';
            const wrapper = this.onclick;
            this.onclick = null;
            try {
                await onclick();
            } catch (error) {
                alert(error);
            }
            this.onclick = wrapper;
            this.innerText = '[download attachments]';
        };
    };
    const donwload = (url, name) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.append(link);
        link.click();
        link.remove();
    };
    const createDownloader = attachment => {
        let date = null;
        for (let item = attachment.parentElement; !date; item = item.parentElement) {
            date = item.querySelector('.tweet-date a:last-child');
        }
        const match = date.href.match(/\/(\w+)\/status\/(\d+)/);
        const username = match[1], status = match[2];

        const imgs = [...attachment.querySelectorAll('.still-image')];
        if (imgs.length) {
            createButton(attachment, async function () {
                for (const [i, img] of imgs.entries()) {
                    const suffix = imgs.length === 1 ? '' : `_${i + 1}`;
                    const resp = await fetch(img.href);
                    const mimeType = resp.headers.get('content-type').split('/')[1];
                    const extension = ({
                        'bmp': '.bmp',
                        'gif': '.gif',
                        'jpeg': '.jpg',
                        'png': '.png',
                        'svg+xml': '.svg',
                        'tiff': '.tiff',
                        'webp': '.webp',
                    })[mimeType] ?? '';
                    const url = URL.createObjectURL(await resp.blob());
                    donwload(url, `${username}_${status}${suffix}${extension}`);
                    URL.revokeObjectURL(url);
                }
            });
            return;
        }

        const video = attachment.querySelector('video');
        if (video) {
            createButton(attachment, async function () {
                const name = `${username}_${status}.mp4`;
                const dataUrl = video.getAttribute('data-url');
                if (dataUrl) {
                    let m3u8Text = (await (await fetch(dataUrl)).text()).trim();
                    const m3u8Url = m3u8Text.slice(m3u8Text.lastIndexOf('\n') + 1);
                    m3u8Text = (await (await fetch(m3u8Url)).text()).trim();
                    let m4sUrls = m3u8Text.split('\n').filter(line => !line.startsWith('#'));
                    const head = m3u8Text.match(/#EXT-X-MAP:URI="(.+?)"/);
                    if (head) {
                        m4sUrls = [head[1], ...m4sUrls];
                    }
                    const blobs = await Promise.all(m4sUrls.map(async url => {
                        let lastError;
                        for (let t = 0; t < 4; t++) {
                            try {
                                return await (await fetch(url)).blob();
                            } catch (error) {
                                lastError = error;
                            }
                        }
                        throw lastError;
                    }));
                    const url = URL.createObjectURL(new Blob(blobs));
                    donwload(url, name);
                    URL.revokeObjectURL(url);
                } else {
                    donwload(video.querySelector('source').src, name);
                }
            });
        }
    };

    for (const attachment of document.querySelectorAll('.timeline-item .attachments')) {
        createDownloader(attachment);
    }
    document.body.addEventListener("DOMNodeInserted", function (event) {
        const attachment = event.target.querySelector?.('.attachments');
        if (attachment) {
            createDownloader(attachment);
        }
    });
})();
