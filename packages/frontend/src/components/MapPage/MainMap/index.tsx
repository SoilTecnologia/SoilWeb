import * as S from "./styles";
import Map, { Layer, Source, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useContextUserData } from "hooks/useContextUserData";
import { useContextData } from "hooks/useContextData";
import theme from "styles/theme";
import Router from "next/router";
import MapComponent from "../MapComponent";
import { useState } from "react";

const MainMap = () => {
  const { farm } = useContextUserData();
  const { pivotMapList } = useContextData();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((oldState) => !oldState);
  };

  return (
    <S.Container>
      <S.ButtonsContainer>
        <S.FarmsButton href="/farms">
          <S.FarmsButtonAnchor>
            <S.BackIcon />
            <S.FarmButtonText>Fazendas</S.FarmButtonText>
          </S.FarmsButtonAnchor>
        </S.FarmsButton>

        <S.PivotsButton href="/pivots">
          <S.PivotsButtonAnchor>
            <S.ListIcon />
            <S.PivotButtonText>Pivôs</S.PivotButtonText>
          </S.PivotsButtonAnchor>
        </S.PivotsButton>
      </S.ButtonsContainer>

      <S.CaptionContainer onClick={handleToggle}>
        <S.CaptionText>Legenda</S.CaptionText>

        {isOpen && (
          <>
            <S.CaptionRowAlign>
              <S.WetDot />
              <S.CaptionText>Ligado com água</S.CaptionText>
            </S.CaptionRowAlign>

            <S.CaptionRowAlign>
              <S.DryDot />
              <S.CaptionText>Ligado sem água</S.CaptionText>
            </S.CaptionRowAlign>

            <S.CaptionRowAlign>
              <S.OffDot />
              <S.CaptionText>Desligado</S.CaptionText>
            </S.CaptionRowAlign>

            <S.CaptionRowAlign>
              <S.OfflineDot />
              <S.CaptionText>Offline</S.CaptionText>
            </S.CaptionRowAlign>
          </>
        )}
      </S.CaptionContainer>

      <MapComponent />
    </S.Container>
  );
};

export default MainMap;
