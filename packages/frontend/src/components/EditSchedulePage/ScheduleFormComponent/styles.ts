import styled, { css } from "styled-components";
export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items:center;
    flex-direction:column;
    height:100%;
    width:100%;
  `}
`;
