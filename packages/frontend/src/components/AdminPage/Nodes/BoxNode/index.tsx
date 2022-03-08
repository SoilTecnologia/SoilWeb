import ViewDataPivots from "components/AdminPage/Pivots/ViewDataPivots";
import BoxOptions from "components/globalComponents/BoxOptions";
import { ContentModalOptionUser } from "components/globalComponents/BoxOptions/styles";
import DeleteDataComponent from "components/globalComponents/DeleteDataComponent";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useState } from "react";
import Farm from "utils/models/farm";
import Node from "utils/models/node";
import * as S from "./styles";

type boxNodeprops = {
  nodeData: Node;
  farmRelation: Farm;
};
const BoxNode = ({ nodeData, farmRelation }: boxNodeprops) => {
  //Contexts

  const { getAllPivots, deleteNode } = useContextActionCrud();

  //States
  const [pivotsVisible, setPivotVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeletedNode, setIsDeletedNode] = useState(false);

  const handleSetModalVisible = () => {
    setModalVisible(false);
  };

  const callbackPut = () => {
    console.log("");
  };

  const okDeleteNode = () => {
    setIsDeletedNode(false);
    deleteNode(nodeData.node_id, farmRelation);
  };

  const notDeleteNode = () => {
    setIsDeletedNode(false);
  };

  const handleDeleteNode = () => {
    setModalVisible(false);
    setIsDeletedNode(true);
  };

  const viewDataPivots = async () => {
    if (!pivotsVisible) {
      await getAllPivots(nodeData.node_id);
      setPivotVisible(true);
    } else {
      setPivotVisible(false);
    }
  };
  return (
    <S.Container onClick={viewDataPivots}>
      <S.IconMenu onClick={() => setModalVisible(true)} />
      <S.NodeName>
        NODE: <span>{nodeData.node_name}</span>
      </S.NodeName>
      <S.IsGprs>
        GRPS: <span>{` ${nodeData.is_gprs ? "SIM" : "NÃO"}`}</span>
      </S.IsGprs>
      {nodeData.gateway && (
        <S.Gateway>
          Gateway: <span>{nodeData.gateway}</span>{" "}
        </S.Gateway>
      )}
      {modalVisible && (
        <BoxOptions
          modalVisible={modalVisible}
          setModalVisible={handleSetModalVisible}
          callbackUpdate={callbackPut}
          handleDelete={handleDeleteNode}
        />
      )}
      {isDeletedNode && (
        <ContentModalOptionUser modalOptionUser={modalVisible}>
          <DeleteDataComponent
            okDelete={okDeleteNode}
            notDelete={notDeleteNode}
            label="USUARIO"
          />
        </ContentModalOptionUser>
      )}
    </S.Container>
  );
};

export default BoxNode;
