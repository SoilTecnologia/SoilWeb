import { FaRegTimesCircle } from "react-icons/fa";
import styled, { css } from "styled-components";

type backProps = {
  background: string | undefined;
};
export const Container = styled.div`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;

    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  `}
`;
export const ContentDataUser = styled.div<backProps>`
  ${({ theme, background }) => css`
    position: relative;
    min-width: 50vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin-bottom: 7rem;

    background: ${background ? background : theme.colors.secondary};
    padding: ${theme.spacings.small} ${theme.spacings.xxsmall};
    border-radius: 2rem;
  `}
`;

export const IconClosed = styled(FaRegTimesCircle)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 3.4rem;
  color: ${({ theme }) => theme.colors.cancel};

  &:hover {
    opacity: 0.7;
  }
`;
