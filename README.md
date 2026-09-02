# Gomes Odontologia & Estética — Landing Page

Landing page premium para a **Gomes Odontologia & Estética** ("Dentista Boiçucanga"),
clínica no Beira Praia Shopping, Boiçucanga — São Sebastião/SP.

> **v2** — reconstruída com fotos e dados reais extraídos do Instagram oficial
> @gomesodontoestetica (login autorizado do cliente), paleta calibrada a partir da
> logo real da marca, e um hero com profundidade 3D real via Three.js.
>
> **v3** — a cliente enviou um pacote de fotos e um vídeo reais (casos de antes/depois
> em alta qualidade, duas avaliações do Google e o vídeo de depoimento da paciente
> Tatiana). Essas fotos substituíram as capturas de tela de baixa resolução da v2 em
> Especialidades, Resultados e Depoimentos — ver seção 4.

---

## 1. Resumo da pesquisa (o que é real vs. o que está pendente)

**Confirmado com login no Instagram oficial (@gomesodontoestetica):**
- Razão social: *Gomes Odontologia e Estética Ltda* (aberta em 04/2024, ativa).
- Endereço: Av. Walkir Vergani, 614 — Sala 34 A, Beira Praia Shopping, Boiçucanga, São Sebastião - SP, CEP 11618-107.
- Bio oficial: *"Odontologia moderna e personalizada, com resultados que surpreendem."*
- **CRO-SP 137352 — Dra. Alanis Gomes**, confirmado tanto na bio quanto na legenda de um post da própria clínica (assinatura "Dra. Alanis Gomes | CRO-SP 137352").
- **WhatsApp confirmado**: `5512996119641`, extraído diretamente do link oficial (`wa.me/...`) na bio do Instagram — já configurado em `js/main.js`.
- Serviços confirmados nos destaques: Ortodontia, Implantes, Clareamento, Odontopediatria.
- Um caso real de reabilitação com implantes + prótese fixa (paciente identificada apenas como "Tati" num comentário), com legenda original da clínica.
- Dois depoimentos reais (um da legenda de post, outro de resposta a story) — ver seção Depoimentos.
- Logo oficial: script cursivo rose-gold sobre fundo creme/marmorizado — usada para calibrar a paleta (seção 2).

**Ainda pendente de confirmação com a cliente:**
- Biografia/formação completa da Dra. Alanis Gomes.
- Se a clínica oferece harmonização facial, botox, preenchimento, canal e próteses — não encontrei confirmação pública específica para esses procedimentos nesta unidade.
- Autorização formal (LGPD/uso de imagem) para publicar no site institucional os casos e depoimentos reais encontrados no Instagram — hoje eles têm base pública (postados pela própria clínica), mas "postado no Instagram" ≠ "autorizado para o site oficial". **Confirmar com a cliente antes de publicar em produção.**
- Fotos em alta resolução — as fotos reais usadas agora são **capturas de tela de baixa resolução** extraídas do Instagram (ver seção 5).

Todos esses pontos estão marcados no código com a classe `.pending-tag` e/ou comentários `<!-- ... -->` / `/* ... */`.

---

## 2. Direção criativa (v2)

**Por que mudou:** a v1 usava uma paleta grafite/preto que o cliente considerou "feia" e pediu algo mais próximo de referências reais (vídeos de landing pages odontológicas premium — "Dentora" da agência CROW, e "IVORY" da docmo.agency) e das cores da própria logo, além de fotos reais em vez de placeholders CSS.

**Paleta — calibrada pixel a pixel a partir da logo real** (`assets/images/clinic/logo-marca-real.jpg`):
| Token | Valor | Origem |
|---|---|---|
| `--cream` | `#FBF5EF` | fundo base claro |
| `--cream-deep` | `#F1E3D6` | seções alternadas |
| `--ink` | `#251A14` | texto principal (marrom quase-preto, não preto puro) |
| `--gold` | `#C1875C` | acento principal — **cor média real do script da logo** |
| `--gold-light` | `#E6B193` | tons claros/hover |
| `--espresso` | `#2A1B13` | único tom escuro do site, usado com moderação (depoimentos, CTA final, rodapé) |

Nada de preto/grafite frio como base — o site é predominantemente claro, com o tom escuro (espresso, marrom quente) reservado a 2-3 seções para dar contraste, não a metade do site como na v1.

**Tipografia** — mantida: `Cormorant Garamond` (títulos) + `Inter` (corpo).

