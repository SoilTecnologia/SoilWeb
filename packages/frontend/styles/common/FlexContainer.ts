import styled from 'styled-components';

type Props = {
	width?:string;
  height: string;
};

const FlexContainer = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
	text-align: center;

  height: ${(props) => props.height};
	width: ${(props) => props.width ? props.width : '100%'}
`;

export default FlexContainer;
