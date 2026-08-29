from PIL import Image, ImageDraw, ImageFilter

S = 1080
CREAM   = (248, 245, 240)
LAVENDER= (196, 180, 245)
NAVY    = (44, 42, 68)

canvas = Image.new("RGB", (S, S), CREAM)

# Soft lavender disc so the phone has something to sit against.
disc = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ImageDraw.Draw(disc).ellipse([120, 60, 960, 900], fill=LAVENDER + (255,))
canvas.paste(Image.alpha_composite(canvas.convert("RGBA"), disc.filter(ImageFilter.GaussianBlur(2))).convert("RGB"))

shot = Image.open("shots/app-screen-es.png").convert("RGB")
PH_H = 830
PH_W = round(PH_H * shot.width / shot.height)
shot = shot.resize((PH_W, PH_H), Image.LANCZOS)

BEZEL, RADIUS = 14, 60
fw, fh = PH_W + BEZEL * 2, PH_H + BEZEL * 2
fx, fy = (S - fw) // 2, (S - fh) // 2

# Drop shadow.
sh = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ImageDraw.Draw(sh).rounded_rectangle(
    [fx, fy + 16, fx + fw, fy + fh + 16], RADIUS, fill=(44, 42, 68, 90)
)
canvas = Image.alpha_composite(
    canvas.convert("RGBA"), sh.filter(ImageFilter.GaussianBlur(22))
).convert("RGB")

# Phone body.
body = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ImageDraw.Draw(body).rounded_rectangle(
    [fx, fy, fx + fw, fy + fh], RADIUS, fill=NAVY + (255,)
)
canvas = Image.alpha_composite(canvas.convert("RGBA"), body).convert("RGB")

# Screen, corners rounded to match the bezel.
mask = Image.new("L", (PH_W, PH_H), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, PH_W, PH_H], RADIUS - BEZEL, fill=255)
canvas.paste(shot, (fx + BEZEL, fy + BEZEL), mask)

canvas.save("shots/checkout-product.png", "PNG", optimize=True)
print("saved", canvas.size)
