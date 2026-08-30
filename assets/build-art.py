# -*- coding: utf-8 -*-
"""Generates the funnel's illustrations from one shared dog, so every scene
reads as the same brand rather than eight separate drawings."""
import pathlib

CREAM   = "#F8F5F0"
LAV_L   = "#D6C2FF"
LAV     = "#7C2DFF"
CORAL   = "#FF4E17"
TEAL    = "#00D9A6"
NAVY    = "#2C2A44"
SUN     = "#FFE81F"
LINE    = "#E9E4DB"

COATS = {
    "gold":  ("#E8B473", "#C98840", "#F5D3A8"),
    "cream": ("#EFD3AE", "#D5B184", "#F8E6CE"),
    "grey":  ("#B9BFCC", "#98A0B2", "#D9DEE8"),
    "brown": ("#C08A5E", "#9E6C45", "#DCB08A"),
}


def dog(cx, cy, s=1.0, coat="gold", ears="floppy", eyes="happy",
        mouth="smile", tail="up", legs=True, tilt=0):
    """A sitting dog, drawn from cx (centre) and cy (top of head)."""
    base, dark, light = COATS[coat]
    g = [f'<g transform="translate({cx},{cy}) scale({s}) rotate({tilt})">']

    if tail == "up":
        g.append(f'<path d="M150 200 q90 -30 70 -120 q-8 -40 -46 -34 q-30 6 -22 40 q10 44 -30 62 z" fill="{dark}"/>')
    elif tail == "down":
        g.append(f'<path d="M150 210 q80 20 96 96 q10 40 -28 48 q-30 6 -34 -28 q-6 -46 -50 -50 z" fill="{dark}"/>')

    # body
    g.append(f'<path d="M0 0 c105 0 150 90 150 190 c0 50 -14 74 -46 74 h-208 c-32 0 -46 -24 -46 -74 c0 -100 45 -190 150 -190 z" fill="{base}"/>')
    g.append(f'<ellipse cx="0" cy="185" rx="60" ry="72" fill="{light}"/>')

    if legs:
        g.append(f'<rect x="-74" y="152" width="52" height="112" rx="26" fill="{base}"/>')
        g.append(f'<rect x="22" y="152" width="52" height="112" rx="26" fill="{base}"/>')
        g.append(f'<ellipse cx="-48" cy="262" rx="32" ry="20" fill="{light}"/>')
        g.append(f'<ellipse cx="48" cy="262" rx="32" ry="20" fill="{light}"/>')

    # ears behind head
    if ears == "floppy":
        g.append(f'<path d="M-130 -40 q-52 20 -46 108 q6 84 62 92 q28 -96 14 -180 z" fill="{dark}"/>')
        g.append(f'<path d="M130 -40 q52 20 46 108 q-6 84 -62 92 q-28 -96 -14 -180 z" fill="{dark}"/>')
    elif ears == "down":
        g.append(f'<path d="M-126 -20 q-70 44 -56 128 q10 60 58 56 q18 -100 -2 -184 z" fill="{dark}"/>')
        g.append(f'<path d="M126 -20 q70 44 56 128 q-10 60 -58 56 q-18 -100 2 -184 z" fill="{dark}"/>')
    elif ears == "perk":
        g.append(f'<path d="M-120 -30 l-26 -116 q-4 -20 16 -14 l86 62 z" fill="{dark}"/>')
        g.append(f'<path d="M120 -30 l26 -116 q4 -20 -16 -14 l-86 62 z" fill="{dark}"/>')

    # head
    g.append(f'<ellipse cx="0" cy="-50" rx="146" ry="132" fill="{base}"/>')
    g.append(f'<ellipse cx="0" cy="10" rx="86" ry="62" fill="{light}"/>')
    g.append(f'<ellipse cx="0" cy="-24" rx="26" ry="19" fill="{NAVY}"/>')
    g.append(f'<path d="M0 -5 v20" stroke="{NAVY}" stroke-width="7" stroke-linecap="round"/>')

    if mouth == "smile":
        g.append(f'<path d="M0 15 q-24 20 -42 2" stroke="{NAVY}" stroke-width="7" fill="none" stroke-linecap="round"/>')
        g.append(f'<path d="M0 15 q24 20 42 2" stroke="{NAVY}" stroke-width="7" fill="none" stroke-linecap="round"/>')
    elif mouth == "open":
        g.append(f'<path d="M-34 14 q34 46 68 0 q-34 16 -68 0 z" fill="{NAVY}"/>')
        g.append(f'<path d="M-18 30 q18 22 36 0 q-18 10 -36 0 z" fill="{CORAL}"/>')
    elif mouth == "flat":
        g.append(f'<path d="M-26 22 q26 -10 52 0" stroke="{NAVY}" stroke-width="7" fill="none" stroke-linecap="round"/>')

    # eyes
    if eyes == "happy":
        for ex in (-60, 60):
            g.append(f'<circle cx="{ex}" cy="-80" r="19" fill="{NAVY}"/>')
            g.append(f'<circle cx="{ex + 7}" cy="-87" r="7" fill="#FFFFFF"/>')
    elif eyes == "sad":
        for ex in (-60, 60):
            g.append(f'<circle cx="{ex}" cy="-76" r="22" fill="{NAVY}"/>')
            g.append(f'<circle cx="{ex + 8}" cy="-85" r="9" fill="#FFFFFF"/>')
        g.append(f'<path d="M-86 -116 q26 -18 52 -6" stroke="{dark}" stroke-width="10" fill="none" stroke-linecap="round"/>')
        g.append(f'<path d="M34 -122 q26 -12 52 6" stroke="{dark}" stroke-width="10" fill="none" stroke-linecap="round"/>')
    elif eyes == "wink":
        g.append(f'<path d="M-78 -80 q18 -18 36 0" stroke="{NAVY}" stroke-width="9" fill="none" stroke-linecap="round"/>')
        g.append(f'<circle cx="60" cy="-80" r="19" fill="{NAVY}"/>')
        g.append(f'<circle cx="67" cy="-87" r="7" fill="#FFFFFF"/>')

    g.append("</g>")
    return "\n".join(g)


