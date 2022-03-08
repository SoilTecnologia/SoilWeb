import * as S from "./styles";
import { useState } from "react";

import ViewDataNode from "components/AdminPage/Nodes/ViewDataNode";
import Farm from "utils/models/farm";
import ViewDataPivots from "components/AdminPage/Pivots/ViewDataPivots";
import { useContextActionCrud } from "hooks/useActionsCrud";

type FarmProps = {
  farmData: Farm;
};
const ViewDataFarms = ({ farmData }: FarmProps) => {
  //Contexts
  const { getAllNodes, getAllPivots } = useContextActionCrud();

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

  const viewDataPivots = async () => {
    // if (!pivotsVisible) {
    //   await getAllPivots();
    // }
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
        <S.Longitude>
          Longitude: <span>{farmData.farm_lng}</span>
        </S.Longitude>
        <S.Latitude>
          Latitude: <span>{farmData.farm_lng}</span>
        </S.Latitude>
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
