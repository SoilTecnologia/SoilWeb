import { useState } from "react";
import * as S from "./styles";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import theme from "styles/theme";

import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import { createTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import DateFnsUtils from "@date-io/date-fns";
import pt from "date-fns/locale/pt-BR";


const DateInputComponent = () => {
  const { scheduleType, setNewAngleSchedule, setNewDateSchedule } = useContextScheduleData()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const useStyles = createTheme({
    overrides: {
      MuiInput: {
        input: {
          textAlign: 'center'
        },
        root: {
          fontSize: 20,

        },
      },
      MuiPickersDay: {
        daySelected: {
          color: 'white',
          backgroundColor: theme.colors.primary
        },
      },
      MuiPickerDTTabs: {
        tabs: {
          color: 'white',
          backgroundColor: theme.colors.primary,
        },
      },
      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: theme.colors.primary,
        },

      },
    },
    typography: {
      htmlFontSize: 10,
    },
  });

  const handleSetStartDate = (value: Date) => {
    setStartDate(value as Date)
    if (scheduleType == 'StopAngle' || scheduleType == 'AutoReturn') {
      setNewAngleSchedule(prevState => ({ ...prevState, ['start_timestamp']: value.getTime() }))

    }
    else if (scheduleType == 'Complete' || scheduleType == 'EasyStop') {
      setNewDateSchedule(prevState => ({ ...prevState, ['start_timestamp']: value.getTime() }))
    }
  }

  const handleSetEndDate = (value: Date) => {
    setEndDate(value as Date)
    setNewDateSchedule(prevState => ({ ...prevState, ['end_timestamp']: value.getTime() }))


  }


  const typeSelector = () => {
    if (scheduleType == 'StopAngle' || scheduleType == 'AutoReturn') {
      return (
        <S.DatePickerContainer>
          <S.DatePickerTitle>Início:</S.DatePickerTitle>

          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
            <ThemeProvider theme={useStyles}>
              <DateTimePicker
                value={startDate}
                minDate={new Date()}
                onChange={(date: MaterialUiPickersDate) =>
                  handleSetStartDate(date as any)
                }
                ampm={false}
                format={"dd/MM/yyy 'às' HH:mm"}
                variant="inline"
              />
            </ThemeProvider>
          </MuiPickersUtilsProvider>
        </S.DatePickerContainer>

      )
    }
    else if (scheduleType == 'Complete') {
      return (
        <S.RowAlign>


          <S.DatePickerContainer>
            <S.DatePickerTitle>Início:</S.DatePickerTitle>

            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
              <ThemeProvider theme={useStyles}>
                <DateTimePicker
                  value={startDate}
                  onChange={(date: MaterialUiPickersDate) =>
                    handleSetStartDate(date as any)
                  }
                  ampm={false}
                  format={"dd/MM/yyy 'às' HH:mm"}
                  variant="inline"
                />
              </ThemeProvider>
            </MuiPickersUtilsProvider>
          </S.DatePickerContainer>

          <S.DatePickerContainer>
            <S.DatePickerTitle>Término:</S.DatePickerTitle>

            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
              <ThemeProvider theme={useStyles}>
                <DateTimePicker
                  value={endDate}
                  minDate={new Date()}
                  onChange={(date: MaterialUiPickersDate) =>
                    handleSetEndDate(date as any)
                  }
                  ampm={false}
                  format={"dd/MM/yyy 'às' HH:mm"}
                  variant="inline"
                />
              </ThemeProvider>
            </MuiPickersUtilsProvider>
          </S.DatePickerContainer>


        </S.RowAlign>


      )

    }
    else if (scheduleType == 'EasyStop') {
      return (
        <S.DatePickerContainer >
          <S.DatePickerTitle>Término:</S.DatePickerTitle>

          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
            <ThemeProvider theme={useStyles}>
              <DateTimePicker
                value={endDate}
                minDate={new Date()}
                onChange={(date: MaterialUiPickersDate) =>
                  handleSetEndDate(date as any)
                }
                ampm={false}
                format={"dd/MM/yyy 'às' HH:mm"}
                variant="inline"
              />
            </ThemeProvider>
          </MuiPickersUtilsProvider>
        </S.DatePickerContainer >

      )

    }
  }


  return (
    <S.Container>
      <S.Header>
        Data
      </S.Header>
      {typeSelector()}
    </S.Container>
  )
};

export default DateInputComponent;
