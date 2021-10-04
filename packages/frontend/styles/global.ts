import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#4A6E53',
    primary44Alpha: '#4A6E5370',
    secondary: '#E3EBC6'
  },
  shadows: {
    buttonPrimary: 'inset 0px -8px 0.8px 0.8px #00000050'
  }
};

export type ThemeType = typeof theme;

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: ${(props) => props.theme.colors.secondary};
  };

  p, h2, h3, h4, h5, h6 {
    font-family: 'Syncopate', serif;
    font-weight: 200;
  };

  h1 {
    font-family: 'Montserrat';
    font-weight: 500;
    font-size: 42px;
  };
`;
