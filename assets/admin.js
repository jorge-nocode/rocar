// ===================================================================
// ELÉTRICA ROCAR — admin.js
// Painel administrativo: login (e-mail único autorizado), CRUD de
// serviços, upload de fotos, leitura de mensagens/solicitações.
// Só funciona depois que assets/supabase-client.js tiver a URL e a
// chave anon reais preenchidas (ver supabase-setup.sql).
// ===================================================================
import { supabase, FOTOS_BUCKET, MATERIAIS_BUCKET, LABELS_CATEGORIA_MATERIAL, LABELS_APLICACAO_MATERIAL, formatBRL, fetchConfig, salvarConfig } from './supabase-client.js';

const els = {
  offlineNotice: document.querySelector('#offline-notice'),
  loginBox: document.querySelector('#admin-login'),
  shell: document.querySelector('.admin-shell'),
  loginForm: document.querySelector('#login-form'),
  loginError: document.querySelector('#login-error'),
  logoutBtn: document.querySelector('#logout-btn'),
  userEmail: document.querySelector('#user-email'),
  tabs: document.querySelectorAll('.admin-sidebar nav a'),
  panels: document.querySelectorAll('.admin-panel'),
  servicosTableBody: document.querySelector('#servicos-tbody'),
  orcamentosTableBody: document.querySelector('#orcamentos-tbody'),
  contatoTableBody: document.querySelector('#contato-tbody'),
  empresaTableBody: document.querySelector('#empresa-tbody'),
  servicoForm: document.querySelector('#servico-form'),
  servicoFeedback: document.querySelector('#servico-feedback'),
  fotosInput: document.querySelector('#servico-fotos'),
  configForm: document.querySelector('#config-form'),
  configFeedback: document.querySelector('#config-feedback'),
  geminiKeyInput: document.querySelector('#gemini-key'),
  materiaisTableBody: document.querySelector('#materiais-tbody'),
  materialForm: document.querySelector('#material-form'),
  materialFeedback: document.querySelector('#material-feedback'),
  materialFotosInput: document.querySelector('#material-fotos'),
  listaCategoriasMaterial: document.querySelector('#lista-categorias-material'),
  materialRaw: document.querySelector('#material-raw'),
  materialGerarIaBtn: document.querySelector('#material-gerar-ia-btn'),
  materialIaFeedback: document.querySelector('#material-ia-feedback'),
  servicoRaw: document.querySelector('#servico-raw'),
  servicoGerarIaBtn: document.querySelector('#servico-gerar-ia-btn'),
  servicoIaFeedback: document.querySelector('#servico-ia-feedback'),
};

if (!supabase) {
  if (els.offlineNotice) els.offlineNotice.style.display = 'block';
  if (els.loginBox) els.loginBox.style.display = 'none';
  if (els.shell) els.shell.style.display = 'none';
} else {
  initAdmin();
}

async function initAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  toggleAuthUI(session);

  supabase.auth.onAuthStateChange((_event, session) => toggleAuthUI(session));

  if (els.loginForm) {
    els.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = els.loginForm.email.value;
      const password = els.loginForm.password.value;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        els.loginError.textContent = 'Login inválido: ' + error.message;
      }
    });
  }

  if (els.logoutBtn) {
    els.logoutBtn.addEventListener('click', () => supabase.auth.signOut());
  }

  initTabs();

  if (els.servicoForm) {
    els.servicoForm.addEventListener('submit', handleServicoSubmit);
  }

  if (els.configForm) {
    els.configForm.addEventListener('submit', handleConfigSubmit);
  }

  if (els.materialForm) {
    els.materialForm.addEventListener('submit', handleMaterialSubmit);
  }

  if (els.materialGerarIaBtn) {
    els.materialGerarIaBtn.addEventListener('click', handleGerarMaterialIA);
  }

  if (els.servicoGerarIaBtn) {
    els.servicoGerarIaBtn.addEventListener('click', handleGerarServicoIA);
  }

  if (els.listaCategoriasMaterial) {
    els.listaCategoriasMaterial.innerHTML = Object.keys(LABELS_CATEGORIA_MATERIAL)
      .map(cat => `<option value="${cat}">${LABELS_CATEGORIA_MATERIAL[cat]}</option>`).join('');
  }
}

