-- ===================================================================
-- ELÉTRICA ROCAR — seed-servicos.sql
-- Dados de exemplo para popular a tabela `servicos` (opcional).
-- Rode depois de supabase-setup.sql, se quiser já ver o catálogo
-- funcionando antes de cadastrar tudo pelo painel admin.
-- ===================================================================

insert into public.servicos (codigo, titulo, categoria, marca, descricao, preco, estoque_status, fotos, destaque, status) values
('MOT-001', 'Rebobinamento de Motor Elétrico Monofásico', 'motores-monofasicos', 'Diversas marcas',
 'Rebobinamento completo de motores monofásicos de até 3 CV, com teste de carga e garantia de serviço. Atendemos motores de portão, bomba d''água, compressor e uso industrial leve.',
 180, 'disponivel', '{}', true, 'ativo'),

('MOT-002', 'Rebobinamento de Motor Trifásico', 'motores-trifasicos', 'WEG e similares',
 'Rebobinamento de motores trifásicos industriais, com balanceamento e teste de isolamento antes da entrega.',
 350, 'disponivel', '{}', true, 'ativo'),

('ELE-003', 'Conserto de Micro-ondas', 'eletrodomesticos', 'Todas as marcas',
 'Diagnóstico e reparo de micro-ondas: magnetron, placa, fusível térmico e demais componentes.',
 90, 'disponivel', '{}', true, 'ativo'),

('ELE-004', 'Manutenção de Air Fryer / Fritadeira Elétrica', 'eletrodomesticos', 'Todas as marcas',
 'Reparo de resistência, placa e sistema de aquecimento de air fryers e fritadeiras elétricas.',
 70, 'disponivel', '{}', false, 'ativo'),

('ELE-005', 'Conserto de Liquidificador', 'eletrodomesticos', 'Todas as marcas',
 'Troca de motor, chave seletora, hélice e reparo do sistema de encaixe do copo.',
 60, 'disponivel', '{}', false, 'ativo'),

('ELE-006', 'Conserto de Panela de Arroz / Pressão Elétrica', 'eletrodomesticos', 'Todas as marcas',
 'Reparo de sensores de temperatura, resistência e placa eletrônica.',
 70, 'disponivel', '{}', false, 'ativo'),

('ELE-007', 'Conserto de Ventilador', 'ventilacao', 'Todas as marcas',
 'Troca de capacitor, motor, hélice e chave de velocidade.',
 60, 'disponivel', '{}', false, 'ativo'),

('ELE-008', 'Conserto de Sanduicheira / Forno Elétrico', 'eletrodomesticos', 'Todas as marcas',
 'Reparo de resistência, termostato e fiação interna.',
 65, 'disponivel', '{}', false, 'ativo'),

('ELE-009', 'Manutenção de Purificador de Água', 'eletrodomesticos', 'Todas as marcas',
 'Limpeza do sistema, troca de refil/filtro e reparo do compressor de refrigeração.',
 90, 'disponivel', '{}', false, 'ativo'),

('BOM-010', 'Manutenção de Bomba de Piscina', 'bombas', 'Jacuzzi, Sodramar e similares',
 'Revisão, troca de vedação/rolamento e diagnóstico de bombas de piscina residenciais.',
 150, 'disponivel', '{}', true, 'ativo'),

('BOM-011', 'Manutenção de Bomba de Poço', 'bombas', 'Diversas marcas',
 'Diagnóstico e reparo de bombas submersas e periféricas para poço residencial.',
 180, 'disponivel', '{}', false, 'ativo'),

('FER-012', 'Manutenção de Ferramentas Elétricas', 'ferramentas', 'Makita, Bosch, DeWalt e similares',
 'Troca de escova, rolamento, fiação e reparo geral de furadeiras, serras mármore, esmerilhadeiras e parafusadeiras.',
 80, 'disponivel', '{}', true, 'ativo'),

('LAV-013', 'Manutenção de Lavadora de Alta Pressão', 'ferramentas', 'Diversas marcas',
 'Reparo de motor, bomba de pressão e gatilho de lavadoras de alta pressão.',
 120, 'disponivel', '{}', false, 'ativo');
