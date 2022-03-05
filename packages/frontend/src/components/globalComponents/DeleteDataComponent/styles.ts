import styled from "styled-components";

export const TextDeleteUser = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
`;
export const ContentOptionsDelete = styled.div`
  display: flex;
  align-items: space-around;
  justify-content: space-between;
`;
export const CancelDelete = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.cancel};
  margin-right: 2rem;
  padding: 0.5rem 1.3rem;
  pointer-events: all;

  font-size: 1.6rem;
  transition: all 0.3s linear;
  border-radius: 0.3rem;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.secondary};
  }
`;
export const ConfirmDelete = styled(CancelDelete)`
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 2rem;
`;
