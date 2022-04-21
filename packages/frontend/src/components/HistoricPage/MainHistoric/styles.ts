import styled, {css} from "styled-components";
import { ImArrowLeft2 } from "react-icons/im";
import { RiRoadMapLine } from "react-icons/ri";
import Link from "next/link";


export const Container =styled.div`
 ${({theme})=> css`
  display: flex;
  width:100vw;
  min-height:100vh;
  flex-direction:column;
  background-color:${theme.colors.secondary};
  `}
`;

export const ButtonsView = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:space-evenly;
  margin: 30px 210px;
`;

export const Button= styled(Link)``
export const ButtonAnchor= styled.a`
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:row;
  padding:1.5rem ${({theme})=>theme.spacings.xlarge};
  background: linear-gradient( ${({theme})=>theme.colors.primary} 90%, ${({theme})=>theme.colors.primary_gradient} 100% );
  box-shadow: 5px 5px 15px gray;
  transition: all .3s linear;
  border-radius: 1.5rem;

  &:hover{
    cursor: pointer;
    opacity: 0.85;
  }
`;

export const Text=styled.h1`
  font-size:${({theme})=>theme.font.sizes.xxlarge};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_bold};
`;

export const BackIcon = styled(ImArrowLeft2)`
  font-size:${({theme})=>theme.font.sizes.xxlarge};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_bold};
`
export const MapIcon = styled(RiRoadMapLine)`
  font-size:${({theme})=>theme.font.sizes.xxlarge};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_bold};
`
