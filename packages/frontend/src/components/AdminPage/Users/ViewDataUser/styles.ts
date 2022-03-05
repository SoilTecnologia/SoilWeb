import styled, { css } from "styled-components";
import { GrAdd } from "react-icons/gr";

export const Container = styled.div`
  margin: auto auto;
  width: 100%;
  /* min-height: 45vh;
  max-height: max-content; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.colors.primary};
  border: 0.1rem solid rgba(0, 0, 0, 0.7);
`;
export const Name = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  font-size: 2.6rem;
  margin-bottom: 1.4rem;
`;
export const DataUser = styled.div`
  width: inherit;
  padding: 1rem 3rem;
`;
export const Farms = styled.div``;
export const Pivots = styled.div``;
export const TabName = styled.p`
  width: max-content;
  padding: 1rem 2rem 1rem 0.5rem;
  border-radius: 0.4rem;
  color: ${({ theme }) => theme.colors.secondary};
`;
export const NotItemFind = styled.p``;
export const ContentDataUser = styled.div`
  ${({ theme }) => css`
    position: relative;
    min-width: 50vw;
    min-height: 87vh;
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
export const AddFarm = styled(TabName)`
  transition: all 0.4s linear;
  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.primary_gradient};
  }
`;
export const IconAdd = styled(GrAdd)``;
export const ContentFarm_Add = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
