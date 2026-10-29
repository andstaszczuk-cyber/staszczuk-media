import cairo, math, sys
WH=(1,1,1); YEL=(0xF5/255,0xD3/255,0x3A/255); INK=(0x1A/255,0x17/255,0x19/255)
def F(c,s,black=True): c.select_font_face('Lato Black' if black else 'Lato',0,0 if black else 1); c.set_font_size(s)
def bg(c,W,H):
    g=cairo.RadialGradient(W*0.3,H*0.25,50,W*0.5,H*0.5,H*0.85)
    for o,col in ((0,(0xC0,0x2F,0x3B)),(0.55,(0x9E,0x1F,0x2A)),(1,(0x6E,0x13,0x1D))): g.add_color_stop_rgb(o,*[v/255 for v in col])
    c.set_source(g); c.paint()
def spaced(c,t,x,y,sp,col,a=1):
    c.set_source_rgba(*col,a); cx=x
    for ch in t: c.move_to(cx,y); c.show_text(ch); cx+=c.text_extents(ch)[4]+sp
def tag(c,l,r,W,y=150):
    F(c,26); spaced(c,l,90,y,7,YEL); c.move_to(W-90-c.text_extents(r)[4],y); c.show_text(r)
    c.set_source_rgba(*YEL,.35); c.rectangle(90,y+24,W-180,2); c.fill()
def segs(c,lines,x,y,size,lh=1.1):
    F(c,size)
    for i,l in enumerate(lines):
        cx=x
        for s,col in l: c.set_source_rgb(*col); c.move_to(cx,y+i*size*lh); c.show_text(s); cx+=c.text_extents(s)[4]
def wrap(c,text,x,y,maxw,size,col,lh=1.35,black=False,a=1):
    F(c,size,black); words=text.split(); line=''; n=0
    for w in words:
        t=(line+' '+w).strip()
        if c.text_extents(t)[4]>maxw and line:
            c.set_source_rgba(*col,a); c.move_to(x,y+n*size*lh); c.show_text(line); n+=1; line=w
        else: line=t
    c.set_source_rgba(*col,a); c.move_to(x,y+n*size*lh); c.show_text(line); return y+(n+1)*size*lh
def logo(c,x,y,s,a=1):
    c.save(); c.translate(x,y); c.scale(s,s); c.set_source_rgba(1,1,1,a); c.set_line_width(2)
    c.move_to(2,2); c.line_to(22,2); c.line_to(22,18); c.line_to(12,28); c.line_to(2,18); c.close_path(); c.stroke()
    F(c,13); te=c.text_extents('S'); c.move_to(12-te[4]/2,18); c.show_text('S'); c.restore()
def footer(c,W,H,i=None,n=None):
    logo(c,90,H-118,1.6); F(c,24,False); c.set_source_rgba(1,1,1,.8); c.move_to(140,H-84); c.show_text('@psychologsportu')
    if i: s=f'{i}/{n}'; c.move_to(W-90-c.text_extents(s)[4],H-84); c.show_text(s)
def st(c,col=WH,w=7): c.set_source_rgb(*col); c.set_line_width(w); c.set_line_cap(1); c.set_line_join(1)
# icons centred at 0,0 size ~ 160
def ic_hand(c):  # two speech bubbles = rozmowa
    st(c); c.new_path(); c.arc(-25,-15,55,0,2*math.pi); c.stroke(); c.move_to(-55,30); c.line_to(-70,62); c.line_to(-30,38); c.stroke()
    c.new_path(); c.arc(45,30,42,0,2*math.pi); c.stroke(); c.move_to(70,62); c.line_to(82,85); c.line_to(55,68); c.stroke()
def ic_target(c):
    st(c)
    for r in (70,44,18): c.new_path(); c.arc(0,0,r,0,2*math.pi); c.stroke()
    st(c,YEL); c.move_to(0,0); c.line_to(70,-70); c.stroke(); c.move_to(70,-70); c.line_to(52,-70); c.move_to(70,-70); c.line_to(70,-52); c.stroke()
def ic_cal(c):
    st(c); c.rectangle(-70,-55,140,125); c.stroke(); c.move_to(-70,-20); c.line_to(70,-20); c.stroke()
    for x in (-38,38): c.move_to(x,-72); c.line_to(x,-40); c.stroke()
    c.set_source_rgb(*YEL); c.rectangle(-45,5,30,26); c.fill(); c.rectangle(15,35,30,26); c.fill()
def ic_phone(c):
    st(c); c.new_path(); r=16; x,y,w,h=-45,-80,90,160
    c.arc(x+w-r,y+r,r,-math.pi/2,0); c.arc(x+w-r,y+h-r,r,0,math.pi/2); c.arc(x+r,y+h-r,r,math.pi/2,math.pi); c.arc(x+r,y+r,r,math.pi,1.5*math.pi); c.close_path(); c.stroke()
    st(c,YEL,6); c.move_to(-22,0); c.line_to(-6,16); c.line_to(24,-18); c.stroke()
    st(c,WH,5); c.move_to(-14,62); c.line_to(14,62); c.stroke()
def ic_compass(c):
    st(c); c.new_path(); c.arc(0,0,72,0,2*math.pi); c.stroke()
    c.set_source_rgb(*YEL); c.move_to(0,-52); c.line_to(16,0); c.line_to(-16,0); c.close_path(); c.fill()
    st(c,WH,6); c.move_to(0,52); c.line_to(16,0); c.line_to(-16,0); c.close_path(); c.stroke()
