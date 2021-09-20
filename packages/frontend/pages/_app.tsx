import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/global';
import type { AppProps } from 'next/app';
import { theme } from '../styles/global';
import {Provider} from 'next-auth/client';

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Provider session={session}>
        <GlobalStyle />
          <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
}
export default MyApp;
