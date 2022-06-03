import styled, {css} from "styled-components"; 
export const Container =styled.div` ${({theme})=> css`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`} `;
export const Content = styled.div`
  max-width:  70vw;
  height: max-content;
`