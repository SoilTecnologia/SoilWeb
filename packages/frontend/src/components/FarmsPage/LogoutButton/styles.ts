import styled, {css} from "styled-components";
import { ImArrowLeft2 } from "react-icons/im";
export const Button =styled.button`
${({theme})=> css`
  display:flex;
  align-self:center;
  align-items:center;
  justify-content:center;
  flex-direction:row;
  background:${theme.colors.secondary};
  padding: 5px ${theme.spacings.xxsmall};
  border-radius:10px;
`}
`;
export const Icon = styled(ImArrowLeft2)`
${({theme})=> css`
  font-size:${theme.font.sizes.xbiglarge};
  color:${theme.colors.primary};
  `}
`;
export const Text = styled.h1`
${({theme})=> css`
  font-size:${theme.font.sizes.xbiglarge};
  color:${theme.colors.primary}
  `}
`;
