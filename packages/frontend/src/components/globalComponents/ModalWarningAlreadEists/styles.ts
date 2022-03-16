import { FaRegTimesCircle } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import styled, { css } from "styled-components";

export const Container = styled.div`
  ${({ theme }) => css``}
`;
export const ModalAlreaExists = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primary};
`;
export const IconClose = styled(FaRegTimesCircle)`
  position: absolute;
  top: 1rem;
  right: 1rem;

  color: ${({ theme }) => theme.colors.cancel};
  font-size: 2.6rem;
`;
export const ContentTextModalInfo = styled.div`
  width: max-content;
  height: max-content;
  padding: 6rem;

  border-radius: 1rem;

  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;
export const AlertMessage = styled.div`
  margin-bottom: 1.2rem;
`;
export const SubAlert = styled.div``;
export const IconAttention = styled(RiErrorWarningLine)`
  color: ${({ theme }) => theme.colors.cancel};
  font-size: 4rem;

  margin-bottom: 2.4rem;
`;
