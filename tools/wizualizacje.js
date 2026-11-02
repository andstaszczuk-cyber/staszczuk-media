// Wizualizacje do rolek mówionych (Tryb 2: schemat u góry, Andrzej w kadrze pod spodem).
// Klip ma format rolki 1080x1920, 30 klatek na sekundę, nieprzezroczyste grafitowe tło i znak @psychologsportu u góry.
// Schemat jest w górnym pasie (od 240 do 840 px), dolna część jest wolna na nagranie Andrzeja.
// Użycie: node wizualizacje.js <numer sceny 1-13> <katalog wyjściowy>   (powstaje scena-NN.mp4)
// Sceny idą w kolejności rolki Mózg szuka braków: 1 gotowi, 2 przetrwanie, 3 paliwo, 4 dziewięć akcji, 5 pamięć,
// 6 sezon kontra kadr, 7 tryb ochrony, 8 wyniki i przygotowanie, 9 kartka z dowodami, 10 wieczór, 11 spiżarnia,
// 12 pewność się chwieje, 13 pytanie do widza.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);

const SCENES = { 1: 12, 2: 10, 3: 9, 4: 12, 5: 10, 6: 10, 7: 11, 8: 11, 9: 14, 10: 9, 11: 9, 12: 10, 13: 8 };
const FPS = 30;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${['600', '800'].map(w => `
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)}) format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)}) format('woff2')}`).join('')}
html,body{margin:0;background:#11141A;width:1080px;height:1920px;overflow:hidden;font-family:Pop,sans-serif}
svg{display:block}
</style></head><body><svg id="s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"></svg>
<script>
const Y='#F4B63A', RED='#C42332', LRED='#E85C69', INK='#11141A', CREAM='#FBF5F3', GREY='#2A303B', MUTED='#A9B0BC';
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3);
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const tx=(x,y,s,size,fill,w,anchor,op)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-weight="'+(w||800)+'" fill="'+fill+'" text-anchor="'+(anchor||'middle')+'" opacity="'+(op==null?1:op)+'">'+s+'</text>';
const title=(t,a,b)=>{const o=eo(seg(t,0.2,0.8));return '<text x="540" y="82" font-size="50" font-weight="800" fill="#fff" text-anchor="middle" opacity="'+o+'">'+a+'<tspan fill="'+Y+'">'+b+'</tspan></text>';};
const poly=(pts,k,stroke,w)=>{
  if(k<=0) return '';
  const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  const target=L[L.length-1]*k, out=[pts[0]];
  for(let i=1;i<pts.length;i++){ if(L[i]<=target) out.push(pts[i]); else { const f=(target-L[i-1])/(L[i]-L[i-1]); out.push([pts[i-1][0]+(pts[i][0]-pts[i-1][0])*f, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*f]); break; } }
  return '<polyline points="'+out.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')+'" fill="none" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
};
const bgGlow='<defs><radialGradient id="g" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#1E242E"/><stop offset="1" stop-color="#11141A"/></radialGradient><filter id="bl"><feGaussianBlur stdDeviation="7"/></filter></defs><rect width="1080" height="1920" fill="url(#g)"/>';

