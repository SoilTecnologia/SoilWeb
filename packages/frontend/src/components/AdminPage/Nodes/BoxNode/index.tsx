import ViewDataPivots from "components/AdminPage/Pivots/ViewDataPivots";
import { useState } from "react";
import Farm from "utils/models/farm";
import Node from "utils/models/node";
import * as S from "./styles";

type boxNodeprops = {
  nodeData: Node;
  farmRelation: Farm;
};
const BoxNode = ({ nodeData, farmRelation }: boxNodeprops) => {
  const [pivotsVisible, setPivotVisible] = useState(false);

  return (
    <S.Container>
      <S.NodeName>NODE: {nodeData.node_name}</S.NodeName>
      <S.ContentPivotsNodes>
        <S.PivotName onClick={() => setPivotVisible(!pivotsVisible)}>
          Pivos <S.IconDown />
        </S.PivotName>
        {nodeData.pivots &&
          nodeData.pivots.map((pivot) => (
            <ViewDataPivots
              key={pivot.pivot_id}
              farmData={farmRelation}
              nodeData={nodeData}
            />
          ))}
      </S.ContentPivotsNodes>
    </S.Container>
  );
};

export default BoxNode;
