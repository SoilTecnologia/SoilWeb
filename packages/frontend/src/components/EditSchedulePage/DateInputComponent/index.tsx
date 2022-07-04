import { useEffect, useState } from "react";
import * as S from "./styles";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import theme from "styles/theme";

import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import { createTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import DateFnsUtils from "@date-io/date-fns";
import pt from "date-fns/locale/pt-BR";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.extend(utc)


const DateInputComponent = () => {
  const { editingScheduleType, editingSchedule, setEditingSchedule } = useContextScheduleData()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  useEffect(() => {
    setStartDate(formatDate(editingSchedule?.start_timestamp, 'picker'))
    if (editingScheduleType == 'Complete' || editingScheduleType == 'EasyStop') {
      setEndDate(formatDate(editingSchedule?.end_timestamp, 'picker'))
    }
  }, [])

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
    if (editingScheduleType == 'StopAngle' || editingScheduleType == 'AutoReturn') {
      setEditingSchedule(prevState => ({ ...prevState, ['start_timestamp']: value.getTime() }))

    }
    else if (editingScheduleType == 'Complete' || editingScheduleType == 'EasyStop') {
      setEditingSchedule(prevState => ({ ...prevState, ['start_timestamp']: value.getTime() }))
    }
  }

  const handleSetEndDate = (value: Date) => {
    setEndDate(value as Date)
    setEditingSchedule(prevState => ({ ...prevState, ['end_timestamp']: value.getTime() }))
  }


  function formatDate(date: any, control: string) {

    if ((date == editingSchedule?.start_timestamp || date == editingSchedule?.end_timestamp) && control == 'text') {
      const [dates, hours] = date.split(" ")
      const [hour, min, sec] = hours.split(":")
      const formated = `${dates} ${hour}:${min}`
      return formated
    }
    else if (control == 'text') {
      return dayjs(date).format('DD/MM/YYYY HH:mm')
    }
    else if ((date == editingSchedule?.start_timestamp || date == editingSchedule?.end_timestamp) && control == 'picker') {
      const [dates, hours] = date.split(" ")
      const [day, month, year] = dates.split('/')
      const [hour, min, sec] = hours.split(":")
      const preFormat = `${year}-${month}-${day}T${hour}:${min}:00.000Z`
      const formated = dayjs(preFormat).format(`ddd MMM D YYYY ${hour}:${min}:00 [GMT]ZZ`)

      return new Date(formated)
    }
    else if (control == 'picker') {
      return date
    }


    return date
  }


  const typeSelector = () => {
    if (editingScheduleType == 'StopAngle' || editingScheduleType == 'AutoReturn') {
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
    else if (editingScheduleType == 'Complete') {
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
    else if (editingScheduleType == 'EasyStop') {
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