function toggleAuthUI(session) {
  const logged = !!session;
  if (els.loginBox) els.loginBox.style.display = logged ? 'none' : 'block';
  if (els.shell) els.shell.style.display = logged ? 'flex' : 'none';
  if (logged) {
    if (els.userEmail) els.userEmail.textContent = session.user.email;
    loadServicos();
    loadOrcamentos();
    loadContato();
    loadEmpresa();
    loadConfig();
    loadMateriais();
  }
}

function initTabs() {
  els.tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      els.tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.panel;
      els.panels.forEach(p => p.style.display = (p.id === target ? 'block' : 'none'));
    });
  });
}

async function loadServicos() {
  if (!els.servicosTableBody) return;
  const { data, error } = await supabase.from('servicos').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return; }
  els.servicosTableBody.innerHTML = (data || []).map(s => `
    <tr>
      <td>${s.codigo}</td>
      <td>${s.titulo}</td>
      <td>${s.categoria}</td>
      <td>${s.preco ? formatBRL(s.preco) : 'Sob orçamento'}</td>
      <td>${s.status}</td>
      <td>
        <button class="btn btn-outline btn-sm" data-edit="${s.id}">Editar</button>
        <button class="btn btn-sm" data-del="${s.id}" style="color:#E30613;background:none;">Excluir</button>
      </td>
    </tr>
  `).join('');

  els.servicosTableBody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => fillFormForEdit(data.find(s => s.id === btn.dataset.edit)));
  });
  els.servicosTableBody.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Excluir este serviço?')) return;
      await supabase.from('servicos').delete().eq('id', btn.dataset.del);
      loadServicos();
    });
  });
}

function fillFormForEdit(s) {
  if (!s || !els.servicoForm) return;
  const f = els.servicoForm;
  f.id.value = s.id;
  f.codigo.value = s.codigo;
  f.titulo.value = s.titulo;
  f.categoria.value = s.categoria;
  f.marca.value = s.marca || '';
  f.descricao.value = s.descricao || '';
  f.preco.value = s.preco || '';
  f.estoque_status.value = s.estoque_status;
  f.destaque.checked = !!s.destaque;
  f.status.value = s.status;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleServicoSubmit(e) {
  e.preventDefault();
  const f = els.servicoForm;
  const id = f.id.value;

  let fotos = [];
  if (els.fotosInput && els.fotosInput.files.length) {
    fotos = await uploadFotos(els.fotosInput.files);
  }

  const payload = {
    codigo: f.codigo.value,
    titulo: f.titulo.value,
    categoria: f.categoria.value,
    marca: f.marca.value,
    descricao: f.descricao.value,
    preco: f.preco.value ? Number(f.preco.value) : null,
    estoque_status: f.estoque_status.value,
    destaque: f.destaque.checked,
    status: f.status.value,
  };
  if (fotos.length) payload.fotos = fotos;

  let error;
  if (id) {
    ({ error } = await supabase.from('servicos').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('servicos').insert(payload));
  }

  if (error) {
    els.servicoFeedback.textContent = 'Erro ao salvar: ' + error.message;
    els.servicoFeedback.className = 'form-feedback err';
  } else {
    els.servicoFeedback.textContent = 'Serviço salvo com sucesso!';
    els.servicoFeedback.className = 'form-feedback ok';
    f.reset();
    f.id.value = '';
    loadServicos();
  }
}

async function uploadFotos(fileList) {
  const urls = [];
  for (const file of fileList) {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(FOTOS_BUCKET).upload(path, file);
    if (error) { console.error(error); continue; }
    const { data } = supabase.storage.from(FOTOS_BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

async function loadOrcamentos() {
  if (!els.orcamentosTableBody) return;
  const { data } = await supabase.from('solicitacoes_orcamento').select('*').order('created_at', { ascending: false });
  els.orcamentosTableBody.innerHTML = (data || []).map(o => `
    <tr>
      <td>${new Date(o.created_at).toLocaleDateString('pt-BR')}</td>
      <td>${o.nome}</td>
      <td>${o.telefone}</td>
      <td>${o.tipo_equipamento || '-'}</td>
      <td>${o.problema || '-'}</td>
      <td>${o.status}</td>
    </tr>
  `).join('');
}

async function loadContato() {
  if (!els.contatoTableBody) return;
  const { data } = await supabase.from('mensagens_contato').select('*').order('created_at', { ascending: false });
  els.contatoTableBody.innerHTML = (data || []).map(m => `
    <tr>
      <td>${new Date(m.created_at).toLocaleDateString('pt-BR')}</td>
      <td>${m.nome}</td>
      <td>${m.telefone || m.email || '-'}</td>
      <td>${m.mensagem}</td>
    </tr>
  `).join('');
}

async function loadEmpresa() {
  if (!els.empresaTableBody) return;
  const { data } = await supabase.from('solicitacoes_empresa').select('*').order('created_at', { ascending: false });
  els.empresaTableBody.innerHTML = (data || []).map(e => `
    <tr>
      <td>${new Date(e.created_at).toLocaleDateString('pt-BR')}</td>
      <td>${e.empresa}</td>
      <td>${e.telefone}</td>
      <td>${e.segmento || '-'}</td>
    </tr>
  `).join('');
}

async function loadMateriais() {
  if (!els.materiaisTableBody) return;
  const { data, error } = await supabase.from('materiais').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return; }
  els.materiaisTableBody.innerHTML = (data || []).map(m => `
    <tr>
      <td>${m.codigo}</td>
      <td>${m.titulo}</td>
      <td>${LABELS_CATEGORIA_MATERIAL[m.categoria] || m.categoria}</td>
      <td>${formatBRL(m.preco)}</td>
      <td>${m.status}</td>
      <td>
        <button class="btn btn-outline btn-sm" data-edit="${m.id}">Editar</button>
        <button class="btn btn-sm" data-del="${m.id}" style="color:#E30613;background:none;">Excluir</button>
      </td>
    </tr>
  `).join('');

  els.materiaisTableBody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => fillMaterialFormForEdit(data.find(m => m.id === btn.dataset.edit)));
  });
  els.materiaisTableBody.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Excluir este material?')) return;
      await supabase.from('materiais').delete().eq('id', btn.dataset.del);
      loadMateriais();
    });
  });
}

