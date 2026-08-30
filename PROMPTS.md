# Prompts de imagem e vídeo — DogFlow

Um bloco por espaço reservado do app. **Copie o bloco inteiro** — da linha
`Genera UNA sola imagen` até `Genera la imagen ahora.` — e cole. Não corte,
não resuma, não junte dois.

Estão em espanhol porque o funil é para LATAM.

## Como usar

1. Conversa nova no ChatGPT.
2. Cole **um** bloco inteiro. Espere a imagem.
3. Próxima imagem: **mesma conversa**, cole o próximo bloco inteiro.

Não peça duas imagens numa mensagem só.

## Se sair errado

| Problema | Responda exatamente isso |
|---|---|
| Apareceu texto ou logo | `Quita todo el texto, las letras y los logotipos. Vuelve a generarla.` |
| Apareceu rosto de pessoa | `No muestres la cara de ninguna persona. Vuelve a generarla.` |
| Enquadramento errado | `Aleja la cámara y deja más espacio vacío alrededor.` |
| Ficou com cara de desenho | `Tiene que ser una fotografía realista, no una ilustración.` |
| Cor errada | `Usa un fondo crema claro y quita los colores saturados.` |

Corrigir em uma frase funciona melhor que recomeçar.

## Trilhas

**Foto** é a recomendada: sai bem com muito mais frequência e costuma
converter melhor em tráfego frio. **Ilustração** é o que a oferta de
referência usa. Escolha uma e não misture.

> **As imagens já estão prontas.** Desenhei as oito em SVG, nas cores exatas
> da marca — estão em `public/art/` e já instaladas no app. `assets/build-art.py`
> regenera todas, e `assets/art-svg/` tem os fontes editáveis.
>
> Os prompts abaixo continuam aqui caso você queira testar uma versão em foto
> no lugar da ilustração. Para trocar, é só substituir o arquivo em
> `public/art/` mantendo o mesmo nome.

---

---

# TRILHA A — FOTO (recomendada)

### `checkout-product` — miniatura do produto no checkout
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.
• Se va a ver muy pequeña, del tamaño de una miniatura: todo tiene que leerse de un vistazo.

━━━ 2. SUJETO PRINCIPAL ━━━
• Un perro adulto joven de raza Golden Retriever, de pelaje dorado claro, limpio y brillante.
• Está sentado y erguido, de frente a la cámara, con las patas delanteras rectas.
• Orejas caídas de forma natural, boca ligeramente abierta, lengua apenas visible.
• Expresión atenta, alegre y amistosa, mirando directo a la cámara.
• Es el elemento más grande de la imagen: ocupa cerca del 55% del ancho y está en el lado derecho.
• Se ve de la cabeza hasta las patas delanteras. No lo cortes por el cuello.

━━━ 3. OBJETO SECUNDARIO ━━━
• Un teléfono celular moderno, negro, de pantalla completa y bordes redondeados.
• Está de pie, apoyado y ligeramente inclinado, visto casi de frente, junto al perro.
• La pantalla está encendida y muestra una interfaz clara y ordenada, con bloques de color suaves y una barra de progreso lavanda; el texto de la interfaz se ve borroso y no se puede leer.
• Ocupa cerca del 30% del alto de la imagen y está en el lado izquierdo, tocando el centro.
• El teléfono es más bajo que el perro: la cabeza del perro queda por encima de la pantalla.

━━━ 4. ESCENARIO ━━━
• Una superficie de madera muy clara, lisa y completamente vacía.
• Al fondo, una pared interior en tono crema, lisa y totalmente desenfocada.
• Nada más en la escena: ningún mueble, planta, juguete, plato ni objeto suelto.

━━━ 5. LUZ ━━━
• Luz natural suave y difusa, entrando desde la izquierda.
• Sombras muy tenues bajo el perro y el teléfono, sin contraste duro.
• Imagen luminosa y pareja, sensación de mañana dentro de casa.

━━━ 6. CÁMARA ━━━
• Cámara de frente, a la altura del pecho del perro, a poco más de un metro.
• Objetivo de 50 mm. Fondo desenfocado con poca profundidad de campo.
• El perro y el teléfono, los dos completamente enfocados y nítidos.

━━━ 7. COLORES ━━━
• Dominan el crema y el beige del fondo, y el dorado del pelaje.
• Un único acento lavanda suave, dentro de la pantalla del teléfono.
• Sin colores saturados ni fuertes en ninguna parte.

━━━ 8. AMBIENTE ━━━
• Limpio, cálido, ordenado y profesional.
• Aspecto de foto de producto para una tienda, no de foto casual de celular.

