import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionSignature,
  clusterApiUrl,
} from "@solana/web3.js";
import { useState } from "react";
import * as timers from "timers-promises";

const Airdrop: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [amount, setAmount] = useState(1);

  const [balance, setBalance] = useState(Number);
  const [signature, setSignature] = useState("");

  // Function to airdrop sol
  const airdrop = async () => {
    setIsLoading(true);

    await timers.setTimeout(5000);

    let signature: TransactionSignature = "";
    try {
      setBalance(0);

      // request airdrop
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      signature = await connection.requestAirdrop(
        new PublicKey(publicKey),
        amount * LAMPORTS_PER_SOL
      );
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      setSignature(signature);
      const walletBalance = await connection.getBalance(
        new PublicKey(publicKey)
      );
      setBalance(walletBalance / LAMPORTS_PER_SOL);
    } catch (err: any) {
      console.log("Error getting wallet balance", err);
    } finally {
      //   console.log(`Airdroped ${amount} SOL`);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2
        id="section1"
        className="flex font-sans font-bold break-normal justify-center text-gray-700 px-2 mt-5 text-xl"
      >
        Airdrop Sol to your account
      </h2>
      <p className="flex font-mono break-normal justify-center text-red-300 px-2">
        Maximun 2 SOL
      </p>
      <div className="p-8 lg:mt-0 leading-normal rounded shadow bg-white">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4 md:col-span-1 flex justify-center space-x-1 items-center">
            <button
              className="mr-3 shadow btn focus:shadow-outline focus:outline-none text-white text-sm md:text-base font-bold py-2 px-4 rounded"
              onClick={airdrop}
            >
              Airdrop
            </button>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max="2"
                placeholder={`${amount}`}
                onChange={(e) => setAmount(e.target.valueAsNumber)}
                className="border placeholder-gray-300 w-12 rounded-lg text-center mr-1 text-gray-700 text-lg"
              />
              <p className="text-lg text-[#2d2d2e]">SOL</p>
            </div>
          </div>

          <div className="col-span-4 md:col-span-3">
            <div className="mb-3 xl:w-2/3">
              <label
                htmlFor="PublicKey"
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
                id="PublicKey"
                placeholder="Public Key"
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </div>
            <div className="mb-3 xl:w-2/3">
              {isLoading && (
                <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
              )}
              {!isLoading && balance > 0 && (
                <>
                  <p className="flex space-x-4 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="bg-green-200 rounded-full h-8 p-1 w-8 mr-1"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                        fill="rgba(47,204,113,1)"
                      />
                    </svg>{" "}
                    Airdrop Successfull{" "}
                    <a
                      href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm underline md:text-lg"
                    >
                      View Transaction on Solana Explorer.
                    </a>
                  </p>
                  <p className="mt-2 text-lg font-mono">
                    Account Balance: {balance} SOL
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
