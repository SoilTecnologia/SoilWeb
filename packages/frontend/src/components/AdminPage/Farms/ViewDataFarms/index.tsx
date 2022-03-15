import ViewDataPivots from "components/AdminPage/Pivots/ViewDataPivots";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useState } from "react";
import Farm from "utils/models/farm";
import * as S from "./styles";

type FarmProps = {
  farmData: Farm;
};
const ViewDataFarms = ({ farmData }: FarmProps) => {
  //Contexts
  const { getAllNodes } = useContextActionCrud();

  //States
  const [pivotsvisible, setPivotVisible] = useState(false);

  const viewDataPivots = () => {
    if (!pivotsvisible) {
      getAllNodes(farmData.farm_id);
      setPivotVisible(true);
    } else {
      setPivotVisible(false);
    }
  };

  return (
    <S.Container>
      <S.ContentData>
        <S.FarmName>
          Fazenda: <span>{farmData.farm_name}</span>
        </S.FarmName>
        <S.FarmCity>
          Cidade: <span>{farmData.farm_city}</span>
        </S.FarmCity>
      </S.ContentData>

      <S.ContentData>
        <S.Latitude>
          Latitude: <span>{farmData.farm_lat.toString()}</span>
        </S.Latitude>
        <S.Longitude>
          Longitude: <span>{farmData.farm_lng.toString()}</span>
        </S.Longitude>
      </S.ContentData>

      <S.ContentPivotsNodes>
        <S.NodeName onClick={viewDataPivots}>
          Pivots <S.IconDown />
        </S.NodeName>
        {pivotsvisible && <ViewDataPivots farm={farmData} />}
      </S.ContentPivotsNodes>
    </S.Container>
  );
};

export default ViewDataFarms;