━━━ 9. COMPOSICIÓN ━━━
• El perro a la derecha y el teléfono a la izquierda, los dos apoyados sobre la misma superficie.
• Juntos ocupan cerca del 80% del cuadro: llena la imagen, deja solo un margen parejo y estrecho alrededor.
• Composición equilibrada y centrada, sin grandes zonas vacías.

━━━ 10. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna persona ni ninguna cara humana.
• Ningún borde, marco, collage ni imagen dividida. Una sola imagen.

Genera la imagen ahora.
```

### `hero-leash` — passeio sem puxar
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. SUJETO PRINCIPAL ━━━
• Un perro adulto de tamaño mediano, raza Labrador de pelaje color chocolate
• Está tirando con fuerza de la correa: el cuerpo inclinado hacia adelante, el pecho bajo y las patas traseras estiradas hacia atrás
• Boca abierta y lengua fuera, con expresión de entusiasmo, mirando hacia adelante y fuera del encuadre
• Ocupa cerca del 55% del ancho de la imagen y está en el lado derecho

━━━ 3. OBJETOS EN LA ESCENA ━━━
• Una correa de nailon azul, completamente tensa y recta, que cruza la imagen en diagonal
• La mano y el antebrazo de una persona adulta entran desde el borde izquierdo sujetando la correa; no se ve nada más de esa persona, ni su cara ni su cuerpo

━━━ 4. ESCENARIO ━━━
• Una acera de ciudad tranquila, de baldosas grises
• Al fondo, árboles y edificios bajos completamente desenfocados

━━━ 5. LUZ ━━━
• Luz natural de atardecer, cálida y baja, viniendo desde atrás del perro. Sin sombras duras.

━━━ 6. CÁMARA ━━━
• Cámara a la altura del pecho del perro, casi a ras del suelo. Objetivo de 50 mm. Fondo muy desenfocado.

━━━ 7. COLORES ━━━
• Tonos cálidos de atardecer: dorado, marrón y gris claro. Un acento azul en la correa.

━━━ 8. AMBIENTE ━━━
• Enérgico y cotidiano. Un paseo real, no una sesión de estudio.

━━━ 9. COMPOSICIÓN ━━━
• El perro a la derecha, la correa cruzando hacia la esquina superior izquierda. Deja espacio vacío delante del perro.

━━━ 10. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna cara humana.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-potty` — xixi no lugar certo
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. SUJETO PRINCIPAL ━━━
• Un cachorro de unos tres meses, raza Beagle, de pelaje tricolor
• Está sentado, con las patas delanteras juntas y el cuerpo un poco encogido
• Orejas caídas y bajas, cabeza ligeramente inclinada hacia abajo, ojos grandes mirando hacia arriba directo a la cámara
• Expresión de culpa y ternura, no de miedo
• Ocupa cerca del 40% del alto de la imagen y está centrado

━━━ 3. OBJETOS EN LA ESCENA ━━━
• Un empapador blanco de entrenamiento, limpio y vacío, apoyado en el piso detrás del cachorro y hacia la derecha, desenfocado

━━━ 4. ESCENARIO ━━━
• El piso de madera clara de una sala de estar luminosa y ordenada
• Al fondo, la pata de un sofá claro y una pared blanca, completamente desenfocados

━━━ 5. LUZ ━━━
• Luz suave de ventana entrando desde la derecha, difusa. Ambiente claro y limpio.

━━━ 6. CÁMARA ━━━
• Cámara al nivel del piso, a la altura de los ojos del cachorro. Objetivo de 50 mm. Fondo desenfocado.

━━━ 7. COLORES ━━━
• Blancos, maderas claras y el marrón y negro del pelaje.

━━━ 8. AMBIENTE ━━━
• Tierno y doméstico. Da ganas de perdonarlo.

━━━ 9. COMPOSICIÓN ━━━
• El cachorro centrado, en la mitad inferior. Deja el tercio superior vacío.