def frame(inner, bg_circle=True):
    """No background plate: the art sits directly on whatever the page uses,
    so the illustration never shows as a square against the surface."""
    circle = f'<circle cx="540" cy="520" r="340" fill="{LAV_L}"/>' if bg_circle else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
{circle}
{inner}
</svg>'''


def cross_badge(x, y, r=52):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{CORAL}"/>'
            f'<path d="M{x-18} {y-18} L{x+18} {y+18} M{x+18} {y-18} L{x-18} {y+18}" '
            f'stroke="#fff" stroke-width="12" stroke-linecap="round"/>')


def check_badge(x, y, r=42):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{TEAL}"/>'
            f'<path d="M{x-17} {y+1} l12 13 l22 -25" stroke="#fff" stroke-width="11" '
            f'fill="none" stroke-linecap="round" stroke-linejoin="round"/>')


def hand(x, y, angle=0, scale=1.0):
    """A forearm entering from the frame edge. No face, ever."""
    return f'''<g transform="translate({x},{y}) rotate({angle}) scale({scale})">
  <rect x="-200" y="-34" width="200" height="68" rx="34" fill="#E8C4A0"/>
  <rect x="-260" y="-42" width="80" height="84" rx="20" fill="{LAV}"/>
  <ellipse cx="14" cy="0" rx="46" ry="40" fill="#F0D2B4"/>
  <rect x="30" y="-30" width="46" height="22" rx="11" fill="#F0D2B4"/>
  <rect x="34" y="-6" width="52" height="22" rx="11" fill="#F0D2B4"/>
  <rect x="30" y="18" width="44" height="22" rx="11" fill="#F0D2B4"/>
</g>'''


SCENES = {}

# 1 — pulling on the leash
SCENES["hero-leash"] = frame(f'''
<path d="M120 470 Q400 430 700 520" stroke="#7BA7D9" stroke-width="18" fill="none" stroke-linecap="round"/>
{dog(620, 470, 0.92, "brown", "floppy", "happy", "open", "up", tilt=8)}
<ellipse cx="620" cy="838" rx="250" ry="26" fill="{LINE}"/>
{hand(210, 452, -8, 0.8)}
{cross_badge(392, 452, 54)}
''')

# 2 — potty training
SCENES["hero-potty"] = frame(f'''
<rect x="600" y="700" width="300" height="150" rx="18" fill="#DCE9F5" transform="rotate(-4 750 775)"/>
<rect x="628" y="726" width="244" height="98" rx="10" fill="#EDF4FB" transform="rotate(-4 750 775)"/>
{dog(470, 500, 0.9, "cream", "down", "sad", "flat", "down")}
<ellipse cx="300" cy="800" rx="76" ry="26" fill="#CFE3F2"/>
{cross_badge(300, 800, 44)}
<ellipse cx="470" cy="840" rx="230" ry="24" fill="{LINE}"/>
''')

# 3 — play biting
SCENES["hero-biting"] = frame(f'''
{dog(600, 500, 0.88, "grey", "floppy", "wink", "open", "up", tilt=-6)}
{hand(330, 560, 12, 0.85)}
<g stroke="{CORAL}" stroke-width="12" stroke-linecap="round">
  <path d="M392 452 l-34 -40"/><path d="M446 424 l-14 -50"/><path d="M340 500 l-48 -18"/>
