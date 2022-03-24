import { RiErrorWarningLine } from "react-icons/ri";
import styled, { css } from "styled-components";

export const Container = styled.div`
  width: 40vw;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const WrapperModalAndForm = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  background: transparent;
`;
export const ContentForm = styled.div`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin-bottom: 7rem;

    background: ${theme.colors.secondary};
    padding: ${theme.spacings.small} ${theme.spacings.xxsmall};
    border-radius: 2rem;
  `}
`;
export const ContentModal = styled(ContentForm)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;
export const ContentLogo = styled.div`
  width: 13rem;
`;
export const TextTech = styled.h3`
  ${({ theme }) => css`
    color: ${theme.colors.dark};
<<<<<<< HEAD
    font-style: bold;
=======
>>>>>>> develop
  `}
`;

export const IconAttention = styled(RiErrorWarningLine)`
  color: ${({ theme }) => theme.colors.cancel};
  font-size: 4rem;
`;