**Fotos reais** — todas as fotos do hero, "A Clínica", parte das Especialidades, Estrutura, Galeria, Profissionais e Resultados/Depoimentos são **capturas reais** extraídas do Instagram oficial da clínica (não são banco de imagens, não são IA). Onde não havia foto real confirmada e relevante (Odontologia Estética, Odontopediatria, Harmonização Facial), o painel placeholder CSS original foi mantido — para não inventar ou usar uma foto genérica no lugar errado.

**3D real (não CSS fake)** — `js/three-hero.js` usa **Three.js** para aplicar a foto real do hero como textura num plano 3D com câmera em perspectiva, que inclina suavemente conforme o mouse se move. Degrada graciosamente: se o WebGL falhar ou `prefers-reduced-motion` estiver ativo, a foto real continua visível de forma estática (via `<img>` normal por trás do canvas). O resto da profundidade (parallax dos painéis editoriais, tilt dos cards de pilares, reveals) continua em CSS + GSAP/ScrollTrigger, como na v1.

**Cards flutuantes** (estilo das referências assistidas) — o hero tem dois cards com `backdrop-filter: blur` sobrepostos à foto: um com o CRO-SP como selo de credibilidade, outro com uma foto real + depoimento real do Instagram.

---

## 3. Como configurar o WhatsApp

Em `js/main.js`:

```js
const CONFIG = {
  whatsappNumber: '5512996119641', // já confirmado — ver seção 1
  whatsappMessage: 'Olá! Gostaria de agendar uma avaliação...',
};
```

Esse número foi extraído do link oficial `wa.me/...` na bio do Instagram logado da clínica. Vale uma confirmação rápida com a cliente antes de publicar em produção, mas não é mais uma suposição como na v1.

---

## 4. Fotos reais usadas — origem e como trocar por versões em alta resolução

Todas em `assets/images/clinic/`, extraídas via captura de tela do Instagram oficial (por isso a resolução é baixa — de ~90×333px a ~350×350px). **Antes de publicar em produção, peça à cliente a versão original de cada uma** (ela tem os arquivos originais em alta resolução, já que são posts/stories da própria clínica).

| Arquivo | Usado em | Conteúdo real |
|---|---|---|
| `logo-marca-real.jpg` | referência de paleta (não usada como `<img>` no site) | Logo oficial, script rose-gold sobre fundo creme |
| `retrato-perfil-real.jpg` | Seção Profissionais, Galeria | Foto de perfil do Instagram (provável retrato da Dra. Alanis) |
| `paciente-consultorio-01.jpg` | Hero (textura 3D), Galeria | Paciente real sorrindo, consultório ao fundo |
| `paciente-consultorio-02.jpg` | Seção "A Clínica" | Mesma paciente, outro ângulo — mostra equipamento/interior |
| `antes-depois-real-01.jpg` | Especialidades (Implantes), Resultados | Caso real de reabilitação com implantes + prótese fixa |
| `depoimento-video-frame.jpg` | Card flutuante do hero | Frame de vídeo de depoimento real |
| `ortodontia-real-01.jpg` | Especialidades (Ortodontia), Galeria | Aparelho ortodôntico real, close-up |
| `experiencia-sacola-marca.jpg` | Seção Estrutura | Detalhe de atendimento — sacola personalizada da marca |
| `equipe-colaboradora-01.jpg`, `equipe-colaboradora-02.jpg` | Seção Estrutura, Galeria | Membros da equipe no ambiente da clínica |

**Fotos e vídeo enviados diretamente pela cliente (v3 — qualidade bem superior às capturas de tela acima):**

| Arquivo | Usado em | Conteúdo real |
|---|---|---|
| `depoimento-tatiana-completo.mp4` + `depoimento-tatiana-hero-poster.jpg` | Área principal do hero | Vídeo real e completo (97s, **com áudio**) de depoimento da paciente **Tatiana**, comprimido de 17MB para ~7,5MB. Toca sob demanda (controles nativos), não em autoplay — navegadores bloqueiam autoplay com som |
| `depoimento-tatiana-poster.jpg` | Card flutuante do hero (placeholder temporário) | Frame do mesmo vídeo, usado até a cliente enviar uma foto real da Tatiana sorrindo para esse espaço |
| `ortodontia-real-02.jpg` | Especialidades (Ortodontia) | Antes/depois real de aparelho ortodôntico |
| `clareamento-real-01.jpg` | Especialidades (Odontologia Estética) | Antes/depois real de clareamento dental |
| `resultado-real-01-reabilitacao.jpg` | Resultados | Antes/depois — reabilitação estética completa |
| `resultado-real-02-protese.jpg` | Resultados | Antes/depois — reabilitação com prótese |
| `resultado-real-03-clareamento.jpg` | Resultados | Antes/depois — clareamento (isolamento com dique) |
| `resultado-real-04-restauracao.jpg` | Resultados | Peça "Antes & Depois — Restauração" já formatada pela própria clínica |
| `avaliacao-google-nayra.jpg`, `avaliacao-google-anaclara.jpg` | (referência — texto já transcrito no HTML) | Prints das peças "Feedback — Avaliação Google" da clínica, com avaliações reais e nome completo |

