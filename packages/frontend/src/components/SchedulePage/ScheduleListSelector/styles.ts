import styled, { css } from "styled-components";
export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-self: center;
    align-items: center;
    flex-direction:column;
    width:100%;
  `}
`;
