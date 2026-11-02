// Wizualizacje do rolek mówionych (Tryb 2: schemat u góry, Andrzej w kadrze pod spodem).
// Klip ma format rolki 1080x1920, 30 klatek na sekundę, nieprzezroczyste grafitowe tło. Schemat jest w górnym pasie (od 240 do 840 px), dolna część jest wolna na nagranie Andrzeja.
// Użycie: node wizualizacje.js <numer sceny 1-5> <katalog wyjściowy>   (powstaje scena-N.mp4)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);

const SCENES = { 1: 9, 2: 8, 3: 8, 4: 10, 5: 7 };
const FPS = 30;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${['600', '800'].map(w => `
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)}) format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)}) format('woff2')}`).join('')}
html,body{margin:0;background:#11141A;width:1080px;height:1920px;overflow:hidden;font-family:Pop,sans-serif}
svg{display:block}
</style></head><body><svg id="s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"></svg>
<script>
const Y='#F4B63A', RED='#C42332', INK='#11141A', CREAM='#FBF5F3', GREY='#2A303B';
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3);
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const tx=(x,y,s,size,fill,w,anchor,op)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-weight="'+(w||800)+'" fill="'+fill+'" text-anchor="'+(anchor||'middle')+'" opacity="'+(op==null?1:op)+'">'+s+'</text>';
const title=(t,a,b)=>{const o=eo(seg(t,0.2,0.8));return '<text x="540" y="82" font-size="50" font-weight="800" fill="#fff" text-anchor="middle" opacity="'+o+'">'+a+'<tspan fill="'+Y+'">'+b+'</tspan></text>';};
const bgGlow='<defs><radialGradient id="g" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#1E242E"/><stop offset="1" stop-color="#11141A"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#g)"/>';

