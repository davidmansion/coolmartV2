import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThirdwebProvider as ThirdwebProviderV5 } from "thirdweb/react";
import "../styles/globals.css";
import { Navbar } from "../components/Navbar/Navbar";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "binance";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={activeChain} clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}>
      <ThirdwebProviderV5>
      <Navbar />
      <Component {...pageProps} />
      </ThirdwebProviderV5>
    </ThirdwebProvider>
  );
}

export default MyApp;
