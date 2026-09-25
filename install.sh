#!/usr/bin/env bash
set -e

echo "======================================================================"
echo "         EDA Toolbox - Installation och Byggskript för Dator"
echo "======================================================================"
echo ""

# 1. Kontrollera Node.js
echo "🔍 [1/3] Kontrollerar Node.js och npm..."
if ! command -v node &> /dev/null; then
    echo "❌ [FEL] Node.js hittades inte på datorn!"
    echo "Installera Node.js (v20 LTS rekommenderas) från https://nodejs.org"
    echo "Eller via Homebrew (macOS): brew install node@20"
    echo "Eller via apt (Ubuntu/Debian): sudo apt install nodejs npm"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "   Hittade Node.js: $NODE_VERSION"

# 2. Installera beroenden
echo ""
echo "📦 [2/3] Installerar paket och bibliotek..."
npm install || npm install --legacy-peer-deps
echo "   Beroenden installerade framgångsrikt!"

# 3. Bygg applikationen
echo ""
echo "🏗️ [3/3] Kompilerar och bygger applikationen med Vite..."
npm run build
echo "   Produktionsbygget i ./dist är klart!"

echo ""
echo "======================================================================"
echo "   ✅ EDA Toolbox är färdiginstallerad på din dator!"
echo "======================================================================"
echo ""
echo "Starta applikationen med något av följande kommandon:"
echo "  • Utvecklingsläge:   npm run dev      (port 3000)"
echo "  • Produktionsläge:   npm run preview  (port 4173)"
echo "  • Eller kör:         ./run.sh"
echo ""

read -p "Vill du starta EDA Toolbox nu? (j/n): " START_NOW
if [[ "$START_NOW" =~ ^[jJyY]$ ]]; then
    npm run dev
fi