const S={};
S[1]=t=>{ // dziewięć dobrych akcji bez echa, jedna zła zostaje
  let o=title(t,'Mózg szuka ','braków');
  const dim=eio(seg(t,4.0,5.0)), mv=eio(seg(t,4.4,5.8));
  for(let i=0;i<10;i++){
    const a=0.8+i*0.22, op=eo(seg(t,a,a+0.3)), x=140+i*88;
    if(i===6){
      const cx=x+(540-x)*mv, cy=190+(400-190)*mv, r=30+70*mv+(t>5.8?6*Math.sin((t-5.8)*4):0);
      o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+14)+'" fill="'+RED+'" opacity="'+(0.18*op*mv)+'"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+RED+'" opacity="'+op+'"/>';
    } else {
      o+='<circle cx="'+x+'" cy="190" r="'+(30-12*dim)+'" fill="#EDEFF3" opacity="'+(op*(1-0.8*dim))+'"/>';
    }
  }
  o+=tx(540,272,'9 dobrych akcji',34,'#fff',600,'middle',eo(seg(t,3.2,3.7))*(1-seg(t,4.0,4.3)));
  o+=tx(540,272,'przechodzi bez echa',34,'#A9B0BC',600,'middle',eo(seg(t,4.3,4.8)));
  o+=tx(540,555,'jedna zła siedzi w głowie przez tydzień',36,Y,800,'middle',eo(seg(t,6.2,6.8)));
  return o;
};
S[2]=t=>{ // cały sezon kontra cudzy najlepszy kadr
  let o=title(t,'Sezon kontra ','najlepszy kadr');
  o+=tx(270,150,'Twój cały sezon',32,'#fff',600,'middle',eo(seg(t,0.6,1.1)));
  o+=tx(810,150,'Ich najlepszy kadr',32,'#fff',600,'middle',eo(seg(t,2.8,3.3)));
  const pal=['#6B7280','#4B5563','#9CA3AF','#6B7280'];
  for(let i=0;i<20;i++){
    const r=Math.floor(i/5), c=i%5, a=0.8+i*0.1, op=eo(seg(t,a,a+0.25));
    const bad=(i===3||i===9||i===14);
    const dim=1-0.35*eo(seg(t,3.6,4.4));
    o+='<rect x="'+(125+c*60)+'" y="'+(185+r*60)+'" width="50" height="50" rx="10" fill="'+(bad?RED:pal[(i*7)%4])+'" opacity="'+(op*dim)+'"/>';
  }
  const g=eo(seg(t,3.0,3.8)), pulse=t>3.8?1+0.02*Math.sin((t-3.8)*4):1;
  o+='<g opacity="'+g+'" transform="translate(810 300) scale('+(pulse*(0.9+0.1*g))+') translate(-810 -300)"><rect x="665" y="185" width="290" height="230" rx="22" fill="'+Y+'" opacity="0.25"/><rect x="675" y="195" width="270" height="210" rx="18" fill="'+Y+'"/></g>';
  o+=tx(540,312,'VS',34,'#A9B0BC',800,'middle',eo(seg(t,2.6,3.1)));
  o+=tx(540,500,'wypada na Twoją niekorzyść',40,'#fff',800,'middle',eo(seg(t,5.2,5.9)));
  return o;
};
S[3]=t=>{ // tydzień przed startem, tryb ochrony podsuwa wątpliwości zamiast faktów
  let o=title(t,'Tydzień ','przed startem');
  const c=eo(seg(t,0.6,1.2));
  o+='<g opacity="'+c+'"><rect x="370" y="130" width="340" height="76" rx="38" fill="'+GREY+'" stroke="'+Y+'" stroke-width="3"/>'+tx(540,181,'Tryb ochrony',34,'#fff',800)+'</g>';
  const p1=eio(seg(t,1.6,2.4)), x1=470+(340-470)*p1, y1=210+(300-210)*p1;
  o+='<line x1="470" y1="210" x2="'+x1+'" y2="'+y1+'" stroke="'+Y+'" stroke-width="5" stroke-linecap="round" opacity="'+(p1>0?1:0)+'"/>';
  if(p1>=1) o+='<polygon points="340,304 322,286 354,284" fill="'+Y+'"/>';
  const l=eo(seg(t,2.2,2.9));
  o+='<g opacity="'+l+'" transform="translate(285 340) scale('+(0.85+0.15*l)+') translate(-285 -340)"><rect x="110" y="300" width="350" height="80" rx="40" fill="'+RED+'"/>'+tx(285,352,'wątpliwości',36,'#fff',800)+'</g>';
  o+=tx(285,432,'podsuwane jako dowód',28,'#fff',600,'middle',eo(seg(t,3.4,4.0)));
  const p2=eio(seg(t,3.6,4.2)), x2=610+(745-610)*p2, y2=210+(300-210)*p2;
  o+='<line x1="610" y1="210" x2="'+x2+'" y2="'+y2+'" stroke="#A9B0BC" stroke-width="3" stroke-dasharray="8 8" opacity="'+(p2>0?0.6:0)+'"/>';
  const r=eo(seg(t,4.0,4.6));
  o+='<g opacity="'+(0.55*r)+'"><rect x="620" y="300" width="350" height="80" rx="40" fill="none" stroke="#fff" stroke-width="3"/>'+tx(795,352,'fakty',36,'#fff',800)+'</g>';
  o+=tx(795,432,'zostają w tle',28,'#A9B0BC',600,'middle',eo(seg(t,5.0,5.6)));
  return o;
};
S[4]=t=>{ // kartka z dowodami
  let o=title(t,'Kartka z ','dowodami');
  const c=eo(seg(t,0.6,1.2));
  o+='<g opacity="'+c+'" transform="translate(0 '+(20*(1-c))+')"><rect x="190" y="120" width="700" height="400" rx="26" fill="'+CREAM+'"/>'+tx(235,182,'Moje dowody',34,INK,800,'start')+'<line x1="235" y1="206" x2="845" y2="206" stroke="#D9CFCB" stroke-width="2"/></g>';
  const L=['Ile treningów za mną','Co poprawione od zeszłego sezonu','Co wychodzi mi teraz','Co pół roku temu sprawiało kłopot'];
  for(let i=0;i<4;i++){
    const a=1.8+i*1.4, y=262+i*62, w=eo(seg(t,a,a+0.8))*580;
    o+='<clipPath id="c'+i+'"><rect x="285" y="'+(y-34)+'" width="'+w+'" height="48"/></clipPath>';
    o+='<g clip-path="url(#c'+i+')">'+tx(285,y,L[i],28,INK,600,'start')+'</g>';
    o+='<rect x="235" y="'+(y-26)+'" width="32" height="32" rx="8" fill="none" stroke="#B9AEAA" stroke-width="3" opacity="'+eo(seg(t,a,a+0.3))+'"/>';
    const k=eio(seg(t,a+0.9,a+1.3));
    if(k>0){ const pts=[[241,y-8],[249,y],[262,y-18]]; const d=k<0.5?[pts[0],[pts[0][0]+(pts[1][0]-pts[0][0])*(k/0.5),pts[0][1]+(pts[1][1]-pts[0][1])*(k/0.5)]]:[pts[0],pts[1],[pts[1][0]+(pts[2][0]-pts[1][0])*((k-0.5)/0.5),pts[1][1]+(pts[2][1]-pts[1][1])*((k-0.5)/0.5)]];
      o+='<polyline points="'+d.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="'+RED+'" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'; }
  }
  o+=tx(540,572,'czytasz ją wieczorem przed startem',34,Y,800,'middle',eo(seg(t,7.4,8.1)));
  return o;
};
S[5]=t=>{ // pewność się chwieje, przygotowanie zostaje
  let o=title(t,'Pewność może się ','chwiać');
  o+='<line x1="120" y1="520" x2="960" y2="520" stroke="#3A4352" stroke-width="3"/>';
  const b=eo(seg(t,0.5,1.1));
  o+='<g opacity="'+b+'" transform="translate(540 520) scale(1 '+b+') translate(-540 -520)"><rect x="240" y="440" width="600" height="80" rx="16" fill="'+RED+'"/>'+tx(540,492,'Przygotowanie',36,'#fff',800)+'</g>';
  const d=eio(seg(t,1.2,1.9)), drop=(1-d)*-140;
  const ang=t>2.2&&t<6.8?9*Math.sin((t-2.2)*5)*(1-0.5*seg(t,5.5,6.8)):0;
  o+='<g opacity="'+eo(seg(t,1.2,1.5))+'" transform="translate(0 '+drop+') rotate('+ang+' 540 440)"><rect x="390" y="330" width="300" height="110" rx="20" fill="'+GREY+'" stroke="'+Y+'" stroke-width="4"/>'+tx(540,396,'Pewność siebie',32,'#fff',800)+'</g>';
  o+=tx(540,578,'przygotowanie zostaje',38,Y,800,'middle',eo(seg(t,4.6,5.3)));
  return o;
};
window.draw=(n,t,D)=>{
  const fade=1-seg(t,D-0.4,D);
  document.getElementById('s').innerHTML=bgGlow+'<text x="540" y="150" font-size="34" font-weight="800" fill="#A9B0BC" text-anchor="middle" letter-spacing="2">@psychologsportu</text><g transform="translate(0 240)"><g opacity="'+fade+'">'+S[n](t)+'</g></g>';
};
</script></body></html>`;

async function main() {
  const n = +process.argv[2];
  const out = process.argv[3];
  const D = SCENES[n];
  fs.mkdirSync(out, { recursive: true });
  const tmp = path.join(__dirname, '.wiz.tmp.html');
  fs.writeFileSync(tmp, html);
  const { chromium } = require('playwright');
  let exe;
  try {
    const cands = [];
    for (const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()) {
      cands.push(`/opt/pw-browsers/${d}/chrome-linux64/chrome`, `/opt/pw-browsers/${d}/chrome-linux/headless_shell`);
    }
    exe = cands.find(c => fs.existsSync(c));
  } catch (e) {}
  const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + tmp);
  await p.evaluate(() => document.fonts.ready);
  const fdir = path.join(out, 'frames-' + n);
  fs.mkdirSync(fdir, { recursive: true });
  const total = D * FPS;
  for (let i = 0; i < total; i++) {
    await p.evaluate(([a, t, d]) => window.draw(a, t, d), [n, i / FPS, D]);
    await p.screenshot({ path: path.join(fdir, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 95 });
  }
  await b.close();
  fs.unlinkSync(tmp);
  execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${fdir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 ${path.join(out, 'scena-' + n + '.mp4')}`);
  console.log('ok scena', n);
}
main();
