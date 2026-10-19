// Ilustracje sędziego (piktogramowy styl, kolory marki). scene(name) -> SVG 1080x1350 (tło + scena)
const Y = '#FCE86A', CR = '#F4EEE4', R = '#AE4549', D = '#141215';
function fig(j, o = {}) { // j: joints {head:[x,y], sh:[x,y], hip:[x,y], lA:[[x,y],[x,y],[x,y]], rA, lL, rL}
  const c = o.color || CR, w = o.w || 34, s = (a) => a.map(p => p.join(',')).join(' ');
  const limb = (pts) => `<polyline points="${s(pts)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const [sx, sy] = j.sh, [hx, hy] = j.hip;
  const torso = `<path d="M${sx - 42},${sy} L${sx + 42},${sy} L${hx + 30},${hy} L${hx - 30},${hy} Z" fill="${c}" stroke="${c}" stroke-width="22" stroke-linejoin="round"/>`;
  return `<g opacity="${o.op || 1}">${limb(j.lL)}${limb(j.rL)}${torso}${limb(j.lA)}${limb(j.rA)}<circle cx="${j.head[0]}" cy="${j.head[1]}" r="${o.hr || 36}" fill="${c}"/>${o.ref === false ? "" : `<polyline points="${sx - 20},${sy - 4} ${sx},${sy + 60} ${sx + 20},${sy - 4}" fill="none" stroke="#2B1515" stroke-width="5"/><rect x="${sx - 13}" y="${sy + 56}" width="26" height="16" rx="6" fill="#2B1515"/>`}${o.extra || ''}</g>`;
}
const defs = `<defs>
 <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${Y}" stop-opacity=".9"/><stop offset=".35" stop-color="${Y}" stop-opacity=".25"/><stop offset="1" stop-color="${Y}" stop-opacity="0"/></radialGradient>
 <radialGradient id="screen" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#9FD3FF" stop-opacity=".55"/><stop offset="1" stop-color="#9FD3FF" stop-opacity="0"/></radialGradient>
 <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A1518"/><stop offset=".6" stop-color="#171416"/><stop offset="1" stop-color="#0F0D0F"/></linearGradient>
 <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${D}" stop-opacity="0"/><stop offset="1" stop-color="${D}" stop-opacity=".96"/></linearGradient>
</defs>`;
const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" style="position:absolute;inset:0">${defs}<rect width="1080" height="1350" fill="url(#night)"/>${inner}<rect y="560" width="1080" height="790" fill="url(#fade)"/></svg>`;
const light = (x, y, r = 260) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#glow)"/><rect x="${x - 46}" y="${y - 18}" width="92" height="36" rx="6" fill="${Y}"/>`;
const stands = (y) => { let p = `M0,${y}`; for (let x = 0; x <= 1080; x += 40) p += ` L${x},${y - 30 - ((x * 7) % 23)} L${x + 20},${y - 18}`; return `<path d="${p} L1080,1350 L0,1350 Z" fill="#221A1C"/>`; };
const STAND = { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [148, 228], [150, 300]], rA: [[240, 155], [252, 228], [250, 300]], lL: [[185, 305], [180, 400], [176, 495]], rL: [[215, 305], [220, 400], [224, 495]] };
const SIT = { head: [200, 70], sh: [200, 145], hip: [200, 340], lA: [[160, 155], [140, 250], [175, 320]], rA: [[240, 155], [260, 250], [225, 320]], lL: [[180, 345], [90, 355], [90, 500]], rL: [[220, 345], [310, 355], [310, 500]] };
const kid = (x, y, sc, pose, o = {}) => `<g transform="translate(${x},${y}) scale(${sc})">${fig(pose, Object.assign({ color: Y, ref: false }, o))}</g>`;
const adult = (x, y, sc, pose, o = {}) => `<g transform="translate(${x},${y}) scale(${sc})">${fig(pose, Object.assign({ ref: false }, o))}</g>`;
const S = {
  // powrót autem po meczu: rodzic za kierownicą, dziecko z tyłu
  car: () => wrap(`<rect width="1080" height="1350" fill="#171315"/>${light(160, 120, 220)}${light(940, 160, 200)}
    <rect x="120" y="0" width="14" height="140" fill="#2A2124"/><rect x="900" y="0" width="14" height="180" fill="#2A2124"/>
    <path d="M90,640 L120,470 Q140,380 260,360 L760,350 Q860,350 920,450 L990,560 L990,640 Z" fill="#5A2427"/>
    <path d="M200,470 Q215,400 290,392 L500,388 L500,500 L200,500 Z" fill="#241C1F"/><path d="M530,388 L740,386 Q810,388 850,470 L860,500 L530,500 Z" fill="#241C1F"/>
    <circle cx="270" cy="650" r="70" fill="#0F0D0F" stroke="#3A2C2F" stroke-width="16"/><circle cx="800" cy="650" r="70" fill="#0F0D0F" stroke="#3A2C2F" stroke-width="16"/>
    <circle cx="680" cy="430" r="34" fill="${CR}"/><path d="M630,500 Q640,465 680,462 Q722,465 730,500 Z" fill="${CR}"/>
    <circle cx="660" cy="470" r="40" fill="none" stroke="${CR}" stroke-width="10" stroke-opacity=".0"/>
    <circle cx="360" cy="448" r="26" fill="${Y}"/><path d="M322,500 Q330,475 360,472 Q392,475 398,500 Z" fill="${Y}"/>
    <rect x="760" y="440" width="40" height="40" rx="20" fill="none" stroke="${CR}" stroke-width="8" stroke-opacity=".5"/>`),
  // rodzic i dziecko na ławce przy boisku, rozmowa
  bench_talk: () => wrap(`${light(880, 90, 280)}${stands(420)}<rect y="440" width="1080" height="910" fill="#1B2A1F" opacity=".5"/>
    <rect x="170" y="560" width="740" height="34" rx="10" fill="#4A3A3E"/><rect x="210" y="594" width="22" height="110" fill="#4A3A3E"/><rect x="848" y="594" width="22" height="110" fill="#4A3A3E"/>
    ${adult(250, 220, 0.95, SIT)}${kid(560, 330, 0.7, { head: [200, 70], sh: [200, 145], hip: [200, 330], lA: [[160, 155], [120, 230], [60, 250]], rA: [[240, 155], [260, 250], [225, 320]], lL: [[180, 335], [90, 350], [90, 490]], rL: [[220, 335], [310, 350], [310, 490]] })}`),
  // rodzinna kolacja przy stole
  dinner: () => wrap(`<rect width="1080" height="1350" fill="#1A1517"/><circle cx="540" cy="80" r="300" fill="url(#glow)" opacity=".55"/><line x1="540" y1="0" x2="540" y2="70" stroke="#3A2C2F" stroke-width="6"/><path d="M470,70 L610,70 L580,120 L500,120 Z" fill="${Y}"/>
    ${adult(80, 210, 0.9, SIT)}${kid(700, 330, 0.62, SIT)}
    <rect x="200" y="520" width="680" height="34" rx="10" fill="#6E2C30"/><rect x="250" y="554" width="22" height="150" fill="#5A2427"/><rect x="808" y="554" width="22" height="150" fill="#5A2427"/>
    <ellipse cx="420" cy="512" rx="60" ry="12" fill="${CR}" opacity=".9"/><ellipse cx="660" cy="512" rx="60" ry="12" fill="${CR}" opacity=".9"/><rect x="530" y="470" width="22" height="42" rx="6" fill="${CR}" opacity=".7"/>`),
  // trójkąt: trener (z gwizdkiem), dziecko w środku, rodzic
  triangle: () => wrap(`${light(180, 90, 240)}${light(900, 90, 240)}${stands(430)}<rect y="450" width="1080" height="900" fill="#1B2A1F" opacity=".5"/>
    <path d="M200,690 L540,330 L880,690 Z" fill="none" stroke="${Y}" stroke-opacity=".35" stroke-width="6" stroke-dasharray="18 14"/>
    ${adult(40, 200, 0.95, STAND, { ref: true })}${adult(660, 200, 0.95, STAND)}${kid(400, 320, 0.7, STAND)}
    <rect x="236" y="380" width="56" height="74" rx="8" fill="${CR}" stroke="#2B1515" stroke-width="4"/>`),
  // dziecko mierzy się przy ścianie z kreskami: punkt odniesienia to ono samo
  growth: () => wrap(`<rect width="1080" height="1350" fill="#1A1517"/><circle cx="900" cy="120" r="260" fill="url(#glow)" opacity=".35"/>
    <rect x="560" y="60" width="16" height="640" fill="#3A2C2F"/>
    ${[600, 540, 480, 420, 360].map((y, i) => `<line x1="560" y1="${y}" x2="${i === 4 ? 660 : 620}" y2="${y}" stroke="${i === 4 ? Y : CR}" stroke-width="${i === 4 ? 8 : 5}" stroke-opacity="${i === 4 ? 1 : .55}"/>`).join('')}
    <text x="680" y="370" font-family="Poppins,sans-serif" font-weight="800" font-size="44" fill="${Y}">dziś</text><text x="640" y="610" font-family="Poppins,sans-serif" font-weight="500" font-size="32" fill="${CR}" fill-opacity=".6">wrzesień</text>
    ${kid(330, 300, 0.82, STAND)}${adult(40, 200, 0.95, { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [148, 228], [150, 300]], rA: [[240, 155], [300, 190], [360, 170]], lL: [[185, 305], [180, 400], [176, 495]], rL: [[215, 305], [220, 400], [224, 495]] })}
    <rect y="700" width="1080" height="16" fill="#3A2C2F"/>`),
  // zejście z boiska pod światłami, samotnie
  walk: () => wrap(`${light(180, 110)}${light(900, 90, 300)}${stands(440)}
    <rect y="470" width="1080" height="880" fill="#1B2A1F" opacity=".55"/>
    <line x1="0" y1="600" x2="1080" y2="560" stroke="${CR}" stroke-opacity=".18" stroke-width="6"/>
    <ellipse cx="575" cy="712" rx="110" ry="14" fill="#000" opacity=".5"/>
    <g transform="translate(365,170) scale(1.05)">${fig({ head: [200, 80], sh: [200, 150], hip: [205, 300], lA: [[165, 155], [150, 228], [168, 292]], rA: [[235, 155], [258, 222], [262, 285]], lL: [[188, 305], [172, 400], [150, 495]], rL: [[222, 305], [240, 396], [262, 490]] })}</g>`),
  // szatnia, ławka, telefon w dłoniach
  phone: () => wrap(`<rect width="1080" height="1350" fill="#1A1517"/>
    ${[90, 300, 510, 720, 930].map(x => `<rect x="${x}" y="40" width="170" height="420" rx="8" fill="#241D20" stroke="#2F2629" stroke-width="6"/><rect x="${x + 135}" y="220" width="14" height="60" rx="5" fill="#3A2F33"/>`).join('')}
    <rect x="160" y="560" width="760" height="40" rx="10" fill="#3A2C2F"/><rect x="200" y="600" width="24" height="110" fill="#3A2C2F"/><rect x="856" y="600" width="24" height="110" fill="#3A2C2F"/>
    <circle cx="560" cy="420" r="190" fill="url(#screen)"/>
    <g transform="translate(360,170)">${fig({ head: [200, 70], sh: [200, 145], hip: [200, 360], lA: [[160, 155], [150, 250], [190, 255]], rA: [[240, 155], [252, 250], [212, 255]], lL: [[180, 365], [110, 380], [110, 520]], rL: [[220, 365], [290, 380], [290, 520]] }, { extra: `<rect x="182" y="225" width="36" height="58" rx="7" fill="#BFE3FF"/>` })}</g>`),
  // analiza powtórki przy ekranie
  replay: () => wrap(`<rect width="1080" height="1350" fill="#151316"/>
    <rect x="470" y="70" width="520" height="320" rx="16" fill="#0E0C0E" stroke="#3A3236" stroke-width="10"/>
    <rect x="490" y="90" width="480" height="280" rx="6" fill="#203226"/>
    <circle cx="640" cy="200" r="16" fill="${CR}"/><circle cx="780" cy="170" r="16" fill="${CR}"/><circle cx="720" cy="270" r="16" fill="${Y}"/>
    <line x1="640" y1="200" x2="780" y2="170" stroke="${Y}" stroke-width="5" stroke-dasharray="14 10"/>
    <polygon points="900,330 900,360 928,345" fill="${CR}"/>
    <circle cx="730" cy="230" r="330" fill="url(#screen)" opacity=".6"/>
    <rect x="80" y="590" width="920" height="30" rx="8" fill="#2E2427"/>
    <g transform="translate(120,150)">${fig({ head: [200, 80], sh: [205, 155], hip: [190, 380], lA: [[168, 160], [200, 260], [300, 280]], rA: [[244, 160], [300, 230], [330, 170]], lL: [[175, 385], [290, 400], [290, 520]], rL: [[210, 385], [320, 395], [330, 520]] })}</g>`),
  // kanapa po meczu, myśli wracają (bańki)
  sofa: () => wrap(`<rect width="1080" height="1350" fill="#191416"/>
    <circle cx="140" cy="120" r="160" fill="url(#glow)" opacity=".45"/><rect x="128" y="120" width="24" height="330" fill="#2A2124"/><path d="M80,120 L200,120 L170,60 L110,60 Z" fill="#3A2C2F"/>
    <rect x="110" y="470" width="860" height="200" rx="40" fill="#5A2427"/><rect x="110" y="370" width="860" height="140" rx="40" fill="#6E2C30"/>
    <g transform="translate(330,150)">${fig({ head: [200, 70], sh: [200, 145], hip: [200, 340], lA: [[160, 155], [138, 250], [150, 335]], rA: [[240, 155], [282, 230], [232, 92]], lL: [[180, 345], [70, 355], [70, 500]], rL: [[220, 345], [330, 355], [330, 500]] })}</g>
    <circle cx="630" cy="190" r="16" fill="${CR}" opacity=".7"/><circle cx="680" cy="140" r="24" fill="${CR}" opacity=".7"/>
    <rect x="680" y="20" width="320" height="150" rx="75" fill="${CR}" opacity=".92"/>
    <rect x="740" y="55" width="200" height="80" rx="6" fill="#203226"/><line x1="840" y1="55" x2="840" y2="135" stroke="${CR}" stroke-width="4"/><circle cx="840" cy="95" r="18" fill="none" stroke="${CR}" stroke-width="4"/><circle cx="880" cy="80" r="7" fill="${Y}"/>`),
};
module.exports = { scene: (n) => S[n](), names: Object.keys(S) };
