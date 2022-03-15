import BoxOptions from "components/globalComponents/BoxOptions";
import ModalDeleteData from "components/globalComponents/ModalDeleteData";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useState } from "react";
import Farm from "utils/models/farm";
import Node from "utils/models/node";
import UpdateNode from "../UpdateNode";
import * as S from "./styles";

type boxNodeprops = {
  nodeData: Node;
  farmRelation: Farm;
};
const BoxNode = ({ nodeData, farmRelation }: boxNodeprops) => {
  //Contexts
  const { getAllPivots, deleteNode } = useContextActionCrud();

  //States
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeletedNode, setIsDeletedNode] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);

  const handleSetModalVisible = () => {
    setModalVisible(false);
  };

  const callbackPut = () => {
    setModalUpdateVisible(true);
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

  const viewDataPivots = () => {
    // getAllPivots(nodeData);
  };
  return (
    <>
      <S.Container>
        <S.IconMenu onClick={() => setModalVisible(true)} />
        <S.ContentData onClick={viewDataPivots}>
          <S.NodeName>
            NODE: <span>{nodeData.node_num}</span>
          </S.NodeName>
          <S.IsGprs>
            GRPS: <span>{` ${nodeData.is_gprs === true ? "SIM" : "NÃO"}`}</span>
          </S.IsGprs>
          {nodeData.gateway && (
            <S.Gateway>
              Gateway: <span>{nodeData.gateway}</span>{" "}
            </S.Gateway>
          )}
        </S.ContentData>

        {modalVisible && (
          <BoxOptions
            modalVisible={modalVisible}
            setModalVisible={handleSetModalVisible}
            callbackUpdate={callbackPut}
            handleDelete={handleDeleteNode}
          />
        )}
      </S.Container>
      {isDeletedNode && (
        <ModalDeleteData
          alertLabel="Essa ação irá deletar o Node e todos os pivôs atrelados a ele"
          callbackNotDelete={notDeleteNode}
          callbackDelete={okDeleteNode}
        />
      )}
      {modalUpdateVisible && (
        <S.ContentAddNode>
          <UpdateNode
            nodeData={nodeData}
            closeModal={() => setModalUpdateVisible(false)}
          />
        </S.ContentAddNode>
      )}
    </>
  );
};

export default BoxNode;
