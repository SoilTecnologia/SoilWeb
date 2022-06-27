import styled, { css } from "styled-components";

import { RiDeleteBin5Line, RiEdit2Fill } from "react-icons/ri";
export const Card = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: 50%;
    background: linear-gradient(
      ${theme.colors.primary} 80%,
      ${theme.colors.primary_gradient} 100%
    );
    margin: 10px;
    align-items: center;
    border-radius: 22.5px;
    padding: 15px 0px;
  `}
`;
export const DeleteButton = styled.button`
  ${({ theme }) => css`
    display: flex;
    padding: ${theme.spacings.xxsmall} ${theme.spacings.small};
    background: linear-gradient(${theme.colors.cancel} 90%, darkred 100%);
    transition: all 0.3s linear;
    border-radius: 1.5rem;
    align-items: center;
    justify-content: center;

    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  `}
`;
export const EditButton = styled.button`
  ${({ theme }) => css`
    display: flex;
    padding: ${theme.spacings.xxsmall} ${theme.spacings.small};
    background: ${theme.colors.secondary};

    transition: all 0.3s linear;
    border-radius: 1.5rem;
    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  `}
`;
export const ButtonText = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    color: ${theme.colors.secondary};
    font-family: ${theme.font.family.Montserrat_bold};
  `}
`;
export const EditButtonText = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    color: ${theme.colors.primary};
    font-family: ${theme.font.family.Montserrat_bold};
  `}
`;
export const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  `}
`;
export const StatusWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-evenly;
  `}
`;
export const GlobalWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `}
`;
export const Text = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    color: ${theme.colors.secondary};
    margin: ${theme.spacings.xxsmall};
    font-family: ${theme.font.family.Montserrat_bold};
  `}
`;
export const Status = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
  `}
`;
export const ImageContainer = styled.div`
  ${({ theme }) => css`
    width: 50px;
    height: 50px;
    margin: 0 ${theme.spacings.xxsmall};
  `}
`;

export const HeaderText = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    color: ${theme.colors.secondary};
    font-family: ${theme.font.family.Montserrat_bold};
  `}
`;

export const DeleteIcon = styled(RiDeleteBin5Line)`
  font-size: ${({ theme }) => theme.font.sizes.medium};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};
`;
export const EditIcon = styled(RiEdit2Fill)`
  font-size: ${({ theme }) => theme.font.sizes.medium};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};
`;