━━━ 10. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna cara humana.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-biting` — fim das mordidas
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. SUJETO PRINCIPAL ━━━
• Un cachorro de unos cuatro meses, raza Border Collie, de pelaje blanco y negro
• Está mordisqueando con suavidad la mano de una persona, con la boca apenas cerrada sobre los dedos
• El cuerpo está relajado y en postura de juego, con las patas delanteras estiradas hacia adelante
• La actitud es claramente de juego: nada de gruñido, orejas ni pelo erizados
• Ocupa cerca del 50% del ancho y está en el lado derecho

━━━ 3. OBJETOS EN LA ESCENA ━━━
• La mano y el antebrazo de una persona adulta entran desde el borde izquierdo de la imagen
• No se ve nada más de esa persona: ni cara, ni torso, ni hombro

━━━ 4. ESCENARIO ━━━
• Una alfombra clara de pelo corto, en el piso de una sala
• Al fondo, la base de un sofá claro completamente desenfocada

━━━ 5. LUZ ━━━
• Luz natural de interior, suave y pareja, sin sombras marcadas.

━━━ 6. CÁMARA ━━━
• Cámara al nivel del piso, muy cerca del cachorro. Objetivo de 50 mm. Poca profundidad de campo.

━━━ 7. COLORES ━━━
• Blanco, gris claro y negro, sobre fondo crema.

━━━ 8. AMBIENTE ━━━
• Juguetón y liviano. Un problema simpático, no una escena agresiva.

━━━ 9. COMPOSICIÓN ━━━
• El cachorro a la derecha y la mano entrando por la izquierda. Deja espacio vacío arriba.

━━━ 10. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna cara humana.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-behaviour` — comportamento indesejado
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. SUJETO PRINCIPAL ━━━
• Un perro adulto de tamaño mediano, raza Labrador de pelaje amarillo claro
• Está sentado en medio del desorden, erguido y quieto
• Mira directo a la cámara con expresión de inocencia total, la cabeza levemente ladeada
• Tiene un par de plumas blancas pegadas en el hocico
• Ocupa cerca del 45% del alto y está centrado

━━━ 3. OBJETOS EN LA ESCENA ━━━
• Un cojín de sofá roto en el piso, delante del perro, con la costura abierta
• Relleno blanco esparcido por el piso alrededor del perro, algunos trozos sueltos

━━━ 4. ESCENARIO ━━━
• El piso de una sala de estar común, de madera clara
• Al fondo, un sofá gris claro, desenfocado

━━━ 5. LUZ ━━━
• Luz de día entrando por una ventana lateral, clara y natural.

━━━ 6. CÁMARA ━━━
• Cámara a la altura de la cabeza del perro. Objetivo de 35 mm, para que entre algo del desorden alrededor. Fondo desenfocado.

━━━ 7. COLORES ━━━
• Blancos, grises y el amarillo claro del pelaje.

━━━ 8. AMBIENTE ━━━
• Cómico y culpable. Debe dar gracia, no enojo.

━━━ 9. COMPOSICIÓN ━━━
• El perro centrado, con el desorden abriéndose hacia los lados y hacia el frente. Deja el tercio superior vacío.

