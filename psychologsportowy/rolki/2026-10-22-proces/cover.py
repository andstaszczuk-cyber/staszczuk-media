import cairo
Y=(0xFC/255,0xE8/255,0x6A/255)
src=cairo.ImageSurface.create_from_png('raw_745.png'); W,H=1080,1920
sf=cairo.ImageSurface(cairo.FORMAT_RGB24,W,H); c=cairo.Context(sf); c.set_source_surface(src,0,0); c.paint()
c.select_font_face('Poppins',0,1); c.set_font_size(84)
lines=['Dwa kroki w tył','to też proces']; y=430
for l in lines:
    e=c.text_extents(l); w=e.x_advance+56; x=(W-w)/2
    c.set_source_rgb(*Y); c.rectangle(x,y-84,w,118); c.fill()
    c.set_source_rgb(0.08,0.08,0.08); c.move_to(x+28,y); c.show_text(l); y+=118
sf.write_to_png('cover.png')
