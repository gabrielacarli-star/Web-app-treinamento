# -*- coding: utf-8 -*-
"""Builds the Spanish access guide handed to the buyer after checkout.

The app URL is read from ACCESS_URL below — update it after deploying and
re-run this script to refresh the PDF.
"""
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

ACCESS_URL = "https://dogflow.vercel.app/es"
SUPPORT_EMAIL = "oi@dogflow.app"
OUT = "assets/DogFlow-Guia-de-Acceso.pdf"

CREAM = HexColor("#F8F5F0")
INK = HexColor("#2C2A44")
SOFT = HexColor("#6B6880")
LAV = HexColor("#A48BF0")
LAV_L = HexColor("#EFE9FD")
CORAL = HexColor("#F2724F")
TEAL = HexColor("#4FBFAE")
SUN = HexColor("#F5EC3D")

W, H = A4
M = 55

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle("DogFlow — Guía de acceso")
c.setAuthor("DogFlow")
c.setSubject("Cómo acceder a tu plan de entrenamiento")


def bg(color=CREAM):
    c.setFillColor(color)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def paw(x, y, s, color):
    """The brand mark, drawn at scale s."""
    c.setFillColor(color)
    for dx, dy, rx, ry in ((-0.29, 0.30, 0.16, 0.20), (0.29, 0.30, 0.16, 0.20),
                           (-0.56, 0.02, 0.14, 0.18), (0.56, 0.02, 0.14, 0.18)):
        c.ellipse(x + (dx - rx) * s, y + (dy - ry) * s,
                  x + (dx + rx) * s, y + (dy + ry) * s, fill=1, stroke=0)
    c.ellipse(x - 0.42 * s, y - 0.62 * s, x + 0.42 * s, y + 0.10 * s, fill=1, stroke=0)


def logo(x, y, size=15):
    c.setFillColor(LAV)
    c.roundRect(x, y - 4, size * 1.5, size * 1.5, size * 0.42, fill=1, stroke=0)
    paw(x + size * 0.75, y + size * 0.72, size * 0.42, HexColor("#FFFFFF"))
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(x + size * 1.5 + 9, y + size * 0.42, "DogFlow")


def wrap(text, font, size, maxw):
    c.setFont(font, size)
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if c.stringWidth(t, font, size) <= maxw:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def para(text, x, y, maxw, font="Helvetica", size=11, lead=16, color=SOFT):
    c.setFillColor(color)
    for line in wrap(text, font, size, maxw):
        c.setFont(font, size)
        c.drawString(x, y, line)
        y -= lead
    return y


def heading(text, y, size=22):
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", size)
    c.drawString(M, y, text)
    return y - size - 10


def footer(page):
    c.setFillColor(HexColor("#9B98AC"))
    c.setFont("Helvetica", 8.5)
    c.drawString(M, 32, "DogFlow · " + SUPPORT_EMAIL)
    c.drawRightString(W - M, 32, str(page))


# ── Page 1 — cover ────────────────────────────────────────────────────────
bg()
c.setFillColor(LAV_L)
c.circle(W * 0.5, H * 0.60, 150, fill=1, stroke=0)
paw(W * 0.5, H * 0.62, 78, LAV)

c.setFillColor(INK)
c.setFont("Helvetica-Bold", 34)
c.drawCentredString(W / 2, H * 0.36, "DogFlow")
c.setFont("Helvetica-Bold", 19)
c.drawCentredString(W / 2, H * 0.36 - 30, "Guía de acceso")
c.setFillColor(SOFT)
c.setFont("Helvetica", 12)
c.drawCentredString(W / 2, H * 0.36 - 54, "Tu plan de entrenamiento personalizado")

c.setFillColor(CORAL)
c.roundRect(W / 2 - 105, H * 0.20, 210, 34, 17, fill=1, stroke=0)
c.setFillColor(HexColor("#FFFFFF"))
c.setFont("Helvetica-Bold", 12)
c.drawCentredString(W / 2, H * 0.20 + 12, "¡Bienvenido! Empecemos")
c.showPage()

# ── Page 2 — how to get in ────────────────────────────────────────────────
bg()
logo(M, H - 70)
y = heading("Cómo acceder", H - 130)
y = para("Tu acceso ya está activo. Son tres pasos y toma menos de un minuto.",
         M, y, W - 2 * M) - 22

steps = [
    ("1", "Abre el enlace de la aplicación",
     "Entra desde el navegador de tu celular o computadora:"),
    ("2", "Agrégala a tu pantalla de inicio",
     "En el menú del navegador elige «Agregar a pantalla de inicio». "
     "Así la abres como cualquier otra aplicación, sin buscar el enlace de nuevo."),
    ("3", "Empieza por el primer curso",
     "Entra en «Cachorro — curso básico» o «Perro adulto — curso básico», "
     "según la edad de tu perro, y sigue las clases en orden."),
]
for num, title, body in steps:
    c.setFillColor(LAV)
    c.circle(M + 13, y + 4, 13, fill=1, stroke=0)
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 13)
    c.drawCentredString(M + 13, y, num)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(M + 38, y, title)
    y = para(body, M + 38, y - 19, W - 2 * M - 38) - 12
    if num == "1":
        c.setFillColor(LAV_L)
        c.roundRect(M + 38, y - 26, W - 2 * M - 38, 34, 8, fill=1, stroke=0)
        c.setFillColor(LAV)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(M + 52, y - 15, ACCESS_URL)
        y -= 46
    y -= 12

