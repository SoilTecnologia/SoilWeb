import { createGlobalStyle, css } from "styled-components";

const GlobalStyles = createGlobalStyle`

/* Roboto */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/roboto-v29-latin-regular.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/roboto-v29-latin-regular.woff2') format('woff2')
}

@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/roboto-v29-latin-italic.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/roboto-v29-latin-italic.woff2') format('woff2')
}

@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/roboto-v29-latin-500italic.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/roboto-v29-latin-500italic.woff2') format('woff2')
}

@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/roboto-v29-latin-700italic.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/roboto-v29-latin-700italic.woff2') format('woff2')
}

/* Poppins */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/poppins-v15-latin-regular.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/poppins-v15-latin-regular.woff2') format('woff2')
}

@font-face {
  font-family: 'Poppins';
  font-style: italic;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/poppins-v15-latin-500italic.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/poppins-v15-latin-500italic.woff2') format('woff2')
}

@font-face {
  font-family: 'Poppins';
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/poppins-v15-latin-700italic.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/poppins-v15-latin-700italic.woff2') format('woff2')
}
 /* Tangerine */
@font-face {
  font-family: 'Tangerine';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/tangerine-v12-latin-regular.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/tangerine-v12-latin-regular.woff2') format('woff2')
}

@font-face {
  font-family: 'Tangerine';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/tangerine-v12-latin-700.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/tangerine-v12-latin-700.woff2') format('woff2')
}

/* grechen-fuemen-regular - latin */
@font-face {
  font-family: "Grechen Fuemen";
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/grechen-fuemen-v1-latin-regular.eot'); /* IE9 Compat Modes */
  src: local(''),url('/fonts/grechen-fuemen-v1-latin-regular.woff2') format('woff2')
}
// Montserrat
@font-face {
  font-family: "Montserrat-Bold";
  font-style: bold;
  src: local(''),url('/fonts/Montserrat-Bold.ttf') format('truetype')
}

@font-face {
  font-family: "Montserrat-Light";
  font-style: normal;
  src: local(''),url('/fonts/Montserrat-Light.ttf') format('truetype')
}
@font-face{
  font-family: "Syncopate-Bold";
  font-style: normal;
  src: local(''),url('/fonts/Syncopate-Bold.ttf') format('truetype')
}
@font-face{
  font-family: "Syncopate-Regular";
  font-style: normal;
  src: local(''),url('/fonts/Syncopate-Regular.ttf') format('truetype')
}


  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  html, body, #__next {
    height: 100vh;
  }

  body {
    ${({ theme }) => css`
      background: ${theme.colors.primary};
      font-size: ${theme.font.sizes.xlarge};
      font-family: ${theme.font.family.Poppins};
    `}
  }
  h1,h2,h3,h4,h5,h6{
    ${({ theme }) => css`
      font-size: ${theme.font.sizes.medium};
      font-family: ${theme.font.family.Roboto};
    `}
  }
  button{
    cursor: pointer;
    border: 0;
  }
  input{
    border: 0;
    padding-left: ${({ theme }) => theme.spacings.xxsmall};
    outline: none
  }
  ul, ol{
    list-style: none
  }
  a{
    color: inherit;
    text-decoration: none;
  }
`;

export default GlobalStyles;
