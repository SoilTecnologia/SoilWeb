export default {
  grid: {
    container: "100vw",
    containerContent: "78rem",
  },
  media: {
    small: "376px",
    xsmall: "480px",
    medium: "620px",
    xmedium: "768px",
    large: "980px",
    full: "1128px",
  },
  colors: {
    primary: "#256e4d",
    primary_gradient: "#1d543e",

    secondary: "#edffcd",
    light: "#e1e1e1",
    dark: "#1e1e1e",

    topbttprimary: "#758d42",
    topbttprimary_gradient: "#93b153",

    wet: "#1E90FF",
    dry: "#93b153",
    offline: "#ffbf00",
    off: "#4e4e4e",

    cancel: "#aa0000",
  },
  font: {
    family: {
      Poppins: "'Poppins', sans-serif",
      Tangerine: "'Tangerine', cursive",
      Roboto: '"Roboto", monospace',
      Montserrat_bold:"Montserrat-Bold",
      Montserrat_light:"Montserrat-Light",
      Syncopate_bold:"Syncopate-Bold",
      Syncopate_regular:"Syncopate-Regular",

    },
    sizes: {
      xsmall: "1.2rem",
      small: "1.4rem",
      medium: "1.6rem",
      large: "1.8rem",
      xlarge: "2.0rem",
      xxlarge: "2.8rem",
      xbiglarge: "3rem",
      xxbiglarge: "3.4rem",
    },
    light: 300,
    normal: 500,
    bold: 700,
  },
  spacings: {
    xxsmall: "0.8rem",
    xsmall: "1.6rem",
    small: "2.4rem",
    medium: "3.2rem",
    large: "4.0rem",
    xlarge: "4.8rem",
    xxlarge: "5.6rem",
  },
} as const;
