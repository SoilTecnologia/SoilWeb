import { useContextUserData } from "hooks/useContextUserData";
import { useState } from "react";
import * as S from "./styles";

type PropsProvider = {
  historicsPerPage: number;
  dataLength: number;
  paginate: (pageNumber: number) => void;
};
const Pagination = ({
  historicsPerPage,
  dataLength,
  paginate,
}: PropsProvider) => {
  const { historic } = useContextUserData();
  const [currentPage, setCurrentPage] = useState(1);
  const pageHistoric = [];

  for (let i = 1; i <= Math.ceil(dataLength / historicsPerPage); i++) {
    pageHistoric.push(i);
  }

  return (
    <S.Container>
      <S.Alignment>
        {pageHistoric.map((number) => (
          <>
            {currentPage === number ? (
              <S.PageIndicatorHighlight key={number}>
                <S.SelectedPageIndicator
                  onClick={() => {
                    paginate(number), setCurrentPage(number);
                  }}
                >
                  {number}
                </S.SelectedPageIndicator>
              </S.PageIndicatorHighlight>
            ) : (
              <S.UnselectedPageIndicator
                key={number}
                onClick={() => {
                  paginate(number), setCurrentPage(number);
                }}
              >
                {number}
              </S.UnselectedPageIndicator>
            )}
          </>
        ))}
      </S.Alignment>
    </S.Container>
  );
};

export default Pagination;
