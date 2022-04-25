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
 ${({theme})=> css`
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:row;
  padding:1.5rem ${theme.spacings.xlarge};
  background: linear-gradient( ${theme.colors.primary} 90%, ${theme.colors.primary_gradient} 100% );
  box-shadow: 5px 5px 15px gray;
  transition: all .3s linear;
  border-radius: 1.5rem;

  &:hover{
    cursor: pointer;
    opacity: 0.85;
  }
  `}
`;

export const Text=styled.h1`
 ${({theme})=> css`
  font-size:${theme.font.sizes.xxlarge};
  color:${theme.colors.secondary};
  font-family:${theme.font.family.Montserrat_bold};
  `}
`;

export const BackIcon = styled(ImArrowLeft2)`
 ${({theme})=> css`
  font-size:${theme.font.sizes.xxlarge};
  color:${theme.colors.secondary};
  font-family:${theme.font.family.Montserrat_bold};
  `}
`;
export const MapIcon = styled(RiRoadMapLine)`
 ${({theme})=> css`
  font-size:${theme.font.sizes.xxlarge};
  color:${theme.colors.secondary};
  font-family:${theme.font.family.Montserrat_bold};
  `}
`;



export const DatePickerWrapper= styled.div`
  display:flex;
   flex-direction:row;
  justify-content:space-evenly;
  `;
export const DatePickerContainer=styled.div`
  display:flex;
  flex-direction:row;
  align-items:center;
`;

export const DatePickerTitle=styled.h1`
 ${({theme})=> css`
    text-overflow: ellipsis;
    font-size:${theme.font.sizes.xxlarge};
    color:${theme.colors.primary};
    font-family:${theme.font.family.Montserrat_bold};

  `}
`;

export const SearchButton=styled.button`
  ${({theme})=> css`
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:row;
    padding:1.5rem ${theme.spacings.xlarge};
    background: linear-gradient( ${theme.colors.primary} 90%, ${theme.colors.primary_gradient} 100% );
    box-shadow: 5px 5px 15px gray;
    transition: all .3s linear;
    border-radius: 1.5rem;

    &:hover{
      cursor: pointer;
      opacity: 0.85;
    }
  `}
`
export const SearchButtonText= styled.h1`
   ${({theme})=> css`
    text-overflow: ellipsis;
    font-size:${theme.font.sizes.large};
    color:${theme.colors.secondary};
    font-family:${theme.font.family.Montserrat_bold};

  `}

`;
