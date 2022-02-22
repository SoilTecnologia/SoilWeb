import { AppProps } from "next/app";
import Head from "next/head";
import GlobalStyles from "styles/global";
import { ThemeProvider } from "styled-components";
import theme from "styles/theme";
import React from "react";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>SoilTech</title>
        <link rel="shortcut icon" href="/logos/logo.png" />
        <link rel="apple-touch-icon" href="/logos/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="description" content="Soil tech Tecnologias de Irrigação" />
      </Head>
      <Component {...pageProps} />
      <GlobalStyles />
    </ThemeProvider>
  );
}

export default App;
