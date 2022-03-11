import styled, { css } from "styled-components";
import { FaEllipsisV } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";

export const Container = styled.div`
  position: relative;
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: ${theme.spacings.small} 0;
    background: ${theme.colors.primary};

    border-radius: 0.9rem;

    transition: all 0.3s linear;

    &:hover {
      cursor: pointer;
      opacity: 0.7;
    }
  `}
`;
export const ContentFarmInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-right: 7rem;
`;
export const ContentLocaleFarm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const City = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.light};
  `}
`;
export const State = styled(City)``;
export const SelectFarm = styled(City)``;
export const Farm = styled(City)``;

export const SelectOption = styled.div`
  width: max-content;
  padding: 0.5rem 2rem;
  border-radius: 0.7rem;
  color: ${({ theme }) => theme.colors.secondary};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const SelectEdit = styled.button`
  width: 9rem;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.primary_gradient};

  &:hover {
    color: ${({ theme }) => theme.colors.topbttprimary};
  }
`;
export const SelectEntries = styled(SelectEdit)`
  margin-top: 0.9rem;
`;
export const IconMenu = styled(FaEllipsisV)`
  position: absolute;
  top: 10px;
  right: 10px;
`;
export const ContentFarmUpdate = styled.div``;
export const ContentFull = styled.div``;
