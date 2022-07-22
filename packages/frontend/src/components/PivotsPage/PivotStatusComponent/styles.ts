import styled from "styled-components";
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  //align-items:flex-start;
  justify-content: center;
`;
export const StatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  @media (max-width: 570px) {
    flex-direction: column;
  }
`;

export const StatusView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem ${({ theme }) => theme.spacings.small};
  @media (max-width: 1100px) {
    margin: 1rem ${({ theme }) => theme.spacings.xsmall};
  }
  @media (max-width: 570px) {
    margin: 0.5rem ${({ theme }) => theme.spacings.xxsmall};
  }
`;

export const StatusName = styled.h1`
  font-size: ${({ theme }) => theme.font.sizes.large};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};
  padding: ${({ theme }) => theme.spacings.xxsmall};

  @media (max-width: 1100px) {
    font-size: ${({ theme }) => theme.font.sizes.medium};
  }
  @media (max-width: 570px) {
    font-size: ${({ theme }) => theme.font.sizes.small};
  }
`;

export const ImageContainer = styled.div`
  width: 70px;
  height: 70px;

  @media (max-width: 1100px) {
    width: 60px;
    height: 60px;
  }
  @media (max-width: 570px) {
    width: 50px;
    height: 50px;
  }
`;

export const PivotCurrentPercent = styled.h1`
  font-size: ${({ theme }) => theme.font.sizes.xlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_light};
  text-align: center;

  @media (max-width: 1100px) {
    font-size: ${({ theme }) => theme.font.sizes.medium};
  }
  @media (max-width: 570px) {
    font-size: ${({ theme }) => theme.font.sizes.small};
  }
`;

export const LastUpdateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
  @media (max-width: 1100px) {
    max-width: 80%;
    flex-direction: column;
  }
`;
export const LastUpdate = styled.h1`
  font-size: ${({ theme }) => theme.font.sizes.large};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_light};
  text-align: center;

  @media (max-width: 1100px) {
    font-size: ${({ theme }) => theme.font.sizes.medium};
  }
  @media (max-width: 570px) {
    font-size: ${({ theme }) => theme.font.sizes.medium};
  }
`;
