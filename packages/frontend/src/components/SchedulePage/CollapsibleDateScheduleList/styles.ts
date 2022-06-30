import styled, { css } from "styled-components";
export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items:center;
    width: 100%;
    transition: all 0.3s linear;
  `}
`;
export const ScheduleListButton = styled.button`
 ${({ theme }) => css`
    display: flex;
    width:60%;
    align-items:center;
    justify-content:center;
    padding: ${theme.spacings.xxsmall} ${theme.spacings.small};
    background: linear-gradient(
      ${theme.colors.primary} 80%,
      ${theme.colors.primary_gradient} 100%
    );
    transition: all 0.3s linear;
    border-radius: 1.5rem;
    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  `}
`;
export const Text = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xxlarge};
    font-family: ${theme.font.family.Montserrat_bold};
    color: ${theme.colors.secondary};
  `}
`;
export const ScheduleListWrapper = styled.h1`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  `}
`;
