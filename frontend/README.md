# ONGchain - Frontend Angular

Frontend de aplicación Angular para interactuar con los smart contracts de trazabilidad de donaciones.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- MetaMask instalado en el navegador
- Contratos desplegados en una testnet de Ethereum (Sepolia recomendado)

### Instalación

```bash
cd frontend
npm install
```

### Configuración

1. Actualiza las direcciones de los contratos en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  contracts: {
    traceDonation: '0xTU_DIRECCION_TRACE_DONATION',
    donationItem: '0xTU_DIRECCION_DONATION_ITEM',
  },
  network: {
    chainId: 11155111, // Sepolia
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/TU_API_KEY',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};
```

2. Si usas una red diferente, actualiza el `chainId` y otros parámetros según corresponda.

### Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build de Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/frontend/browser/`

## 📋 Funcionalidades

### Para el Owner del Contrato
- **Gestión de ONGs**: Autorizar y revocar ONGs para emitir tokens

### Para ONGs Autorizadas
- **Crear Donaciones**: Emitir nuevos tokens NFT de donación
- **Actualizar Ubicación**: Registrar movimientos de productos
- **Marcar como Usado**: Indicar entrega final

### Para Todos los Usuarios
- **Rastrear Donaciones**: Ver historial completo de trazabilidad
- **Conectar Wallet**: Integración con MetaMask

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── features/        # Componentes de funcionalidades
│   │   │   ├── dashboard/
│   │   │   ├── donation-tracker/
│   │   │   ├── ong-management/
│   │   │   ├── create-donation/
│   │   │   ├── update-location/
│   │   │   ├── my-donations/
│   │   │   └── wallet-connect/
│   │   └── layout/          # Componentes de layout
│   │       ├── header/
│   │       └── sidebar/
│   ├── contracts/
│   │   ├── abis/            # ABIs de los contratos
│   │   └── interfaces/      # Interfaces TypeScript
│   ├── guards/              # Guards de rutas
│   ├── services/            # Servicios de Angular
│   │   ├── web3.service.ts
│   │   ├── trace-donation.service.ts
│   │   └── donation-item.service.ts
│   └── app.routes.ts
└── environments/            # Configuración de entornos
```

## 🔧 Tecnologías Utilizadas

- **Angular 21**: Framework frontend
- **Ethers.js v6**: Librería para interactuar con Ethereum
- **Angular Material**: Componentes UI
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos

## 📝 Notas Importantes

### Configuración de MetaMask

1. Asegúrate de tener MetaMask instalado
2. Conecta a la red Sepolia (o la red que estés usando)
3. Asegúrate de tener ETH de prueba en tu wallet

### Obtener ETH de Prueba (Sepolia)

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

## 🐛 Solución de Problemas

### Error: "MetaMask no está instalado"
- Instala la extensión de MetaMask en tu navegador

### Error: "Red incorrecta"
- Cambia a la red Sepolia en MetaMask
- O actualiza `environment.ts` con la red correcta

### Error: "No autorizado"
- Verifica que tu dirección tenga los permisos necesarios
- Para gestión de ONGs: debes ser el owner del contrato
- Para crear donaciones: debes ser una ONG autorizada

## 📄 Licencia

MIT
