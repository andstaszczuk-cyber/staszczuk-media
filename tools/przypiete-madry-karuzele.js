// Mądry Sport: slajdy 2-5 karuzel przypiętych postów (okładki robi przypiete-madry.js)
// node przypiete-madry-karuzele.js outDir
const fs=require('fs'),path=require('path');const out=process.argv[2];
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const DG='#0D262C',TQ='#15625F',T2='#1E7A75',PK='#F6CFD2',MI='#BCD6D2',LINE='#4FBFB3';
const BG=['linear-gradient(90deg,#0D262C,#124A4B)','linear-gradient(90deg,#124A4B,#17605D)','linear-gradient(90deg,#17605D,#1E7A75)'];
const I={ // proste ikony liniowe 120x120
 pulse:'<polyline points="6,64 34,64 46,34 62,92 76,52 86,64 114,64"/>',
 step:'<polyline points="10,104 40,104 40,78 66,78 66,52 92,52 92,26 112,26"/>',
 heart:'<path d="M60 102 C20 74 10 52 22 36 C34 20 54 26 60 40 C66 26 86 20 98 36 C110 52 100 74 60 102Z"/>',
 apple:'<path d="M60 38 C44 26 18 34 20 62 C22 90 42 106 60 98 C78 106 98 90 100 62 C102 34 76 26 60 38Z"/><path d="M60 38 C60 26 66 16 76 12"/>',
 dumbbell:'<line x1="30" y1="60" x2="90" y2="60"/><rect x="14" y="40" width="16" height="40" rx="4"/><rect x="90" y="40" width="16" height="40" rx="4"/>',
 plus:'<circle cx="60" cy="60" r="46"/><line x1="60" y1="38" x2="60" y2="82"/><line x1="38" y1="60" x2="82" y2="60"/>',
 doc:'<path d="M32 12 H74 L92 30 V108 H32Z"/><line x1="46" y1="54" x2="78" y2="54"/><line x1="46" y1="72" x2="78" y2="72"/><line x1="46" y1="90" x2="66" y2="90"/>',
 coins:'<ellipse cx="60" cy="34" rx="36" ry="14"/><path d="M24 34 V58 C24 66 40 72 60 72 C80 72 96 66 96 58 V34"/><path d="M24 58 V82 C24 90 40 96 60 96 C80 96 96 90 96 82 V58"/>',
 sign:'<line x1="60" y1="14" x2="60" y2="108"/><path d="M60 26 H96 L106 38 L96 50 H60Z"/><path d="M60 62 H26 L16 74 L26 86 H60Z"/>',
 person:'<circle cx="60" cy="38" r="20"/><path d="M22 106 C24 80 40 68 60 68 C80 68 96 80 98 106"/>',
 calendar:'<rect x="16" y="24" width="88" height="80" rx="10"/><line x1="16" y1="46" x2="104" y2="46"/><line x1="38" y1="14" x2="38" y2="32"/><line x1="82" y1="14" x2="82" y2="32"/><polyline points="42,74 56,88 80,62"/>',
};
const ic=(k,c)=>`<svg viewBox="0 0 120 120" width="130" height="130" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;
const C=[
 {k:'glowa',pts:[['pulse','Przed startem głowa robi swoje','Serce wali, myśli uciekają, nogi miękną. Psycholog sportowy pomaga zrozumieć, co się wtedy dzieje, i nauczyć się z tym grać.'],
   ['step','Błąd, kontuzja, kryzys','Po błędzie trudno wrócić do gry, a po kontuzji trudno zaufać ciału. Pracujemy nad tym krok po kroku, bez obiecywania cudów.'],
   ['heart','Kiedy sport przestaje cieszyć','Zmęczenie, brak sensu, napięcie w drużynie albo w domu. Wtedy wchodzi też terapeuta, kiedy potrzeba czegoś więcej.']],
  end:['person','Najpierw człowiek, potem *sportowiec*','Ciało znajdziesz w kolejnym przypiętym poście.']},
 {k:'cialo',pts:[['apple','Jedzenie pod trening, nie pod modę','Dietetyk sportowy układa jedzenie tak, żeby starczało siły na szkołę, pracę i trening.'],
   ['dumbbell','Przygotowanie motoryczne','Siła, szybkość i mobilność ułożone pod twój sport, żeby ciało dawało radę przez cały sezon.'],
   ['plus','Ból i regeneracja','Fizjoterapeuta pomaga, kiedy coś boli, i pokazuje, jak odpoczywać, żeby wracać silniejszym.']],
  end:['heart','Dobry wynik nie powinien kosztować *zdrowia*','Karierę znajdziesz w kolejnym przypiętym poście.']},
 {k:'kariera',pts:[['doc','Umowy i prawo','Kontrakt z klubem, sponsor, wizerunek. Zanim podpiszesz, warto, żeby ktoś to dokładnie przeczytał.'],
   ['coins','Pieniądze i księgowość','Pierwsze pieniądze ze sportu, faktury, podatki. Księgowy pomaga to poukładać od początku.'],
   ['sign','Decyzje na lata','Zmiana klubu, wyjazd, koniec kariery. Takie decyzje łatwiej podjąć, kiedy ktoś pomoże spojrzeć na nie spokojnie.']],
  end:['calendar','Pierwsza rozmowa *bezpłatnie*','Umówisz ją na madrysport.pl, link masz w bio.']},
];
const hl=s=>s.replace(/\*(.+?)\*/g,`<span style="color:${PK}">$1</span>`);
const frame=`<div style="position:absolute;inset:40px;border:6px solid ${LINE}"></div>`;
const foot=(i)=>`<div style="position:absolute;left:96px;bottom:88px;font-weight:600;font-size:26px;color:${MI}">@madrysport.pl · ${i}/5</div>`;
const point=(p,n,i)=>`<div style="position:absolute;left:96px;right:96px;top:300px">
 <div style="display:flex;align-items:center;gap:36px">${ic(p[0],PK)}<div style="font-weight:900;font-size:150px;color:${PK};line-height:1">${n}</div></div>
 <div style="margin-top:56px;font-weight:900;font-size:84px;line-height:1.08;color:#fff;letter-spacing:-1px">${p[1]}</div>
 <div style="margin-top:40px;font-weight:600;font-size:44px;line-height:1.45;color:${MI}">${p[2]}</div></div>${foot(i)}`;
const end=(e)=>`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 120px">
 ${ic(e[0],PK)}<div style="margin-top:56px;font-weight:900;font-size:96px;line-height:1.08;color:#fff;letter-spacing:-1px">${hl(e[1])}</div>
 <div style="width:120px;height:8px;background:${LINE};border-radius:4px;margin:56px 0 44px"></div>
 <div style="font-weight:600;font-size:42px;line-height:1.4;color:${MI}">${e[2]}</div></div>${foot(5)}`;
const doc=(bg,inner)=>`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-ext-600-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-600-normal.woff2')})}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-ext-900-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-900-normal.woff2')})}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;position:relative;font-family:M;background:${bg}}</style>${inner}${frame}`;
(async()=>{fs.mkdirSync(out,{recursive:true});const {chromium}=require('playwright');const g=fs.readdirSync('/opt/pw-browsers').filter(d=>d.startsWith('chromium_headless_shell')).sort().reverse();
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1350}});const tmp=path.join(__dirname,'.tmpk.html');
for(const [ci,c] of C.entries()){const slides=[...c.pts.map((pt,j)=>point(pt,j+1,j+2)),end(c.end)];
 for(const [j,s] of slides.entries()){fs.writeFileSync(tmp,doc(BG[ci],s));await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(out,`${ci+1}-${c.k}-${j+2}.png`)});}}
fs.unlinkSync(tmp);await b.close();})();
