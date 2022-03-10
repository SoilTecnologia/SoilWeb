import styled, { css } from "styled-components";
import { RiErrorWarningLine } from "react-icons/ri";

export const Container = styled.div`
  ${({ theme }) => css``}
`;
export const ContentModal = styled.div`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin-bottom: 7rem;

    background: ${theme.colors.primary};
    padding: ${theme.spacings.small} ${theme.spacings.xxsmall};
    border-radius: 2rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;

    z-index: 100;
  `}
`;
export const IconAttention = styled(RiErrorWarningLine)`
  color: ${({ theme }) => theme.colors.cancel};
  font-size: 4rem;
`;
