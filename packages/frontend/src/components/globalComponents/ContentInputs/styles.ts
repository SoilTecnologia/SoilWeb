import styled, { css } from "styled-components";

type colorLabelProps = {
  colorLabel?: string;
};
export const Container = styled.div``;
export const Inputs = styled.input`
  ${({ theme }) => css`
    width: inherit;
    padding: ${theme.spacings.xsmall} ${theme.spacings.xsmall};
    font-size: 1.4rem;
    background: ${theme.colors.light};
    border-radius: 0.7rem;
    text-align: start;
    color: ${theme.colors.primary};
    transition: all 0.3s linear;
    ::placeholder {
      color: rgba(155, 155, 155, 0.95);
    }

    @media (min-width: ${theme.media.xmedium}) {
      font-size: ${theme.font.sizes.small};
    }
  `}
`;
export const ContentIconInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
export const Label = styled.label<colorLabelProps>`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0.5rem;
  color: ${({ theme, colorLabel }) =>
    colorLabel ? colorLabel : theme.colors.primary_gradient};
`;
