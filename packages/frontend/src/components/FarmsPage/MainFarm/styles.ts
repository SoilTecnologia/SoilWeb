import styled, {css} from "styled-components";

export const Container =styled.div`
  display:flex;
  width:100vw;
  min-height:100vh;
  flex-direction: column;
  background-color:${({theme})=>theme.colors.secondary};
`;
