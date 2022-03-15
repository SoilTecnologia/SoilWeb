import styled, { css } from "styled-components";
export const Container = styled.main``;
type isActiveOptionUser = {
  isActive: boolean;
};
export const ContentTittle = styled.div`
  height: 13vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

export const OptionUser = styled.button<isActiveOptionUser>`
  ${({ theme, isActive }) => css`
    position: relative;
    width: max-content;
    font-size: ${theme.font.sizes.xxlarge};
    letter-spacing: 0.3rem;
    color: ${theme.colors.light};
    background: transparent;
    padding: 0.4rem 2rem;
    margin: 0 5rem;
    border-radius: 1rem;
    transition: all 0.3s linear;

    &:hover {
      cursor: pointer;
      background: ${theme.colors.primary_gradient};
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

    border-radius: 0.4rem;

    background: ${theme.colors.secondary};
    z-index: 10;
  `}
`;
export const OptionCreateUser = styled.button`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    background: ${theme.colors.secondary};

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
export const ContentOption = styled.div`
  width: inherit;
  min-height: 87vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
