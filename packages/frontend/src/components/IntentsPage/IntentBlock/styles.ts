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

export const MapStyle= styled.div`
${({theme})=>css`
  height:500px;
  width:500px;
  background:black;
  margin:${theme.spacings.small};
`}
`;

export const Circle=styled.button`
  ${({theme})=>css`
  height:100px;
  width:100px;
  border-radius:50%;
  background:black;

`}
`;



export const CaptionContainer=styled.div`
${({theme})=>css`
  display:flex;
  width:100%;
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



