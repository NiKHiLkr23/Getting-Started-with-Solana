import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionSignature,
  clusterApiUrl,
} from "@solana/web3.js";
import { useState } from "react";
import base58 from "bs58";
const GenerateKeypair: React.FC = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [balance, setBalance] = useState(Number);

  function generate() {
    const newPair = new Keypair();
    const publicKey = new PublicKey(newPair.publicKey).toString();
    const privateKey = newPair.secretKey;
    setPublicKey(publicKey);
    setPrivateKey(base58.encode(privateKey));
    console.log("keypair generated, PublicKey: ", publicKey);

    const airdrop = async () => {
      let signature: TransactionSignature = "";
      try {
        setBalance(0);

        // request airdrop
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        signature = await connection.requestAirdrop(
          new PublicKey(publicKey),
          2 * LAMPORTS_PER_SOL
        );
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature,
        });
        const walletBalance = await connection.getBalance(
          new PublicKey(publicKey)
        );
        setBalance(walletBalance / LAMPORTS_PER_SOL);
      } catch (err: any) {
        console.log("Error getting wallet balance", err);
      } finally {
        console.log("Airdroped 2 SOL");
      }
    };

    airdrop();
  }

  return (
    <div>
      <h2
        id="section1"
        className="flex font-sans font-bold break-normal justify-center text-gray-700 px-2 mt-5 text-xl"
      >
        Create a new Solana account
      </h2>
      <div className="p-8 lg:mt-0 leading-normal rounded shadow bg-white">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4 md:col-span-1 flex justify-center items-center">
            <button
              className="mr-3 shadow btn focus:shadow-outline focus:outline-none text-white text-sm md:text-base font-bold py-2 px-4 rounded"
              onClick={generate}
            >
              Create
            </button>
          </div>
          <div className="col-span-4 md:col-span-3">
            <div className="mb-3 xl:w-2/3">
              <label
                htmlFor="publicKey"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Public Key
              </label>
              <input
                type="text"
                className="
                form-control
                input_style
            "
                placeholder="Public Key"
                readOnly
                value={publicKey}
              />
            </div>
            <div className="mb-3 xl:w-2/3">
              <label
                htmlFor="privateKey"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Private Key
              </label>
              <input
                type="text"
                className="
                form-control
                input_style
            "
                placeholder="Private Key"
                readOnly
                value={privateKey}
              />
              {privateKey && (
                <p className="text-sm text-gray-500 pl-3">
                  Copy this private key and store it to a safe place
                </p>
              )}
              {balance > 0 && (
                <p className="mt-2 text-lg font-mono">
                  Account Balance: {balance} SOL
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateKeypair;