const S={};
// 1. fizycznie gotowi, w głowie trudniej, brak wiary częstszy niż stres
S[1]=t=>{
  let o=title(t,'Fizycznie ','gotowi');
  const p1=1-eo(seg(t,6.3,7.0));
  o+='<g opacity="'+p1+'">';
  o+='<g opacity="'+eo(seg(t,0.8,1.5))+'"><rect x="80" y="140" width="420" height="290" rx="26" fill="'+GREY+'"/>'+tx(290,205,'Ciało',40,'#fff',800)+tx(290,405,'gotowe',34,MUTED,600)+poly([[225,300],[275,350],[355,260]],eio(seg(t,1.4,2.4)),Y,14)+'</g>';
  o+='<g opacity="'+eo(seg(t,2.2,2.9))+'"><rect x="580" y="140" width="420" height="290" rx="26" fill="'+GREY+'"/>'+tx(790,205,'Głowa',40,'#fff',800);
  for(let i=0;i<3;i++){ const a=eo(seg(t,2.6+i*0.3,3.1+i*0.3)); o+='<g opacity="'+a+'"><circle cx="'+(680+i*110)+'" cy="'+(300+8*Math.sin(t*3+i*1.7))+'" r="36" fill="'+RED+'"/>'+tx(680+i*110,(300+8*Math.sin(t*3+i*1.7))+14,'?',40,'#fff',800)+'</g>'; }
  o+=tx(790,405,'wątpliwości',34,LRED,600,'middle',eo(seg(t,3.6,4.2)))+'</g>';
  o+='</g>';
  const p2=eo(seg(t,7.0,7.6));
  o+='<g opacity="'+p2+'">'+tx(80,215,'Brak wiary w siebie',32,'#fff',600,'start')+'<rect x="80" y="232" width="'+(880*eo(seg(t,7.6,9.0)))+'" height="46" rx="23" fill="'+RED+'"/>';
  o+=tx(80,350,'Stres przed startem',32,'#fff',600,'start')+'<rect x="80" y="367" width="'+(580*eo(seg(t,8.2,9.4)))+'" height="46" rx="23" fill="#6B7280"/></g>';
  o+=tx(540,500,'jeden z najczęstszych problemów',38,Y,800,'middle',eo(seg(t,9.8,10.5)));
  return o;
};
// 2. z punktu widzenia przetrwania: przeoczony brak kontra przeoczony sukces
S[2]=t=>{
  let o=title(t,'Z punktu widzenia ','przetrwania');
  const ang=-6*eio(seg(t,3.0,4.5));
  o+='<polygon points="540,250 500,335 580,335" fill="'+GREY+'"/>';
  o+='<g transform="rotate('+ang+' 540 250)"><rect x="140" y="242" width="800" height="16" rx="8" fill="'+MUTED+'"/>';
  o+='<g opacity="'+eo(seg(t,1.0,1.8))+'"><line x1="200" y1="250" x2="200" y2="285" stroke="'+MUTED+'" stroke-width="4"/><rect x="150" y="285" width="100" height="84" rx="14" fill="'+RED+'"/></g>';
  o+='<g opacity="'+eo(seg(t,1.8,2.6))+'"><line x1="880" y1="250" x2="880" y2="285" stroke="'+MUTED+'" stroke-width="4"/><circle cx="880" cy="312" r="26" fill="'+Y+'"/></g></g>';
  o+=tx(230,470,'Przeoczony brak',34,LRED,800,'middle',eo(seg(t,3.6,4.2)));
  o+=tx(230,512,'mógł kosztować życie',28,'#fff',600,'middle',eo(seg(t,4.6,5.2)));
  o+=tx(850,470,'Przeoczony sukces',34,'#fff',800,'middle',eo(seg(t,5.6,6.2)));
  o+=tx(850,512,'nie kosztował nic',28,'#fff',600,'middle',eo(seg(t,6.6,7.2)));
  return o;
};
// 3. szukanie zagrożeń za darmo, dostrzeganie tego, co działa, najdroższe paliwo
S[3]=t=>{
  let o=title(t,'Paliwo ','dla mózgu');
  const a=eo(seg(t,0.6,1.2));
  o+='<g opacity="'+a+'">'+tx(80,170,'Szukanie braków',32,'#fff',600,'start')+'<rect x="80" y="190" width="920" height="60" rx="30" fill="none" stroke="'+MUTED+'" stroke-width="3"/></g>';
  o+='<clipPath id="tk"><rect x="80" y="190" width="920" height="60" rx="30"/></clipPath>';
  const sweep=((t-1.0)%2.4)/2.4;
  if(t>1.0) o+='<g clip-path="url(#tk)"><rect x="'+(60+sweep*900)+'" y="196" width="150" height="48" rx="24" fill="'+LRED+'" opacity="0.75"/></g>';
  o+=tx(1000,170,'działa za darmo',28,MUTED,600,'end',eo(seg(t,2.8,3.4)));
  o+='<g opacity="'+eo(seg(t,3.2,3.8))+'">'+tx(80,330,'Dostrzeganie tego, co działa',32,'#fff',600,'start')+'<rect x="80" y="350" width="920" height="60" rx="30" fill="none" stroke="'+MUTED+'" stroke-width="3"/></g>';
  o+='<clipPath id="tk2"><rect x="80" y="350" width="920" height="60" rx="30"/></clipPath><g clip-path="url(#tk2)"><rect x="80" y="350" width="'+(920*eio(seg(t,3.8,6.2)))+'" height="60" fill="'+Y+'"/></g>';
  o+=tx(1000,330,'najdroższe paliwo',28,Y,800,'end',eo(seg(t,6.4,7.0)));
  o+=tx(540,500,'jedno jest za darmo, drugie kosztuje',36,'#fff',800,'middle',eo(seg(t,7.2,7.9)));
  return o;
};
// 4. dziewięć dobrych akcji bez echa, jedna zła zostaje na tydzień
S[4]=t=>{
  let o=title(t,'Mózg szuka ','braków');
  const dim=eio(seg(t,4.0,5.0)), mv=eio(seg(t,4.4,5.8));
  for(let i=0;i<10;i++){
    const a=0.8+i*0.22, op=eo(seg(t,a,a+0.3)), x=140+i*88;
    if(i===6){
      const cx=x+(870-x)*mv, cy=190+(345-190)*mv, r=30+36*mv+(t>5.8?4*Math.sin((t-5.8)*4):0);
      o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+14)+'" fill="'+RED+'" opacity="'+(0.18*op*mv)+'"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+RED+'" opacity="'+op+'"/>';
    } else {
      o+='<circle cx="'+x+'" cy="190" r="'+(30-12*dim)+'" fill="#EDEFF3" opacity="'+(op*(1-0.8*dim))+'"/>';
    }
  }
  o+=tx(540,272,'9 dobrych akcji',34,'#fff',600,'middle',eo(seg(t,3.2,3.7))*(1-seg(t,4.0,4.3)));
  o+=tx(540,272,'przechodzi bez echa',34,MUTED,600,'middle',eo(seg(t,4.3,4.8)));
  o+=tx(540,485,'jedna zła siedzi w głowie przez tydzień',36,Y,800,'middle',eo(seg(t,6.2,6.8)));
  const days=['pn','wt','śr','czw','pt','sob','nd'], wk=eo(seg(t,7.4,8.0));
  for(let i=0;i<7;i++){ const lit=eo(seg(t,8.2+i*0.4,8.5+i*0.4)); o+='<g opacity="'+wk+'"><rect x="'+(113+i*124)+'" y="520" width="110" height="52" rx="14" fill="'+GREY+'"/><rect x="'+(113+i*124)+'" y="520" width="110" height="52" rx="14" fill="'+RED+'" opacity="'+lit+'"/>'+tx(168+i*124,555,days[i],28,'#fff',800)+'</g>'; }
  return o;
};
// 5. pamięć wybiórcza: setki treningów w szarej plamie, jeden dzień w kolorze
S[5]=t=>{
  let o=title(t,'Pamięć ','wybiórcza');
  const blur=eio(seg(t,3.0,4.6));
  o+='<g filter="'+(blur>0.05?'url(#bl)':'none')+'" opacity="'+(1-0.45*blur)+'">';
  for(let i=0;i<32;i++){ const r=Math.floor(i/8), c=i%8, a=0.5+i*0.05, op=eo(seg(t,a,a+0.25)); o+='<rect x="'+(140+c*60)+'" y="'+(150+r*60)+'" width="50" height="50" rx="9" fill="'+(i%3?'#6B7280':'#4B5563')+'" opacity="'+op+'"/>'; }
  o+='</g>';
  const k=eo(seg(t,4.6,5.6)), pulse=t>5.6?1+0.02*Math.sin((t-5.6)*4):1;
  o+='<g opacity="'+k+'" transform="translate(810 280) scale('+((0.7+0.3*k)*pulse)+') translate(-810 -280)"><rect x="720" y="190" width="180" height="180" rx="22" fill="'+RED+'"/><rect x="738" y="208" width="144" height="144" rx="14" fill="none" stroke="#fff" stroke-width="3" opacity="0.5"/></g>';
  o+=tx(375,450,'Setki treningów',32,'#fff',800,'middle',eo(seg(t,2.4,3.0)));
  o+=tx(375,490,'zlewają się w szarą plamę',28,MUTED,600,'middle',eo(seg(t,3.0,3.6)));
  o+=tx(810,450,'Jeden słabszy dzień',32,'#fff',800,'middle',eo(seg(t,5.6,6.2)));
  o+=tx(810,488,'w kolorze',28,LRED,600,'middle',eo(seg(t,6.2,6.8)));o+=tx(810,522,'i wysokiej rozdzielczości',26,LRED,600,'middle',eo(seg(t,6.4,7.0)));
  o+=tx(540,578,'przed startem pamięć sięga po to, co poszło źle',30,Y,800,'middle',eo(seg(t,7.6,8.3)));
  return o;
};
// 6. cały sezon kontra cudzy najlepszy kadr
S[6]=t=>{
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
  o+=tx(540,312,'VS',34,MUTED,800,'middle',eo(seg(t,2.6,3.1)));
  o+=tx(270,455,'znasz go od kuchni',28,MUTED,600,'middle',eo(seg(t,5.0,5.6)));
  o+=tx(810,455,'widzisz wyniki i filmiki',28,MUTED,600,'middle',eo(seg(t,5.6,6.2)));
  o+=tx(540,530,'wypada na Twoją niekorzyść',40,'#fff',800,'middle',eo(seg(t,7.2,7.9)));
  return o;
};
// 7. tydzień przed startem: tryb ochrony podsuwa wątpliwości zamiast faktów
S[7]=t=>{
  let o=title(t,'Tydzień ','przed startem');
  const c=eo(seg(t,0.6,1.2));
  o+='<g opacity="'+c+'"><rect x="370" y="130" width="340" height="76" rx="38" fill="'+GREY+'" stroke="'+Y+'" stroke-width="3"/>'+tx(540,181,'Tryb ochrony',34,'#fff',800)+'</g>';
  const p1=eio(seg(t,1.6,2.4)), x1=470+(340-470)*p1, y1=210+(300-210)*p1;
  o+='<line x1="470" y1="210" x2="'+x1+'" y2="'+y1+'" stroke="'+Y+'" stroke-width="5" stroke-linecap="round" opacity="'+(p1>0?1:0)+'"/>';
  if(p1>=1) o+='<polygon points="340,304 322,286 354,284" fill="'+Y+'"/>';
  const l=eo(seg(t,2.2,2.9));
  o+='<g opacity="'+l+'" transform="translate(285 340) scale('+(0.85+0.15*l)+') translate(-285 -340)"><rect x="110" y="300" width="350" height="80" rx="40" fill="'+RED+'"/>'+tx(285,352,'wątpliwości',36,'#fff',800)+'</g>';
  o+=tx(285,430,'podsuwane jako dowód',28,'#fff',600,'middle',eo(seg(t,3.4,4.0)));
  const p2=eio(seg(t,3.6,4.2)), x2=610+(745-610)*p2, y2=210+(300-210)*p2;
  o+='<line x1="610" y1="210" x2="'+x2+'" y2="'+y2+'" stroke="'+MUTED+'" stroke-width="3" stroke-dasharray="8 8" opacity="'+(p2>0?0.6:0)+'"/>';
  const r=eo(seg(t,4.0,4.6));
  o+='<g opacity="'+(0.55*r)+'"><rect x="620" y="300" width="350" height="80" rx="40" fill="none" stroke="#fff" stroke-width="3"/>'+tx(795,352,'fakty',36,'#fff',800)+'</g>';
  o+=tx(795,430,'zostają w tle',28,MUTED,600,'middle',eo(seg(t,5.0,5.6)));
  o+='<g opacity="'+eo(seg(t,6.6,7.2))+'"><rect x="90" y="475" width="410" height="60" rx="30" fill="none" stroke="'+Y+'" stroke-width="3"/>'+tx(295,514,'wrażenie: mogłem więcej',28,'#fff',800)+'</g>';
  const p3=eio(seg(t,7.4,8.0));
  o+='<line x1="505" y1="505" x2="'+(505+60*p3)+'" y2="505" stroke="'+Y+'" stroke-width="5" stroke-linecap="round" opacity="'+(p3>0?1:0)+'"/>';
  o+='<g opacity="'+eo(seg(t,8.0,8.6))+'"><rect x="580" y="475" width="410" height="60" rx="30" fill="'+GREY+'"/>'+tx(785,514,'tak działa głowa pod presją',26,'#fff',800)+'</g>';
  return o;
};
// 8. pewność budowana na wynikach (zmienne) i na przygotowaniu (fundament)
S[8]=t=>{
  let o=title(t,'Na czym budujesz ','pewność');
  o+=tx(290,150,'Wyniki',36,'#fff',800,'middle',eo(seg(t,0.6,1.2)));
  o+=tx(790,150,'Przygotowanie',36,'#fff',800,'middle',eo(seg(t,3.2,3.8)));
  o+='<line x1="90" y1="410" x2="490" y2="410" stroke="#3A4352" stroke-width="3"/>';
  o+=poly([[95,330],[150,210],[210,350],[270,200],[330,320],[390,185],[450,300],[490,230]],eio(seg(t,1.2,3.0)),LRED,7);
  o+=tx(290,495,'zmienne',32,LRED,800,'middle',eo(seg(t,3.0,3.6)));
  for(let i=0;i<5;i++){ const a=3.8+i*0.5, op=eo(seg(t,a,a+0.4)); o+='<rect x="590" y="'+(395-i*56)+'" width="400" height="48" rx="12" fill="'+(i===0?RED:'#3A4352')+'" opacity="'+op+'" transform="translate(0 '+(20*(1-op))+')"/>'; }
  o+=tx(790,495,'fundament',32,Y,800,'middle',eo(seg(t,6.4,7.0)));
  o+=tx(540,555,'wyniki się zmieniają, przygotowanie zostaje',34,'#fff',800,'middle',eo(seg(t,7.6,8.3)));
  return o;
};
// 9. kartka z dowodami
S[9]=t=>{
  let o=title(t,'Kartka z ','dowodami');
  const c=eo(seg(t,0.6,1.2));
  o+='<g opacity="'+c+'" transform="translate(0 '+(20*(1-c))+')"><rect x="190" y="120" width="700" height="400" rx="26" fill="'+CREAM+'"/>'+tx(235,182,'Moje dowody',34,INK,800,'start')+'<line x1="235" y1="206" x2="845" y2="206" stroke="#D9CFCB" stroke-width="2"/></g>';
  const L=['Ile treningów za mną','Co poprawione od zeszłego sezonu','Co wychodzi mi teraz','Co pół roku temu sprawiało kłopot'];
  for(let i=0;i<4;i++){
    const a=2.2+i*2.2, y=262+i*62, w=eo(seg(t,a,a+1.0))*580;
    o+='<clipPath id="c'+i+'"><rect x="285" y="'+(y-34)+'" width="'+w+'" height="48"/></clipPath>';
    o+='<g clip-path="url(#c'+i+')">'+tx(285,y,L[i],28,INK,600,'start')+'</g>';
    o+='<rect x="235" y="'+(y-26)+'" width="32" height="32" rx="8" fill="none" stroke="#B9AEAA" stroke-width="3" opacity="'+eo(seg(t,a,a+0.3))+'"/>';
    o+=poly([[241,y-8],[249,y],[262,y-18]],eio(seg(t,a+1.1,a+1.5)),RED,6);
  }
  o+=tx(540,572,'same fakty, nic więcej',34,Y,800,'middle',eo(seg(t,11.2,11.9)));
  return o;
};
// 10. wieczorem przed startem głowa idzie spać z faktami zamiast wątpliwości
S[10]=t=>{
  let o=title(t,'Wieczorem ','przed startem');
  const m=eo(seg(t,0.6,1.3));
  o+='<g opacity="'+m+'"><circle cx="930" cy="170" r="46" fill="#EDEFF3"/><circle cx="952" cy="156" r="40" fill="#171B22"/><circle cx="820" cy="130" r="4" fill="#EDEFF3"/><circle cx="860" cy="215" r="3" fill="#EDEFF3"/><circle cx="780" cy="200" r="3" fill="#EDEFF3"/></g>';
  const h=eo(seg(t,1.3,2.0));
  o+='<g opacity="'+h+'"><circle cx="250" cy="350" r="56" fill="#EDEFF3"/><path d="M130 500 Q250 400 370 500 Z" fill="#EDEFF3"/><ellipse cx="250" cy="195" rx="150" ry="58" fill="'+GREY+'" stroke="'+MUTED+'" stroke-width="2"/><circle cx="262" cy="270" r="11" fill="'+GREY+'"/><circle cx="256" cy="300" r="6" fill="'+GREY+'"/></g>';
  const sw=eo(seg(t,3.4,4.0));
  o+=tx(250,205,'wątpliwości',34,LRED,800,'middle',eo(seg(t,1.8,2.4))*(1-sw));
  o+=tx(250,205,'fakty',38,'#fff',800,'middle',sw);
  const cs=eo(seg(t,2.6,3.4));
  o+='<g opacity="'+cs+'" transform="translate('+(60*(1-cs))+' 0)"><rect x="580" y="230" width="240" height="250" rx="20" fill="'+CREAM+'"/>';
  for(let i=0;i<3;i++){ o+='<rect x="606" y="'+(262+i*62)+'" width="26" height="26" rx="7" fill="none" stroke="#B9AEAA" stroke-width="3"/>'+poly([[611,(275+i*62)],[618,(282+i*62)],[628,(268+i*62)]],eio(seg(t,3.2+i*0.4,3.6+i*0.4)),RED,5)+'<rect x="646" y="'+(268+i*62)+'" width="'+(130-i*20)+'" height="12" rx="6" fill="#D9CFCB"/>'; }
  o+='</g>';
  const ar=eio(seg(t,4.2,5.0));
  o+='<line x1="570" y1="300" x2="'+(570-170*ar)+'" y2="'+(300-70*ar)+'" stroke="'+Y+'" stroke-width="5" stroke-linecap="round" opacity="'+(ar>0?1:0)+'"/>';
  o+=tx(540,545,'głowa idzie spać z faktami',38,Y,800,'middle',eo(seg(t,6.0,6.7)));
  return o;
};
// 11. spiżarnia: pełna, tylko nikt do niej nie zaglądał
S[11]=t=>{
  let o=title(t,'Twoja ','spiżarnia');
  o+='<rect x="90" y="345" width="900" height="14" rx="7" fill="#4B5563"/>';
  const names=['treningi','poprawki','co wychodzi','pół roku temu','dowody'];
  for(let i=0;i<5;i++){
    const x=125+i*172, a=0.8+i*0.7, f=eio(seg(t,a,a+0.9)), ap=eo(seg(t,a-0.3,a+0.1));
    o+='<g opacity="'+ap+'"><rect x="'+x+'" y="185" width="130" height="160" rx="20" fill="none" stroke="'+MUTED+'" stroke-width="3"/><clipPath id="j'+i+'"><rect x="'+x+'" y="185" width="130" height="160" rx="20"/></clipPath><g clip-path="url(#j'+i+')"><rect x="'+x+'" y="'+(345-160*f)+'" width="130" height="'+(160*f)+'" fill="'+Y+'"/></g>'+tx(x+65,395,names[i],i>2?22:26,'#fff',600)+'</g>';
  }
  const sw=eio(seg(t,5.2,7.2));
  if(sw>0&&sw<1) o+='<rect x="'+(60+sw*900)+'" y="170" width="110" height="200" rx="30" fill="#fff" opacity="0.18"/>';
  o+=tx(540,500,'pełna, tylko nikt do niej nie zaglądał',36,Y,800,'middle',eo(seg(t,4.2,4.9)));
  return o;
};
// 12. pewność się chwieje, przygotowanie zostaje
S[12]=t=>{
  let o=title(t,'Pewność może się ','chwiać');
  o+='<line x1="120" y1="520" x2="960" y2="520" stroke="#3A4352" stroke-width="3"/>';
  const b=eo(seg(t,0.5,1.1));
  o+='<g opacity="'+b+'" transform="translate(540 520) scale(1 '+b+') translate(-540 -520)"><rect x="240" y="440" width="600" height="80" rx="16" fill="'+RED+'"/>'+tx(540,492,'Przygotowanie',36,'#fff',800)+'</g>';
  const d=eio(seg(t,1.2,1.9)), drop=(1-d)*-140;
  const ang=t>2.2&&t<8.6?9*Math.sin((t-2.2)*5)*(1-0.6*seg(t,6.5,8.6)):0;
  o+='<g opacity="'+eo(seg(t,1.2,1.5))+'" transform="translate(0 '+drop+') rotate('+ang+' 540 440)"><rect x="390" y="330" width="300" height="110" rx="20" fill="'+GREY+'" stroke="'+Y+'" stroke-width="4"/>'+tx(540,396,'Pewność siebie',32,'#fff',800)+'</g>';
  o+=tx(540,578,'przygotowanie zostaje',38,Y,800,'middle',eo(seg(t,4.6,5.3)));
  return o;
};
// 13. pytanie do widza: za co możesz się dziś docenić
S[13]=t=>{
  let o=title(t,'Za co możesz się ','dziś docenić?');
  const c=eo(seg(t,0.6,1.3));
  o+='<g opacity="'+c+'"><rect x="120" y="170" width="840" height="130" rx="34" fill="'+GREY+'"/><circle cx="190" cy="235" r="30" fill="'+Y+'"/>';
  for(let i=0;i<3;i++){ o+='<circle cx="'+(330+i*50)+'" cy="'+(235-9*Math.max(0,Math.sin(t*5-i*0.8)))+'" r="10" fill="'+MUTED+'"/>'; }
  o+='</g>';
  o+=tx(540,400,'napisz mi jedną rzecz w komentarzu',36,Y,800,'middle',eo(seg(t,2.6,3.3)));
  o+=tx(540,470,'Pewność ma prawo się chwiać, przygotowanie zostaje',28,MUTED,600,'middle',eo(seg(t,4.6,5.3)));
  return o;
};
window.draw=(n,t,D)=>{
  const fade=1-seg(t,D-0.4,D);
  const k=(n%2?1+0.05*(t/D):1.05-0.05*(t/D));
  document.getElementById('s').innerHTML=bgGlow+'<text x="540" y="150" font-size="34" font-weight="800" fill="#A9B0BC" text-anchor="middle" letter-spacing="2">@psychologsportu</text><g transform="translate(0 240)"><g opacity="'+fade+'"><g transform="translate(540 300) scale('+k+') translate(-540 -300)">'+S[n](t)+'</g></g></g>';
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
  const nn = String(n).padStart(2, '0');
  const fdir = path.join(out, 'frames-' + nn);
  fs.mkdirSync(fdir, { recursive: true });
  const total = D * FPS;
  for (let i = 0; i < total; i++) {
    await p.evaluate(([a, t, d]) => window.draw(a, t, d), [n, i / FPS, D]);
    await p.screenshot({ path: path.join(fdir, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 98 });
  }
  await b.close();
  fs.unlinkSync(tmp);
  execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${fdir}/%04d.jpg -c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p ${path.join(out, 'scena-' + nn + '.mp4')}`);
  fs.rmSync(fdir, { recursive: true, force: true });
  console.log('ok scena', nn);
}
main();
