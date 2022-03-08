import styled from "styled-components";
import { GrAdd } from "react-icons/gr";
import { FaAngleDown } from "react-icons/fa";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const AddNode = styled.button`
  background: transparent;
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  margin: 1rem 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.6rem;
  &:hover {
    background: ${({ theme }) => theme.colors.primary_gradient};
    cursor: pointer;
  }
`;
export const IconAdd = styled(GrAdd)``;
export const ContentAddNode = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.colors.primary};
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;
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
export const ContentNodes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: : center;
`;
