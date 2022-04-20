import * as S from "./styles";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextUserData } from "hooks/useContextUserData";
import { useEffect, useState } from "react";
import Header from "components/globalComponents/Header";
import Router from "next/router";
import ListContainer from "../ListContainer";
import Pagination from "../Pagination";

const MainHistoric = () => {

  const { pivot, historic, setHistoric } = useContextUserData()
  const { getPivotHistoric } = useContextActionCrud()



  const [currentPage, setCurrentPage] = useState(1);
  const [historicsPerPage] = useState(5);


  //trocar de pivots/cycles para cycles/ apenas

  useEffect(() => {
    if (pivot) {
      getPivotHistoric(pivot.pivot_id, '01-03-2022', '11-04-2022')
    }
  }, [pivot])

  const indexOfLastHistoric = currentPage * historicsPerPage;
  const indexOfFirstHistoric = indexOfLastHistoric - historicsPerPage;
  const currentHistorics = historic.slice(indexOfFirstHistoric, indexOfLastHistoric);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  };
  const handleIntent = () => {
    Router.push("/intent");
  };
  const handleMap = () => {
    Router.push("/map")
  };

  return (
    <S.Container>
      <Header text={'Histórico'} />

      <S.ButtonsView>
        <S.Button onClick={handleIntent}>
          <S.BackIcon />
          <S.Text>
            Voltar
          </S.Text>
        </S.Button>
        <S.Button onClick={handleMap}>
          <S.MapIcon />
          <S.Text >
            Mapa
          </S.Text>
        </S.Button>
      </S.ButtonsView>

      <ListContainer currentHistorics={currentHistorics} />
      <Pagination
        historicsPerPage={historicsPerPage}
        dataLength={historic.length}
        paginate={paginate}
      />


    </S.Container>
  )
}

export default MainHistoric;
