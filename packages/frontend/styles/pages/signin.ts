import styled from 'styled-components';
import { ThemeType } from '../global';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const LoginBox = styled.div<{ theme: ThemeType }>`
  border-radius: 22.5px;
  background-color: ${({ theme }) => theme.colors.secondary};
  width: 70%;
  height: 60%;
`;

export const Logo = styled(Image)`
  padding: 300px;
  margin: 300px;
  border: 10px solid red;
`;

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 15px;
`;

export const InputIcon = styled(FontAwesomeIcon)<{ theme: ThemeType }>`
  padding: 10px;
  color: ${({ theme }) => theme.colors.primary};
  min-width: 50px;
  text-align: center;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  outline: none;
`;

export const LoginButton = styled.input`
  width: 240px;
  height: 45px;
  border: none;
  border-radius: 22.5px;
  font-family: 'Syncopate', 'serif';
  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  outline: 0px;
  box-shadow: ${(props) => props.theme.shadows.buttonPrimary};
`;
