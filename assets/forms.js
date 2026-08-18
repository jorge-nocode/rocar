// ===================================================================
// ELÉTRICA ROCAR — forms.js
// Lógica compartilhada de submit dos formulários públicos:
// Fale Conosco, Solicitar Orçamento, Atendimento para Empresas.
// Cada form grava no Supabase (ou loga em modo offline) e, quando
// aplicável, abre o WhatsApp com uma mensagem pronta.
// ===================================================================
import {
  submitMensagemContato,
  submitSolicitacaoOrcamento,
  submitSolicitacaoEmpresa,
  whatsappLink
} from './supabase-client.js';

function setFeedback(form, msg, ok) {
  let fb = form.querySelector('.form-feedback');
  if (!fb) {
    fb = document.createElement('div');
    fb.className = 'form-feedback';
    form.appendChild(fb);
  }
  fb.textContent = msg;
  fb.className = 'form-feedback ' + (ok ? 'ok' : 'err');
}

// ---------------------------------------------------------------
// Anti-spam: honeypot + rate limiting simples, sem depender de nenhum
// serviço externo de captcha.
//
// 1) Honeypot: cada form ganha (via CSS, injetado abaixo) um campo
//    escondido que só um robô preencheria. Se vier preenchido, a gente
//    finge que deu certo (pra não avisar o bot) mas não envia nada.
// 2) Rate limit: guardamos no localStorage o horário do último envio
//    de cada form neste navegador e bloqueamos reenvios do mesmo form
//    por 2 minutos.
// ---------------------------------------------------------------
const HONEYPOT_FIELD = 'website';
const RATE_LIMIT_MS = 2 * 60 * 1000; // 2 minutos
const RATE_LIMIT_PREFIX = 'rocarUltimoEnvio_';

function garantirHoneypot(form) {
  if (form.querySelector(`input[name="${HONEYPOT_FIELD}"]`)) return;
  const campo = document.createElement('input');
  campo.type = 'text';
  campo.name = HONEYPOT_FIELD;
  campo.autocomplete = 'off';
  campo.tabIndex = -1;
  campo.setAttribute('aria-hidden', 'true');
  campo.className = 'form-honeypot';
  form.appendChild(campo);
}

function tempoRestanteRateLimit(formId) {
  try {
    const ultimo = Number(localStorage.getItem(RATE_LIMIT_PREFIX + formId) || 0);
    const passou = Date.now() - ultimo;
    return passou < RATE_LIMIT_MS ? RATE_LIMIT_MS - passou : 0;
  } catch (e) {
    return 0; // localStorage indisponível — não bloqueia o envio.
  }
}

function registrarEnvio(formId) {
  try { localStorage.setItem(RATE_LIMIT_PREFIX + formId, String(Date.now())); } catch (e) { /* ignora */ }
}

async function handleSubmit(form, fn, buildWhats, successMsg) {
  garantirHoneypot(form);
  const formId = form.id || 'form';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot preenchido = bot. Finge sucesso silenciosamente.
    const honeypotValor = form.querySelector(`input[name="${HONEYPOT_FIELD}"]`)?.value;
    if (honeypotValor) {
      form.reset();
      return;
    }

    const restante = tempoRestanteRateLimit(formId);
    if (restante > 0) {
      const minutos = Math.ceil(restante / 60000);
      setFeedback(form, `Você já enviou uma mensagem recentemente. Tente novamente em ${minutos} minuto(s).`, false);
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const data = Object.fromEntries(new FormData(form).entries());
    delete data[HONEYPOT_FIELD];
    const result = await fn(data);

    if (result.ok) {
      registrarEnvio(formId);
      btn.textContent = 'Enviado ✓';
      setFeedback(form, successMsg, true);
      form.reset();
      if (buildWhats) {
        const link = whatsappLink(buildWhats(data));
        setTimeout(() => window.open(link, '_blank'), 500);
      }
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2500);
    } else {
      btn.textContent = original;
      btn.disabled = false;
      setFeedback(form, 'Não foi possível enviar agora. Tente novamente ou chame no WhatsApp.', false);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const contatoForm = document.querySelector('#form-contato');
  if (contatoForm) {
    handleSubmit(
      contatoForm,
      submitMensagemContato,
      (d) => `Olá! Meu nome é ${d.nome}. ${d.mensagem}`,
      'Mensagem enviada! Vamos responder em breve.'
    );
  }

  const orcamentoForm = document.querySelector('#form-orcamento');
  if (orcamentoForm) {
    handleSubmit(
      orcamentoForm,
      submitSolicitacaoOrcamento,
      (d) => `Olá! Vim pelo site e quero um orçamento.\nEquipamento: ${d.tipo_equipamento || '-'}\nMarca: ${d.marca_equipamento || '-'}\nProblema: ${d.problema || '-'}`,
      'Solicitação enviada! Vamos te chamar no WhatsApp para fechar os detalhes.'
    );
  }

  const empresaForm = document.querySelector('#form-empresa');
  if (empresaForm) {
    handleSubmit(
      empresaForm,
      submitSolicitacaoEmpresa,
      (d) => `Olá! Somos a empresa ${d.empresa} e temos interesse em atendimento/manutenção recorrente.`,
      'Recebemos seus dados! Nossa equipe vai entrar em contato.'
    );
  }
});
