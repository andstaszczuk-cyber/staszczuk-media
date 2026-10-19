// node stories.js outDir  -> 1080x1920 IG stories announcing the two new profiles
const fs=require('fs'),path=require('path');
const {page,shield,MARKS,render}=require('./kit');
const out=process.argv[2]; fs.mkdirSync(out,{recursive:true});
const W=1080,H=1920;
const top=`<div style="position:absolute;top:120px;left:0;right:0;text-align:center;font-family:Pop;font-weight:500;font-size:34px;opacity:.9">@psychologsportu</div>`;
const sticker=t=>`<div style="position:absolute;left:140px;right:140px;bottom:300px;height:150px;border:4px dashed rgba(255,255,255,.55);border-radius:28px;display:flex;align-items:center;justify-content:center;font-family:Pop;font-weight:500;font-size:30px;opacity:.75">${t}</div>`;
const S=[
`${top}<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 100px;text-align:center;gap:50px">
 <div style="font-family:Pop;font-weight:500;font-size:44px;color:#FCE86A">Mam dla Was nowość</div>
 <div style="font-weight:800;font-size:112px;line-height:1.1">Powstały<br><span class="y">dwa nowe</span><br>profile</div>
 <div style="width:140px;height:8px;background:#FCE86A"></div>
 <div style="font-family:Pop;font-weight:500;font-size:46px;line-height:1.45">Dla sędziów<br>i dla rodziców<br>młodych sportowców</div></div>
 <div style="position:absolute;bottom:160px;left:0;right:0;text-align:center;font-family:Pop;font-weight:500;font-size:36px;color:#FCE86A">stuknij dalej →</div>`,
`${top}<div style="position:absolute;top:260px;left:0;right:0;display:flex;justify-content:center">${shield(MARKS.sedzia,{w:230})}</div>
 <div style="position:absolute;top:680px;left:90px;right:90px;text-align:center">
 <div class="wm" style="font-size:120px">SĘDZIA<br><span class="y">Z GŁOWĄ</span></div>
 <div style="font-family:Pop;font-weight:500;font-size:44px;line-height:1.45;margin-top:50px">Psychologia sędziowania:<br>presja, błędy, pewność siebie<br>i reset po trudnym meczu.</div>
 <div style="font-weight:800;font-size:56px;margin-top:46px;color:#FCE86A">@sedziazglowa</div></div>`,
`${top}<div style="position:absolute;top:260px;left:0;right:0;display:flex;justify-content:center">${shield(MARKS.rodzina,{w:230})}</div>
 <div style="position:absolute;top:680px;left:90px;right:90px;text-align:center">
 <div class="wm" style="font-size:120px">SPORTOWA<br><span class="y">RODZINA</span></div>
 <div style="font-family:Pop;font-weight:500;font-size:44px;line-height:1.45;margin-top:50px">Dla rodziców sportowców:<br>jak wspierać dziecko,<br>żeby sport dawał mu radość.</div>
 <div style="font-weight:800;font-size:56px;margin-top:46px;color:#FCE86A">@sportowarodzina</div></div>`,
`${top}<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 100px;text-align:center;gap:56px">
 <div style="font-weight:800;font-size:96px;line-height:1.15">Znasz sędziego<br>albo rodzica<br><span class="y">sportowca?</span></div>
 <div style="width:140px;height:8px;background:#FCE86A"></div>
 <div style="font-family:Pop;font-weight:500;font-size:46px;line-height:1.45">Udostępnij mu tę relację.<br>Regularnie nowe,<br>praktyczne treści.</div>
 <div style="font-family:Pop;font-weight:500;font-size:42px;line-height:1.6"><span class="y">@sedziazglowa</span><br><span class="y">@sportowarodzina</span></div></div>`
];
(async()=>{for(let i=0;i<S.length;i++){await render(page(S[i],{w:W,h:H}),path.join(out,`relacja-${i+1}.png`),W,H);console.log('ok',i+1)}})();
