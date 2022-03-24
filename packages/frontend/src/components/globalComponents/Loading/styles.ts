import styled from "styled-components";

export const LoadContent = styled.div`
  width: 100vw;
  height: 100vh;
  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ContentData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 2rem 4rem;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 2rem;
`;
export const TextLoading = styled.h1`
  margin-top: 4rem;
  color: ${({ theme }) => theme.colors.primary};
`;
