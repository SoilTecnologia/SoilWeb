import styled, { css } from "styled-components";
import { FaHistory } from "react-icons/fa";
import { RiRoadMapLine } from "react-icons/ri";

import Link from "next/link";

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    width: 100vw;
    min-height: 100vh;
    flex-direction: column;
    background-color: ${theme.colors.secondary};
  `}
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ScheduleButton = styled.button`
  ${({ theme }) => css`
    display: flex;
    width: 30%;
    align-self: center;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding: 1.5rem ${theme.spacings.xlarge};
    margin: 1.5rem ${theme.spacings.xlarge};
    background: linear-gradient(
      ${theme.colors.primary} 90%,
      ${theme.colors.primary_gradient} 100%
    );
    box-shadow: 5px 5px 15px gray;
    transition: all 0.3s linear;
    border-radius: 1.5rem;

    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  `}
`;

export const CurrentStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const StateText = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xxlarge};
    color: ${theme.colors.primary};
    font-family: ${theme.font.family.Montserrat_bold};
  `}
`;
export const CurrentStateWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
export const CurrentStateIcon = styled.img``;

export const ButtonsView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 30px;
`;
export const AnchorButton = styled.a`
  ${({ theme }) => css`
    display: flex;
    width: 30%;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding: 1.5rem ${theme.spacings.xxlarge};
    background: linear-gradient(
      ${theme.colors.primary} 90%,
      ${theme.colors.primary_gradient} 100%
    );
    box-shadow: 5px 5px 15px gray;
    transition: all 0.3s linear;
    border-radius: 1.5rem;

    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  `}
`;
export const Button = styled(Link)``;

export const ButtonText = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xxlarge};
    color: ${theme.colors.secondary};
    font-family: ${theme.font.family.Montserrat_bold};
    padding: 0 ${theme.spacings.xxsmall};
  `}
`;

export const Icon = styled.div`
  ${({ theme }) => css`
    svg {
      font-size: ${theme.font.sizes.xxlarge};
      color: ${theme.colors.secondary};
      font-family: ${theme.font.family.Montserrat_bold};
    }
  `}
`;

export const Text = styled.h1`
  font-size: ${({ theme }) => theme.font.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};
  margin: 0 1rem;
`;

export const MapIcon = styled(RiRoadMapLine)`
  font-size: ${({ theme }) => theme.font.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};
`;
export const ClockIcon = styled(FaHistory)`
  font-size: ${({ theme }) => theme.font.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};
`;

// export const Button = styled.button`
//   height:300px;
//   width:400px;
//   background:black;
// `
