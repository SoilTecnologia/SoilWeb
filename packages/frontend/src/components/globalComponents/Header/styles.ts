import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 14rem;
  background: ${({ theme }) => theme.colors.primary};
  flex-direction: row;
`;
export const ChildrenContainer = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  margin: 0 30px;
`;
export const TextContainer = styled.div`
  display: flex;
  height: 14rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

export const LastUpdateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const LastUpdateText = styled.h1`
  font-size: ${({ theme }) => theme.font.sizes.xlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};
  font-weight: bold;
  padding: ${({ theme }) => theme.spacings.xxsmall};
`;

export const SubText = styled.h2`
  font-size: ${({ theme }) => theme.font.sizes.large};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_light};
`;