</g>
<ellipse cx="600" cy="840" rx="240" ry="24" fill="{LINE}"/>
''')

# 4 — the wrecked cushion
SCENES["hero-behaviour"] = frame(f'''
<g transform="rotate(-10 300 780)">
  <rect x="176" y="700" width="250" height="160" rx="30" fill="{CORAL}"/>
  <path d="M200 704 q60 -34 120 -6 q-40 26 -120 6 z" fill="#FBE3D8"/>
</g>
<g fill="#FBE3D8">
  <ellipse cx="200" cy="640" rx="38" ry="28"/><ellipse cx="860" cy="700" rx="34" ry="25"/>
  <ellipse cx="770" cy="820" rx="42" ry="30"/><ellipse cx="300" cy="880" rx="36" ry="26"/>
</g>
{dog(560, 490, 0.9, "gold", "floppy", "happy", "smile", "up", tilt=-4)}
<ellipse cx="612" cy="512" rx="24" ry="12" fill="#FBE3D8" transform="rotate(28 612 512)"/>
<ellipse cx="560" cy="840" rx="235" ry="24" fill="{LINE}"/>
''')

# 5 — home alone
SCENES["hero-alone"] = frame(f'''
<rect x="470" y="140" width="470" height="740" rx="16" fill="#E4D6C4"/>
<rect x="506" y="180" width="398" height="300" rx="12" fill="#D8C7B2"/>
<rect x="506" y="512" width="398" height="300" rx="12" fill="#D8C7B2"/>
<circle cx="520" cy="500" r="17" fill="#B79B7C"/>
<rect x="470" y="856" width="470" height="26" rx="8" fill="{SUN}" opacity="0.85"/>
{dog(300, 520, 0.78, "gold", "down", "sad", "flat", "down")}
<ellipse cx="300" cy="848" rx="190" ry="22" fill="{LINE}"/>
''', bg_circle=False)

# 6 — social proof by breed
SCENES["quiz-proof_breed"] = frame(f'''
{dog(250, 560, 0.62, "cream", "floppy", "happy", "smile", "up")}
{dog(540, 530, 0.68, "gold", "perk", "happy", "smile", "up")}
{dog(830, 560, 0.62, "brown", "floppy", "happy", "smile", "up")}
{check_badge(250, 336, 36)}
{check_badge(540, 292, 36)}
{check_badge(830, 336, 36)}
<ellipse cx="540" cy="866" rx="400" ry="26" fill="{LINE}"/>
''')

# 7 — the reassurance beat
SCENES["quiz-heard_you"] = frame(f'''
<path d="M540 322 c-40 -74 -160 -60 -160 34 c0 76 104 130 160 176 c56 -46 160 -100 160 -176 c0 -94 -120 -108 -160 -34 z"
      fill="none" stroke="{LAV}" stroke-width="14" opacity="0.6"/>
{dog(596, 520, 0.86, "gold", "floppy", "wink", "smile", "up")}
<path d="M250 620 q120 -70 250 -30 q40 12 30 48 q-10 34 -50 22 q-90 -28 -180 22 z" fill="{LAV}"/>
<path d="M258 742 q120 -50 244 -18 q40 12 30 46 q-12 34 -52 22 q-84 -24 -172 12 z" fill="#8B6EE5"/>
<ellipse cx="596" cy="842" rx="240" ry="24" fill="{LINE}"/>
''')

# 8 — the plan is ready
SCENES["plan-ready"] = frame(f'''
{dog(470, 500, 0.9, "gold", "perk", "happy", "smile", "up")}
<g transform="rotate(6 800 480)">
  <rect x="686" y="330" width="230" height="290" rx="24" fill="#FFFFFF" stroke="{LINE}" stroke-width="4"/>
  <rect x="762" y="312" width="78" height="34" rx="17" fill="{LAV}"/>
''' + "".join(
    f'<circle cx="{728}" cy="{y}" r="19" fill="{TEAL}"/>'
    f'<path d="M{719} {y} l7 8 l13 -15" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    f'<rect x="{762}" y="{y - 10}" width="118" height="20" rx="10" fill="{LINE}"/>'
    for y in (400, 470, 540)
) + f'''
</g>
<g fill="{LAV}"><circle cx="250" cy="250" r="13"/><circle cx="880" cy="760" r="11"/></g>
<g fill="{SUN}"><circle cx="890" cy="240" r="15"/><circle cx="215" cy="700" r="12"/></g>
<ellipse cx="470" cy="840" rx="235" ry="24" fill="{LINE}"/>
''')

out = pathlib.Path("svg")
for name in list(out.glob("*.svg")):
    name.unlink()
for name, svg in SCENES.items():
    (out / f"{name}.svg").write_text(svg)
print("geradas:", len(SCENES))
