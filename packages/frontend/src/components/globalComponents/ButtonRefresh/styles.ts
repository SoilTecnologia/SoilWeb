import styled, { css } from "styled-components";
import { RiErrorWarningLine } from "react-icons/ri";
import { BiRefresh } from "react-icons/bi";

export const ContentModal = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.81);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconAttention = styled(RiErrorWarningLine)`
  color: ${({ theme }) => theme.colors.cancel};
  font-size: 4rem;
`;

export const IconRefresh = styled(BiRefresh)`
  font-size: ${({ theme }) => theme.font.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const RefreshButton = styled.button`
  ${({ theme }) => css`
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 50px;
    right: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(
      ${theme.colors.primary} 90%,
      ${theme.colors.primary_gradient} 100%
    );
    box-shadow: 5px 5px 15px gray;
    transition: all 0.3s linear;
    border-radius: 25px;

    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  `}
`;
