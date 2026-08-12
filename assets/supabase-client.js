// ===================================================================
// ELÉTRICA ROCAR — supabase-client.js
// Client central do Supabase + funções de acesso a dados.
// Troque SUPABASE_URL e SUPABASE_ANON_KEY pelas credenciais reais
// (Supabase > Project Settings > API) quando o projeto for criado.
// Até lá, o site funciona com DADOS_EXEMPLO abaixo (modo offline).
// ===================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE';
export const SUPABASE_ANON_KEY = 'COLE_AQUI_A_CHAVE_ANON_PUBLICA';

const SUPABASE_CONFIGURADO =
  !SUPABASE_URL.includes('COLE_AQUI') && !SUPABASE_ANON_KEY.includes('COLE_AQUI');

export const supabase = SUPABASE_CONFIGURADO
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const FOTOS_BUCKET = 'servicos-fotos';

// Número oficial de WhatsApp do site (somente dígitos, com DDI+DDD)
export const WHATSAPP_NUMERO = '551134353809';

// ---------------------------------------------------------------
// Dados de exemplo (usados enquanto o Supabase não está configurado
// ou enquanto o painel admin ainda não tem itens cadastrados)
// ---------------------------------------------------------------
export const DADOS_EXEMPLO = [
  {
    codigo: 'MOT-001',
    titulo: 'Rebobinamento de Motor Elétrico Monofásico',
    categoria: 'motores-monofasicos',
    marca: 'Diversas marcas',
    descricao: 'Rebobinamento completo de motores monofásicos de até 3 CV, com teste de carga e garantia de serviço.\n\nAtendemos motores de portão, bomba d\'água, compressor e uso industrial leve.',
    preco: 180,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/produto-bomba-jacuzzi.jpeg'],
    destaque: true,
    status: 'ativo'
  },
  {
    codigo: 'MOT-002',
    titulo: 'Rebobinamento de Motor Trifásico',
    categoria: 'motores-trifasicos',
    marca: 'WEG e similares',
    descricao: 'Rebobinamento de motores trifásicos industriais, com balanceamento e teste de isolamento antes da entrega.',
    preco: 350,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/produto-bomba-jacuzzi.jpeg'],
    destaque: true,
    status: 'ativo'
  },
  {
    codigo: 'ELE-003',
    titulo: 'Conserto de Micro-ondas',
    categoria: 'eletrodomesticos',
    marca: 'Todas as marcas',
    descricao: 'Diagnóstico e reparo de micro-ondas: magnetron, placa, fusível térmico e demais componentes.',
    preco: 90,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: [],
    destaque: true,
    status: 'ativo'
  },
  {
    codigo: 'ELE-004',
    titulo: 'Manutenção de Air Fryer / Fritadeira Elétrica',
    categoria: 'eletrodomesticos',
    marca: 'Todas as marcas',
    descricao: 'Reparo de resistência, placa e sistema de aquecimento de air fryers e fritadeiras elétricas.',
    preco: 70,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: [],
    destaque: false,
    status: 'ativo'
  },
  {
    codigo: 'BOM-005',
    titulo: 'Manutenção de Bomba de Piscina',
    categoria: 'bombas',
    marca: 'Jacuzzi, Sodramar e similares',
    descricao: 'Revisão, troca de vedação/rolamento e diagnóstico de bombas de piscina residenciais.',
    preco: 150,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/produto-bomba-jacuzzi.jpeg'],
    destaque: true,
    status: 'ativo'
  },
  {
    codigo: 'FER-006',
    titulo: 'Manutenção de Ferramentas Elétricas',
    categoria: 'ferramentas',
    marca: 'Makita, Bosch, DeWalt e similares',
    descricao: 'Troca de escova, rolamento, fiação e reparo geral de furadeiras, serras mármore, esmerilhadeiras e parafusadeiras.',
    preco: 80,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/produto-serra-marmore.jpeg'],
    destaque: true,
    status: 'ativo'
  }
];

