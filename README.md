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
> Especialidades, Resultados e Depoimentos — ver seção 4. O vídeo da Tatiana (completo,
> com áudio) virou o visual principal do hero, com controles nativos.
>
> **v4** — a cliente enviou 4 fotos reais tiradas na própria clínica (fachada, recepção
> com a logo, sala de espera, sala de atendimento) em boa resolução. A foto da fachada
> confirmou oficialmente a lista completa de serviços (inclusive harmonização facial,
> antes marcada como não confirmada) e o número de WhatsApp. Essas fotos substituíram
> as fotos de pacientes/equipe usadas antes em "A Clínica", Estrutura e Galeria.

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
| `retrato-perfil-real.jpg` | Seção Profissionais, Galeria | Foto de perfil do Instagram (provável retrato da Dra. Alanis) — ainda baixa resolução, ver seção 5 |
| `ortodontia-real-01.jpg` | Galeria | Aparelho ortodôntico real, close-up (captura de tela do Instagram) |

**Fotos e vídeo enviados diretamente pela cliente (v3 — casos, avaliações e depoimento em vídeo):**

| Arquivo | Usado em | Conteúdo real |
|---|---|---|
| `depoimento-tatiana-completo.mp4` + `depoimento-tatiana-hero-poster.jpg` | Área principal do hero | Vídeo real e completo (97s, **com áudio**) de depoimento da paciente **Tatiana**, comprimido de 17MB para ~7,5MB. Toca sob demanda (controles nativos), não em autoplay — navegadores bloqueiam autoplay com som |
| `depoimento-tatiana-poster.jpg` | Card flutuante do hero (placeholder temporário) | Frame do mesmo vídeo, usado até a cliente enviar uma foto real da Tatiana sorrindo para esse espaço |
| `antes-depois-real-01.jpg` | Especialidades (Implantes), Resultados | Caso real de reabilitação com implantes + prótese fixa (paciente "Tati") |
| `ortodontia-real-02.jpg` | Especialidades (Ortodontia) | Antes/depois real de aparelho ortodôntico |
| `clareamento-real-01.jpg` | Especialidades (Odontologia Estética) | Antes/depois real de clareamento dental |
| `resultado-real-01-reabilitacao.jpg` | Resultados | Antes/depois — reabilitação estética completa |
| `resultado-real-02-protese.jpg` | Resultados | Antes/depois — reabilitação com prótese |
| `resultado-real-03-clareamento.jpg` | Resultados | Antes/depois — clareamento (isolamento com dique) |
| `resultado-real-04-restauracao.jpg` | Resultados | Peça "Antes & Depois — Restauração" já formatada pela própria clínica |
| `avaliacao-google-nayra.jpg`, `avaliacao-google-anaclara.jpg` | (referência — texto já transcrito no HTML) | Prints das peças "Feedback — Avaliação Google" da clínica, com avaliações reais e nome completo |

**Fotos tiradas na própria clínica pela cliente (v4 — melhor qualidade de todas, câmera de verdade):**

| Arquivo | Usado em | Conteúdo real |
|---|---|---|
| `fachada-real.jpg` | Estrutura, Galeria, `og:image`/dados estruturados | Fachada da clínica no Beira Praia Shopping, com a placa oficial — **lista completa de serviços e telefone visíveis na foto** (ver seção 1) |
| `recepcao-logo-real.jpg` | Seção "A Clínica" | Parede da recepção com a logo oficial em relevo/espelhada |
| `recepcao-espera-real.jpg` | Estrutura, Galeria | Sala de espera/recepção completa |
| `sala-atendimento-real.jpg` | Estrutura | Sala de atendimento com cadeira odontológica e equipamentos |

Os depoimentos do Google (Nayra Campos, Ana Clara Gomes) e o depoimento da Tatiana **não têm mais a tag de "confirmar autorização"**, porque são peças que a própria clínica já formatou para divulgação pública — mas continua valendo confirmar com a cliente se ela quer o texto integral ou resumido no site institucional.

Para trocar qualquer imagem por uma versão em resolução ainda maior: basta substituir o arquivo mantendo o mesmo nome — nenhum HTML/CSS precisa mudar.

