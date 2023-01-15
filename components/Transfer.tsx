import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import base58 from "bs58";
import { FC, useEffect, useState } from "react";

export const SendTransaction: FC = () => {
  const { connection } = useConnection();
  const [frompublicKey, setFromPublicKey] = useState("");
  const [fromprivateKey, setFromPrivateKey] = useState("");
  const [toPublicKey, setToPublicKey] = useState(String);
  const [balance, setBalance] = useState(Number);
  const [walletBalance, setWalletBalance] = useState(Number);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState("");

  const { publicKey } = useWallet();

  async function transfer() {
    try {
      setBalance(0);
      if (!frompublicKey) {
        throw new Error("Please enter a valid public key.");
      }
      if (!frompublicKey) {
        throw new Error("Please enter a valid private key.");
      }
      if (!toPublicKey) {
        throw new Error("Please enter a valid public key.");
      }
      setMessage("");
      setLoading(true);

      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const fromSecretKey = Uint8Array.from(base58.decode(fromprivateKey));
      const from = Keypair.fromSecretKey(fromSecretKey);

      // Send money from "from" wallet and into "to" wallet
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(frompublicKey),
          toPubkey: new PublicKey(toPublicKey),
          lamports: 1.5 * LAMPORTS_PER_SOL,
        })
      );

      // Sign transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
      );
      setSignature(signature);
      // get the new balance
      const walletBalance = await connection.getBalance(
        new PublicKey(frompublicKey)
      );
      setBalance(walletBalance / LAMPORTS_PER_SOL);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((info: any) => {
      setWalletBalance(info.lamports);
    });
  }, [connection, publicKey]);

  return (
    <div>
      <h2
        id="section1"
        className="flex items-center justify-center font-sans font-bold break-normal text-gray-700 px-2 mt-5 pb-8 text-xl"
      >
        Transfer SOL
      </h2>
      <div className="px-8 lg:mt-0 leading-normal rounded shadow bg-white">
        <div className="grid grid-cols-5 gap-4 md:gap-10">
          <div className="col-span-5 md:col-start-2 md:col-span-3">
            <p className="mb-3 text-gray-500">From:</p>
            <div className="mb-3">
              <label
                htmlFor="frompublicKey"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Enter Public Key
              </label>
              <input
                type="text"
                className="form-control
                input_style
            "
                placeholder="Public Key"
                onChange={(e) => setFromPublicKey(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="fromprivateKey"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Enter Private Key
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="
                form-control
                input_style
            "
                placeholder="Private Key"
                onChange={(e) => setFromPrivateKey(e.target.value)}
              />
            </div>
            <br />
            <p className="mb-3 text-gray-500">To:</p>
            <div className="mb-3">
              <label
                htmlFor="toPublicKey"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Enter Public Key
              </label>
              <input
                type="text"
                className="
                form-control
                input_style
            "
                id="toPublicKey"
                placeholder="Public Key"
                value={toPublicKey}
                onChange={(e) => setToPublicKey(e.target.value)}
              />
            </div>
          </div>
          <div className=" flex md:flex-col md:items-center md:justify-center col-span-5 md:col-span-1 ">
            {publicKey && (
              <button
                className="p-2 btn text-white font-bold"
                onClick={() =>
                  publicKey ? setToPublicKey(publicKey.toString()) : ""
                }
              >
                {" "}
                Send to wallet
              </button>
            )}
            <p className="md:flex ml-2 mt-1 md:justify-center md:items-center">
              {publicKey
                ? `Wallet Balance: ${walletBalance / LAMPORTS_PER_SOL} SOL`
                : ""}
            </p>
          </div>
          <button
            className="col-span-5 md:col-start-3 md:col-span-1 shadow btn focus:shadow-outline focus:outline-none text-white text-sm md:text-base font-bold py-2 px-4 rounded"
            onClick={transfer}
          >
            Transfer
          </button>
          <div className="col-span-5 md:col-start-2 md:col-span-3">
            {loading ? (
              <p>loading</p>
            ) : (
              <>
                {balance ? (
                  <p>Sender&apos;s Remaining balance: {balance}</p>
                ) : (
                  ""
                )}
                <br />
                {signature && (
                  <p className="break-words font-mono ">
                    Signature: {signature}
                  </p>
                )}
                <br />
                {signature && (
                  <p className="flex flex-col md:flex-row justify-start  items-start truncate md:text-lg break-words mb-5 ">
                    Explore transaction:{" "}
                    <a
                      href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm md:ml-3 md:text-lg"
                    >{`https://explorer.solana.com/tx/${signature}?cluster=devnet`}</a>
                  </p>
                )}
              </>
            )}
            <p className="my-3 text-red-500">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
