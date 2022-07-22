import styled, { css } from "styled-components";
import { ImArrowLeft2 } from "react-icons/im";
import { RiRoadMapLine, RiErrorWarningLine } from "react-icons/ri";
import { BiRefresh } from "react-icons/bi";

import Link from "next/link";

export const Container = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  align-self:center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const Grid = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  row-gap: 20px;

  @media(max-width: 1100px) {
    display: flex;
    flex-direction: column;
    grid-template-columns: 0;
    row-gap: 0px;
  }
`;
export const ButtonsView = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-around;
  margin: 30px 20px;

  @media(max-width: 570px) {
    flex-direction: column;
    justify-content: center;
    align-items:center;
    align-self:center;
  }
`;
export const AnchorButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 1.5rem ${({ theme }) => theme.spacings.xlarge};
  margin: 1.5rem ${({ theme }) => theme.spacings.xlarge};
  background: linear-gradient(
    ${({ theme }) => theme.colors.primary} 90%,
    ${({ theme }) => theme.colors.primary_gradient} 100%
  );
  box-shadow: 5px 5px 15px gray;
  transition: all 0.3s linear;
  border-radius: 1.5rem;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;
export const Button = styled(Link)``;

export const Text = styled.h1`
  font-size: ${({ theme }) => theme.font.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};

  @media(max-width: 1100px) {
    font-size: ${({ theme }) => theme.font.sizes.xlarge};
  }
  @media(max-width: 570px) {
    font-size: ${({ theme }) => theme.font.sizes.large};
  }
`;

export const BackIcon = styled(ImArrowLeft2)`
  font-size: ${({ theme }) => theme.font.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};

  @media(max-width: 1100px) {
    font-size: ${({ theme }) => theme.font.sizes.xlarge};
  }
  @media(max-width: 570px) {
    font-size: ${({ theme }) => theme.font.sizes.large};
  }
`;
export const MapIcon = styled(RiRoadMapLine)`
  font-size: ${({ theme }) => theme.font.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};

  @media(max-width: 1100px) {
    font-size: ${({ theme }) => theme.font.sizes.xlarge};
  }
  @media(max-width: 570px) {
    font-size: ${({ theme }) => theme.font.sizes.large};
  }
`;