━━━ 10. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna cara humana.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-alone` — filhote sozinho em casa
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. SUJETO PRINCIPAL ━━━
• Un cachorro de unos cuatro meses, raza Cocker Spaniel, de pelaje dorado
• Está sentado solo en el piso, quieto, de frente a una puerta cerrada
• Se lo ve de perfil de tres cuartos, con la cabeza levantada mirando hacia la manija de la puerta
• Expresión de espera paciente y algo de tristeza, sin dramatismo
• Ocupa cerca del 30% del alto y está en el lado izquierdo

━━━ 3. OBJETOS EN LA ESCENA ━━━
• Una puerta interior de madera clara, cerrada, que ocupa el fondo de la imagen
• Una franja de luz cálida entrando por debajo de la puerta y extendiéndose sobre el piso

━━━ 4. ESCENARIO ━━━
• Un pasillo interior vacío, de piso de madera, sin muebles ni objetos

━━━ 5. LUZ ━━━
• Ambiente en penumbra suave. La única luz fuerte es la franja que entra por debajo de la puerta.

━━━ 6. CÁMARA ━━━
• Cámara al nivel del piso, a dos metros del cachorro. Objetivo de 35 mm. Fondo enfocado.

━━━ 7. COLORES ━━━
• Marrones apagados y crema, con la franja de luz cálida como único punto brillante.

━━━ 8. AMBIENTE ━━━
• Silencioso y de espera. Melancólico, nunca angustiante.

━━━ 9. COMPOSICIÓN ━━━
• El cachorro a la izquierda y la puerta ocupando el resto. Deja espacio vacío a la derecha.

━━━ 10. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna cara humana.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `quiz-proof_breed` — prova social por raça
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. SUJETO PRINCIPAL ━━━
• Tres perros adultos de razas distintas, sentados uno al lado del otro en fila
• De izquierda a derecha: un Golden Retriever dorado, un Border Collie blanco y negro, y un Beagle tricolor
• Los tres están sentados y erguidos, en la misma postura, mirando en la misma dirección hacia la cámara
• Se ven atentos y bien entrenados, ninguno distraído
• En conjunto ocupan cerca del 70% del ancho de la imagen

━━━ 3. ESCENARIO ━━━
• El pasto corto y verde de un parque
• Al fondo, árboles completamente desenfocados

━━━ 4. LUZ ━━━
• Luz natural de la mañana, suave y pareja, sin sombras duras.

━━━ 5. CÁMARA ━━━
• Cámara a la altura de la cabeza de los perros, de frente. Objetivo de 50 mm. Fondo muy desenfocado.

━━━ 6. COLORES ━━━
• Verdes suaves de fondo, con los pelajes dorado, blanco, negro y marrón.

━━━ 7. AMBIENTE ━━━
• Ordenado y confiable. Tres perros que claramente aprendieron algo.

━━━ 8. COMPOSICIÓN ━━━
• Los tres centrados y alineados sobre la misma línea. Deja espacio vacío arriba y abajo.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna cara humana.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `quiz-heard_you` — acolhimento
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. SUJETO PRINCIPAL ━━━
• Un perro adulto de tamaño mediano, raza Golden Retriever de pelaje dorado
• Está de pie, apoyado contra una persona que lo abraza, con la cabeza apoyada en el hombro de ella
• Se lo ve de perfil, con los ojos entrecerrados y expresión de calma
• Ocupa cerca del 40% del ancho, en el lado derecho

━━━ 3. OBJETOS EN LA ESCENA ━━━
• Una persona adulta en cuclillas, abrazando al perro con los dos brazos
• El encuadre corta a la persona a la altura del cuello: nunca se ve su cara
• Viste ropa sencilla en tonos neutros

━━━ 4. ESCENARIO ━━━
• El pasto de un parque al final de la tarde
• Al fondo, árboles y luz filtrándose entre las hojas, completamente desenfocados

━━━ 5. LUZ ━━━
• Luz dorada de atardecer viniendo desde atrás, con un halo suave alrededor de las siluetas.

━━━ 6. CÁMARA ━━━
• Cámara a la altura de las dos figuras, de perfil. Objetivo de 85 mm. Fondo muy desenfocado.

━━━ 7. COLORES ━━━
• Dorados cálidos y verdes suaves.

━━━ 8. AMBIENTE ━━━
• Íntimo y tranquilo. El momento de vínculo que el funil promete.

━━━ 9. COMPOSICIÓN ━━━
• Las dos figuras juntas y centradas, ligeramente a la derecha. Deja espacio vacío a la izquierda.

━━━ 10. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna cara humana.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `plan-ready` — o plano ficou pronto
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Fotografía realista. No es ilustración, no es render 3D, no es dibujo.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. SUJETO PRINCIPAL ━━━
• Un perro adulto de tamaño mediano, raza Border Collie de pelaje blanco y negro
• Está sentado, erguido y perfectamente quieto, con las patas delanteras rectas
• Orejas levantadas y atentas, cabeza en alto, mirando directo a la cámara
• Expresión despierta y lista, como esperando una orden
• Ocupa cerca del 45% del alto y está centrado

━━━ 3. ESCENARIO ━━━
• El piso de madera clara de una sala luminosa y vacía
• Al fondo, una pared blanca lisa, completamente desenfocada

━━━ 4. LUZ ━━━
• Luz natural clara y difusa, entrando desde la izquierda. Ambiente muy luminoso.

━━━ 5. CÁMARA ━━━
• Cámara a la altura de los ojos del perro. Objetivo de 85 mm. Fondo desenfocado.

━━━ 6. COLORES ━━━
• Blancos y maderas claras, con el blanco y negro del pelaje.

━━━ 7. AMBIENTE ━━━
• Optimista y ordenado. Un perro listo para empezar.

━━━ 8. COMPOSICIÓN ━━━
• El perro centrado, en la mitad inferior de la imagen. Deja bastante espacio vacío arriba.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ninguna cara humana.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

---

# TRILHA B — ILUSTRAÇÃO

Mesmas cenas. Escolha uma trilha e não misture.

### `checkout-product` — miniatura do produto no checkout
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Un perro adulto joven de raza Golden Retriever, de pelaje dorado claro, limpio y brillante
• Está sentado y erguido, con las patas delanteras rectas y apoyadas en la mesa
• Orejas caídas de forma natural, boca ligeramente abierta, lengua apenas visible
• Expresión atenta y amistosa, con la cabeza girada hacia el teléfono que tiene al lado
• Ocupa cerca del 45% del ancho de la imagen y está en el lado derecho

━━━ 4. OBJETOS EN LA ESCENA ━━━
• Un teléfono celular moderno, negro, de pantalla completa y bordes redondeados
• Está de pie sobre la mesa, apoyado y ligeramente inclinado hacia atrás, visto casi de frente
• La pantalla está encendida y muestra una interfaz limpia y clara, con bloques de color suaves; el texto de la interfaz aparece borroso y no se puede leer
• Ocupa cerca del 25% del ancho y está en el lado izquierdo, más cerca del centro que del borde

━━━ 5. ESCENARIO ━━━
• Una mesa de madera clara, lisa y sin objetos alrededor
• Al fondo, una pared de interior en tono crema, completamente desenfocada
• Todo el escenario simplificado a pocas formas planas.

━━━ 6. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 7. AMBIENTE ━━━
• Limpio, cálido y ordenado. Aspecto de foto de producto, no de foto casual.

━━━ 8. COMPOSICIÓN ━━━
• El perro a la derecha y el teléfono a la izquierda, ambos apoyados sobre la línea inferior. Deja el tercio superior de la imagen vacío.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-leash` — passeio sem puxar
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Un perro adulto de tamaño mediano, raza Labrador de pelaje color chocolate
• Está tirando con fuerza de la correa: el cuerpo inclinado hacia adelante, el pecho bajo y las patas traseras estiradas hacia atrás
• Boca abierta y lengua fuera, con expresión de entusiasmo, mirando hacia adelante y fuera del encuadre
• Ocupa cerca del 55% del ancho de la imagen y está en el lado derecho

