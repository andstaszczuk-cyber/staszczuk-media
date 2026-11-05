// Wizualizacje do rolki mówionej AI ogłupia (Tryb 2: schemat u góry, Andrzej w kadrze pod spodem).
// Klip 1080x1920, 30 kl./s, grafitowe tło, znak @psychologsportu u góry, schemat na środku, w pasie 660–1260 px.
// Użycie: node wizualizacje-ai.js <numer sceny 1-15> <katalog wyjściowy>   (powstaje scena-NN.mp4)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);

const SCENES = { 1: 10, 2: 9, 3: 9, 4: 10, 5: 9, 6: 10, 7: 9, 8: 9, 9: 10, 10: 10, 11: 10, 12: 11, 13: 10, 14: 10, 15: 8 };
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
// 1. płacisz trenerowi, a on wkleja Twoją historię do czatu
S[1]=t=>{
  let o=title(t,'Płacisz za ','kopiuj-wklej');
  const a=eo(seg(t,0.5,1.2));
  o+='<g opacity="'+a+'"><rect x="90" y="170" width="260" height="170" rx="26" fill="'+GREY+'"/>'+tx(220,245,'300–500 zł',40,Y,800)+tx(220,295,'za sesję',28,MUTED,600)+'</g>';
  const m=eio(seg(t,1.6,3.0));
  o+='<g opacity="'+eo(seg(t,1.4,1.8))+'"><rect x="'+(395+120*m)+'" y="210" width="110" height="80" rx="14" fill="'+CREAM+'"/>'+[0,1,2].map(i=>'<rect x="'+(410+120*m)+'" y="'+(228+i*18)+'" width="'+(80-i*18)+'" height="8" rx="4" fill="'+GREY+'"/>').join('')+'</g>';
  o+='<g opacity="'+eo(seg(t,2.8,3.4))+'"><rect x="680" y="160" width="310" height="190" rx="30" fill="'+GREY+'" stroke="'+MUTED+'" stroke-width="3"/>'+tx(835,215,'CZAT',30,MUTED,800);
  for(let i=0;i<3;i++){const w=230*eo(seg(t,3.6+i*0.5,4.2+i*0.5));o+='<rect x="720" y="'+(245+i*28)+'" width="'+w+'" height="12" rx="6" fill="'+MUTED+'"/>';}
  o+='</g>';
  o+=tx(540,450,'Twoja historia idzie do maszyny',36,'#fff',800,'middle',eo(seg(t,5.4,6.0)));
  o+=tx(540,505,'a Ty dostajesz to, co wypluła',30,LRED,600,'middle',eo(seg(t,6.6,7.2)));
  return o;
};
// 2. MIT: aktywność mózgu przy pisaniu: sam, wyszukiwarka, AI
S[2]=t=>{
  let o=title(t,'Aktywność ','mózgu');
  const L=[['sam',300,Y],['z wyszukiwarką',200,'#EDEFF3'],['z AI',85,RED]];
  L.forEach(([n,h,c],i)=>{const x=200+i*270,k=eio(seg(t,1.0+i*0.9,2.4+i*0.9));
    o+='<rect x="'+(x-70)+'" y="'+(470-h*k)+'" width="140" height="'+(h*k)+'" rx="16" fill="'+c+'"/>'+tx(x,515,n,30,'#fff',600,'middle',eo(seg(t,0.8+i*0.9,1.4+i*0.9)));});
  o+='<line x1="100" y1="472" x2="980" y2="472" stroke="'+MUTED+'" stroke-width="3"/>';
  o+=tx(540,160,'badanie MIT: pisanie opowiadań',30,MUTED,600,'middle',eo(seg(t,0.4,1.0)));
  o+=tx(740,300,'najniżej',34,LRED,800,'middle',eo(seg(t,5.4,6.0)));
  return o;
};
// 3. ponad 80% nie przytoczyło ani zdania z własnego tekstu
S[3]=t=>{
  let o=title(t,'Kilka minut ','później');
  for(let i=0;i<10;i++){const x=150+i*87,op=eo(seg(t,0.6+i*0.12,0.9+i*0.12)),red=i<8&&t>2.4+i*0.15;
    o+='<g opacity="'+op+'"><circle cx="'+x+'" cy="210" r="26" fill="'+(red?RED:'#EDEFF3')+'"/><rect x="'+(x-24)+'" y="245" width="48" height="80" rx="20" fill="'+(red?RED:'#EDEFF3')+'"/></g>';}
  o+=tx(540,430,'ponad 80%',64,Y,800,'middle',eo(seg(t,4.2,4.8)));
  o+=tx(540,490,'nie umiało przytoczyć ani zdania z własnego tekstu',30,'#fff',600,'middle',eo(seg(t,5.2,5.8)));
  return o;
};
// 4. po czterech miesiącach: sami w górę, grupa z AI w dół
S[4]=t=>{
  let o=title(t,'Po czterech ','miesiącach');
  o+='<line x1="120" y1="470" x2="960" y2="470" stroke="'+MUTED+'" stroke-width="3"/>'+tx(960,510,'4 miesiące',26,MUTED,600,'end',eo(seg(t,0.6,1.2)));
  const k=eio(seg(t,1.2,5.0));
  o+=poly([[120,330],[330,300],[540,265],[750,220],[960,170]],k,Y,10);
  o+=poly([[120,330],[330,345],[540,365],[750,395],[960,430]],k,RED,10);
  o+=tx(960,150,'pisali sami',30,Y,800,'end',eo(seg(t,5.0,5.6)));
  o+=tx(960,420,'z AI',30,LRED,800,'end',eo(seg(t,5.4,6.0)));
  o+=tx(540,560,'kompetencje wyraźnie słabsze',34,'#fff',800,'middle',eo(seg(t,6.6,7.2)));
  return o;
};
// 5. paradoks: skuteczność zostaje, rozumowanie spada
S[5]=t=>{
  let o=title(t,'Paradoks ','AI');
  const b=(y,lab,w,c,op)=>'<g opacity="'+op+'">'+tx(120,y-18,lab,32,'#fff',600,'start')+'<rect x="120" y="'+y+'" width="840" height="56" rx="28" fill="'+GREY+'"/><rect x="120" y="'+y+'" width="'+w+'" height="56" rx="28" fill="'+c+'"/></g>';
  o+=b(210,'Skuteczność',760*eio(seg(t,1.0,2.2)),Y,eo(seg(t,0.6,1.0)));
  o+=b(360,'Rozumowanie i wnioskowanie',760-560*eio(seg(t,3.4,5.4)),RED,eo(seg(t,2.6,3.0)));
  o+=tx(540,520,'rozwiązanie jest, myślenia coraz mniej',34,Y,800,'middle',eo(seg(t,6.0,6.6)));
  return o;
};
// 6. dziś łatwiej, w długim terminie gorzej
S[6]=t=>{
  let o=title(t,'Dziś łatwiej, ','jutro trudniej');
  o+='<line x1="120" y1="470" x2="960" y2="470" stroke="'+MUTED+'" stroke-width="3"/>';
  o+=tx(180,510,'dziś',28,MUTED,600,'middle',eo(seg(t,0.6,1.0)))+tx(900,510,'za rok',28,MUTED,600,'middle',eo(seg(t,0.6,1.0)));
  const k=eio(seg(t,1.0,5.4));
  o+=poly([[120,400],[260,250],[420,230],[600,290],[780,360],[960,420]],k,RED,10);
  o+=poly([[120,400],[300,370],[500,320],[720,250],[960,180]],k,Y,10);
  o+=tx(300,210,'gotowe odpowiedzi',28,LRED,800,'middle',eo(seg(t,2.2,2.8)));
  o+=tx(900,160,'własny wysiłek',28,Y,800,'end',eo(seg(t,5.4,6.0)));
  o+=tx(540,570,'to, co dziś ułatwia, z czasem hamuje rozwój',32,'#fff',800,'middle',eo(seg(t,6.8,7.4)));
  return o;
};
// 7. na zawodach telefon zostaje w szafce, jesteś Ty i Twoja głowa
S[7]=t=>{
  let o=title(t,'Na zawodach ','jesteś Ty');
  o+='<g opacity="'+eo(seg(t,0.5,1.0))+'"><rect x="140" y="150" width="260" height="360" rx="14" fill="'+GREY+'" stroke="'+MUTED+'" stroke-width="3"/><line x1="270" y1="150" x2="270" y2="510" stroke="'+MUTED+'" stroke-width="3"/>'+[0,1,2].map(i=>'<rect x="'+(160)+'" y="'+(175+i*16)+'" width="90" height="6" rx="3" fill="'+MUTED+'"/>').join('')+tx(270,550,'szafka',26,MUTED,600)+'</g>';
  const m=eio(seg(t,1.4,3.2));
  o+='<g transform="translate('+(520-340*m)+' '+(220+120*m)+') scale('+(1-0.35*m)+')"><rect x="0" y="0" width="120" height="210" rx="22" fill="'+CREAM+'"/><rect x="12" y="24" width="96" height="150" rx="8" fill="#5B6472"/>'+[0,1,2].map(i=>'<rect x="22" y="'+(40+i*22)+'" width="'+(70-i*14)+'" height="8" rx="4" fill="'+CREAM+'"/>').join('')+'</g>';
  const h=eo(seg(t,3.8,4.6));
  o+='<g opacity="'+h+'"><circle cx="760" cy="230" r="70" fill="'+Y+'"/><rect x="680" y="320" width="160" height="200" rx="60" fill="'+Y+'"/><circle cx="760" cy="230" r="'+(90+6*Math.sin(t*3))+'" fill="none" stroke="'+Y+'" stroke-width="4" opacity="0.4"/></g>';
  o+=tx(760,580,'Ty i Twoja głowa',32,'#fff',800,'middle',eo(seg(t,5.0,5.6)));
  return o;
};
// 8. odtwarzasz rozwiązanie, ale nie znasz silnika w środku
S[8]=t=>{
  let o=title(t,'Jak działa ','silnik?');
  const c=eo(seg(t,0.5,1.1)), open=eio(seg(t,4.0,5.4));
  o+='<g opacity="'+c+'">';
  const gear=(cx,cy,r,rot,col)=>{let g='<g transform="rotate('+rot+' '+cx+' '+cy+')">';for(let i=0;i<8;i++)g+='<rect x="'+(cx-10)+'" y="'+(cy-r-16)+'" width="20" height="26" rx="4" fill="'+col+'" transform="rotate('+i*45+' '+cx+' '+cy+')"/>';return g+'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+col+'"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r*0.35+'" fill="'+INK+'"/></g>';};
  o+=gear(470,320,62,t*40,Y)+gear(610,300,44,-t*57,'#EDEFF3');
  o+='<rect x="'+(330+520*open)+'" y="190" width="420" height="250" rx="26" fill="'+GREY+'" stroke="'+MUTED+'" stroke-width="3" opacity="'+(1-open)+'"/>';
  o+=tx(540,'335',open<0.3?'DZIAŁA':'',44,'#fff',800,'middle',1-seg(t,3.8,4.2));
  o+='</g>';
  o+=tx(540,500,'wdrażasz coś, co działa',32,'#fff',600,'middle',eo(seg(t,1.8,2.4)));
  o+=tx(540,550,'i nie wiesz, dlaczego działa',32,LRED,800,'middle',eo(seg(t,2.8,3.4)));
  return o;
};
// 9. workslop: wygląda profesjonalnie, po chwili bełkot
S[9]=t=>{
  let o=title(t,'','Workslop');
  const a=eo(seg(t,0.5,1.1)), mess=eio(seg(t,4.0,6.0));
  o+='<g opacity="'+a+'"><rect x="300" y="140" width="480" height="380" rx="18" fill="'+CREAM+'"/><rect x="340" y="175" width="260" height="22" rx="8" fill="'+INK+'"/>';
  for(let i=0;i<9;i++){const y=230+i*30,w=(i%3===2?260:380),dx=mess*((i*37)%60-30),r=mess*((i*53)%30-15);
    o+='<rect x="'+(340+dx)+'" y="'+y+'" width="'+w+'" height="12" rx="6" fill="'+(mess>0.5&&i%2?LRED:'#5B6472')+'" transform="rotate('+r+' '+(340+w/2)+' '+y+')"/>';}
  o+='</g>';
  o+=tx(540,95+500,'',1,'#fff');
  o+=tx(160,250,'wygląda',26,MUTED,600,'middle',eo(seg(t,1.6,2.2)))+tx(160,290,'profesjonalnie',28,'#fff',800,'middle',eo(seg(t,2.0,2.6)));
  o+=tx(920,380,'po chwili',26,MUTED,600,'middle',eo(seg(t,5.4,6.0)))+tx(920,420,'bełkot',36,LRED,800,'middle',eo(seg(t,5.8,6.4)));
  o+=tx(540,580,'AI dokłada roboty: ciągle trzeba sprawdzać',30,Y,800,'middle',eo(seg(t,7.0,7.6)));
  return o;
};
// 10. wszyscy zaczynają pisać na jedno kopyto
S[10]=t=>{
  let o=title(t,'Wszyscy ','na jedno kopyto');
  const cols=[Y,RED,'#5FB3A8','#8E7CC3','#EDEFF3','#E89B4C'], k=eio(seg(t,3.0,5.2));
  for(let i=0;i<12;i++){const r=Math.floor(i/6),c=i%6,x=150+c*156,y=230+r*170,op=eo(seg(t,0.5+i*0.1,0.8+i*0.1));
    const s0=[40,60,50,70,45,55][(i*5)%6], s=s0+(52-s0)*k, rr=[0,30,8,20,14,26][(i*7)%6]*(1-k)+12*k;
    const col=k>0.6?'#6B7280':cols[i%6];
    o+='<rect x="'+(x-s/2)+'" y="'+(y-s/2)+'" width="'+s+'" height="'+s+'" rx="'+rr+'" fill="'+col+'" opacity="'+op+'" transform="rotate('+((i*23)%40-20)*(1-k)+' '+x+' '+y+')"/>';}
  o+=tx(540,150,'teksty z AI: trochę ciekawsze, coraz bardziej podobne',28,MUTED,600,'middle',eo(seg(t,1.6,2.2)));
  o+=tx(540,560,'a Ty potrzebujesz rozwiązania szytego pod Ciebie',32,Y,800,'middle',eo(seg(t,6.4,7.0)));
  return o;
};
// 11. co widzi psycholog, a co dostaje czat
S[11]=t=>{
  let o=title(t,'Co widzi ','czat?');
  o+=tx(270,150,'na spotkaniu',30,'#fff',800,'middle',eo(seg(t,0.5,1.0)))+tx(810,150,'w czacie',30,'#fff',800,'middle',eo(seg(t,4.8,5.3)));
  const items=[['głos',0],['żart, który coś przykrywa',1],['zaangażowanie',2],['to, czego nie mówisz',3]];
  items.forEach(([n,i])=>{const op=eo(seg(t,1.2+i*0.7,1.6+i*0.7));o+='<g opacity="'+op+'"><circle cx="110" cy="'+(220+i*80)+'" r="14" fill="'+Y+'"/>'+tx(140,230+i*80,n,30,'#fff',600,'start')+'</g>';});
  o+='<line x1="540" y1="170" x2="540" y2="520" stroke="'+GREY+'" stroke-width="3"/>';
  o+='<g opacity="'+eo(seg(t,5.2,5.8))+'"><rect x="620" y="250" width="380" height="110" rx="30" fill="'+GREY+'"/>'+tx(810,318,'tylko to, co napiszesz',28,MUTED,600)+'</g>';
  o+=tx(540,580,'opisujesz sytuację na tyle, na ile sam ją rozumiesz',28,Y,800,'middle',eo(seg(t,7.2,7.8)));
  return o;
};
// 12. nauka z AI: gotowe odpowiedzi kontra pytania, a potem sam
S[12]=t=>{
  let o=title(t,'Pytania ','zamiast gotowców');
  o+='<line x1="120" y1="470" x2="960" y2="470" stroke="'+MUTED+'" stroke-width="3"/><line x1="560" y1="160" x2="560" y2="470" stroke="'+GREY+'" stroke-width="3" stroke-dasharray="10 10"/>';
  o+=tx(340,510,'ćwiczenia z AI',26,MUTED,600,'middle',eo(seg(t,0.5,1.0)))+tx(760,510,'potem sam',26,MUTED,600,'middle',eo(seg(t,0.5,1.0)));
  const k=eio(seg(t,1.2,6.0));
  o+=poly([[120,420],[340,300],[560,250],[760,360],[960,420]],k,RED,10);
  o+=poly([[120,420],[340,340],[560,300],[760,240],[960,190]],k,Y,10);
  o+=tx(330,270,'gotowe odpowiedzi',26,LRED,800,'middle',eo(seg(t,3.0,3.6)));
  o+=tx(950,170,'AI zadawało pytania',26,Y,800,'end',eo(seg(t,6.0,6.6)));
  o+=tx(540,580,'rozwój zaczyna się, kiedy sam uczysz się myśleć',30,'#fff',800,'middle',eo(seg(t,7.6,8.2)));
  return o;
};
// 13. krok po kroku: w ten dzień robisz to, potem piszesz, jak poszło
S[13]=t=>{
  let o=title(t,'Krok ','po kroku');
  const st=[['ustalamy','co i kiedy'],['wdrażasz','na treningu'],['piszesz mi,','jak poszło'],['jeszcze raz','i jeszcze raz']];
  st.forEach(([a,b],i)=>{const x=165+i*250,op=eo(seg(t,0.8+i*1.3,1.3+i*1.3)),y=380-i*50;
    o+='<g opacity="'+op+'"><rect x="'+(x-100)+'" y="'+y+'" width="200" height="'+(470-y)+'" rx="16" fill="'+(i===3?Y:GREY)+'"/>'+tx(x,y+55,String(i+1),44,i===3?INK:Y,800)+tx(x,500,a,24,'#fff',600)+tx(x,532,b,24,MUTED,600)+'</g>';});
  o+=tx(540,600,'czat Ci tego nie dopilnuje',32,LRED,800,'middle',eo(seg(t,6.6,7.2)));
  return o;
};
// 14. najpierw sam, potem AI jako sparingpartner
S[14]=t=>{
  let o=title(t,'Najpierw ','sam');
  const box=(x,lab,sub,c,op)=>'<g opacity="'+op+'"><rect x="'+(x-140)+'" y="190" width="280" height="150" rx="26" fill="'+c+'"/>'+tx(x,255,lab,34,c===Y?INK:'#fff',800)+tx(x,300,sub,24,c===Y?INK:MUTED,600)+'</g>';
  o+=box(220,'Ty myślisz','co zadziałało?',Y,eo(seg(t,0.6,1.2)));
  o+='<g opacity="'+eo(seg(t,1.8,2.2))+'">'+poly([[380,265],[480,265]],eio(seg(t,1.8,2.6)),MUTED,6)+'</g>';
  o+=box(640,'AI','sparingpartner',GREY,eo(seg(t,2.6,3.2)));
  o+=tx(540,430,'Twoja głowa plus narzędzie to przewaga',34,Y,800,'middle',eo(seg(t,4.6,5.2)));
  o+=tx(540,490,'samo narzędzie to kopia kopii',32,LRED,800,'middle',eo(seg(t,6.2,6.8)));
  o+=tx(900,265,'=',60,'#fff',800,'middle',eo(seg(t,3.6,4.0)))+'<g opacity="'+eo(seg(t,3.8,4.4))+'"><circle cx="985" cy="262" r="42" fill="'+Y+'"/>'+poly([[965,262],[980,278],[1006,248]],eio(seg(t,4.2,4.8)),INK,8)+'</g>';
  return o;
};
// 15. napisz AI w komentarzu
S[15]=t=>{
  let o=title(t,'Napisz ','AI w komentarzu');
  const c=eo(seg(t,0.6,1.3));
  o+='<g opacity="'+c+'"><rect x="200" y="200" width="680" height="150" rx="40" fill="'+GREY+'"/><circle cx="280" cy="275" r="36" fill="'+Y+'"/>'+tx(560,298,'AI',72,'#fff',800,'middle',eo(seg(t,1.6,2.2)))+'</g>';
  o+=tx(540,450,'a wyślę Ci rozwiązanie',36,Y,800,'middle',eo(seg(t,2.8,3.4)));
  o+=tx(540,515,'krytycznego myślenia uczę w nowym kursie',28,MUTED,600,'middle',eo(seg(t,4.4,5.0)));
  return o;
};
window.draw=(n,t,D)=>{
  const fade=1-seg(t,D-0.4,D);
  const k=(n%2?1+0.05*(t/D):1.05-0.05*(t/D));
  document.getElementById('s').innerHTML=bgGlow+'<text x="540" y="590" font-size="34" font-weight="800" fill="#A9B0BC" text-anchor="middle" letter-spacing="2">@psychologsportu</text><g transform="translate(0 660)"><g opacity="'+fade+'"><g transform="translate(540 300) scale('+k+') translate(-540 -300)">'+S[n](t)+'</g></g></g>';
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
