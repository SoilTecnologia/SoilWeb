import * as S from "./styles";
import { useState } from "react";

import ViewDataNode from "components/AdminPage/Nodes/ViewDataNode";
import Farm from "utils/models/farm";

type FarmProps = {
  farmData: Farm;
};
const ViewDataFarms = ({ farmData }: FarmProps) => {
  const [nodesVisible, setNodesVisible] = useState(false);

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
        <S.Longitude>
          Longitude: <span>{farmData.farm_lng}</span>
        </S.Longitude>
        <S.Latitude>
          Latitude: <span>{farmData.farm_lng}</span>
        </S.Latitude>
      </S.ContentData>

      <S.ContentPivotsNodes>
        <S.NodeName onClick={() => setNodesVisible(!nodesVisible)}>
          Nodes <S.IconDown />
        </S.NodeName>
        {nodesVisible && <ViewDataNode farmData={farmData} />}
      </S.ContentPivotsNodes>
    </S.Container>
  );
};

export default ViewDataFarms;
