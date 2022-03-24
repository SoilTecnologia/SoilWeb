import styled from "styled-components";

export const Container = styled.div`
  height: 14vh;
  background: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;
export const TextContainer = styled.div`
  width: 100%;

  margin-left: -6rem;
  display: flex;
  height: 14vh;
  align-self: center;
  align-items: center;
  justify-content: center;
`;
export const Text = styled.h1`
  font-size: ${({ theme }) => theme.font.sizes.xxbiglarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Poppins};
  letter-spacing: 0.3rem;
`;
export const ContentLogout = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
