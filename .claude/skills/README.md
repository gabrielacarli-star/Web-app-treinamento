# Pack de Skills — Criativos e Benchmarking para Tráfego Direto

Cinco skills, um contrato de dados compartilhado. A ordem de uso é a ordem da aula.

## Ordem de execução

BLOCO 1 — o que já vende (pago, validado por verba)
1. **benchmarking-mercado** (Raio-X do Leilão) — largura. Mapeia o nicho, monta o grupo
   de controle e devolve o Mapa de Fatias.
2. **dissecacao-de-criativo** — pega os ads mais escalados de uma oferta, reconstrói o
   roteiro e destrincha cada um em ângulo, avatar, formato e hook de uma vez.
3. **mineracao-angulo · mineracao-clickbait · mineracao-formatos-virais** — profundidade
   por variável, na fatia que o Raio-X apontou.
4. **espiao-de-funil** — profundidade em UM concorrente, das 7 camadas ao pós-compra.

BLOCO 2 — o que já prende (público e orgânico, chega antes no ciclo)
5. **estudo-de-publico** — micro-personas por papel ameaçado, com linguagem literal e
   lastro de evidência. É quem define `micro_persona_id` pro pack inteiro.
6. **mineracao-formatos-virais**, frente orgânica — o que viraliza no TikTok, YouTube e
   Instagram, com avaliação de transferência pro pago.

CRUZAMENTO
7. **esteira-de-hook** — junta os dois blocos e gera transplante de formato, troca de
   avatar e reescrita na linguagem do público.

GERAÇÃO
8. **gerador-de-criativo-imagem** — lê estrutura, estilo e hook visual dos estáticos
   escalados e devolve o prompt da base visual mais a especificação da camada de edição.
9. **gerador-de-criativo-video** — decompõe os vídeos escalados plano a plano e devolve,
   por plano, o par: prompt da imagem base + prompt de imagem para vídeo, com fala e
   room tone. A imagem base pode vir da skill de imagem.

FECHAMENTO DO LOOP
10. **diagnostico-criativo** — lê o gerenciador, aponta o pedaço quebrado, escreve o
   resultado no Banco de Fatias e chama a esteira pros substitutos.

CONSOLIDAÇÃO
    python3 dissecacao-de-criativo/scripts/consolidar_planilha.py . banco-criativo.xlsx

Gera uma planilha com 10 abas (Resumo, Criativos, Angulos, Avatares, Formatos, Hooks,
Publico, Virais, Anunciantes, Fatias). Fonte ausente vira aba vazia, nunca erro.

