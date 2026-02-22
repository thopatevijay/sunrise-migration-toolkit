export interface MigrationProposal {
  id: string;
  tokenId: string;
  tokenSymbol: string;
  tokenName: string;
  mdsScore: number;
  whyThisToken: string;
  proposedStrategy: string;
  createdAt: string;
  marketCap: number;
  bridgeVolume7d: number;
  demandMentions: number;
  walletOverlap: number;
}

const STORAGE_KEY = "tideshift-proposals";

export function getStoredProposals(): MigrationProposal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProposal(proposal: MigrationProposal): void {
  const proposals = getStoredProposals();
  proposals.unshift(proposal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
}

export function deleteProposal(id: string): void {
  const proposals = getStoredProposals().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
}