ICONS=[ic_hand,ic_target,ic_cal,ic_phone]
STEPS=[('Sesja zero','Bezpłatna. Poznajemy się i sprawdzamy, czy jest między nami zaufanie. Bez niego tylko ślizgamy się po powierzchni.'),
 ('Twój problem, nie teoria','Od razu bierzemy to, z czym przychodzisz: stres przed startem, błąd, który wraca, forma, która znika na zawodach.'),
 ('Spotkania co dwa tygodnie','Po imieniu i bez tabu. W sporcie dużo się dzieje, dlatego nie widzimy się rzadziej niż co dwa tygodnie.'),
 ('Robota między spotkaniami','Dostajesz zadania i aplikację z naszymi ustaleniami. Najważniejsza praca dzieje się między spotkaniami.')]
def carousel(out):
    W,H=1080,1350; n=6
    def new(): s=cairo.ImageSurface(cairo.FORMAT_RGB24,W,H); c=cairo.Context(s); bg(c,W,H); return s,c
    s,c=new(); tag(c,'WSPÓŁPRACA','KROK PO KROKU',W)
    c.save(); c.translate(W/2,470); c.scale(1.6,1.6); ic_compass(c); c.restore()
    segs(c,[[('Jak wygląda',WH)],[('współpraca',YEL)],[('ze mną?',WH)]],90,830,110)
    F(c,40,False); c.set_source_rgba(1,1,1,.85); c.move_to(90,1150); c.show_text('Bez czarów. Krok po kroku.')
    F(c,28); c.set_source_rgb(*YEL); t='przesuń →'; c.move_to(W-90-c.text_extents(t)[4],1150); c.show_text(t)
    logo(c,90,H-118,1.6); F(c,24,False); c.set_source_rgba(1,1,1,.8); c.move_to(140,H-84); c.show_text('@psychologsportu'); s.write_to_png(f'{out}/1.png')
    for i,((h,d),ic) in enumerate(zip(STEPS,ICONS)):
        s,c=new(); tag(c,f'KROK {i+1}','WSPÓŁPRACA',W)
        c.set_source_rgb(*INK); c.arc(W/2,450,170,0,2*math.pi); c.fill()
        c.save(); c.translate(W/2,450); ic(c); c.restore()
        F(c,72); c.set_source_rgb(*WH); tw=c.text_extents(h)[4]
        if tw>W-180: segs(c,[[(w,WH)] for w in [h.rsplit(' ',1)[0],h.rsplit(' ',1)[1]]],90,780,72)
        else: c.move_to(90,780); c.show_text(h)
        c.set_source_rgb(*YEL); c.rectangle(90,880 if tw>W-180 else 820,80,6); c.fill()
        wrap(c,d,90,(960 if tw>W-180 else 900),W-180,40,WH,a=.92)
        footer(c,W,H,i+2,n); s.write_to_png(f'{out}/{i+2}.png')
    s,c=new(); tag(c,'UCZCIWIE','WSPÓŁPRACA',W)
    segs(c,[[('Nie obiecuję wyniku.',WH)],[('Obiecuję ',WH),('pracę.',YEL)]],90,340,84)
    wrap(c,'Gwarancji wyniku nie da ci nikt uczciwy. Mogę dać ci narzędzia i towarzyszyć ci w drodze, a robotę zrobisz ty.',90,560,W-180,40,WH,a=.92)
    wrap(c,'To nie psychoterapia. To trening głowy w sporcie.',90,820,W-180,40,YEL,black=True)
    c.set_source_rgb(1,1,1); r=40; x,y,w,h=90,980,W-180,120
    c.new_path(); c.arc(x+w-r,y+r,r,-math.pi/2,0); c.arc(x+w-r,y+h-r,r,0,math.pi/2); c.arc(x+r,y+h-r,r,math.pi/2,math.pi); c.arc(x+r,y+r,r,math.pi,1.5*math.pi); c.close_path(); c.fill()
    F(c,40); c.set_source_rgb(0xA8/255,0x22/255,0x2E/255); t='Umów sesję zero: link w bio'; c.move_to(W/2-c.text_extents(t)[4]/2,1053); c.show_text(t)
    footer(c,W,H,6,n); s.write_to_png(f'{out}/6.png')
def story(out):
    W,H=1080,1920; s=cairo.ImageSurface(cairo.FORMAT_RGB24,W,H); c=cairo.Context(s); bg(c,W,H)
    tag(c,'WSPÓŁPRACA','JAK TO WYGLĄDA',W,230)
    segs(c,[[('Jak wygląda',WH)],[('współpraca',YEL)],[('ze mną?',WH)]],90,400,96)
    short=['Bezpłatna sesja zero: poznajemy się.','Bierzemy twój problem, nie teorię.','Spotkania co dwa tygodnie, bez tabu.','Zadania i aplikacja między spotkaniami.']
    for i,(t,ic) in enumerate(zip(short,ICONS)):
        y=760+i*190; c.set_source_rgb(*INK); c.arc(170,y,70,0,2*math.pi); c.fill()
        c.save(); c.translate(170,y); c.scale(.55,.55); ic(c); c.restore()
        F(c,22); spaced(c,f'KROK {i+1}',280,y-22,4,YEL); wrap(c,t,280,y+26,W-370,38,WH,black=True)
    F(c,40); c.set_source_rgb(*WH); c.move_to(90,1580); c.show_text('Nie obiecuję wyniku. Obiecuję pracę.')
    F(c,30,False); c.set_source_rgba(1,1,1,.85); c.move_to(90,1640); c.show_text('Sesję zero umówisz przez link w bio.')
    logo(c,W/2-22,1720,1.8); s.write_to_png(f'{out}/relacja.png')
import os; os.makedirs('out',exist_ok=True); carousel('out'); story('out')
