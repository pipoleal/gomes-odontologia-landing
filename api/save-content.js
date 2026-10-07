/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — api/save-content.js
   Vercel Serverless Function (Node.js, CommonJS — sem dependências).

   Recebe { password, content, images?, imagePathsToDelete? } via POST,
   confere a senha contra ADMIN_PASSWORD (variável de ambiente, nunca
   commitada) e, se correta, grava o novo conteúdo em
   data/site-content.json direto no GitHub via API (GITHUB_TOKEN,
   também só como variável de ambiente).

   `images` é um mapa { idDoAnuncio: base64 } — cada entrada já vem
   redimensionada/comprimida no navegador. Cada imagem é salva em
   assets/images/announcements/<id>.jpg, e o item correspondente em
   content.announcements é atualizado com o caminho + um imageVersion
   novo (timestamp, pra cache-busting) antes de gravar o JSON.

   `imagePathsToDelete` é uma lista de caminhos (só dentro de
   assets/images/announcements/) a apagar do repositório — usado
   quando um anúncio é removido ou tem a foto trocada/removida.

   O commit no GitHub dispara o deploy automático já configurado
   (repositório conectado à Vercel) — o site atualiza sozinho.
   ============================================================ */

const GITHUB_OWNER = 'pipoleal';
const GITHUB_REPO = 'gomes-odontologia-landing';
const GITHUB_BRANCH = 'main';
const FILE_PATH = 'data/site-content.json';
const IMAGE_DIR = 'assets/images/announcements';
const MAX_IMAGE_BASE64_LENGTH = 6_000_000; // ~4.5MB de imagem, já tratada/comprimida no navegador
const SAFE_ID = /^[a-zA-Z0-9_-]+$/;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não permitido.' });
    return;
  }

  const { password, content, images, imagePathsToDelete } = req.body || {};

  const adminPassword = process.env.ADMIN_PASSWORD;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!adminPassword || !githubToken) {
    const missing = [!adminPassword && 'ADMIN_PASSWORD', !githubToken && 'GITHUB_TOKEN'].filter(Boolean).join(', ');
    res.status(500).json({
      success: false,
      error: `Servidor não configurado: falta a variável de ambiente ${missing} no projeto da Vercel.`,
    });
    return;
  }

  if (!password || password !== adminPassword) {
    res.status(401).json({ success: false, error: 'Senha incorreta.' });
    return;
  }

  if (!content || typeof content !== 'object') {
    res.status(400).json({ success: false, error: 'Conteúdo inválido.' });
    return;
  }

  if (images && typeof images === 'object') {
    for (const id of Object.keys(images)) {
      if (!SAFE_ID.test(id)) {
        res.status(400).json({ success: false, error: 'Id de anúncio inválido.' });
        return;
      }
      const b64 = images[id];
      if (typeof b64 !== 'string' || !b64.length || b64.length > MAX_IMAGE_BASE64_LENGTH) {
        res.status(400).json({ success: false, error: 'Imagem inválida ou grande demais.' });
        return;
      }
    }
  }

  const githubHeaders = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'gomes-odontologia-admin-panel',
  };

  function contentsUrl(path) {
    return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  }

  async function getSha(path) {
    const r = await fetch(`${contentsUrl(path)}?ref=${GITHUB_BRANCH}`, { headers: githubHeaders });
    if (r.ok) return (await r.json()).sha;
    if (r.status === 404) return null;
    const errText = await r.text();
    throw new Error(`Falha ao ler ${path} no GitHub (${r.status}): ${errText}`);
  }

  async function putFile(path, base64Content, commitMessage) {
    const sha = await getSha(path);
    const putRes = await fetch(contentsUrl(path), {
      method: 'PUT',
      headers: { ...githubHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        sha: sha || undefined,
        branch: GITHUB_BRANCH,
      }),
    });
    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`Falha ao salvar ${path} no GitHub (${putRes.status}): ${errText}`);
    }
  }

  async function deleteFile(path, commitMessage) {
    const sha = await getSha(path);
    if (!sha) return; // já não existe — nada a fazer
    const delRes = await fetch(contentsUrl(path), {
      method: 'DELETE',
      headers: { ...githubHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: commitMessage, sha, branch: GITHUB_BRANCH }),
    });
    if (!delRes.ok) {
      const errText = await delRes.text();
      throw new Error(`Falha ao apagar ${path} no GitHub (${delRes.status}): ${errText}`);
    }
  }

  try {
    if (Array.isArray(imagePathsToDelete)) {
      for (const path of imagePathsToDelete) {
        if (typeof path === 'string' && path.startsWith(IMAGE_DIR + '/')) {
          await deleteFile(path, 'chore: remove foto de anúncio via painel admin');
        }
      }
    }

    const uploadedImages = {};
    if (images && typeof images === 'object') {
      for (const id of Object.keys(images)) {
        const path = `${IMAGE_DIR}/${id}.jpg`;
        await putFile(path, images[id], 'chore: atualiza foto do anúncio via painel admin');
        const imageVersion = Date.now();
        uploadedImages[id] = { image: path, imageVersion };
        if (Array.isArray(content.announcements)) {
          const item = content.announcements.find((a) => a && a.id === id);
          if (item) {
            item.image = path;
            item.imageVersion = imageVersion;
          }
        }
      }
    }

    const newContentStr = JSON.stringify(content, null, 2) + '\n';
    const newContentBase64 = Buffer.from(newContentStr, 'utf-8').toString('base64');
    await putFile(FILE_PATH, newContentBase64, 'chore: atualiza conteúdo via painel admin');

    res.status(200).json({ success: true, images: uploadedImages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Erro desconhecido ao salvar.' });
  }
};