━━━ 4. OBJETOS EN LA ESCENA ━━━
• Una correa de nailon azul, completamente tensa y recta, que cruza la imagen en diagonal
• La mano y el antebrazo de una persona adulta entran desde el borde izquierdo sujetando la correa; no se ve nada más de esa persona, ni su cara ni su cuerpo

━━━ 5. ESCENARIO ━━━
• Una acera de ciudad tranquila, de baldosas grises
• Al fondo, árboles y edificios bajos completamente desenfocados
• Todo el escenario simplificado a pocas formas planas.

━━━ 6. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 7. AMBIENTE ━━━
• Enérgico y cotidiano. Un paseo real, no una sesión de estudio.

━━━ 8. COMPOSICIÓN ━━━
• El perro a la derecha, la correa cruzando hacia la esquina superior izquierda. Deja espacio vacío delante del perro.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-potty` — xixi no lugar certo
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Un cachorro de unos tres meses, raza Beagle, de pelaje tricolor
• Está sentado, con las patas delanteras juntas y el cuerpo un poco encogido
• Orejas caídas y bajas, cabeza ligeramente inclinada hacia abajo, ojos grandes mirando hacia arriba directo a la cámara
• Expresión de culpa y ternura, no de miedo
• Ocupa cerca del 40% del alto de la imagen y está centrado

━━━ 4. OBJETOS EN LA ESCENA ━━━
• Un empapador blanco de entrenamiento, limpio y vacío, apoyado en el piso detrás del cachorro y hacia la derecha, desenfocado

━━━ 5. ESCENARIO ━━━
• El piso de madera clara de una sala de estar luminosa y ordenada
• Al fondo, la pata de un sofá claro y una pared blanca, completamente desenfocados
• Todo el escenario simplificado a pocas formas planas.

━━━ 6. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 7. AMBIENTE ━━━
• Tierno y doméstico. Da ganas de perdonarlo.

━━━ 8. COMPOSICIÓN ━━━
• El cachorro centrado, en la mitad inferior. Deja el tercio superior vacío.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-biting` — fim das mordidas
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Un cachorro de unos cuatro meses, raza Border Collie, de pelaje blanco y negro
• Está mordisqueando con suavidad la mano de una persona, con la boca apenas cerrada sobre los dedos
• El cuerpo está relajado y en postura de juego, con las patas delanteras estiradas hacia adelante
• La actitud es claramente de juego: nada de gruñido, orejas ni pelo erizados
• Ocupa cerca del 50% del ancho y está en el lado derecho

━━━ 4. OBJETOS EN LA ESCENA ━━━
• La mano y el antebrazo de una persona adulta entran desde el borde izquierdo de la imagen
• No se ve nada más de esa persona: ni cara, ni torso, ni hombro

━━━ 5. ESCENARIO ━━━
• Una alfombra clara de pelo corto, en el piso de una sala
• Al fondo, la base de un sofá claro completamente desenfocada
• Todo el escenario simplificado a pocas formas planas.

━━━ 6. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 7. AMBIENTE ━━━
• Juguetón y liviano. Un problema simpático, no una escena agresiva.

