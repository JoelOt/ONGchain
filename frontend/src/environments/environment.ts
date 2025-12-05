export const environment = {
    production: false,
    contracts: {
        // TODO: Actualizar con las direcciones reales después del despliegue
        traceDonation: '0xA7C5d2E48f6092bea549Af009ccAd6e0BC04bCC1',
        donationItem: '0x80d24fB9119e2D6A8d92D806224F12d519421432',
    },
    network: {
        chainId: 11155111, // Sepolia Testnet
        name: 'Sepolia Testnet',
        rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
        blockExplorer: 'https://sepolia.etherscan.io'
    }
};
