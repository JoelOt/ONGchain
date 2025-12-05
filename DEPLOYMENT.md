# 🚀 Guía de Despliegue de Smart Contracts

## Requisitos Previos

1. **Sepolia ETH**: Obtén ETH de prueba de estos faucets:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

2. **RPC Provider**: Crea una cuenta gratuita en:
   - [Infura](https://infura.io/) o
   - [Alchemy](https://www.alchemy.com/)

3. **Wallet**: Ten lista una wallet de desarrollo (NO uses tu wallet principal)

## Paso 1: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` y completa:
```bash
# Tu clave privada (sin 0x)
PRIVATE_KEY=tu_clave_privada_aqui

# URL RPC de Sepolia (elige una opción)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/TU_API_KEY

# Opcional: Para verificar contratos en Etherscan
ETHERSCAN_API_KEY=tu_api_key_aqui
```

> ⚠️ **IMPORTANTE**: Nunca compartas tu `.env` ni lo subas a Git

## Paso 2: Compilar Contratos

```bash
npx hardhat compile
```

Deberías ver:
```
Compiled 2 Solidity files successfully
```

## Paso 3: Desplegar a Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

El script automáticamente:
- ✅ Despliega `DonationItem`
- ✅ Despliega `TraceDonation`
- ✅ Configura roles necesarios
- ✅ Guarda las direcciones en `deployments/sepolia.json`
- ✅ Actualiza `frontend/src/environments/environment.ts`

## Paso 4: Verificar Contratos (Opcional)

Si configuraste `ETHERSCAN_API_KEY`, verifica los contratos:

```bash
# Verificar DonationItem
npx hardhat verify --network sepolia DIRECCION_DONATION_ITEM "TU_DIRECCION" "TU_DIRECCION"

# Verificar TraceDonation
npx hardhat verify --network sepolia DIRECCION_TRACE_DONATION "DIRECCION_DONATION_ITEM"
```

## Paso 5: Probar el Frontend

```bash
cd frontend
npm start
```

Abre `http://localhost:4200` y:
1. Conecta tu wallet de MetaMask
2. Asegúrate de estar en Sepolia
3. Prueba las funcionalidades

## Estructura de Archivos

```
ONGchain/
├── contracts/              # Smart contracts
│   ├── TraceDonation.sol
│   └── token/
│       └── DonationItem.sol
├── scripts/
│   └── deploy.js          # Script de despliegue
├── deployments/           # Direcciones desplegadas
│   └── sepolia.json
├── hardhat.config.js      # Configuración de Hardhat
├── .env                   # Variables de entorno (NO COMMITEAR)
└── .env.example           # Template de .env
```

## Comandos Útiles

```bash
# Compilar contratos
npx hardhat compile

# Limpiar cache
npx hardhat clean

# Ejecutar tests (si existen)
npx hardhat test

# Desplegar a red local
npx hardhat node                    # Terminal 1
npx hardhat run scripts/deploy.js   # Terminal 2

# Ver ayuda
npx hardhat help
```

## Solución de Problemas

### Error: "insufficient funds"
- Asegúrate de tener suficiente Sepolia ETH
- Verifica que estás usando la wallet correcta

### Error: "invalid API key"
- Verifica que tu `SEPOLIA_RPC_URL` es correcta
- Asegúrate de que tu API key de Infura/Alchemy es válida

### Error: "nonce too low"
- Resetea tu cuenta en MetaMask: Settings → Advanced → Reset Account

### El frontend no detecta los contratos
- Verifica que `frontend/src/environments/environment.ts` tiene las direcciones correctas
- Reinicia el servidor de desarrollo del frontend

## Seguridad

🔒 **Mejores Prácticas**:
- Usa una wallet separada para desarrollo
- Nunca compartas tu clave privada
- Verifica que `.env` está en `.gitignore`
- Revisa las transacciones antes de confirmar

## Soporte

Si encuentras problemas:
1. Revisa los logs del despliegue
2. Verifica las transacciones en [Sepolia Etherscan](https://sepolia.etherscan.io/)
3. Asegúrate de tener la última versión de Node.js (18+)