━━━ 8. COMPOSICIÓN ━━━
• El cachorro a la derecha y la mano entrando por la izquierda. Deja espacio vacío arriba.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-behaviour` — comportamento indesejado
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Un perro adulto de tamaño mediano, raza Labrador de pelaje amarillo claro
• Está sentado en medio del desorden, erguido y quieto
• Mira directo a la cámara con expresión de inocencia total, la cabeza levemente ladeada
• Tiene un par de plumas blancas pegadas en el hocico
• Ocupa cerca del 45% del alto y está centrado

━━━ 4. OBJETOS EN LA ESCENA ━━━
• Un cojín de sofá roto en el piso, delante del perro, con la costura abierta
• Relleno blanco esparcido por el piso alrededor del perro, algunos trozos sueltos

━━━ 5. ESCENARIO ━━━
• El piso de una sala de estar común, de madera clara
• Al fondo, un sofá gris claro, desenfocado
• Todo el escenario simplificado a pocas formas planas.

━━━ 6. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 7. AMBIENTE ━━━
• Cómico y culpable. Debe dar gracia, no enojo.

━━━ 8. COMPOSICIÓN ━━━
• El perro centrado, con el desorden abriéndose hacia los lados y hacia el frente. Deja el tercio superior vacío.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `hero-alone` — filhote sozinho em casa
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Un cachorro de unos cuatro meses, raza Cocker Spaniel, de pelaje dorado
• Está sentado solo en el piso, quieto, de frente a una puerta cerrada
• Se lo ve de perfil de tres cuartos, con la cabeza levantada mirando hacia la manija de la puerta
• Expresión de espera paciente y algo de tristeza, sin dramatismo
• Ocupa cerca del 30% del alto y está en el lado izquierdo

━━━ 4. OBJETOS EN LA ESCENA ━━━
• Una puerta interior de madera clara, cerrada, que ocupa el fondo de la imagen
• Una franja de luz cálida entrando por debajo de la puerta y extendiéndose sobre el piso

━━━ 5. ESCENARIO ━━━
• Un pasillo interior vacío, de piso de madera, sin muebles ni objetos
• Todo el escenario simplificado a pocas formas planas.

━━━ 6. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 7. AMBIENTE ━━━
• Silencioso y de espera. Melancólico, nunca angustiante.

━━━ 8. COMPOSICIÓN ━━━
• El cachorro a la izquierda y la puerta ocupando el resto. Deja espacio vacío a la derecha.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `quiz-proof_breed` — prova social por raça
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Tres perros adultos de razas distintas, sentados uno al lado del otro en fila
• De izquierda a derecha: un Golden Retriever dorado, un Border Collie blanco y negro, y un Beagle tricolor
• Los tres están sentados y erguidos, en la misma postura, mirando en la misma dirección hacia la cámara
• Se ven atentos y bien entrenados, ninguno distraído
• En conjunto ocupan cerca del 70% del ancho de la imagen

━━━ 4. ESCENARIO ━━━
• El pasto corto y verde de un parque
• Al fondo, árboles completamente desenfocados
• Todo el escenario simplificado a pocas formas planas.

━━━ 5. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 6. AMBIENTE ━━━
• Ordenado y confiable. Tres perros que claramente aprendieron algo.

━━━ 7. COMPOSICIÓN ━━━
• Los tres centrados y alineados sobre la misma línea. Deja espacio vacío arriba y abajo.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 8. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `quiz-heard_you` — acolhimento
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Un perro adulto de tamaño mediano, raza Golden Retriever de pelaje dorado
• Está de pie, apoyado contra una persona que lo abraza, con la cabeza apoyada en el hombro de ella
• Se lo ve de perfil, con los ojos entrecerrados y expresión de calma
• Ocupa cerca del 40% del ancho, en el lado derecho

━━━ 4. OBJETOS EN LA ESCENA ━━━
• Una persona adulta en cuclillas, abrazando al perro con los dos brazos
• El encuadre corta a la persona a la altura del cuello: nunca se ve su cara
• Viste ropa sencilla en tonos neutros

━━━ 5. ESCENARIO ━━━
• El pasto de un parque al final de la tarde
• Al fondo, árboles y luz filtrándose entre las hojas, completamente desenfocados
• Todo el escenario simplificado a pocas formas planas.

━━━ 6. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 7. AMBIENTE ━━━
• Íntimo y tranquilo. El momento de vínculo que el funil promete.

━━━ 8. COMPOSICIÓN ━━━
• Las dos figuras juntas y centradas, ligeramente a la derecha. Deja espacio vacío a la izquierda.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 9. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```

### `plan-ready` — o plano ficou pronto
```
Genera UNA sola imagen. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO DE SALIDA ━━━
• Ilustración vectorial plana. No es fotografía, no es render 3D.
• Imagen cuadrada, proporción exacta 1:1, 1080 x 1080 píxeles.

━━━ 2. ESTILO ━━━
• Formas simples y redondeadas, con contorno grueso y parejo.
• Colores planos, sin degradados ni sombras realistas.
• Proporciones tiernas: cabeza grande y cuerpo compacto.
• Aspecto de pantalla de bienvenida de una aplicación móvil moderna.

━━━ 3. SUJETO PRINCIPAL ━━━
• Un perro adulto de tamaño mediano, raza Border Collie de pelaje blanco y negro
• Está sentado, erguido y perfectamente quieto, con las patas delanteras rectas
• Orejas levantadas y atentas, cabeza en alto, mirando directo a la cámara
• Expresión despierta y lista, como esperando una orden
• Ocupa cerca del 45% del alto y está centrado

━━━ 4. ESCENARIO ━━━
• El piso de madera clara de una sala luminosa y vacía
• Al fondo, una pared blanca lisa, completamente desenfocada
• Todo el escenario simplificado a pocas formas planas.

━━━ 5. COLORES ━━━
• Fondo crema liso y parejo.
• El resto en tonos lavanda y crema.
• Un solo acento coral en el punto más importante de la escena.

━━━ 6. AMBIENTE ━━━
• Optimista y ordenado. Un perro listo para empezar.

━━━ 7. COMPOSICIÓN ━━━
• El perro centrado, en la mitad inferior de la imagen. Deja bastante espacio vacío arriba.
• Márgenes amplios: nada toca el borde de la imagen.

━━━ 8. NO INCLUYAS ━━━
• Ninguna palabra, letra, número, cartel, logotipo ni marca de agua.
• Ningún rasgo facial humano detallado.
• Ningún borde, marco ni collage. Una sola imagen.

Genera la imagen ahora.
```
---

