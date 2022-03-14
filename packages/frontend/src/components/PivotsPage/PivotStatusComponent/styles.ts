import styled from "styled-components";
export const Container =styled.div`
  display:flex;
  flex-direction:column;
  width:max-content;
  align-items:flex-start;
`;
export const StatusWrapper = styled.div`
  display:flex;
  flex-direction:row;
`;

export const StatusView = styled.div`
  display:flex;
  flex-direction:column;
  margin: 2rem ${({theme})=>theme.spacings.small};
`;

export const StatusName = styled.h1`
  font-size:${({theme})=>theme.font.sizes.large};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_bold};
  font-weight:bold;
`;

export const ImageContainer= styled.div`
  width:70px;
  height:70px;
`;

export const PivotCurrentPercent= styled.h1`
  font-size:${({theme})=>theme.font.sizes.large};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_light};
`;

export const LastUpdateWrapper =styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
`;
export const LastUpdate = styled.h1`
  font-size:${({theme})=>theme.font.sizes.large};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_light};
`;
