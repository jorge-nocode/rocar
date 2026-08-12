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

async function handleSubmit(form, fn, buildWhats, successMsg) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const data = Object.fromEntries(new FormData(form).entries());
    const result = await fn(data);

    if (result.ok) {
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
