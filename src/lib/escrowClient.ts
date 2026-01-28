import { ethers, type Signer } from "ethers";

// Minimal ABI for createGig(worker) payable
const ESCROW_ABI = ["function createGig(address _worker) public payable returns (uint256)"];

const getProvider = () => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("No wallet provider found. Please install a compatible wallet or connect via WalletConnect.");
  }
  return new ethers.BrowserProvider((window as any).ethereum);
};

export async function createGigWithWallet(paymentAmount: string | number, workerAddress?: string, externalSigner?: Signer) {
  const contractAddress = import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS;
  const targetChainId = import.meta.env.VITE_CHAIN_ID || "43113"; // default Fuji

  if (!contractAddress) {
    throw new Error("Escrow contract address not configured (VITE_ESCROW_CONTRACT_ADDRESS).");
  }

  const signer = externalSigner || (await getProvider().getSigner());
  const provider = signer.provider;
  if (!provider) {
    throw new Error("No provider found for signer.");
  }

  const network = await provider.getNetwork();
  if (network.chainId.toString() !== targetChainId.toString()) {
    const hexChainId = `0x${Number(targetChainId).toString(16)}`;
    if ((provider as any).send) {
      await (provider as any).send("wallet_switchEthereumChain", [{ chainId: hexChainId }]).catch(() => {
        throw new Error(`Please switch your wallet to chain ${targetChainId}`);
      });
    } else {
      throw new Error(`Please switch your wallet to chain ${targetChainId}`);
    }
  }

  const contract = new ethers.Contract(contractAddress, ESCROW_ABI, signer);
  const value = ethers.parseEther(paymentAmount.toString());
  const worker = workerAddress || ethers.ZeroAddress;

  const tx = await contract.createGig(worker, { value });
  const receipt = await tx.wait();

  const gigId = Number(receipt?.logs?.[0]?.args?.[0] ?? receipt?.logs?.[0]?.args?.gigId ?? 0);

  return {
    gigId,
    txHash: receipt?.hash,
    blockNumber: receipt?.blockNumber,
  };
}
