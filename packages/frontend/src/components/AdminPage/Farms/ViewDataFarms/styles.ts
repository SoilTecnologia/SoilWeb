import { FaAngleDown } from "react-icons/fa";
import styled, { css } from "styled-components";

export const Container = styled.div`
  ${({ theme }) => css`
    height: max-content;
    background: ${theme.colors.primary};
    padding: ${theme.spacings.small} 4rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `}
`;
export const ContentFullData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
export const ContentData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const FarmName = styled.p`
  color: ${({ theme }) => theme.colors.offline};

  span {
    color: ${({ theme }) => theme.colors.secondary};
    margin-left: 1.8rem;
  }
`;
export const FarmCity = styled(FarmName)``;
export const Longitude = styled(FarmName)``;
export const Latitude = styled(FarmName)``;
export const ContentPivotsNodes = styled.div`
  height: max-content;
`;

export const IconDown = styled(FaAngleDown)``;
export const NodeName = styled.h3`
  margin-top: 1.4rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.offline};

  &:hover {
    cursor: pointer;
    opacity: 0.7;
    padding: 0.4rem 1rem;
  }
`;
