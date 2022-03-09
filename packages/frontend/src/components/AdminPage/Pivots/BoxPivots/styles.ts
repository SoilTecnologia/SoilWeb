import styled, { css } from "styled-components";
import { FaEllipsisV } from "react-icons/fa";

export const Container = styled.div`
  ${({ theme }) => css`
    position: relative;
    min-width: 55rem;
    margin: 1rem 0;
    padding: 1rem 3rem;
    background: ${theme.colors.primary_gradient};
    border-radius: 1rem;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  `}
`;
export const Name = styled.p`
  color: ${({ theme }) => theme.colors.offline};

  span {
    color: ${({ theme }) => theme.colors.secondary};
    margin-left: 1.2rem;
  }
`;
export const Latitude = styled(Name)``;
export const Longitude = styled(Name)``;
export const StartAngle = styled(Name)``;
export const EndAngle = styled(Name)``;
export const Radius = styled(Name)``;
export const LastCommunication = styled(Name)``;
export const Radio = styled(Name)``;
export const IconOption = styled(FaEllipsisV)`
  position: absolute;
  top: 1rem;
  right: 1rem;

  &:hover {
    cursor: pointer;
  }
`;
