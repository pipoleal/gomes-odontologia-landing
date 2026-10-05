/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — api/verify-password.js
   Vercel Serverless Function (Node.js, CommonJS — sem dependências).

   Só confere a senha enviada contra ADMIN_PASSWORD (variável de
   ambiente, nunca commitada) pra liberar a tela do painel admin.
   Não grava nada — quem edita o conteúdo ainda passa pela mesma
   checagem de senha em api/save-content.js antes de salvar.
   ============================================================ */

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não permitido.' });
    return;
  }

  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    res.status(500).json({
      success: false,
      error: 'Servidor não configurado: falta a variável de ambiente ADMIN_PASSWORD no projeto da Vercel.',
    });
    return;
  }

  if (!password || password !== adminPassword) {
    res.status(401).json({ success: false, error: 'Senha incorreta.' });
    return;
  }

  res.status(200).json({ success: true });
};
