import styled, { css } from "styled-components";
export const Container = styled.div`
  width: inherit;
  min-height: 87vh;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const ContentModal = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
`;