## Arquivos gerados

    mineracao/benchmark.json      <- benchmarking-mercado
    mineracao/angulos.json        <- mineracao-angulo
    mineracao/clickbait.json      <- mineracao-clickbait
    mineracao/board-clickbait.md  <- mineracao-clickbait (board visual)
    mineracao/capturas/*.png      <- mineracao-clickbait (referência interna)
    mineracao/formatos.json       <- mineracao-formatos-virais
    espionagem/<alvo>.json + .md  <- espiao-de-funil
    esteira/leva-<data>.json      <- esteira-de-hook
    banco/criativos.json          <- dissecacao-de-criativo
    banco/publico.json            <- estudo-de-publico
    banco/virais.json             <- mineracao-formatos-virais (orgânico)
    banco-de-fatias.json          <- lido pelo Raio-X e pela Esteira, escrito por ambas
    geracao/prompts-*.md          <- gerador-de-criativo-imagem
    geracao/leva.json             <- gerador-de-criativo-imagem
    geracao/video-*.md            <- gerador-de-criativo-video
    geracao/leva-video.json       <- gerador-de-criativo-video
    banco-criativo.xlsx           <- consolidar_planilha.py
    (o diagnostico ESCREVE em banco-de-fatias.json: validado | morto | inconclusivo)

## O Banco de Fatias

Não é skill, é o ativo. O Raio-X lê antes de recomendar e escreve as fatias fantasma como
`a_testar`. A Esteira lê pra não repropor combinação queimada e escreve cada peça gerada.
Quando o resultado voltar do gerenciador, é nele que o `status` vira `validado` ou `morto`.
É o único arquivo que composta com o tempo — as skills são substituíveis, ele não.

## Teste de integração

    python3 validar-contratos.py

Valida os blocos JSON das seis skills, confere se as minerações compartilham o mesmo
contrato, se a esteira só pede campos que a origem entrega, e se os enums batem.
Rode sempre que editar qualquer SKILL.md — quebra de contrato não aparece na leitura.

**Imagem sim, vídeo não.** O Claude analisa imagem a fundo — cena, sujeito, figurino,
cenário, luz, props. Vídeo ele não assiste: reconstrói por frames, legenda queimada e
transcrição. Toda skill que lê vídeo declara o que é observado e o que é inferido.

**O Claude não assiste vídeo.** Roteiro de ad é reconstruído por legenda queimada lida em
frames (via principal), captions da plataforma, transcrição colada ou descrição estruturada.
A origem vai declarada em todo item. Nada de roteiro plausível inventado.

## A regra da derivação

Tudo que a skill precisaria perguntar — ticket, país, micro-personas, avatares, formatos,
ângulos — ela deriva do mercado. Mas **só do grupo A**, o subconjunto que está sustentando
verba acima do corte de longevidade.

Antes de derivar qualquer coisa ela estabelece esse subconjunto: passada provisória a 21 dias,
lê o ticket nas páginas dos 10 do topo, fixa o corte real pela tabela por ticket, e reordena.
O grupo B, dos que morreram cedo, entra só para calcular discriminação — nunca como fonte
de persona, formato ou ângulo.

Derivar da amostra somada é derivar do ruído: o que é comum entre anúncios que não performam
é convenção do nicho, não vantagem.

## Qual criativo entra

Grupo A diz quais anunciantes escalam, não quais criativos prestam. Dentro de cada conta a
skill separa **controle** (longevidade acima da mediana da conta, duplicado ou variado),
**variação de controle** e **teste** (menos de 7 dias, sem duplicação). Teste não entra.

Ângulo, avatar e micro-persona saem dos controles. Formato e hook visual saem das variações
recentes dos controles, porque é onde o anunciante está mexendo agora.

**A contagem é por anunciante distinto, nunca por anúncio.** Um anunciante com 200 peças
conta como um voto por elemento — senão ele define sozinho todos os percentuais e você modela
a preferência de uma conta em vez do padrão do mercado. Elemento presente nos controles de
menos de 3 anunciantes é hipótese, não padrão.

## Autonomia

Todas as 11 skills carregam a mesma camada de autonomia no topo: executam a cadeia inteira
sem pedir aprovação no meio, decidem amostra e alvo pelos critérios do próprio arquivo em vez
de perguntar, leem os JSONs do banco antes de recomeçar trabalho, e entregam arquivo salvo com
caminho informado — nunca texto colado no chat.

Elas só param quando falta login, falta permissão de pasta, ou quando existem duas leituras
igualmente defensáveis e a escolha muda o resultado.

Isso exige Cowork: sem navegador não tem captura, sem terminal não tem frame, e sem pasta local
o Banco de Fatias não acumula entre sessões.

## Três regras que atravessam o pack

**Grupo de controle.** Toda frequência é reportada em dois grupos (o que escalou e o que
morreu cedo) mais o índice de discriminação. Percentual só entre vencedores é ruído com
cara de dado.

**Captura é referência, não ativo.** As imagens que a mineração de hook visual salva formam
um board de pesquisa interno. O que vai pra produção é a receita de replicação, nunca o
arquivo do concorrente.

**Linha vermelha.** Extrai-se mecanismo e estrutura, nunca alegação enganosa nem ativo de
terceiro (copy literal, arte, PDF, nome de produto). Fatia que só existe com veneno é
passivo, não oportunidade.
