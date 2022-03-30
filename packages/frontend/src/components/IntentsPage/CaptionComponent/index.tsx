import * as S from "./styles";

const CaptionComponent = () => (
  <S.Container>
    <S.Text>
      Legenda:
    </S.Text>

    <S.CaptionWrapper>
      <S.CaptionAlignment>

        <S.WetDot />
        <S.Text>
          Ligado com água
        </S.Text>

      </S.CaptionAlignment>
      <S.CaptionAlignment>

        <S.DryDot />
        <S.Text>
          Ligado sem água
        </S.Text>

      </S.CaptionAlignment>

    </S.CaptionWrapper>
    <S.CaptionWrapper>
      <S.CaptionAlignment>

        <S.OffDot />
        <S.Text>
          Desligado
        </S.Text>

      </S.CaptionAlignment>
      <S.CaptionAlignment>

        <S.OfflineDot />
        <S.Text>
          Offline
        </S.Text>

      </S.CaptionAlignment>

    </S.CaptionWrapper>



  </S.Container>
);

export default CaptionComponent;
