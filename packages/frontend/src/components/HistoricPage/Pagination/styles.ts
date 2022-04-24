import styled, { css } from "styled-components";
export const Container = styled.div`
  ${({ theme }) => css`
    display:flex;
    flex-direction:row;
    align-content:center;
    justify-content:center;
    margin:15px;
  `}
`;
export const PageIndicatorHighlight=styled.div`
${({ theme }) => css`
  display:flex;
  height:30px;
  width:30px;
  margin:0 5px;
  border-radius:100%;
  background-color:${theme.colors.primary};
  align-content:center;
  justify-content:center;

  `}
`;
export const SelectedPageIndicator = styled.u`
${({ theme }) => css`
  transition: all .3s linear;
  color:${theme.colors.secondary};
  &:hover{
    cursor: pointer;
    opacity: 0.85;
    }
  `}
`;
export const UnselectedPageIndicator = styled.a`
  ${({ theme }) => css`
    transition: all .3s linear;

    margin:0 5px;
    &:hover{
      cursor: pointer;
      opacity: 0.85;
    }
  `}
`;
export const Alignment = styled.div`
  display:flex;
  flex-direction:row;
  align-content:center;
  justify-content:center;

`

