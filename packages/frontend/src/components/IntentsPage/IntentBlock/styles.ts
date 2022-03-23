import { FaHistory } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import styled, {css} from "styled-components";


export const Container =styled.div`
  display: flex;
  flex-direction:row;
  justify-content:center;
`;
///left side
export const MapContainer = styled.div`
${({theme})=>css`
  display: flex;
  width:100%;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:${theme.spacings.xsmall};

`}
`;

export const Map= styled.div`
${({theme})=>css`
  height:500px;
  width:500px;
  margin:${theme.spacings.small};
`}
`;
export const CaptionContainer=styled.div`
${({theme})=>css`
  display:flex;
  height:100px;
  width:300px;
`}
`;


///right side
export const IntentContainer = styled.div`
${({theme})=>css`
  display: flex;
  width:100%;
  flex-direction:column;
  align-items:center;
  padding:${theme.spacings.xsmall};
  `}
`;