# VÍDEOS DAS AULAS

Ids `lesson-<curso>-<aula>`. Curso 1 é "Filhote — curso básico".

Regra que vale mais que qualquer detalhe: **uma ação só por clipe**. Pedir
três momentos em seis segundos é o que produz aquele vídeo derretido.

### `lesson-1-1` — parar de morder na brincadeira
```
Genera UN video corto. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO ━━━
• Video realista de 6 segundos, proporción 4:3, sin audio.
• Pensado para repetirse en bucle: el último cuadro debe parecerse al primero.

━━━ 2. ACCIÓN, UNA SOLA ━━━
• Un cachorro de unos cuatro meses mordisquea con suavidad la mano de una persona.
• La mano se aleja despacio y el cachorro se queda quieto, mirándola.
• No pasa nada más en todo el clip.

━━━ 3. ESCENARIO ━━━
• Una alfombra clara en el piso de una sala. Al fondo, un sofá claro desenfocado.

━━━ 4. CÁMARA ━━━
• Fija, al nivel del piso. Sin zoom, sin paneo, sin ningún movimiento de cámara.

━━━ 5. LUZ ━━━
• Luz natural de interior, suave y pareja, sin sombras marcadas.

━━━ 6. NO INCLUYAS ━━━
• Ningún texto, letra, número, logotipo ni marca de agua.
• Ninguna cara humana: solo la mano y el antebrazo.

Genera el video ahora.
```

### `lesson-1-2` — xixi no lugar certo
```
Genera UN video corto. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO ━━━
• Video realista de 6 segundos, proporción 4:3, sin audio.
• Pensado para repetirse en bucle: el último cuadro debe parecerse al primero.

━━━ 2. ACCIÓN, UNA SOLA ━━━
• Un cachorro camina hasta un empapador blanco apoyado en el piso y se sienta encima.
• Después levanta la cabeza y mira hacia arriba.
• No pasa nada más en todo el clip.

━━━ 3. ESCENARIO ━━━
• El piso de madera clara de una sala luminosa y ordenada, sin objetos alrededor.

━━━ 4. CÁMARA ━━━
• Fija, al nivel del piso. Sin zoom, sin paneo, sin ningún movimiento de cámara.

━━━ 5. LUZ ━━━
• Luz de ventana, clara y difusa.

━━━ 6. NO INCLUYAS ━━━
• Ningún texto, letra, número, logotipo ni marca de agua.
• Ninguna persona en el encuadre.

Genera el video ahora.
```

### `lesson-1-4` — jogo do "pega e solta"
```
Genera UN video corto. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO ━━━
• Video realista de 6 segundos, proporción 4:3, sin audio.
• Pensado para repetirse en bucle: el último cuadro debe parecerse al primero.

━━━ 2. ACCIÓN, UNA SOLA ━━━
• Un cachorro sostiene un juguete de cuerda en la boca.
• Una mano se acerca desde el borde con un premio y el cachorro suelta la cuerda.
• No pasa nada más en todo el clip.

━━━ 3. ESCENARIO ━━━
• Una alfombra clara en el piso de una sala, fondo desenfocado.

━━━ 4. CÁMARA ━━━
• Fija, al nivel del piso. Sin zoom, sin paneo, sin ningún movimiento de cámara.

━━━ 5. LUZ ━━━
• Luz natural de interior, suave y pareja.

━━━ 6. NO INCLUYAS ━━━
• Ningún texto, letra, número, logotipo ni marca de agua.
• Ninguna cara humana: solo la mano y el antebrazo.

Genera el video ahora.
```

