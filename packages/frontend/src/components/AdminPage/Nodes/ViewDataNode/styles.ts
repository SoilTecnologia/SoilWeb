import styled from "styled-components";
import { GrAdd } from "react-icons/gr";

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
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;
export const IconAdd = styled(GrAdd)``;
export const ContentAddNode = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;