c.setFillColor(HexColor("#FFFFFF"))
c.roundRect(M, y - 78, W - 2 * M, 72, 12, fill=1, stroke=0)
c.setFillColor(TEAL)
c.setFont("Helvetica-Bold", 11)
c.drawString(M + 18, y - 26, "Un consejo antes de empezar")
para("Con 15 minutos al día alcanza. Es mejor entrenar poco y todos los días "
     "que una hora un solo día de la semana.",
     M + 18, y - 44, W - 2 * M - 36, size=10.5, lead=14)
footer(2)
c.showPage()

# ── Page 3 — what's inside ────────────────────────────────────────────────
bg()
logo(M, H - 70)
y = heading("Qué encontrarás dentro", H - 130)
y = para("Tu acceso incluye los cuatro cursos completos.", M, y, W - 2 * M) - 18

cards = [
    ("Cachorro — curso básico",
     "Socialización y los primeros pasos en casa. Necesidades en el sitio "
     "correcto, mordidas de juego, transportín y las primeras órdenes."),
    ("Perro adulto — curso básico",
     "Para perros de más de 10 meses. Paseo sin tirones, llamada fiable, "
     "ladridos en la puerta y quedarse solo sin ansiedad."),
    ("Juegos contra el aburrimiento",
     "Para mantener la cabeza de tu perro ocupada y gastar energía los días "
     "en que no pueden salir."),
    ("Trucos para impresionar",
     "Dar la pata, girar, entrelazar las piernas. Divertidos, y además "
     "refuerzan todo lo aprendido."),
]
for title, body in cards:
    c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(M, y - 62, W - 2 * M, 72, 12, fill=1, stroke=0)
    c.setFillColor(SUN)
    c.roundRect(M + 16, y - 40, 40, 40, 9, fill=1, stroke=0)
    paw(M + 36, y - 17, 12, INK)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(M + 70, y - 8, title)
    para(body, M + 70, y - 25, W - 2 * M - 86, size=10, lead=13)
    y -= 88
footer(3)
c.showPage()

# ── Page 4 — first week ───────────────────────────────────────────────────
bg()
logo(M, H - 70)
y = heading("Tus primeros 7 días", H - 130)
y = para("Si no sabes por dónde empezar, sigue este orden. Una sesión de 15 "
         "minutos por día, siempre a la misma hora.", M, y, W - 2 * M) - 20

days = [
    ("Día 1", "Enseña su nombre y el contacto visual. Todo lo demás depende de esto."),
    ("Día 2", "Repite el día 1 y suma el premio en la mano para guiarlo."),
    ("Día 3", "Primera orden: «sentado». Sesiones cortas, muchas repeticiones."),
    ("Día 4", "Repasa «sentado» en otra habitación de la casa."),
    ("Día 5", "Suma «espera». Empieza con dos segundos y ve subiendo."),
    ("Día 6", "Primera sesión fuera de casa, en un lugar tranquilo."),
    ("Día 7", "Repaso general. Solo lo que ya salió bien, para cerrar en alto."),
]
for label, body in days:
    c.setFillColor(LAV)
    c.roundRect(M, y - 5, 52, 20, 10, fill=1, stroke=0)
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(M + 26, y + 1, label)
    c.setFillColor(SOFT)
    c.setFont("Helvetica", 10.5)
    c.drawString(M + 66, y + 1, body)
    y -= 30

y -= 14
c.setFillColor(HexColor("#FFFFFF"))
c.roundRect(M, y - 56, W - 2 * M, 66, 12, fill=1, stroke=0)
c.setFillColor(CORAL)
c.setFont("Helvetica-Bold", 11)
c.drawString(M + 18, y - 8, "Si un día sale mal")
para("Vuelve al ejercicio anterior, el que ya dominaba, y termina ahí. Nunca "
     "cierres una sesión con un fracaso.",
     M + 18, y - 26, W - 2 * M - 36, size=10.5, lead=14)
footer(4)
c.showPage()

# ── Page 5 — support ──────────────────────────────────────────────────────
bg()
logo(M, H - 70)
y = heading("Soporte y garantía", H - 130)

c.setFillColor(HexColor("#FFFFFF"))
c.roundRect(M, y - 96, W - 2 * M, 104, 12, fill=1, stroke=0)
c.setFillColor(TEAL)
c.setFont("Helvetica-Bold", 13)
c.drawString(M + 20, y - 24, "Garantía de 30 días")
para("Creemos que vas a ver resultados en 4 semanas. Si sigues el plan y no "
     "notas un cambio concreto en el comportamiento de tu perro, escríbenos y "
     "te devolvemos el dinero.",
     M + 20, y - 44, W - 2 * M - 40, size=10.5, lead=14)
y -= 124

c.setFillColor(HexColor("#FFFFFF"))
c.roundRect(M, y - 78, W - 2 * M, 86, 12, fill=1, stroke=0)
c.setFillColor(INK)
c.setFont("Helvetica-Bold", 13)
c.drawString(M + 20, y - 24, "¿Tienes una duda?")
para("Escríbenos y te respondemos. Cuéntanos la raza y la edad de tu perro, "
     "así podemos ayudarte mejor.",
     M + 20, y - 44, W - 2 * M - 40, size=10.5, lead=14)
c.setFillColor(LAV)
c.setFont("Helvetica-Bold", 12)
c.drawString(M + 20, y - 70, SUPPORT_EMAIL)
y -= 116

paw(W / 2, y - 40, 30, LAV_L)
c.setFillColor(SOFT)
c.setFont("Helvetica-Bold", 12)
c.drawCentredString(W / 2, y - 98, "Ahora ve a entrenar. Nos vemos dentro.")
footer(5)
c.showPage()

c.save()
print("ok:", OUT)
