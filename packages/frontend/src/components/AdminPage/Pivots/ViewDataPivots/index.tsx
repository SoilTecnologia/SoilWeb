import Farm from "utils/models/farm";
import Node from "utils/models/node";
import BoxPivots from "../BoxPivots";
import * as S from "./styles";

type vewDataPivotsProps = {
  farmData: Farm;
  nodeData: Node;
};
const ViewDataPivots = ({ farmData, nodeData }: vewDataPivotsProps) => (
  <S.Container>
    <S.AddNode>
      Adicionar Pivot <S.IconAdd />
    </S.AddNode>
    {farmData.pivots ? (
      farmData.pivots.map((pivot) => (
        <BoxPivots
          key={pivot.pivot_id}
          pivotData={pivot}
          farmRelation={farmData}
        />
      ))
    ) : (
      <p>Nenhum Pivô cadastrado</p>
    )}
  </S.Container>
);

export default ViewDataPivots;
