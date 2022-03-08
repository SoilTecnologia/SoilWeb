import ViewDataPivots from "components/AdminPage/Pivots/ViewDataPivots";
import { useContextData } from "hooks/useContextData";
import { useState } from "react";
import Farm from "utils/models/farm";
import Node from "utils/models/node";
import BoxNode from "../BoxNode";
import CreateNode from "../CreateNode";
import * as S from "./styles";

type viewDataNodeProps = {
  farmData: Farm;
};
const ViewDataNode = ({ farmData }: viewDataNodeProps) => {
  const [addNode, setAddNode] = useState(false);

  const { nodeList } = useContextData();

  return (
    <S.Container>
      <S.AddNode onClick={() => setAddNode(true)}>
        Adicionar Node <S.IconAdd />
      </S.AddNode>
      <S.ContentNodes>
        {farmData ? (
          nodeList.map((node) => (
            <BoxNode
              key={node.node_id}
              nodeData={node}
              farmRelation={farmData}
            />
          ))
        ) : (
          <p>Nenhum Node cadastrado</p>
        )}
        {addNode && (
          <S.ContentAddNode>
            <CreateNode farm={farmData} setAddNode={setAddNode} />
          </S.ContentAddNode>
        )}
      </S.ContentNodes>
    </S.Container>
  );
};

export default ViewDataNode;
