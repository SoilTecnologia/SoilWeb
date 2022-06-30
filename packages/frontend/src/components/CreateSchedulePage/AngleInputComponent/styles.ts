import styled, { css } from "styled-components";
export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self:stretch;

  `}
`;
export const Header = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xbiglarge};
    font-family: ${theme.font.family.Montserrat_bold};
    margin: 10px 0px;
    color:${theme.colors.primary};
  `}
`;
export const RowAlign = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-self:stretch;
  margin: 20px 0px;
`;
export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px 10px;
`;
export const Text = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xxlarge};
    font-family: ${theme.font.family.Montserrat_bold};
    color:${theme.colors.primary};
  `}
`;
export const AngleInput = styled.input`
  min-height: 40px;
  min-width: 120px;
  border-radius: 4px;
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  font-size: 16px;
`;
