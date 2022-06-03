import { RiErrorWarningLine } from "react-icons/ri";
import styled, { css } from "styled-components";
import { ImArrowLeft2 } from "react-icons/im";
import Link from 'next/link'
import { FaRegTimesCircle } from "react-icons/fa";
import Buttons from 'components/globalComponents/Buttons';




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
  background: transparent;
`;

export const ContentForm = styled.div`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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
    font-style: bold;
  `}
`;

export const IconAttention = styled(RiErrorWarningLine)`
  color: ${({ theme }) => theme.colors.cancel};
  font-size: 4rem;
`;

export const AlertText = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    font-size: 1.5rem;
  `}
`
export const ContentFormSignUp = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const LoginBack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
export const Button = styled(Buttons)`
  text-align: end;
  padding: 0.6rem 1.2rem 5rem 1.2rem;
`;

export const FullContent = styled.div` 
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
`

export const IconClosed = styled(FaRegTimesCircle)`
  position: absolute;
  top: 0.6rem;
  right: 1.5rem;
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.cancel};

  &:hover {
    opacity: 0.7;
  }
`;