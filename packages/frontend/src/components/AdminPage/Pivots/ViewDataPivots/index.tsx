import { useContextData } from "hooks/useContextData";
import { useState } from "react";
import Farm from "utils/models/farm";
import Node from "utils/models/node";
import BoxPivots from "../BoxPivots";
import CreatePivot from "../CreatePivot";
import * as S from "./styles";

type vewDataPivotsProps = {
  farmData: Farm;
  nodeData: Node;
};
const ViewDataPivots = ({ farmData, nodeData }: vewDataPivotsProps) => {
  const [addPivot, setAddPivot] = useState(false);

  const { pivotList } = useContextData();
  return (
    <S.Container>
      <S.AddNode onClick={() => setAddPivot(true)}>
        Adicionar Pivot <S.IconAdd />
      </S.AddNode>
      {farmData ? (
        pivotList.map((pivot) => (
          <BoxPivots
            key={pivot.pivot_id}
            pivotData={pivot}
            farmRelation={farmData}
          />
        ))
      ) : (
        <p>Nenhum Pivô cadastrado</p>
      )}
      {addPivot && (
        <S.ContentAddNode>
          <CreatePivot farm={farmData} setAddNode={setAddPivot} />
        </S.ContentAddNode>
      )}
    </S.Container>
  );
};

export default ViewDataPivots;
