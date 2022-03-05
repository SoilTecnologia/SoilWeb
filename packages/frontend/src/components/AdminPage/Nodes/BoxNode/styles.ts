import styled, { css } from "styled-components";
import { FaAngleDown } from "react-icons/fa";

export const Container = styled.div`
  ${({ theme }) => css``}
`;
export const ContentPivotsNodes = styled.div`
  height: max-content;
`;
export const PivotName = styled.h3`
  margin-top: 1.4rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.offline};

  &:hover {
    cursor: pointer;
    opacity: 0.7;
    padding: 0.4rem 1rem;
  }
`;
export const IconDown = styled(FaAngleDown)``;
export const NodeName = styled.p``;
