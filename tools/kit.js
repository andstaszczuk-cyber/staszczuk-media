// Shared visual kit: Staszczuk Sport Team family (psychologsportu / Sportowa Rodzina / Sędzia z głową)
const path = require('path');
const fs = require('fs');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);

const COLORS = { top: '#AE4549', bottom: '#7A2423', yellow: '#FCE86A', white: '#FFFFFF', ink: '#5A1A1A' };

const fontCss = `
@font-face{font-family:Raj;font-weight:700;src:url(${F('rajdhani/files/rajdhani-latin-ext-700-normal.woff2')}) format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:Raj;font-weight:700;src:url(${F('rajdhani/files/rajdhani-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-ext-800-normal.woff2')}) format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-800-normal.woff2')}) format('woff2')}
@font-face{font-family:Pop;font-weight:500;src:url(${F('poppins/files/poppins-latin-ext-500-normal.woff2')}) format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Pop;font-weight:500;src:url(${F('poppins/files/poppins-latin-500-normal.woff2')}) format('woff2')}
`;

// Shield badge in the SST style: flat top with chamfers, straight sides, pointed bottom, double outline.
function shield(inner, { w = 300, stroke = '#fff' } = {}) {
  const h = w * 1.6;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 160" width="${w}" height="${h}">
    <path d="M6 4 H94 L94 112 L50 156 L6 112 Z" fill="none" stroke="${stroke}" stroke-width="7" stroke-linejoin="miter"/>
    <path d="M17 15 H83 L83 106 L50 139 L17 106 Z" fill="none" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="miter"/>
    ${inner}
  </svg>`;
}

// Inner marks
const MARKS = {
  // Sportowa Rodzina: adult + child, geometric, child figure in yellow
  rodzina: `
    <circle cx="40" cy="45" r="9" fill="#fff"/>
    <path d="M27 98 V70 a13 13 0 0 1 26 0 V98 Z" fill="#fff"/>
    <circle cx="64" cy="62" r="7" fill="${COLORS.yellow}"/>
    <path d="M55 98 V83 a9 9 0 0 1 18 0 V98 Z" fill="${COLORS.yellow}"/>
    <path d="M50 76 L58 82" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  // Sędzia z głową: head profile with a card raised (yellow card)
  sedzia: `
    <path d="M36 102 V86 c-8-4-12-12-12-22 c0-15 11-26 26-26 c13 0 22 9 23 21 l6 10 h-6 v8 c0 4-3 7-7 7 h-6 V102 Z" fill="#fff"/>
    <rect x="58" y="22" width="18" height="26" rx="2" fill="${COLORS.yellow}" transform="rotate(12 67 35)"/>`,
};

function page(body, { w, h, bg = 'grad' } = {}) {
  const background = bg === 'grad' ? `linear-gradient(180deg, ${COLORS.top} 0%, ${COLORS.bottom} 100%)` : bg;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}
  html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}
  body{background:${background};color:#fff;font-family:Pop,Poppins,sans-serif}
  .wm{font-family:Raj,sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.04em;line-height:.92;text-align:center}
  .y{color:${COLORS.yellow}}
  </style></head><body>${body}</body></html>`;
}

async function render(html, out, w, h) {
  const { chromium } = require('playwright');
  const glob = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium_headless_shell')).sort().reverse();
  const exe = glob.length ? `/opt/pw-browsers/${glob[0]}/chrome-linux/headless_shell` : undefined;
  const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const tmp = path.join(__dirname, '.tmp.html');
  fs.writeFileSync(tmp, html);
  await p.goto('file://' + tmp);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out });
  await b.close();
}

module.exports = { COLORS, shield, MARKS, page, render };