### `lesson-1-7` — ensinando o nome
```
Genera UN video corto. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO ━━━
• Video realista de 5 segundos, proporción 4:3, sin audio.
• Pensado para repetirse en bucle: el último cuadro debe parecerse al primero.

━━━ 2. ACCIÓN, UNA SOLA ━━━
• Un cachorro está de espaldas a la cámara, distraído, mirando hacia otro lado.
• De golpe gira la cabeza hacia la cámara y levanta las orejas.
• No pasa nada más en todo el clip.

━━━ 3. ESCENARIO ━━━
• El piso de madera clara de una sala luminosa, fondo desenfocado.

━━━ 4. CÁMARA ━━━
• Fija, al nivel del piso. Sin zoom, sin paneo, sin ningún movimiento de cámara.

━━━ 5. LUZ ━━━
• Luz natural de interior, clara y difusa.

━━━ 6. NO INCLUYAS ━━━
• Ningún texto, letra, número, logotipo ni marca de agua.
• Ninguna persona en el encuadre.

Genera el video ahora.
```

### Molde para as demais aulas
Troque só o bloco 2 por **uma única ação**:
```
Genera UN video corto. Sigue cada punto al pie de la letra y no omitas ninguno.

━━━ 1. FORMATO ━━━
• Video realista de 6 segundos, proporción 4:3, sin audio.
• Pensado para repetirse en bucle: el último cuadro debe parecerse al primero.

━━━ 2. ACCIÓN, UNA SOLA ━━━
• <escribe aquí una sola acción, en una frase>
• No pasa nada más en todo el clip.

━━━ 3. ESCENARIO ━━━
• El piso de una sala luminosa y ordenada, fondo desenfocado.

━━━ 4. CÁMARA ━━━
• Fija, al nivel del piso. Sin zoom, sin paneo, sin ningún movimiento de cámara.

━━━ 5. LUZ ━━━
• Luz natural de interior, suave y pareja.

━━━ 6. NO INCLUYAS ━━━
• Ningún texto, letra, número, logotipo ni marca de agua.
• Ninguna cara humana.

Genera el video ahora.
```

---

# CHECKOUT

## Imagem do produto na Hotmart

Uma imagem serve para os três planos.

Duas opções, as duas prontas:

1. **`assets/checkout-product.png`** no repositório — montada a partir da tela
   real do app, em espanhol. Mostra o que a pessoa está comprando.
2. **Gerar uma foto** com o bloco `checkout-product` da trilha A. Esse bloco é
   afinado para miniatura: o cachorro e o celular preenchem cerca de 80% do
   quadro, porque na Hotmart a imagem aparece pequena e espaço vazio ali só
   atrapalha.

Suba quadrada. 1080×1080 é seguro — a plataforma reduz sozinha — e mantenha
o arquivo abaixo de 2 MB.

### Plano 1 — 7 dias · cobrar USD 1,99
- **Nome:** `DogFlow — Plan de 7 días`
- **Descrição:** `Plan de entrenamiento personalizado para tu perro, según su
  raza, su edad y sus problemas de comportamiento. Acceso completo por 7 días:
  más de 70 clases cortas, más de 80 juegos y trucos, y guías de higiene,
  salud y alimentación. 15 minutos al día bastan para ver progreso.`

### Plano 2 — 4 semanas · cobrar USD 6,51 (o mais vendido)
- **Nome:** `DogFlow — Plan de 4 semanas`
- **Descrição:** `Plan de entrenamiento personalizado para tu perro, según su
  raza, su edad y sus problemas de comportamiento. Acceso completo por 4
  semanas: más de 70 clases cortas, más de 80 juegos y trucos, y guías de
  higiene, salud y alimentación. El 98% de nuestros usuarios nota cambios
  positivos ya en la primera semana.`

### Plano 3 — 12 semanas · cobrar USD 13,92
- **Nome:** `DogFlow — Plan de 12 semanas`
- **Descrição:** `Plan de entrenamiento personalizado para tu perro, según su
  raza, su edad y sus problemas de comportamiento. Acceso completo por 12
  semanas: más de 70 clases cortas, más de 80 juegos y trucos, y guías de
  higiene, salud y alimentación. El plan completo para dejar atrás los
  comportamientos no deseados y sostener el resultado.`

### Garantia (mesma para os três)
`Garantía de reembolso de 30 días. Si sigues el plan y no notas un cambio
concreto en el comportamiento de tu perro, te devolvemos el dinero.`

> A garantia de 30 dias está escrita no paywall. Configure o mesmo prazo no
> checkout — se divergir, a plataforma pode barrar o produto na revisão.

---

# ESPECIFICAÇÕES TÉCNICAS

| Uso | Formato | Tamanho |
|---|---|---|
| `hero-*`, `quiz-*`, `plan-ready` | PNG ou JPG, quadrado 1:1 | 1080×1080 |
| `checkout-product` | pronto no repositório | 1080×1080 |
| `lesson-*` | MP4, 4:3, sem áudio | 1200×900, 5 a 10 s em loop |
