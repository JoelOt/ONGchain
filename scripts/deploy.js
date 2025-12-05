import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("Iniciando despliegue de contratos ONGchain...\n");

    // Obtener el deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Desplegando contratos con la cuenta:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance de la cuenta:", hre.ethers.formatEther(balance), "ETH\n");

    // 1. Desplegar DonationItem
    console.log("Desplegando DonationItem...");
    const DonationItem = await hre.ethers.getContractFactory("DonationItem");

    // Constructor parameters: defaultAdmin, minter
    // Usamos la misma dirección para ambos roles inicialmente
    const donationItem = await DonationItem.deploy(deployer.address, deployer.address);
    await donationItem.waitForDeployment();

    const donationItemAddress = await donationItem.getAddress();
    console.log("DonationItem desplegado en:", donationItemAddress);

    // 2. Desplegar TraceDonation
    console.log("Desplegando TraceDonation...");
    const TraceDonation = await hre.ethers.getContractFactory("TraceDonation");

    // Constructor parameter: tokenAddress (DonationItem address)
    const traceDonation = await TraceDonation.deploy(donationItemAddress);
    await traceDonation.waitForDeployment();

    const traceDonationAddress = await traceDonation.getAddress();
    console.log("TraceDonation desplegado en:", traceDonationAddress);

    // 3. Configurar roles
    console.log("Configurando roles...");

    // Otorgar rol MINTER_ROLE a TraceDonation en DonationItem
    const MINTER_ROLE = await donationItem.MINTER_ROLE();
    const grantTx = await donationItem.grantRole(MINTER_ROLE, traceDonationAddress);
    await grantTx.wait();
    console.log("Rol MINTER_ROLE otorgado a TraceDonation");

    // 4. Guardar direcciones en archivo JSON
    const deploymentInfo = {
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            DonationItem: donationItemAddress,
            TraceDonation: traceDonationAddress
        }
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("Información de despliegue guardada en:", deploymentFile);

    // 5. Actualizar frontend environment
    console.log("Actualizando configuración del frontend...");
    updateFrontendEnvironment(donationItemAddress, traceDonationAddress);

    // 6. Resumen
    console.log("=".repeat(60));
    console.log("Despliegue completado exitosamente!");
    console.log("=".repeat(60));
    console.log("📋 Resumen:");
    console.log("  Red:", hre.network.name);
    console.log("  DonationItem:", donationItemAddress);
    console.log("  TraceDonation:", traceDonationAddress);
    console.log("Verificar en Etherscan:");
    console.log("  DonationItem:", `https://sepolia.etherscan.io/address/${donationItemAddress}`);
    console.log("  TraceDonation:", `https://sepolia.etherscan.io/address/${traceDonationAddress}`);
    console.log("Próximos pasos:");
    console.log("  1. Verifica los contratos en Etherscan (opcional):");
    console.log(`     npx hardhat verify --network ${hre.network.name} ${donationItemAddress} "${deployer.address}" "${deployer.address}"`);
    console.log(`     npx hardhat verify --network ${hre.network.name} ${traceDonationAddress} "${donationItemAddress}"`);
    console.log("  2. Inicia el frontend:");
    console.log("     cd frontend && npm start");
    console.log("  3. Conecta tu wallet y prueba la aplicación\n");
}

function updateFrontendEnvironment(donationItemAddress, traceDonationAddress) {
    const envPath = path.join(__dirname, "../frontend/src/environments/environment.ts");

    if (!fs.existsSync(envPath)) {
        console.log("Archivo environment.ts no encontrado, saltando actualización");
        return;
    }

    let envContent = fs.readFileSync(envPath, "utf8");

    // Actualizar direcciones de contratos
    envContent = envContent.replace(
        /traceDonation:\s*['"]0x[a-fA-F0-9]{40}['"]/,
        `traceDonation: '${traceDonationAddress}'`
    );
    envContent = envContent.replace(
        /donationItem:\s*['"]0x[a-fA-F0-9]{40}['"]/,
        `donationItem: '${donationItemAddress}'`
    );

    fs.writeFileSync(envPath, envContent);
    console.log("Frontend environment.ts actualizado");

    // También actualizar environment.prod.ts si existe
    const envProdPath = path.join(__dirname, "../frontend/src/environments/environment.prod.ts");
    if (fs.existsSync(envProdPath)) {
        let envProdContent = fs.readFileSync(envProdPath, "utf8");
        envProdContent = envProdContent.replace(
            /traceDonation:\s*['"]0x[a-fA-F0-9]{40}['"]/,
            `traceDonation: '${traceDonationAddress}'`
        );
        envProdContent = envProdContent.replace(
            /donationItem:\s*['"]0x[a-fA-F0-9]{40}['"]/,
            `donationItem: '${donationItemAddress}'`
        );
        fs.writeFileSync(envProdPath, envProdContent);
        console.log("Frontend environment.prod.ts actualizado");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error durante el despliegue:");
        console.error(error);
        process.exit(1);
    });
