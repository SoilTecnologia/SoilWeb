import * as S from "./styles";
import { useState } from "react";

import ViewDataNode from "components/AdminPage/Nodes/ViewDataNode";
import Farm from "utils/models/farm";
import { useContextActionCrud } from "hooks/useActionsCrud";

type FarmProps = {
  farmData: Farm;
};
const ViewDataFarms = ({ farmData }: FarmProps) => {
  //Contexts
  const { getAllNodes } = useContextActionCrud();

  //States
  const [nodesVisible, setNodesVisible] = useState(false);

  const viewDataNodes = () => {
    if (!nodesVisible) {
      getAllNodes(farmData.farm_id);
      setNodesVisible(true);
    } else {
      setNodesVisible(false);
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
        <S.NodeName onClick={viewDataNodes}>
          Nodes <S.IconDown />
        </S.NodeName>
        {nodesVisible && <ViewDataNode farmData={farmData} />}
      </S.ContentPivotsNodes>
    </S.Container>
  );
};

export default ViewDataFarms;
