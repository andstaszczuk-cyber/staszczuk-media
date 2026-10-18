// Usage: node post.js <brand rodzina|sedzia|psychologsportu> "<line with *yellow* words>" out.png
const { shield, MARKS, page, render } = require('./kit');
const [, , brand, text, out] = process.argv;
const B = {
  rodzina: { l1: 'SPORTOWA', l2: 'RODZINA', handle: 'sportowarodzina' },
  sedzia: { l1: 'SĘDZIA', l2: 'Z GŁOWĄ', handle: 'sedziazglowa' },
}[brand];
const html = text.replace(/\\n/g,'\n').split('\n').map(l => l.replace(/\*(.+?)\*/g, '<span class="y">$1</span>')).join('<br>');
const len = text.replace(/\*/g, '').length;
const fs = len < 30 ? 96 : len < 55 ? 82 : 68;
render(page(`
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 90px;box-sizing:border-box">
    <div style="font-weight:800;font-size:${fs}px;line-height:1.28;text-align:center;text-wrap:balance">${html}</div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:70px;display:flex;flex-direction:column;align-items:center;gap:10px">
    <img src="file://${__dirname}/sst_shield.png" style="height:64px">
    <div class="wm" style="font-size:24px">${B.l1}<br>${B.l2}</div>
    <div style="font-family:Pop;font-weight:500;font-size:20px;opacity:.85;margin-top:4px">@${B.handle}</div>
  </div>`, { w: 1080, h: 1350 }), out, 1080, 1350).then(() => console.log('ok', out));
