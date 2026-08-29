# Prompts de imagem e vídeo — DogFlow

Cada espaço reservado no app tem um **id** (aparece escrito dentro do próprio
placeholder). Aqui está o prompt pronto para gerar o arquivo de cada id.

Gere as imagens no ChatGPT (ou outro gerador) e me mande de volta — eu troco os
placeholders pelos arquivos reais.

---

## Antes de tudo: o estilo da marca

Cole este bloco **no começo de cada prompt de imagem**. É ele que faz todas as
imagens parecerem da mesma marca em vez de um mosaico de estilos diferentes.

> Ilustração vetorial plana (flat vector), traço arredondado e amigável, sem
> sombras realistas, sem gradiente pesado. Paleta: fundo creme #F8F5F0, roxo
> lavanda #A48BF0, coral #F2724F, verde-água #4FBFAE, amarelo #F5EC3D,
> contornos em azul-marinho escuro #2C2A44. Cachorro com expressão simpática e
> levemente cômica, proporções fofas, cabeça grande. Composição centralizada e
> limpa, com bastante espaço vazio ao redor. Sem texto, sem letras, sem logo,
> sem marca d'água. Formato quadrado 1:1.

**Especificação técnica:** 1080×1080 px, PNG, fundo creme sólido (não
transparente).

---

## Imagens da landing page (uma por ângulo de anúncio)

São as 5 variantes que rodam em `?v=`. Cada anúncio deve cair na landing com a
imagem do mesmo problema que o criativo prometeu resolver.

### `hero-leash` — passeio sem puxar
> [estilo] Um cachorro de porte médio puxando com força uma guia esticada na
> diagonal, patas dianteiras no ar, língua para fora, expressão de empolgação
> travessa. A guia sai do quadro para a esquerda. Um pequeno ícone circular
> coral com um "X" branco flutua sobre a guia esticada, indicando que esse é o
> comportamento a corrigir.

### `hero-potty` — xixi no lugar certo
> [estilo] Um filhote sentado com ar de culpado ao lado de uma pequena poça no
> chão de madeira clara, orelhas baixas, olhos grandes olhando para cima. Ao
> lado, um tapete higiênico azul-claro limpo e vazio. Ícone circular coral com
> "X" branco sobre a poça.

### `hero-biting` — fim das mordidas
> [estilo] Um filhote pequeno mordendo de brincadeira a mão de uma pessoa
> (mostrar só a mão e o punho, sem rosto, pele em tom neutro), com estrelinhas
> de "ai!" em coral saindo do ponto da mordida. Expressão do filhote é
> divertida, não agressiva.

### `hero-behaviour` — comportamento indesejado
> [estilo] Uma sala de estar bagunçada vista de frente: almofada rasgada com
> penas no ar, um chinelo mordido no chão, e um cachorro no centro sentado com
> a cara de "não fui eu", orelhas para trás e uma pena grudada no focinho.

### `hero-alone` — filhote sozinho em casa
> [estilo] Um filhote sozinho sentado atrás de uma porta fechada, visto de
> frente, com uma expressão triste e esperançosa. Luz suave vindo de baixo da
> porta. Ambiente simples, poucos elementos.

---

## Imagens dentro do quiz

### `quiz-proof_breed` — prova social por raça
Aparece logo depois da pergunta de raça, com o texto "mais de 150 mil cães da
raça X já treinaram com a gente".

> [estilo] Três cachorros de raças diferentes sentados lado a lado, alinhados e
> obedientes, todos olhando para a frente com expressão orgulhosa. Acima deles,
> três pequenas marcas de "check" em verde-água #4FBFAE. Composição horizontal
> equilibrada dentro do quadrado.

### `quiz-heard_you` — "entendemos o seu caso"
Tela de acolhimento no meio do quiz, depois das perguntas de problema.

> [estilo] Uma pessoa agachada de lado abraçando um cachorro, ambos de perfil,
> em um momento calmo e afetuoso. Mostrar a pessoa de forma genérica e
> estilizada, sem rosto detalhado. Ao redor, um contorno suave em formato de
> coração em roxo lavanda #A48BF0, bem discreto.

---

## Imagem da tela de plano pronto

### `plan-ready` — o plano ficou pronto
> [estilo] Um cachorro sentado ereto e atento, com uma prancheta ou tablet
> flutuando ao lado mostrando uma lista com três marcas de check em verde-água.
> Pequenos confetes em roxo lavanda e amarelo ao fundo, poucos e discretos.
> Clima de conquista, não de festa exagerada.

---

## Vídeos das aulas (área de membros)

Os ids são `lesson-<curso>-<aula>`. Curso 1 é "Filhote — curso básico".
São vídeos curtos, de **5 a 10 segundos**, em loop, sem áudio e sem texto.

### Estilo base dos vídeos
Cole no começo de cada prompt de vídeo:

