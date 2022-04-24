import * as S from "./styles";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextUserData } from "hooks/useContextUserData";
import { useState } from "react";
import Header from "components/globalComponents/Header";
import ListContainer from "../ListContainer";
import Pagination from "../Pagination";

import DateFnsUtils from '@date-io/date-fns';
import { format } from "date-fns";
import pt from "date-fns/locale/pt-BR";

import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { createTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import theme from "styles/theme";
import { useEffect } from "react";
declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey extends MuiPickersOverrides { }
}


const MainHistoric = () => {

  const { pivot, historic, setHistoric } = useContextUserData()
  const { getPivotHistoric } = useContextActionCrud()

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [currentPage, setCurrentPage] = useState(1);
  const [historicsPerPage] = useState(5);

  const indexOfLastHistoric = currentPage * historicsPerPage;
  const indexOfFirstHistoric = indexOfLastHistoric - historicsPerPage;
  const currentHistorics = historic.slice(indexOfFirstHistoric, indexOfLastHistoric);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  };

  useEffect(() => {
    return () => {
      setHistoric([])
    }
  }, [])


  const handleGetPivotHistoric = () => {
    const formatedStartDate = format(new Date(startDate), 'dd-MM-yyyy')
    const formatedEndDate = format(new Date(endDate), 'dd-MM-yyyy')
    paginate(1)
    getPivotHistoric(pivot.pivot_id, formatedStartDate, formatedEndDate)
  }

  const useStyles = createTheme({
    overrides: {
      MuiInput: {
        root: {
          fontSize: 20,
        }
      },

      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: theme.colors.primary,

        }
      },

    },
    typography: {
      htmlFontSize: 10,
    },

  });



  return (
    <S.Container>
      <Header text={'Histórico'} />

      <S.ButtonsView>
        <S.Button href='/intent'>
          <S.ButtonAnchor>
            <S.BackIcon />
            <S.Text>
              Voltar
            </S.Text>
          </S.ButtonAnchor>
        </S.Button>
        <S.Button href='/map'>
          <S.ButtonAnchor>
            <S.MapIcon />
            <S.Text >
              Mapa
            </S.Text>
          </S.ButtonAnchor>
        </S.Button>
      </S.ButtonsView>

      <S.DatePickerWrapper>

        <S.DatePickerContainer>

          <S.DatePickerTitle>
            Data de Início:
          </S.DatePickerTitle>

          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
            <ThemeProvider theme={useStyles}>


              <DatePicker
                value={startDate}
                maxDate={endDate}
                onChange={(date) => setStartDate(date)}
                format={'dd/MM/yyy'}
                variant='inline'
              />
            </ThemeProvider>


          </MuiPickersUtilsProvider>

        </S.DatePickerContainer>


        <S.DatePickerContainer>
          <S.DatePickerTitle>
            Data de Término:
          </S.DatePickerTitle>

          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={pt}

          >
            <ThemeProvider theme={useStyles}>
              <DatePicker
                value={endDate}
                minDate={startDate}
                maxDate={new Date()}
                onChange={(date) => setEndDate(date)}
                format={'dd/MM/yyy'}
                variant='inline'
              />
            </ThemeProvider>
          </MuiPickersUtilsProvider>

        </S.DatePickerContainer>

        <S.SearchButton onClick={() => handleGetPivotHistoric()}>
          <S.SearchButtonText>
            Pesquisar
          </S.SearchButtonText>
        </S.SearchButton>

      </S.DatePickerWrapper>
      <ListContainer currentHistorics={currentHistorics} />
      <Pagination
        historicsPerPage={historicsPerPage}
        dataLength={historic.length}
        paginate={paginate}
      />


    </S.Container >
  )
}

export default MainHistoric;
