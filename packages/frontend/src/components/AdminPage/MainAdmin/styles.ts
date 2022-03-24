import styled, { css } from "styled-components";

export const Container = styled.main``;
type isActiveOptionUser = {
  isActive: boolean;
};
export const ContentTittle = styled.div`
  height: 13vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: -3.4rem;
`;

export const OptionUser = styled.button<isActiveOptionUser>`
  ${({ theme, isActive }) => css`
    position: relative;
    width: max-content;
    height: max-content;
    font-size: ${theme.font.sizes.xxlarge};
    letter-spacing: 0.3rem;
    color: ${theme.colors.primary_gradient};
    padding: 0.4rem 3rem;
    margin: 0 2rem;
    border-radius: 1rem;
    transition: all 0.3s linear;
    background: ${isActive
      ? theme.colors.primary_gradient
      : theme.colors.secondary};
    color: ${isActive ? theme.colors.secondary : theme.colors.primary_gradient};
    border-radius: 1.4rem;

    &:hover {
      cursor: pointer;

      opacity: ${isActive ? 1 : 0.7};
    }
  `}
`;
export const OptionFarm = styled(OptionUser)``;

export const TabSelect = styled.div`
  ${({ theme }) => css`
    width: 100vw;
    min-height: 87vh;
    max-height: max-content;

    background: ${theme.colors.secondary};
  `}
`;

export const ContentOptionUser = styled.div`
  ${({ theme }) => css`
    position: absolute;
    bottom: 100;
    right: 0;
    left: 0;
    height: max-content;
    padding: 2rem 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-radius: 1rem;
    margin-top: 1.4rem;

    background: ${theme.colors.primary_gradient};
    z-index: 10;
  `}
`;
export const OptionCreateUser = styled.button`
  ${({ theme }) => css`
    color: ${theme.colors.secondary};
    background: transparent;

    padding: 0.6rem 1.2rem;
    transition: all 0.3s linear;
    &:hover {
      opacity: 0.7;
      font-size: 1.4rem;
    }
  `}
`;
export const ListUser = styled(OptionCreateUser)`
  margin-top: 2rem;
`;

export const ContentLogout = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
export const ContentOption = styled.div`
  width: inherit;
  min-height: 87vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
