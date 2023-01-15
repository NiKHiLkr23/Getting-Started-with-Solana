import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import React, { useState } from "react";

export default function Balance() {
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState(Number);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function getBalance() {
    console.log("Getting Balance ...");
    try {
      setBalance(0);
      if (!publicKey) {
        throw new Error("Please enter a valid public key.");
      }
      setMessage("");
      setLoading(true);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const walletBalance = await connection.getBalance(
        new PublicKey(publicKey)
      );
      setBalance(walletBalance / LAMPORTS_PER_SOL);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2
        id="section1"
        className="flex font-sans font-bold break-normal justify-center text-gray-700 px-2 pb-8 text-xl mt-5"
      >
        Get Account Balance
      </h2>
      <div className="px-8 my-2 pb-4 md:pb-8  lg:mt-0 leading-normal rounded shadow bg-white">
        <div className="grid grid-cols-5 gap-4 md:gap-10">
          <div className="col-span-5 md:col-span-1 flex justify-center items-center">
            <button
              className="flex items-center shadow btn focus:shadow-outline focus:outline-none text-white text-sm md:text-base font-bold py-2 px-3 rounded"
              onClick={getBalance}
            >
              Get Balance
            </button>
          </div>
          <div className="col-span-5 md:col-span-3">
            <div className="">
              <label
                htmlFor="publicKey"
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
                placeholder="Public Key"
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </div>
            <p className="p-2  text-xs font-serif text-red-500">{message}</p>
          </div>
          <div className="col-span-5 flex md:flex-col md:col-span-1">
            <p>Balance:</p>
            {balance > 0 && (
              <p className="flex ml-5 md:ml-0 md:mt-3 md:text-lg font-mono grow">
                {balance} SOL
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
