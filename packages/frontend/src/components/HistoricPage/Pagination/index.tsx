import { useContextUserData } from "hooks/useContextUserData";
import * as S from "./styles";
type PropsProvider = {
  historicsPerPage: number,
  dataLength: number,
  paginate: (pageNumber: number) => void
}
const Pagination = ({ historicsPerPage, dataLength, paginate }: PropsProvider) => {
  const { historic } = useContextUserData()
  const pageHistoric = [];


  for (let i = 1; i <= Math.ceil(dataLength / historicsPerPage); i++) {
    pageHistoric.push(i);
  }

  return (
    <S.Container>
      {pageHistoric.map(number => (
        <li key={number} >
          <S.PageIndicator onClick={() => paginate(number)} >
            {number}
          </S.PageIndicator>
        </li>
      ))}
    </S.Container>
  )
};

export default Pagination;