function fillMaterialFormForEdit(m) {
  if (!m || !els.materialForm) return;
  const f = els.materialForm;
  f.id.value = m.id;
  f.codigo.value = m.codigo;
  f.titulo.value = m.titulo;
  f.categoria.value = m.categoria;
  f.aplicacao.value = m.aplicacao || '';
  f.descricao.value = m.descricao || '';
  f.preco.value = m.preco;
  f.status.value = m.status;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleMaterialSubmit(e) {
  e.preventDefault();
  const f = els.materialForm;
  const id = f.id.value;

  let fotos = [];
  if (els.materialFotosInput && els.materialFotosInput.files.length) {
    fotos = await uploadFotosMaterial(els.materialFotosInput.files);
  }

  const payload = {
    codigo: f.codigo.value,
    titulo: f.titulo.value,
    categoria: f.categoria.value,
    aplicacao: f.aplicacao.value || null,
    descricao: f.descricao.value,
    preco: Number(f.preco.value),
    status: f.status.value,
  };
  if (fotos.length) {
    payload.fotos = fotos;
    payload.imagem = fotos[0];
    payload.imagem_url = fotos[0];
  }

  let error;
  if (id) {
    ({ error } = await supabase.from('materiais').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('materiais').insert(payload));
  }

  if (error) {
    els.materialFeedback.textContent = 'Erro ao salvar: ' + error.message;
    els.materialFeedback.className = 'form-feedback err';
  } else {
    els.materialFeedback.textContent = 'Material salvo com sucesso!';
    els.materialFeedback.className = 'form-feedback ok';
    f.reset();
    f.id.value = '';
    loadMateriais();
  }
}

async function uploadFotosMaterial(fileList) {
  const urls = [];
  for (const file of fileList) {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(MATERIAIS_BUCKET).upload(path, file);
    if (error) { console.error(error); continue; }
    const { data } = supabase.storage.from(MATERIAIS_BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

async function loadConfig() {
  if (!els.geminiKeyInput) return;
  const valor = await fetchConfig('chatbot_gemini_key');
  els.geminiKeyInput.value = valor || '';
}

async function handleConfigSubmit(e) {
  e.preventDefault();
  const valor = els.geminiKeyInput.value.trim();
  const { ok, error } = await salvarConfig('chatbot_gemini_key', valor);
  if (ok) {
    els.configFeedback.textContent = 'Chave salva com sucesso!';
    els.configFeedback.className = 'form-feedback ok';
  } else {
    els.configFeedback.textContent = 'Erro ao salvar: ' + (error?.message || 'tente novamente.');
    els.configFeedback.className = 'form-feedback err';
  }
}

// ---------------------------------------------------------------
// Preenchimento automático COMPLETO do cadastro (Materiais e Serviços)
// com IA (Google Gemini), a partir de um texto bruto colado pelo
// usuário na caixa "Preenchimento Automático por IA" no topo de cada
// formulário. A chave da API NUNCA é digitada/guardada no navegador de
// cada admin: fica salva uma única vez na tabela 'site_config' do
// Supabase (chave 'chatbot_gemini_key', editável na aba
// "Configurações") e é buscada via fetchConfig() a cada uso — assim
// qualquer pessoa logada no painel, em qualquer computador, consegue
// usar o botão "Gerar com IA" sem precisar configurar nada localmente.
// ---------------------------------------------------------------
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Chama o Gemini pedindo resposta em JSON puro e devolve o objeto já
// parseado. Lança erro se não houver chave configurada, se a API
// falhar ou se a resposta não for um JSON válido.
async function gerarJSONComGemini(prompt) {
  const key = await fetchConfig('chatbot_gemini_key');
  if (!key) {
    throw new Error('Nenhuma chave do Gemini configurada. Salve a chave na aba "Configurações" (ela vale para todos os admins).');
  }

  const resp = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 500,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!resp.ok) throw new Error(`Gemini respondeu ${resp.status}`);

  const data = await resp.json();
  const textoBruto = (data?.candidates?.[0]?.content?.parts || [])
    .map(p => p.text || '').join('').trim();

  if (!textoBruto) throw new Error('Resposta vazia da IA.');

  // Mesmo pedindo JSON puro, remove eventuais cercas de código como
  // segurança extra antes do parse.
  const limpo = textoBruto.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  return JSON.parse(limpo);
}

async function handleGerarMaterialIA() {
  const f = els.materialForm;
  const raw = els.materialRaw?.value?.trim();
  const feedback = els.materialIaFeedback;
  if (!raw) {
    feedback.textContent = 'Cole as informações brutas do produto na caixa acima primeiro.';
    feedback.className = 'form-feedback err';
    return;
  }

  const btn = els.materialGerarIaBtn;
  const textoOriginal = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Gerando...';
  feedback.textContent = '';
  feedback.className = 'form-feedback';

  const categoriasValidas = Object.keys(LABELS_CATEGORIA_MATERIAL);
  const aplicacoesValidas = Object.keys(LABELS_APLICACAO_MATERIAL);

  const prompt = `Você é um especialista em vendas técnicas de peças e materiais para assistência técnica de motores elétricos, ferramentas e eletrodomésticos (Elétrica Rocar).
Analise o texto bruto abaixo, colado por um funcionário da oficina, e responda APENAS com um JSON válido (sem markdown, sem texto extra, sem crases), no formato exato:
{"codigo":"...","titulo":"...","categoria":"...","aplicacao":"...","preco":0,"descricao":"..."}

Regras:
- "codigo": se houver um código/referência no texto, use-o; senão gere um código curto plausível no padrão "MAT-XXX" (letras maiúsculas e números).
- "titulo": nome técnico e comercial bem formatado do produto.
- "categoria": escolha OBRIGATORIAMENTE um destes valores (em minúsculas, sem acento): ${categoriasValidas.join(', ')}. Use o mais próximo se nenhum encaixar perfeitamente.
- "aplicacao": escolha OBRIGATORIAMENTE um destes valores: ${aplicacoesValidas.join(', ')}.
- "preco": número (apenas dígitos e ponto decimal, sem "R$" e sem separador de milhar). Se não houver preço no texto, estime um valor de mercado plausível para o produto.
- "descricao": descrição comercial detalhada, técnica e atrativa, entre 50 e 80 palavras, em português do Brasil.

Texto bruto:
"""
${raw}
"""`;

  try {
    const json = await gerarJSONComGemini(prompt);

    if (json.codigo) f.codigo.value = json.codigo;
    if (json.titulo) f.titulo.value = json.titulo;
    if (json.categoria) f.categoria.value = json.categoria;
    if (json.aplicacao && aplicacoesValidas.includes(json.aplicacao)) f.aplicacao.value = json.aplicacao;
    if (json.preco !== undefined && json.preco !== null && json.preco !== '') f.preco.value = Number(json.preco);
    if (json.descricao) f.descricao.value = json.descricao;

    feedback.textContent = 'Código, nome, categoria, aplicação, preço e descrição gerados com sucesso! Revise antes de salvar.';
    feedback.className = 'form-feedback ok';
  } catch (err) {
    console.error(err);
    feedback.textContent = 'Erro ao gerar com IA: ' + err.message;
    feedback.className = 'form-feedback err';
  } finally {
    btn.disabled = false;
    btn.textContent = textoOriginal;
  }
}

async function handleGerarServicoIA() {
  const f = els.servicoForm;
  const raw = els.servicoRaw?.value?.trim();
  const feedback = els.servicoIaFeedback;
  if (!raw) {
    feedback.textContent = 'Cole as informações brutas do serviço na caixa acima primeiro.';
    feedback.className = 'form-feedback err';
    return;
  }

  const btn = els.servicoGerarIaBtn;
  const textoOriginal = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Gerando...';
  feedback.textContent = '';
  feedback.className = 'form-feedback';

  const categoriasValidas = Array.from(f.categoria.options).map(o => o.value).filter(Boolean);

  const prompt = `Você é um especialista em vendas técnicas de serviços de assistência técnica de motores elétricos, ferramentas e eletrodomésticos (Elétrica Rocar).
Analise o texto bruto abaixo, colado por um funcionário da oficina, e responda APENAS com um JSON válido (sem markdown, sem texto extra, sem crases), no formato exato:
{"codigo":"...","titulo":"...","categoria":"...","marca":"...","preco":0,"descricao":"..."}

Regras:
- "codigo": se houver um código/referência no texto, use-o; senão gere um código curto plausível no padrão "SRV-XXX" (letras maiúsculas e números).
- "titulo": nome técnico e comercial bem formatado do serviço/equipamento.
- "categoria": escolha OBRIGATORIAMENTE um destes valores (exatamente como estão, minúsculas): ${categoriasValidas.join(', ')}.
- "marca": marca do equipamento mencionada no texto; use "" se não houver.
- "preco": número (apenas dígitos e ponto decimal, sem "R$" e sem separador de milhar). Se não houver preço no texto, estime um valor de mercado plausível.
- "descricao": descrição comercial detalhada, técnica e atrativa, entre 50 e 80 palavras, em português do Brasil.

Texto bruto:
"""
${raw}
"""`;

  try {
    const json = await gerarJSONComGemini(prompt);

    if (json.codigo) f.codigo.value = json.codigo;
    if (json.titulo) f.titulo.value = json.titulo;
    if (json.categoria && categoriasValidas.includes(json.categoria)) f.categoria.value = json.categoria;
    if (json.marca) f.marca.value = json.marca;
    if (json.preco !== undefined && json.preco !== null && json.preco !== '') f.preco.value = Number(json.preco);
    if (json.descricao) f.descricao.value = json.descricao;

    feedback.textContent = 'Código, título, categoria, marca, preço e descrição gerados com sucesso! Revise antes de salvar.';
    feedback.className = 'form-feedback ok';
  } catch (err) {
    console.error(err);
    feedback.textContent = 'Erro ao gerar com IA: ' + err.message;
    feedback.className = 'form-feedback err';
  } finally {
    btn.disabled = false;
    btn.textContent = textoOriginal;
  }
}
