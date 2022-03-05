import styled, { css } from "styled-components";
import { FaEllipsisV } from "react-icons/fa";
type modalVisible = {
  modalOptionUser: boolean;
};

export const Container = styled.div<modalVisible>`
  ${({ theme, modalOptionUser }) => css`
     position: relative;
    width: 68rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${theme.spacings.xxsmall} 0};
    background: ${theme.colors.primary};
    padding: ${theme.spacings.small} ;

    border-radius: 0.9rem;

    transition: all .3s linear;
    ${
      modalOptionUser &&
      css`
        pointer-events: none;
      `
    }

    &:hover{
      cursor: pointer;
      opacity: 0.85;
    }

  `}
`;
export const ContentData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const UserName = styled.h4`
  color: ${({ theme }) => theme.colors.secondary};
`;
export const FarmUser = styled(UserName)`
  margin-top: 1.4rem;
`;
export const RoleUser = styled(FarmUser)``;
export const IconMenu = styled(FaEllipsisV)`
  position: absolute;
  top: 10px;
  right: 10px;
`;
export const ContentModalOptionUser = styled.div<modalVisible>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.85);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 0.9rem;

  ${({ modalOptionUser }) =>
    modalOptionUser &&
    css`
      pointer-events: all;
    `}

  &:hover {
    cursor: default;
  }
`;
