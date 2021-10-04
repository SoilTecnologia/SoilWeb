import styled from 'styled-components';
import { ThemeType } from '../global';

export const Card3D = styled.div<{ theme: ThemeType }>`
  width: 240px;
  height: 45px;
  border: none;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  outline: 0px;
  box-shadow: ${(props) => props.theme.shadows.buttonPrimary};
`;
