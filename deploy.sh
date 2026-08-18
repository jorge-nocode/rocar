#!/usr/bin/env bash
# ===================================================================
# ELETRICA ROCAR - deploy.sh
# Envia as alteracoes commitadas localmente para o GitHub (branch
# atual). Rode com: bash deploy.sh  (ou "./deploy.sh" apos
# "chmod +x deploy.sh"), dentro da pasta do projeto.
#
# O Vercel está conectado a este repositório, então um push para o
# branch principal já dispara o deploy automático do site.
# ===================================================================
set -e

echo ""
echo "=== Elétrica Rocar: enviando alterações para o GitHub ==="
echo ""

git push origin main

echo ""
echo "=== Push concluído com sucesso! O Vercel vai publicar o site automaticamente. ==="
echo ""
