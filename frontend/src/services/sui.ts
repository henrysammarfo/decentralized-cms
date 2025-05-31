import { TransactionBlock } from '@mysten/sui.js';
import { useSignTransactionBlock, useSuiClient } from '@mysten/dapp-kit';

export function useCMSContract() {
  const { mutateAsync: signTransactionBlock } = useSignTransactionBlock();
  const suiClient = useSuiClient();

  const createPage = async (title: string, contentCid: string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::cms::create_page`,
      arguments: [
        tx.pure(title),
        tx.pure(contentCid),
        tx.pure([tx.pure(address)]), // Initial editors
      ],
    });

    const signedTx = await signTransactionBlock({ transactionBlock: tx });
    await suiClient.executeTransactionBlock({
      transactionBlock: signedTx.transactionBlockBytes,
      signature: signedTx.signature,
    });
  };

  // Add similar functions for updateContent, addEditor, etc.
}