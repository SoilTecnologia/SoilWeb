import styled, { css } from "styled-components";

type modalVisible = {
  modalOptionUser: boolean;
};
export const Container = styled.div``;
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
export const OptionPutUser = styled.button`
  ${({ theme }) => css`
    width: 80%;
    background: transparent;
    color: ${theme.colors.secondary};
    font-size: ${theme.font.sizes.small};
  `}
`;
export const OptionDeleteUser = styled(OptionPutUser)`
  margin-top: 0.6rem;
`;
