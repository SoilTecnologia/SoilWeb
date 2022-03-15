import { useContextData } from "hooks/useContextData";
import { useState } from "react";
import Farm from "utils/models/farm";
import BoxPivots from "../BoxPivots";
import CreatePivot from "../CreatePivot";
import * as S from "./styles";

type vewDataPivotsProps = {
  farm: Farm;
};
const ViewDataPivots = ({ farm }: vewDataPivotsProps) => {
  const [addPivot, setAddPivot] = useState(false);

  const { pivotList } = useContextData();
  return (
    <S.Container>
      <S.AddNode onClick={() => setAddPivot(true)}>
        Adicionar Pivot <S.IconAdd />
      </S.AddNode>
      {pivotList.length > 0 ? (
        pivotList.map((pivot) => (
          <BoxPivots key={pivot.pivot_id} pivotData={pivot} />
        ))
      ) : (
        <p>Nenhum Pivô cadastrado</p>
      )}
      {addPivot && (
        <S.ContentAddNode>
          <CreatePivot setAddNode={setAddPivot} farm={farm} />
        </S.ContentAddNode>
      )}
    </S.Container>
  );
};

export default ViewDataPivots;