export function formatBRL(value) {
  const n = Number(value || 0);
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const LABELS_CATEGORIA = {
  'motores-monofasicos': 'Motores Monofásicos',
  'motores-trifasicos': 'Motores Trifásicos',
  'eletrodomesticos': 'Eletrodomésticos',
  'bombas': 'Bombas d\'Água',
  'ferramentas': 'Ferramentas Elétricas',
  'ventilacao': 'Ventiladores',
  'climatizacao': 'Ar-condicionado'
};
export function labelCategoria(cat) {
  return LABELS_CATEGORIA[cat] || cat;
}

const LABELS_ESTOQUE = {
  disponivel: 'Pronta Entrega',
  sob_encomenda: 'Sob Avaliação',
  esgotado: 'Indisponível no momento'
};
export function labelEstoque(s) {
  return LABELS_ESTOQUE[s] || s;
}

export function whatsappLink(mensagem) {
  const texto = encodeURIComponent(mensagem);
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
}

export function whatsappLinkServico(servico) {
  const msg = `Olá! Vim pelo site e gostaria de um orçamento para: ${servico.titulo} (código ${servico.codigo}).`;
  return whatsappLink(msg);
}

// ---------------------------------------------------------------
// Serviços técnicos complexos (rebobinamento de motores etc.) NUNCA
// devem ser exibidos como produto com preço fechado — são sempre
// "sob orçamento" e levam direto ao formulário/WhatsApp de orçamento.
// ---------------------------------------------------------------
export const CATEGORIAS_SOB_ORCAMENTO = ['motores-monofasicos', 'motores-trifasicos'];

export function isServicoSobOrcamento(servico) {
  return CATEGORIAS_SOB_ORCAMENTO.includes(servico.categoria);
}

export function linkOrcamentoServico(servico) {
  const params = new URLSearchParams({
    equipamento: servico.titulo,
    categoria: servico.categoria,
    codigo: servico.codigo
  });
  return `orcamento.html?${params.toString()}`;
}

// ---------------------------------------------------------------
// Fetch de serviços/produtos
// ---------------------------------------------------------------
export async function fetchServicos({ categoria, busca, destaque, limit, codigo } = {}) {
  if (!supabase) {
    let lista = DADOS_EXEMPLO.filter(p => p.status === 'ativo');
    if (categoria) lista = lista.filter(p => p.categoria === categoria);
    if (codigo) lista = lista.filter(p => p.codigo === codigo);
    if (destaque) lista = lista.filter(p => p.destaque);
    if (busca) {
      const b = busca.toLowerCase();
      lista = lista.filter(p => p.titulo.toLowerCase().includes(b));
    }
    if (limit) lista = lista.slice(0, limit);
    return lista;
  }
  let query = supabase.from('servicos').select('*').eq('status', 'ativo');
  if (categoria) query = query.eq('categoria', categoria);
  if (codigo) query = query.eq('codigo', codigo);
  if (destaque) query = query.eq('destaque', true);
  if (busca) query = query.ilike('titulo', `%${busca}%`);
  if (limit) query = query.limit(limit);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function fetchServicoByCodigo(codigo) {
  const lista = await fetchServicos({ codigo });
  return lista[0] || null;
}

// ---------------------------------------------------------------
// Formulários públicos
// ---------------------------------------------------------------
async function inserirOuLog(tabela, payload) {
  if (!supabase) {
    console.info(`[modo offline] formulário "${tabela}" seria enviado:`, payload);
    return { ok: true, offline: true };
  }
  const { error } = await supabase.from(tabela).insert(payload);
  if (error) { console.error(error); return { ok: false, error }; }
  return { ok: true };
}

export async function submitMensagemContato({ nome, email, telefone, mensagem }) {
  return inserirOuLog('mensagens_contato', { nome, email, telefone, mensagem });
}

export async function submitSolicitacaoOrcamento(payload) {
  return inserirOuLog('solicitacoes_orcamento', payload);
}

export async function submitSolicitacaoEmpresa(payload) {
  return inserirOuLog('solicitacoes_empresa', payload);
}

export async function submitNewsletter(email) {
  return inserirOuLog('newsletter', { email });
}

// ---------------------------------------------------------------
// Template de card de serviço (reaproveitado nas listagens)
// ---------------------------------------------------------------
export function serviceCardHTML(s) {
  const foto = (s.fotos && s.fotos[0]) || 'assets/fotos-oficina/logo-mural.jpeg';
  const sobOrcamento = isServicoSobOrcamento(s);

  const link = sobOrcamento
    ? linkOrcamentoServico(s)
    : `servico.html?codigo=${encodeURIComponent(s.codigo)}`;

  const precoTexto = sobOrcamento
    ? '<span class="from">Serviço técnico</span>Sob Orçamento'
    : (s.preco ? `<span class="from">A partir de</span>${formatBRL(s.preco)}` : 'Sob orçamento');

  const botaoTexto = sobOrcamento ? 'Solicitar Orçamento' : 'Ver Detalhes';

  return `
  <article class="service-card">
    <a href="${link}">
      <div class="service-photo">
        <span class="badge badge-red">${labelCategoria(s.categoria)}</span>
        <img src="${foto}" alt="${s.titulo}" loading="lazy">
      </div>
      <div class="service-body">
        <div>
          <h3>${s.titulo}</h3>
          <p class="loc">${s.marca || ''}</p>
          <div class="service-price">${precoTexto}</div>
        </div>
        <a href="${link}" class="btn btn-primary btn-sm btn-block">${botaoTexto}</a>
      </div>
    </a>
  </article>`;
}
