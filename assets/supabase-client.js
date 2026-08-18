// ===================================================================
// ELÉTRICA ROCAR — supabase-client.js
// Client central do Supabase + funções de acesso a dados.
// Projeto Supabase real conectado (conta santana.basp@gmail.com).
// A biblioteca @supabase/supabase-js é carregada via CDN (esm.sh) direto
// no import abaixo — não precisa de <script> extra no HTML.
// ===================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://kwifszpmjchzamcnmjgs.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_co2e0iGKlFayRhRAOipNxg_35kq7Oph';

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
    codigo: 'FUR-003',
    titulo: 'Manutenção de Furadeiras Elétricas',
    categoria: 'furadeiras',
    marca: 'Makita, Bosch, DeWalt e similares',
    descricao: 'Troca de escova, rolamento, mandril e fiação de furadeiras elétricas e de impacto.',
    preco: 60,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/produto-serra-marmore.jpeg'],
    destaque: true,
    status: 'ativo'
  },
  {
    codigo: 'SER-004',
    titulo: 'Manutenção de Serra Mármore',
    categoria: 'serra-marmore',
    marca: 'Makita, Bosch e similares',
    descricao: 'Reparo de motor, disco, escova e fiação de serras mármore e serras circulares.',
    preco: 90,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/produto-serra-marmore.jpeg'],
    destaque: true,
    status: 'ativo'
  },
  {
    codigo: 'FER-005',
    titulo: 'Manutenção de Ferramentas Elétricas em Geral',
    categoria: 'ferramentas',
    marca: 'Diversas marcas',
    descricao: 'Reparo de esmerilhadeiras, parafusadeiras, lixadeiras e outras ferramentas elétricas de uso profissional e doméstico.',
    preco: 80,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/produto-serra-marmore.jpeg'],
    destaque: false,
    status: 'ativo'
  },
  {
    codigo: 'MIC-006',
    titulo: 'Conserto de Micro-ondas',
    categoria: 'microondas',
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
    codigo: 'LIQ-007',
    titulo: 'Conserto de Liquidificadores',
    categoria: 'liquidificadores',
    marca: 'Todas as marcas',
    descricao: 'Reparo de motor, base e sistema de acoplamento de liquidificadores residenciais e industriais.',
    preco: 60,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: [],
    destaque: false,
    status: 'ativo'
  },
  {
    codigo: 'ELE-008',
    titulo: 'Manutenção de Air Fryer / Fritadeira Elétrica',
    categoria: 'eletrodomesticos',
    marca: 'Todas as marcas',
    descricao: 'Reparo de resistência, placa e sistema de aquecimento de air fryers e fritadeiras elétricas. Também atendemos panela de arroz/pressão elétrica, sanduicheira e purificador de água.',
    preco: 70,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: [],
    destaque: false,
    status: 'ativo'
  },
  {
    codigo: 'MAS-009',
    titulo: 'Manutenção de Masseiras',
    categoria: 'masseiras',
    marca: 'Uso industrial e padaria',
    descricao: 'Reparo de motor, engrenagens e sistema elétrico de masseiras de padaria e uso industrial.',
    preco: 120,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/fachada-noite.jpeg'],
    destaque: false,
    status: 'ativo'
  },
  {
    codigo: 'LAV-010',
    titulo: 'Manutenção de Lavadora de Alta Pressão',
    categoria: 'lavadoras',
    marca: 'WAP e similares',
    descricao: 'Reparo de motor, bomba, mangueira e gatilho de lavadoras de alta pressão residenciais.',
    preco: 90,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/logo-mural.jpeg'],
    destaque: false,
    status: 'ativo'
  },
  {
    codigo: 'BOM-011',
    titulo: 'Manutenção de Bomba de Piscina e Poço',
    categoria: 'bombas',
    marca: 'Jacuzzi, Sodramar e similares',
    descricao: 'Revisão, troca de vedação/rolamento e diagnóstico de bombas de piscina e poço residenciais.',
    preco: 150,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/produto-bomba-jacuzzi.jpeg'],
    destaque: true,
    status: 'ativo'
  },
  {
    codigo: 'VEN-012',
    titulo: 'Manutenção de Ventiladores',
    categoria: 'ventilacao',
    marca: 'Todas as marcas',
    descricao: 'Reparo de motor, hélice e sistema elétrico de ventiladores de mesa, coluna e teto.',
    preco: 60,
    preco_promocional: null,
    estoque_status: 'disponivel',
    fotos: ['assets/fotos-oficina/fachada-noite.jpeg'],
    destaque: false,
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
  'furadeiras': 'Furadeiras',
  'serra-marmore': 'Serra Mármore',
  'eletrodomesticos': 'Eletrodomésticos',
  'microondas': 'Micro-ondas',
  'liquidificadores': 'Liquidificadores',
  'masseiras': 'Masseiras',
  'lavadoras': 'Lavadora de Alta Pressão',
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
          ${sobOrcamento ? '' : `<div class="service-price">${precoTexto}</div>`}
        </div>
        <a href="${link}" class="btn btn-primary btn-sm btn-block">${botaoTexto}</a>
      </div>
    </a>
  </article>`;
}

// ---------------------------------------------------------------
// Materiais e peças (demo) — venda de peças para rebobinamento/reparo
// ---------------------------------------------------------------
const ICONE_ISOLACAO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M4 14h16"/></svg>';
const ICONE_CARRETEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>';
const ICONE_SELO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-2.5L15 21l-2-7"/></svg>';
const ICONE_CENTRIFUGA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>';
const ICONE_ENGRENAGEM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.6a7.6 7.6 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9a7.6 7.6 0 0 0 2.6 1.5l.5 2.6h4l.5-2.6a7.6 7.6 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4z"/></svg>';
const ICONE_CAPACITOR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v16M15 4v16M3 12h6M15 12h6"/></svg>';
const ICONE_ROLAMENTO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.6"/><circle cx="12" cy="5.2" r="1" fill="currentColor" stroke="none"/><circle cx="18.8" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="18.8" r="1" fill="currentColor" stroke="none"/><circle cx="5.2" cy="12" r="1" fill="currentColor" stroke="none"/></svg>';
const ICONE_CABO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6v3a5 5 0 0 0 5 5h6a5 5 0 0 1 5 5v1"/><path d="M4 4v4M8 4v4"/></svg>';
const ICONE_INDUZIDO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="20" rx="2"/><path d="M5 6h4M15 6h4M5 12h4M15 12h4M5 18h4M15 18h4"/></svg>';
const ICONE_MICROONDAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="4.5" y="6.5" width="11" height="11" rx="1"/><circle cx="19" cy="9" r="1" fill="currentColor" stroke="none"/><path d="M17 13h4M17 16h4"/></svg>';

export const LABELS_CATEGORIA_MATERIAL = {
  'microondas-seminovos': 'Micro-ondas Seminovos',
  'isolacao': 'Isolação',
  'fios-de-cobre': 'Fios de Cobre',
  'selos-mecanicos': 'Selos Mecânicos',
  'centrifugas': 'Centrífugas',
  'pecas-motor': 'Peças de Motor',
  'capacitores': 'Capacitores',
  'rolamentos': 'Rolamentos',
  'cabos': 'Cabos',
  'induzidos': 'Induzidos'
};

export const LABELS_APLICACAO_MATERIAL = {
  'eletrodomesticos': 'Eletrodomésticos',
  'motores': 'Motores',
  'bombas': 'Bombas',
  'ferramentas': 'Ferramentas',
  'geral': 'Uso Geral'
};

export const MATERIAIS_EXEMPLO = [
  {
    codigo: 'MIC-SEMI-01',
    titulo: 'Micro-ondas Seminovos',
    descricao: 'Micro-ondas seminovos revisados e testados pela nossa oficina, prontos para uso, com garantia.',
    icone: ICONE_MICROONDAS,
    categoria: 'microondas-seminovos',
    aplicacao: 'eletrodomesticos',
    preco: 180
  },
  {
    codigo: 'MAT-001',
    titulo: 'Isolação Branca para Motor',
    descricao: 'Fita e manta isolante branca para bobinagem de motores elétricos monofásicos e trifásicos.',
    icone: ICONE_ISOLACAO,
    foto: 'assets/produto-isolacao.png',
    categoria: 'isolacao',
    aplicacao: 'motores',
    preco: 35
  },
  {
    codigo: 'MAT-002',
    titulo: 'Carretéis de Fio de Cobre',
    descricao: 'Diversas bitolas de fio de cobre esmaltado disponíveis para rebobinamento.',
    icone: ICONE_CARRETEL,
    foto: 'assets/produto-fios-cobre.png',
    categoria: 'fios-de-cobre',
    aplicacao: 'motores',
    preco: 55
  },
  {
    codigo: 'MAT-003',
    titulo: 'Selo Mecânico',
    descricao: 'Selos mecânicos para bombas d\'água e motores com vedação líquida.',
    icone: ICONE_SELO,
    foto: 'assets/produto-selo-mecanico.png',
    categoria: 'selos-mecanicos',
    aplicacao: 'bombas',
    preco: 40
  },
  {
    codigo: 'MAT-004',
    titulo: 'Centrífuga de Motor',
    descricao: 'Peça de centrífuga/chave centrífuga para partida de motores monofásicos.',
    icone: ICONE_CENTRIFUGA,
    foto: 'assets/produto-centrifuga.png',
    categoria: 'centrifugas',
    aplicacao: 'motores',
    preco: 65
  },
  {
    codigo: 'MAT-005',
    titulo: 'Peças para Motor Trifásico',
    descricao: 'Rolamentos, tampas, eixos e demais componentes para motores trifásicos.',
    icone: ICONE_ENGRENAGEM,
    categoria: 'pecas-motor',
    aplicacao: 'motores',
    preco: 85
  },
  {
    codigo: 'MAT-006',
    titulo: 'Peças para Motor Monofásico',
    descricao: 'Capacitor, chave centrífuga, rolamentos e outros componentes para motores monofásicos.',
    icone: ICONE_ENGRENAGEM,
    categoria: 'pecas-motor',
    aplicacao: 'motores',
    preco: 75
  },
  {
    codigo: 'MAT-007',
    titulo: 'Capacitores',
    descricao: 'Capacitores de partida e permanentes em diversas capacitâncias.',
    icone: ICONE_CAPACITOR,
    foto: 'assets/produto-capacitores.png',
    categoria: 'capacitores',
    aplicacao: 'motores',
    preco: 22
  },
  {
    codigo: 'MAT-008',
    titulo: 'Rolamentos',
    descricao: 'Rolamentos em diversos tamanhos para motores, bombas e ferramentas elétricas.',
    icone: ICONE_ROLAMENTO,
    foto: 'assets/produto-rolamentos.png',
    categoria: 'rolamentos',
    aplicacao: 'geral',
    preco: 28
  },
  {
    codigo: 'MAT-009',
    titulo: 'Cabo para Ferramenta Elétrica',
    descricao: 'Cabos de força para furadeiras, serras, esmerilhadeiras e ferramentas em geral.',
    icone: ICONE_CABO,
    foto: 'assets/produto-cabo-ferramenta.webp',
    categoria: 'cabos',
    aplicacao: 'ferramentas',
    preco: 18
  },
  {
    codigo: 'MAT-010',
    titulo: 'Induzidos',
    descricao: 'Induzidos para furadeiras, serras mármore e outras ferramentas elétricas.',
    icone: ICONE_INDUZIDO,
    foto: 'assets/produto-induzidos.png',
    categoria: 'induzidos',
    aplicacao: 'ferramentas',
    preco: 95
  }
];

const ICONE_GENERICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';

export const MATERIAIS_BUCKET = 'materiais-fotos';

// Normaliza um registro (vindo do Supabase ou do MATERIAIS_EXEMPLO local)
// para um formato único usado pelos cartões e pela página de detalhe.
function normalizarMaterial(m) {
  const fotos = (Array.isArray(m.fotos) && m.fotos.length)
    ? m.fotos
    : (m.imagem || m.imagem_url || m.foto ? [m.imagem || m.imagem_url || m.foto] : []);
  return {
    id: m.id || m.codigo,
    codigo: m.codigo,
    titulo: m.titulo,
    categoria: m.categoria,
    aplicacao: m.aplicacao || null,
    descricao: m.descricao || '',
    preco: m.preco,
    fotos,
    imagem_url: fotos[0] || null,
    icone: m.icone || null,
    status: m.status || 'ativo'
  };
}

function filtrarMateriaisLocal({ categoria, aplicacao, busca, codigo, precoMax, ordenar } = {}) {
  let lista = MATERIAIS_EXEMPLO.map(normalizarMaterial);
  if (categoria) lista = lista.filter(m => m.categoria === categoria);
  if (aplicacao) lista = lista.filter(m => m.aplicacao === aplicacao);
  if (codigo) lista = lista.filter(m => m.codigo.toLowerCase().includes(codigo.toLowerCase()));
  if (busca) {
    const b = busca.toLowerCase();
    lista = lista.filter(m => m.titulo.toLowerCase().includes(b));
  }
  if (precoMax) lista = lista.filter(m => m.preco <= precoMax);

  if (ordenar === 'menor-preco') lista.sort((a, b) => a.preco - b.preco);
  else if (ordenar === 'maior-preco') lista.sort((a, b) => b.preco - a.preco);
  else if (ordenar === 'nome') lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));

  return lista;
}

// ---------------------------------------------------------------
// Busca de materiais/produtos — usa a tabela public.materiais quando
// o Supabase está configurado; senão cai no MATERIAIS_EXEMPLO (offline).
// ---------------------------------------------------------------
export async function fetchMateriais({ categoria, aplicacao, busca, codigo, precoMax, ordenar, limit } = {}) {
  if (!supabase) return filtrarMateriaisLocal({ categoria, aplicacao, busca, codigo, precoMax, ordenar }).slice(0, limit || undefined);

  let query = supabase.from('materiais').select('*').eq('status', 'ativo');
  if (categoria) query = query.eq('categoria', categoria);
  if (aplicacao) query = query.eq('aplicacao', aplicacao);
  if (codigo) query = query.ilike('codigo', `%${codigo}%`);
  if (busca) query = query.ilike('titulo', `%${busca}%`);
  if (precoMax) query = query.lte('preco', precoMax);

  if (ordenar === 'menor-preco') query = query.order('preco', { ascending: true });
  else if (ordenar === 'maior-preco') query = query.order('preco', { ascending: false });
  else if (ordenar === 'nome') query = query.order('titulo', { ascending: true });
  else query = query.order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return (data || []).map(normalizarMaterial);
}

export async function fetchMaterialById(id) {
  if (!id) return null;
  if (!supabase) {
    const item = MATERIAIS_EXEMPLO.find(m => m.codigo === id);
    return item ? normalizarMaterial(item) : null;
  }
  let { data } = await supabase.from('materiais').select('*').eq('id', id).maybeSingle();
  if (!data) {
    ({ data } = await supabase.from('materiais').select('*').eq('codigo', id).maybeSingle());
  }
  return data ? normalizarMaterial(data) : null;
}

export function whatsappLinkMaterial(m, quantidade = 1) {
  const qtd = Math.max(1, Number(quantidade) || 1);
  const total = formatBRL(m.preco * qtd);
  const msg = qtd > 1
    ? `Olá! Quero comprar: ${qtd}x ${m.titulo} (${m.codigo}) - Total ${total}. Ainda tem disponível?`
    : `Olá! Quero comprar: ${m.titulo} (${m.codigo}) - ${formatBRL(m.preco)}. Ainda tem disponível?`;
  return whatsappLink(msg);
}

export function materialCardHTML(m) {
  const link = `material.html?id=${encodeURIComponent(m.id || m.codigo)}`;
  const foto = m.imagem_url
    ? `<img src="${m.imagem_url}" alt="${m.titulo}" loading="lazy">`
    : `<div class="material-icon">${m.icone || ICONE_GENERICO}</div>`;
  return `
  <article class="service-card">
    <a href="${link}">
      <div class="service-photo material-photo${m.imagem_url ? '' : ' sem-foto'}">
        <span class="badge badge-red">${LABELS_CATEGORIA_MATERIAL[m.categoria] || 'Material'}</span>
        ${foto}
      </div>
      <div class="service-body">
        <div>
          <h3>${m.titulo}</h3>
          <div class="service-price"><span class="from">A partir de</span>${formatBRL(m.preco)}</div>
        </div>
        <a href="${link}" class="btn btn-primary btn-sm btn-block">Ver Detalhes</a>
      </div>
    </a>
  </article>`;
}
