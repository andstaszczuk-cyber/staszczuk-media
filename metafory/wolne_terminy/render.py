#!/usr/bin/env python3
"""Relacja IG: wolne terminy. Użycie: python3 -I render.py spec.json out.png
spec: {"title2":"w tym tygodniu","rows":[["czwartek","12.11",["17:15"]],...]}  (max 6 wierszy, godziny czasu polskiego)"""
import json,sys,tempfile,os
spec=json.load(open(sys.argv[1]))
CSS="""*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;font-family:Lato,'Helvetica Neue',Arial,sans-serif;color:#fff;background:radial-gradient(circle at 30% 20%,#c32d3b,#8f1b26);padding:0 90px;position:relative}
.k{position:absolute;top:230px;left:90px;right:90px;display:flex;justify-content:space-between;color:#f4d332;font-weight:800;font-size:34px;letter-spacing:6px;border-bottom:2px solid #d9953a;padding-bottom:22px}
h1{position:absolute;top:330px;left:90px;font-size:92px;line-height:1.05;font-weight:900}h1 span{color:#f4d332}
.sub{position:absolute;top:580px;left:90px;font-size:40px;color:#f6d9d9;font-weight:600}
.l{position:absolute;top:690px;left:90px;right:90px}
.r{display:flex;align-items:center;border-bottom:1px solid rgba(255,255,255,.25);padding:24px 0}
.d{width:320px;font-size:40px;font-weight:900;color:#f4d332}.d small{display:block;font-size:28px;color:#fff;font-weight:600;letter-spacing:2px}
.t{display:flex;gap:10px;flex-wrap:wrap}.t b{background:#fff;color:#8f1b26;font-size:34px;padding:6px 14px;border-radius:40px;font-weight:900}
.h{position:absolute;bottom:110px;left:90px;font-size:34px;color:#f6d9d9;font-weight:700}"""
rows=''.join("<div class=r><div class=d>%s<small>%s</small></div><div class=t>%s</div></div>"%(d,dt,''.join('<b>%s</b>'%x for x in ts)) for d,dt,ts in spec['rows'])
html="<!doctype html><meta charset=utf-8><style>%s</style><div class=k><span>SESJE ONLINE</span><span>ZOOM</span></div><h1>Wolne <span>terminy</span><br>%s</h1><div class=sub>Sesja indywidualna, 60 minut</div><div class=l>%s</div><div class=h>@psychologsportu</div>"%(CSS,spec['title2'],rows)
f=tempfile.NamedTemporaryFile('w',suffix='.html',delete=False,encoding='utf-8');f.write(html);f.close()
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1080,'height':1920});pg.goto('file://'+f.name);pg.screenshot(path=sys.argv[2]);b.close()
os.unlink(f.name)
