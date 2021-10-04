import styled from 'styled-components';
import {ThemeType} from '../global';

export const Header = styled.div<{theme: ThemeType}>`
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	color: ${({theme}) => theme.colors.secondary};
	background-color: ${({theme}) => theme.colors.primary};
	height: 20vh;
`