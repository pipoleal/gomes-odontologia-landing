/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — api/save-content.js
   Vercel Serverless Function (Node.js, CommonJS — sem dependências).

   Recebe { password, content, image? } via POST, confere a senha
   contra a variável de ambiente ADMIN_PASSWORD (configurada no painel
   da Vercel, nunca commitada no repositório) e, se correta, grava o
   novo conteúdo em data/site-content.json direto no GitHub via API
   (usando GITHUB_TOKEN, também só como variável de ambiente).

   Se `image` vier preenchida (base64 de uma foto já redimensionada
   no navegador), também grava/atualiza assets/images/announcements/anuncio.jpg
   e aponta o anúncio pra essa foto. Se vier a string especial
   '__remove__', só desvincula a foto do anúncio (o arquivo em si
   continua no repositório, sem problema).

   O commit no GitHub dispara o deploy automático já configurado
   (repositório conectado à Vercel) — o site atualiza sozinho.
   ============================================================ */

const GITHUB_OWNER = 'pipoleal';
const GITHUB_REPO = 'gomes-odontologia-landing';
const GITHUB_BRANCH = 'main';
const FILE_PATH = 'data/site-content.json';
const IMAGE_PATH = 'assets/images/announcements/anuncio.jpg';
const MAX_IMAGE_BASE64_LENGTH = 6_000_000; // ~4.5MB de imagem, já tratada/comprimida no navegador

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não permitido.' });
    return;
  }

  const { password, content, image } = req.body || {};

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

  if (typeof image === 'string' && image !== '__remove__' && image.length > MAX_IMAGE_BASE64_LENGTH) {
    res.status(400).json({ success: false, error: 'Imagem muito grande.' });
    return;
  }

  const githubHeaders = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'gomes-odontologia-admin-panel',
  };

  function contentsUrl(path) {
    return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  }

  async function putFile(path, base64Content, commitMessage) {
    const currentRes = await fetch(`${contentsUrl(path)}?ref=${GITHUB_BRANCH}`, { headers: githubHeaders });
    let sha;
    if (currentRes.ok) {
      sha = (await currentRes.json()).sha;
    } else if (currentRes.status !== 404) {
      const errText = await currentRes.text();
      throw new Error(`Falha ao ler ${path} no GitHub (${currentRes.status}): ${errText}`);
    }

    const putRes = await fetch(contentsUrl(path), {
      method: 'PUT',
      headers: { ...githubHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`Falha ao salvar ${path} no GitHub (${putRes.status}): ${errText}`);
    }
  }

  try {
    if (typeof image === 'string' && image !== '__remove__' && image.length > 0) {
      await putFile(IMAGE_PATH, image, 'chore: atualiza foto do anúncio via painel admin');
      content.announcement = content.announcement || {};
      content.announcement.image = IMAGE_PATH;
      content.announcement.imageVersion = Date.now();
    } else if (image === '__remove__') {
      content.announcement = content.announcement || {};
      content.announcement.image = '';
      content.announcement.imageVersion = 0;
    }

    const newContentStr = JSON.stringify(content, null, 2) + '\n';
    const newContentBase64 = Buffer.from(newContentStr, 'utf-8').toString('base64');
    await putFile(FILE_PATH, newContentBase64, 'chore: atualiza conteúdo via painel admin');

    res.status(200).json({
      success: true,
      image: content.announcement ? content.announcement.image : undefined,
      imageVersion: content.announcement ? content.announcement.imageVersion : undefined,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Erro desconhecido ao salvar.' });
  }
};
