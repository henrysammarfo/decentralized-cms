// src/lib/sui.js
import {
  JsonRpcProvider,
  Ed25519Keypair,
  RawSigner,
} from "@mysten/sui";

const provider = new JsonRpcProvider({
  url: import.meta.env.VITE_SUI_RPC,
});

let signer = null;

export async function connectWallet() {
  // example using a local keypair; in prod swap for web-wallet flow
  const keypair = Ed25519Keypair.generate();
  signer = new RawSigner(keypair, provider);
  return signer;
}

export async function callUpdatePage(packageId, moduleName, functionName, args) {
  if (!signer) throw new Error("Wallet not connected");
  const tx = await signer.executeMoveCall({
    packageObjectId: packageId,
    module: moduleName,
    function: functionName,
    typeArguments: [],
    arguments: args,
    gasBudget: 10000,
  });
  return tx;
}