Onde ainda não há foto real (Odontopediatria e Harmonização Facial — este último já confirmado como serviço, só falta a foto do procedimento), o painel `.img-placeholder` (CSS, com legenda indicando o que falta) permanece — ver seção 5 para a lista do que pedir.

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
├── robots.txt            # aponta pro sitemap, libera tudo pra indexação
├── sitemap.xml           # site de página única — lista só a URL raiz
├── css/
│   ├── style.css        # estilos base (paleta, tipografia, layout, seções)
│   └── responsive.css   # breakpoints — mobile tem experiência própria, não só reduzida
├── js/
│   ├── main.js          # config (WhatsApp), header, menu mobile, ano no rodapé
│   ├── treatments.js    # bloco "Tratamentos em destaque" (array editável)
│   ├── carousel.js      # carrossel arrastável (Antes/Depois, Depoimentos)
│   ├── animations.js    # GSAP/ScrollTrigger — parallax, reveals, tilt 3D
│   └── site-content.js  # lê data/site-content.json e mostra anúncio/horário especial
├── admin.html            # painel admin (anúncio + horários especiais) — ver seção 9
├── api/
│   ├── verify-password.js # Vercel Serverless Function — confere a senha da tela de login
│   └── save-content.js    # Vercel Serverless Function usada pelo admin.html pra salvar
├── data/
│   └── site-content.json # conteúdo editável pelo painel (anúncio, horários especiais)
├── assets/
│   ├── images/
│   │   ├── clinic/        # fotos reais da clínica/tratamentos
│   │   └── team/           # fotos reais da Dra. Alanis (hero, bio, equipe)
│   └── icons/
│       └── favicon.ico, apple-touch-icon.png, etc.  # gerados a partir do logo oficial
└── README.md
```

> Nota: `three-hero.js` (profundidade 3D via Three.js) existiu numa versão anterior
> do hero e foi removido quando o hero passou a usar o vídeo de depoimento como
> visual principal — não procure por ele, é esperado que não exista mais.

---

## 7. Performance e acessibilidade

- GSAP + ScrollTrigger para as animações (reveals, parallax, tilt 3D nos cards) — única biblioteca externa carregada via CDN.
- `loading="lazy"` em todas as imagens fora do hero.
- Animações desativadas automaticamente com `prefers-reduced-motion: reduce`.
- HTML semântico (`header`, `main`, `section`, `address`, `footer`), um único `<h1>`, hierarquia de `<h2>`/`<h3>` respeitada, `alt` descritivo em todas as imagens.
- Dados estruturados (`schema.org/Dentist`) no `<head>` para SEO local — ver seção 8.

---

## 8. Domínio e SEO

**Domínio oficial (desde out/2026):**
- Forma legível: `gomesodontologiaeestética.com.br`
- Forma punycode/ASCII (a que realmente vai em URLs): `xn--gomesodontologiaeesttica-ufc.com.br`
- `SITE_URL` canônico: `https://xn--gomesodontologiaeesttica-ufc.com.br` — **sem** `www`, **sem** barra no final.

**Por que não existe uma variável `SITE_URL` de verdade:** este projeto é HTML/CSS/JS estático, sem bundler/build step — então não tem como uma única variável alimentar `<meta>` tags automaticamente (elas precisam estar no HTML puro para crawlers que não executam JS). Por isso o valor acima está hardcoded nos lugares abaixo. Se o domínio mudar de novo, esses são **todos** os lugares a atualizar:

| Arquivo | Onde |
|---|---|
| `index.html` | comentário no topo do `<head>`, `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, `og:site_name` não muda, JSON-LD (`image`, `url`) |
| `sitemap.xml` | `<loc>` |
| `robots.txt` | linha `Sitemap:` |

Se no futuro o site crescer (mais páginas, formulário com backend, etc.), vale migrar para uma ferramenta com build step (ex.: um gerador simples de HTML a partir de um `site.config.json`) para centralizar isso de verdade — hoje seria complexidade desnecessária para 3 arquivos.

**Checklist de verificação rápida depois de qualquer mudança de domínio:**
- [ ] `index.html`: canonical, og:url, og:image (absoluta), twitter:image, JSON-LD `url`/`image`
- [ ] `sitemap.xml` e `robots.txt`
- [ ] Links de WhatsApp (`js/main.js` → `CONFIG.whatsappNumber`), Instagram e "Como Chegar" continuam corretos e abrem em nova aba (`target="_blank" rel="noopener"`) — isso é independente do domínio do site e já está conferido.

---

## 9. Painel admin (anúncio + horários especiais)

Painel simples em `/admin.html` para 1–2 funcionárias editarem, sem precisar tocar em código:
- **Tela de login:** pede a senha do painel antes de mostrar qualquer campo ou conteúdo atual. Quem não souber a senha não vê nada além do campo de senha.
- **Anúncio (pop-up):** aviso que aparece sobre a tela na primeira visita (não é um banner fixo), com título, mensagem, uma foto opcional e um botão opcional com link (ex.: WhatsApp de uma promoção). Pode ser ativado/desativado a qualquer momento. A foto é enviada direto do computador/celular de quem está editando (sem precisar de link externo) — o navegador redimensiona ela antes de enviar, e ela é salva em `assets/images/announcements/anuncio.jpg` no mesmo commit do conteúdo.
- **Horários especiais:** datas com horário diferente do normal (feriados, etc.) ou marcadas como "fechado". Aparece como um aviso perto da seção "Como Chegar" nos 7 dias antes da data cadastrada.

**Como funciona por baixo dos panos (sem banco de dados, sem custo extra):**
1. O conteúdo fica em `data/site-content.json`, lido direto pelo site (`js/site-content.js`) e, depois do login, pelo painel (`admin.html`).
2. Ao digitar a senha na tela de login, o navegador envia `{ senha }` (por POST, nunca na URL) pra função serverless `api/verify-password.js`, que só confere a senha — não grava nada. Se estiver certa, o painel libera a edição e guarda a senha **só na memória da aba** (nunca em localStorage, sessionStorage, cookie ou console) para usar depois no "Salvar", sem pedir de novo.
3. Ao clicar em "Salvar", o navegador envia `{ senha, conteúdo }` (também por POST) pra função serverless `api/save-content.js`.
4. Essa função confere a senha de novo e, se estiver certa, grava o novo `data/site-content.json` direto no GitHub via API (usando um token).
5. Esse commit no GitHub dispara o deploy automático que já está configurado na Vercel — o site atualiza sozinho em 1–2 minutos, sem precisar rodar nada manualmente.

A senha nunca aparece na URL, no histórico do navegador ou em qualquer `console.log` — só viaja dentro do corpo de requisições POST, que o próprio navegador não registra em lugar nenhum visível (histórico, favoritos, etc.).

**Configuração das variáveis de ambiente na Vercel:**

No painel da Vercel → projeto `gomes-odontologia-landing` → **Settings → Environment Variables** (nunca commitar essas senhas/tokens no repositório nem colar em chat):

| Variável | O que é | Situação |
|---|---|---|
| `ADMIN_PASSWORD` | A senha do painel (login e salvar usam a mesma). | ✅ Já configurada (Production, Preview e Development) via CLI. Pra trocar a senha, edite essa variável direto no dashboard da Vercel e faça um novo deploy. |
| `GITHUB_TOKEN` | Um token do GitHub que permite ao painel salvar o arquivo de conteúdo. | ⚠️ **Ainda falta configurar.** GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**. Em "Repository access", escolher **Only select repositories** → `pipoleal/gomes-odontologia-landing`. Em "Permissions", dar **Contents: Read and write**. Copiar o token gerado (começa com `github_pat_...`) e colar como valor da variável `GITHUB_TOKEN` na Vercel. |

Depois de configurar o `GITHUB_TOKEN`, fazer um novo deploy (ou aguardar o próximo push) para ele entrar em vigor.

**Acesso ao painel:** `https://xn--gomesodontologiaeesttica-ufc.com.br/admin.html` (não aparece no menu do site nem é indexado pelo Google — `robots.txt` bloqueia e a página tem `<meta name="robots" content="noindex, nofollow">`). Quem abrir o link sem saber a senha só vê a tela de login — nenhum campo, nenhum conteúdo atual é exibido antes da senha ser confirmada pelo servidor.
