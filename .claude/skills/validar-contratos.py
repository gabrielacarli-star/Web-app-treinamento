import re, json, os, glob
from collections import defaultdict

files = sorted(glob.glob('*/SKILL.md'))
blocks = {}
for f in files:
    s = open(f).read()
    name = f.split('/')[0]
    found = re.findall(r'```json\n(.*?)```', s, re.S)
    blocks[name] = found

# 1. Todos os blocos JSON são parseáveis?
print("=== 1. VALIDADE DOS BLOCOS JSON ===")
parsed = defaultdict(list)
for name, bs in blocks.items():
    for i, b in enumerate(bs):
        try:
            parsed[name].append(json.loads(b))
            print(f"OK   {name} bloco {i+1}")
        except Exception as e:
            print(f"FALHA {name} bloco {i+1}: {e}")

# 2. Campos compartilhados entre as minerações + esteira
print("\n=== 2. ALINHAMENTO DO CONTRATO COMPARTILHADO ===")
def fields(obj):
    if isinstance(obj, list) and obj: obj = obj[0]
    return set(obj.keys()) if isinstance(obj, dict) else set()

miners = {}
for n in ['mineracao-angulo','mineracao-clickbait','mineracao-formatos-virais']:
    miners[n] = fields(parsed[n][0])

core = set.intersection(*miners.values())
print(f"Campos presentes nas 3 minerações ({len(core)}): {sorted(core)}\n")
for n, f in miners.items():
    print(f"{n} exclusivos: {sorted(f - core)}")

# 3. Campos que a esteira consome existem na origem?
print("\n=== 3. A ESTEIRA CONSOME O QUE EXISTE? ===")
esteira = fields(parsed['esteira-de-hook'][0])
precisa = {'micro_persona','angulo_id','formato_id','clickbait_id','principios',
           'estado_cognitivo','nivel_consciencia','crenca_respeitada','receita_visual'}
for c in sorted(precisa):
    print(f"  esteira.{c}: {'presente' if c in esteira else 'AUSENTE'}")

rec = parsed['mineracao-clickbait'][0][0].get('receita_replicacao', {})
rv = parsed['esteira-de-hook'][0][0].get('receita_visual', {})
print(f"\n  receita_replicacao (clickbait): {sorted(rec.keys())}")
print(f"  receita_visual (esteira):       {sorted(rv.keys())}")
faltando = set(rv) - set(rec) - {'referencia'}
print(f"  esteira pede e clickbait NAO entrega: {sorted(faltando) or 'nada'}")

# 4. Vocabulários de enum consistentes
print("\n=== 4. ENUMS ===")
def enums(name, field):
    out=set()
    for b in parsed[name]:
        o = b[0] if isinstance(b, list) else b
        v = o.get(field)
        if isinstance(v,str) and '|' in v:
            out |= {x.strip() for x in v.split('|')}
    return out
for field in ['estado_cognitivo','nivel_consciencia','adaptabilidade','status']:
    print(f"\n  {field}:")
    for n in parsed:
        e = enums(n, field)
        if e: print(f"    {n}: {sorted(e)}")

# 5. Limites do frontmatter (o Cowork recusa description > 1024)
print("\n=== 5. LIMITES DO FRONTMATTER ===")
LIMITE = 1024
for f in files:
    src=open(f).read()
    fm=re.match(r'^---\n(.*?)\n---\n', src, re.S)
    n=f.split('/')[0]
    if not fm: print(f"FALHA {n}: sem frontmatter"); continue
    m=re.search(r'description:\s*>\s*\n(.*)', fm.group(1), re.S)
    d=' '.join(m.group(1).split()) if m else ''
    folga = LIMITE - len(d)
    print(f"{'ESTOURA' if len(d)>LIMITE else 'ok     '} {len(d):5d}/{LIMITE} (folga {folga})  {n}")

# 6. Frontmatter
print("\n=== 6. FRONTMATTER ===")
for f in files:
    s=open(f).read()
    m=re.match(r'^---\n(.*?)\n---\n', s, re.S)
    n=f.split('/')[0]
    if not m: print(f"FALHA {n}: sem frontmatter"); continue
    fm=m.group(1)
    nome=re.search(r'^name:\s*(\S+)', fm, re.M)
    desc='description:' in fm
    match = nome and nome.group(1)==n
    print(f"{'OK  ' if (match and desc) else 'FALHA'} {n}: name={'bate' if match else 'DIVERGE'} | description={'ok' if desc else 'AUSENTE'} | linhas={len(s.splitlines())}")
