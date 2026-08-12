// ===================================================================
// ELÉTRICA ROCAR — admin.js
// Painel administrativo: login (e-mail único autorizado), CRUD de
// serviços, upload de fotos, leitura de mensagens/solicitações.
// Só funciona depois que assets/supabase-client.js tiver a URL e a
// chave anon reais preenchidas (ver supabase-setup.sql).
// ===================================================================
import { supabase, FOTOS_BUCKET, formatBRL, fetchConfig, salvarConfig } from './supabase-client.js';

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