> Animação 2D vetorial plana, mesma paleta da marca (creme #F8F5F0, roxo
> lavanda #A48BF0, coral #F2724F, verde-água #4FBFAE, contorno azul-marinho
> #2C2A44), fundo amarelo #F5EC3D sólido. Câmera fixa, sem zoom e sem
> movimento de câmera. Movimento suave e em loop perfeito. Sem texto, sem
> legenda, sem logo. 6 segundos, proporção 4:3.

**Especificação técnica:** MP4, 4:3, 1200×900 px, sem áudio, 6 s em loop.

### `lesson-1-1` — parar de morder na brincadeira
> [estilo vídeo] Um filhote morde de leve a mão de uma pessoa; a mão se afasta
> e para de brincar; o filhote inclina a cabeça, confuso; a mão volta e faz um
> carinho. Ciclo de quatro momentos, bem devagar.

### `lesson-1-2` — treino de xixi no lugar certo
> [estilo vídeo] Um filhote caminha até um tapete higiênico, senta em cima dele
> e olha para cima esperando aprovação; uma marca de check verde-água aparece e
> some suavemente acima dele.

### `lesson-1-4` — jogo do "pega e solta"
> [estilo vídeo] Um filhote segura um brinquedo de corda na boca; uma mão se
> aproxima com um petisco; o filhote solta a corda; a mão entrega o petisco.

### `lesson-1-7` — ensinando o nome
> [estilo vídeo] Um filhote de costas, distraído; ele vira a cabeça de repente
> na direção da câmera com as orelhas levantando; pequenas ondas sonoras em
> roxo lavanda aparecem do lado esquerdo do quadro.

### Modelo para as demais aulas
Para qualquer outra aula, use este molde trocando só a ação:

> [estilo vídeo] Um cachorro executando **<a ação da aula, em uma frase curta e
> concreta>**, em três momentos claros: antes, durante e o resultado. Uma marca
> de check verde-água aparece no final.

---

## Se quiser vídeo na landing depois

Quando for testar landing com vídeo em vez de imagem, o slot `hero-*` vira
vídeo de **5 segundos**, 1:1, sem áudio:

> [estilo vídeo] O mesmo cachorro e a mesma cena descrita no prompt de imagem
> `hero-<variante>`, com um único movimento em loop: <o comportamento problema
> acontecendo uma vez>. Proporção 1:1, 5 segundos, sem áudio, loop perfeito.

O importante é que o primeiro quadro do vídeo seja praticamente idêntico à
imagem estática — assim dá para trocar imagem por vídeo sem refazer o teste.

---

## Imagem do produto no checkout (Hotmart / Kiwify)

É a miniatura que aparece ao lado do preço na página de pagamento. Uma imagem
serve para os três planos — o que muda é só o nome do produto.

**Especificação técnica:** 1080×1080 px (1:1), PNG ou JPG, abaixo de 2 MB.
Sem texto pequeno: no checkout ela aparece com uns 120 px de lado e qualquer
texto miúdo vira borrão.

### `checkout-product`
> Ilustração vetorial plana (flat vector), traço arredondado e amigável, sem
> sombras realistas. Paleta: fundo creme #F8F5F0, roxo lavanda #A48BF0, coral
> #F2724F, verde-água #4FBFAE, contornos em azul-marinho escuro #2C2A44.
> Composição: um celular visto de frente, levemente inclinado, com a tela
> mostrando uma interface simples de app de treino (barra de progresso roxa e
> três linhas de lista com marcas de check verde-água — sem texto legível). Ao
> lado do celular, um cachorro simpático sentado e atento, olhando para a tela.
> Composição centralizada, com margem generosa nas bordas. Sem texto, sem
> letras, sem logo, sem marca d'água. Formato quadrado 1:1.

Se quiser diferenciar visualmente os três planos, gere a mesma imagem três
vezes trocando só a frase final por: "um pequeno selo circular coral no canto
superior direito com o número 7" / "com o número 4" / "com o número 12".

---

## Nome e descrição dos produtos no checkout (espanhol)

Copie e cole nos campos da Hotmart ou Kiwify.

### Plano 1 — 7 dias
- **Nome:** `DogFlow — Plan de 7 días`
- **Descrição:** `Plan de entrenamiento personalizado para tu perro, según su
  raza, su edad y sus problemas de comportamiento. Acceso completo por 7 días:
  más de 70 clases cortas, más de 80 juegos y trucos, y guías de higiene,
  salud y alimentación. 15 minutos al día bastan para ver progreso.`

### Plano 2 — 4 semanas (o mais vendido)
- **Nome:** `DogFlow — Plan de 4 semanas`
- **Descrição:** `Plan de entrenamiento personalizado para tu perro, según su
  raza, su edad y sus problemas de comportamiento. Acceso completo por 4
  semanas: más de 70 clases cortas, más de 80 juegos y trucos, y guías de
  higiene, salud y alimentación. El 98% de nuestros usuarios nota cambios
  positivos ya en la primera semana.`

### Plano 3 — 12 semanas
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
> checkout — se o checkout disser 7 dias e a página disser 30, a plataforma
> pode barrar o produto na revisão.
