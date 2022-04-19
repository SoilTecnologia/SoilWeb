import styled, {css} from "styled-components";
export const Container =styled.div` ${({theme})=> css` `} `;
export const PageIndicator = styled.a`


  transition: all .3s linear;

  &:hover{
      cursor: pointer;
      opacity: 0.85;
    }

`;
