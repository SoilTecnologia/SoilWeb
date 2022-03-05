import { AppProps } from "next/app";
import Head from "next/head";
import GlobalStyles from "styles/global";
import { ThemeProvider } from "styled-components";
import theme from "styles/theme";
import React from "react";
import { UseContextProvider } from "hooks/useContextData";
import { UseCrudContextProvider } from "hooks/useActionsCrud";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <UseContextProvider>
        <UseCrudContextProvider>
          <Head>
            <title>SoilTech</title>
            <link rel="shortcut icon" href="/logos/logo.png" />
            <link rel="apple-touch-icon" href="/logos/logo.png" />
            <link rel="manifest" href="/manifest.json" />
            <meta
              name="description"
              content="Soil tech Tecnologias de Irrigação"
            />
          </Head>
          <Component {...pageProps} />
          <GlobalStyles />
        </UseCrudContextProvider>
      </UseContextProvider>
    </ThemeProvider>
  );
}

export default App;
