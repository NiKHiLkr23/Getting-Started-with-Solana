import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import GenerateKeypair from "@/components/GenerateKeypair";
import WalletContextProvider from "@/contexts/WalletContextProvider";
import Balance from "@/components/GetBalance";
import { SendTransaction } from "@/components/Transfer";
import { Footer } from "@/components/Footer";
export default function Home() {
  return (
    <>
      <Head>
        <title>Solana</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WalletContextProvider>
        <Header />
        <main className="mx-auto max-w-6xl">
          <GenerateKeypair />

          <Balance />

          <SendTransaction />
        </main>
        <Footer />
      </WalletContextProvider>
    </>
  );
}