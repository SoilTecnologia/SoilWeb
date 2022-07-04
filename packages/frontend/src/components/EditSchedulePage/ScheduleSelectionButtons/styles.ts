import styled, {css} from "styled-components";


export const Container=styled.div`
  flex-direction:row;
  display:flex;
  align-self:center;
`;

export const InicialState =styled.button`
  height: 100px;
  width: 100px;
  border-radius: 50%;
  align-self:center;
  margin:35px;
  flex-direction:row;
  animation: breath 0.2s linear normal forwards;
  box-shadow: 5px 5px 15px gray;
  @keyframes breath {
   0% { transform :scale(1.1,1.1) }
  100% { transform :scale(1,1) }
  }
`;
export const SelectedIntent =styled.button`

  height: 100px;
  width: 100px;
  border-radius: 50%;
  align-self:center;
  margin:35px;
  flex-direction:row;
  animation: breath-animation 0.2s linear normal forwards;
  box-shadow: 5px 5px 15px gray;

 @keyframes breath-animation {
   0% { transform :scale(1,1) }
  100% { transform :scale(1.3,1.3) }
  }


`;
export const UnselectedIntent =styled.button`

  height: 100px;
  width: 100px;
  border-radius: 50%;
  align-self:center;
  margin:35px;
  flex-direction:row;
  animation: reduce 0.2s linear normal forwards;
  box-shadow: 5px 5px 15px gray;
 @keyframes reduce {
   0% {
     transform :scale(1.3,1.3);
    filter: brightness(100%) }
  100% {
    transform :scale(1,1);
    filter: brightness(60%);
   }
  }


`;
