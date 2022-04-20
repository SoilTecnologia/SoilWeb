import styled, {css} from "styled-components";
import { ImArrowLeft2 } from "react-icons/im";
import {BsList}from "react-icons/bs";
import Link from "next/link";

export const Container =styled.div`
${({theme})=> css`
display:flex;
height:100%;
width:100%;

`}
`;

export const ButtonsContainer=styled.div`
  ${({theme})=> css`
    display:flex;
    width:100%;
    z-index:10;
    position:absolute;
    justify-content:space-around;
    top:20px;
  `}
`;
export const FarmsButton = styled(Link)`
`
export const FarmsButtonAnchor = styled.a`
 ${({theme})=> css`
  display:flex;
  padding: ${theme.spacings.xxsmall} ${theme.spacings.small};
  background:${theme.colors.primary} ;
  background: linear-gradient( ${theme.colors.secondary} 95%, black 100% );
  box-shadow: 5px 5px 15px black;
  transition: all .3s linear;
  border-radius: 1.5rem;
  justify-content:center;
  align-items:center;
  flex-direction:row;

  &:hover{
    cursor: pointer;
    opacity: 0.85;
  }
  `}
`

export const FarmButtonText = styled.h1`
 ${({theme})=> css`
  font-size:${theme.font.sizes.xxbiglarge};
  font-family:${theme.font.family.Montserrat_bold};
  color:${theme.colors.primary};
  margin:0px ${theme.spacings.xxsmall};


`}
`;

export const BackIcon = styled(ImArrowLeft2)`
${({theme})=> css`
  font-size:${theme.font.sizes.xxbiglarge};
  font-family:${theme.font.family.Montserrat_bold};
  color:${theme.colors.primary};

`}
`

export const ListIcon = styled(BsList)`
${({theme})=> css`
  font-size:${theme.font.sizes.xxbiglarge};
  font-family:${theme.font.family.Montserrat_bold};
`}
`;
export const PivotsButton = styled(Link)`
`
export const PivotsButtonAnchor = styled.a`
 ${({theme})=> css`
  display:flex;
  padding: ${theme.spacings.xxsmall} ${theme.spacings.small};
  background:${theme.colors.primary} ;
  background: linear-gradient( ${theme.colors.dry} 95%, black 100% );
  box-shadow: 5px 5px 15px black;
  transition: all .3s linear;
  border-radius: 1.5rem;
  justify-content:center;
  align-items:center;
  flex-direction:row;

  &:hover{
    cursor: pointer;
    opacity: 0.85;
  }
  `}
`
export const PivotButtonText = styled.h1`
 ${({theme})=> css`
  font-size:${theme.font.sizes.xxbiglarge};
  font-family:${theme.font.family.Montserrat_bold};
  margin:0px ${theme.spacings.xxsmall};
`}
`;


export const CaptionContainer=styled.button`
${({theme})=> css`
  display:flex;
  margin: 30px;
  padding:5px;
  bottom: 0;
  right: 0;
  z-index: 10;
  position: absolute;
  padding: ${theme.spacings.xxsmall} ${theme.spacings.small};
  background:${theme.colors.primary} ;
  background: linear-gradient( ${theme.colors.primary} 80%, ${theme.colors.primary_gradient} 100% );
  box-shadow: 5px 5px 15px black;
  transition: all .3s linear;
  border-radius: 1.5rem;
  justify-content:center;
  flex-direction:column;
  `}
`
export const CaptionText = styled.h1`
 ${({theme})=> css`
  font-size:${theme.font.sizes.xbiglarge};
  font-family:${theme.font.family.Montserrat_bold};
  color:${theme.colors.secondary};
  margin:5px ${theme.spacings.xxsmall};
  align-self:center;
`}
`

export const CaptionRowAlign=styled.div`
  display:flex;
  flex-direction:row;
  align-items:center;
`
export const WetDot = styled.div`
${({theme})=> css`
  height: ${theme.font.sizes.xlarge};
  width: ${theme.font.sizes.xlarge};
  background:${theme.colors.wet};
  border-radius:100%;
  `}
`
export const DryDot = styled.div`
${({theme})=> css`
  height: ${theme.font.sizes.xlarge};
  width: ${theme.font.sizes.xlarge};
  background:${theme.colors.dry};
  border-radius:100%;
  `}
`
export const OffDot = styled.div`
${({theme})=> css`
  height: ${theme.font.sizes.xlarge};
  width: ${theme.font.sizes.xlarge};
  background:${theme.colors.off};
  border-radius:100%;
  `}
`
export const OfflineDot = styled.div`
${({theme})=> css`
  height: ${theme.font.sizes.xlarge};
  width: ${theme.font.sizes.xlarge};
  background:${theme.colors.offline};
  border-radius:100%;
  `}
`

