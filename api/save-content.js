/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — api/save-content.js
   Vercel Serverless Function (Node.js, CommonJS — sem dependências).

   Recebe { password, content } via POST, confere a senha contra a
   variável de ambiente ADMIN_PASSWORD (configurada no painel da
   Vercel, nunca commitada no repositório) e, se correta, grava o
   novo conteúdo em data/site-content.json direto no GitHub via API
   (usando GITHUB_TOKEN, também só como variável de ambiente).

   O commit no GitHub dispara o deploy automático já configurado
   (repositório conectado à Vercel) — o site atualiza sozinho.
   ============================================================ */

const GITHUB_OWNER = 'pipoleal';
const GITHUB_REPO = 'gomes-odontologia-landing';
const GITHUB_BRANCH = 'main';
const FILE_PATH = 'data/site-content.json';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não permitido.' });
    return;
  }

  const { password, content } = req.body || {};

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

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const githubHeaders = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'gomes-odontologia-admin-panel',
  };

  try {
    // 1. Pega o SHA atual do arquivo (obrigatório pra API do GitHub aceitar a atualização)
    const currentRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers: githubHeaders });
    if (!currentRes.ok) {
      const errText = await currentRes.text();
      throw new Error(`Falha ao ler arquivo atual no GitHub (${currentRes.status}): ${errText}`);
    }
    const currentFile = await currentRes.json();

    // 2. Grava o novo conteúdo
    const newContentStr = JSON.stringify(content, null, 2) + '\n';
    const newContentBase64 = Buffer.from(newContentStr, 'utf-8').toString('base64');

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...githubHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'chore: atualiza conteúdo via painel admin',
        content: newContentBase64,
        sha: currentFile.sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`Falha ao salvar no GitHub (${putRes.status}): ${errText}`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Erro desconhecido ao salvar.' });
  }
};