Esses depoimentos do Google (Nayra Campos, Ana Clara Gomes) e o depoimento da Tatiana **não têm mais a tag de "confirmar autorização"** da v2, porque são peças que a própria clínica já formatou para divulgação pública — mas continua valendo confirmar com a cliente se ela quer o texto integral ou resumido no site.

Para trocar qualquer imagem por uma versão em resolução ainda maior: basta substituir o arquivo mantendo o mesmo nome — nenhum HTML/CSS precisa mudar.

Onde ainda não há foto real (Odontologia Estética/Clareamento, Odontopediatria, Harmonização Facial, Recepção, Sala de atendimento dedicada, Fachada), o painel `.img-placeholder` (CSS, com legenda indicando o que falta) permanece — ver seção 5 para a lista do que pedir.

---

## 5. Fotos que ainda precisamos pedir para a cliente

| # | Foto | Enquadramento / Orientação | Proporção sugerida | Resolução mín. | Iluminação |
|---|---|---|---|---|---|
| 1 | **Versões em alta resolução de todas as fotos da tabela acima** (ela já tem os originais) | — | — | Original | — |
| 2 | Fachada da clínica | Horizontal, ângulo de rua | 3:2 | 2400×1600px | Luz natural, fim de tarde |
| 3 | Logo em alta resolução (vetor, se possível) | — | SVG/PNG fundo transparente | Vetorial | — |
| 4 | Recepção | Horizontal, ampla | 3:2 | 2000×1400px | Luz quente, ambiente |
| 5 | Sala de atendimento (vazia, sem paciente) | Horizontal | 3:2 | 2400×1600px | Luz quente/dourada |
| 6 | Clareamento dental / sorriso close-up | Frontal ou 3/4 | 1:1 ou 4:5 | 1600×1600px | Clínica, foco nítido |
| 7 | Atendimento odontopediátrico (com autorização do responsável) | Horizontal | 3:2 | 2000×1400px | Acolhedora |
| 8 | Harmonização facial (se o serviço for confirmado) | Close-up de rosto, com autorização | 4:5 | 1600×2000px | Suave, sem sombras duras |
| 9 | Fotos de antes/depois adicionais (autorizadas por escrito) | Frontal, mesmo enquadramento nas duas fotos | 1:1 | 1600×1600px | Consistente entre as duas fotos |
| 10 | Depoimentos em texto (nome ou iniciais autorizados) para completar a seção de Depoimentos | — | — | — | — |

**Observações gerais:**
- Priorizar luz quente/natural, consistente com a paleta creme/rose-gold do site.
- Fotos com pacientes/equipe exigem autorização de uso de imagem por escrito — inclusive as fotos já extraídas do Instagram, antes de manter no site final.
- Entregar sempre a maior resolução disponível.

---

## 6. Estrutura de arquivos

```
/
├── index.html
├── css/
│   ├── style.css        # estilos base (paleta, tipografia, layout, seções)
│   └── responsive.css   # breakpoints — mobile tem experiência própria, não só reduzida
├── js/
│   ├── main.js          # config (WhatsApp), header, menu mobile, ano no rodapé
│   ├── animations.js    # GSAP/ScrollTrigger — parallax, reveals, tilt 3D
│   └── three-hero.js    # profundidade 3D real (Three.js) na foto do hero
├── assets/
│   ├── images/
│   │   └── clinic/        # fotos reais extraídas do Instagram (ver seção 4) + onde salvar as em alta resolução
│   └── icons/
│       └── favicon.svg    # favicon provisório (monograma) — trocar pelo logo oficial
└── README.md
```

---

## 7. Performance e acessibilidade

- Three.js carregado via CDN (build `r128`, leve) apenas para a cena do hero; falha graciosamente para uma foto estática se o WebGL não estiver disponível.
- GSAP + ScrollTrigger para o restante das animações — nenhuma outra biblioteca pesada.
- `loading="lazy"` em todas as imagens fora do hero.
- Animações (incluindo a cena 3D) desativadas automaticamente com `prefers-reduced-motion: reduce`.
- HTML semântico (`header`, `main`, `section`, `address`, `footer`), um único `<h1>`, hierarquia de `<h2>`/`<h3>` respeitada, `alt` descritivo em todas as imagens.
- Dados estruturados (`schema.org/Dentist`) no `<head>` para SEO local.
