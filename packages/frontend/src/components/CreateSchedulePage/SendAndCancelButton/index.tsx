import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextUserData } from "hooks/useContextUserData";
import { useEffect, useState } from "react";
import Schedule from "utils/models/schedulings";
import * as S from "./styles";

const SendAndCancelButton = () => {
  const {
    scheduleType,
    setScheduleType,
    newAngleSchedule,
    setNewAngleSchedule,
    newDateSchedule,
    setNewDateSchedule,
  } = useContextScheduleData();
  const { pivot } = useContextUserData();
  const {
    createNewAngleSchedule,
    createNewDateSchedule,
    getDateSchedulings,
    getAngleSchedulings,
  } = useContextActionCrud();
  const [inicialAngleIntentsState, setAngleInicialIntentsState] = useState(
    {} as Schedule
  );
  const [inicialDateIntentsState, setDateInicialIntentsState] = useState(
    {} as Schedule
  );
  const [readyAngle, setReadyAngle] = useState(false);
  const [readyDate, setReadyDate] = useState(false);

  useEffect(() => {
    setAngleInicialIntentsState({
      pivot_id: "",
      author: "",
      is_return: null,
      power: null,
      water: null,
      direction: null,
      percentimeter: 0,
      start_angle: 0,
      end_angle: 0,
      start_timestamp: new Date(),
      timestamp: new Date().getTime(),
    });
    setDateInicialIntentsState({
      pivot_id: "",
      author: "",
      is_stop: null,
      power: null,
      water: null,
      direction: null,
      percentimeter: 0,
      start_timestamp: new Date(),
      end_timestamp: new Date(),
      timestamp: new Date().getTime(),
    });
  }, [scheduleType]);

  useEffect(() => {
    if (readyAngle) {
      handleSendIntents();
      setReadyAngle(false);
    }
  }, [readyAngle, setReadyAngle]);

  useEffect(() => {
    if (readyDate) {
      handleSendIntents();
      setReadyDate(false);
    }
  }, [readyDate, setReadyDate]);

  const resetSchedule = () => {
    setNewAngleSchedule(inicialAngleIntentsState);
    setNewDateSchedule(inicialDateIntentsState);
    setScheduleType("");
  };

  const handleSendIntents = async () => {
    if (scheduleType === "StopAngle" || scheduleType === "AutoReturn") {
      createNewAngleSchedule(newAngleSchedule).then(() => {
        getAngleSchedulings(newAngleSchedule["pivot_id"]);
        resetSchedule();
      });
    } else if (scheduleType === "Complete" || scheduleType === "EasyStop") {
      createNewDateSchedule(newDateSchedule).then(() => {
        getDateSchedulings(newDateSchedule["pivot_id"]);
        resetSchedule();
      });
    }
  };

  const handleAngleButton = async () => {
    await angleDataCheck();
    setReadyAngle(true);
  };

  const handleDateButton = async () => {
    await dateDataCheck();
    setReadyDate(true);
  };

  const angleDataCheck = async () => {
    console.log(newAngleSchedule);
    for (const [key, value] of Object.entries(newAngleSchedule)) {
      if (value == null && key != "direction") {
        setNewAngleSchedule((prevState) => ({
          ...prevState,
          [`${key}`]: false,
        }));
      } else if (
        typeof value != "number" &&
        (key == "start_timestamp" || key == "end_timestamp")
      ) {
        setNewAngleSchedule((prevState) => ({
          ...prevState,
          [`${key}`]: value.getTime(),
        }));
      } else if (value == null && key == "direction") {
        setNewAngleSchedule((prevState) => ({
          ...prevState,
          [`${key}`]: "CLOCKWISE",
        }));
      }
    }
  };

  const dateDataCheck = async () => {
    for (const [key, value] of Object.entries(newAngleSchedule)) {
      if (value == null && key != "direction") {
        setNewDateSchedule((prevState) => ({
          ...prevState,
          [`${key}`]: false,
        }));
      } else if (
        value == "" &&
        (key == "start_timestamp" || key == "end_timestamp")
      ) {
        setNewDateSchedule((prevState) => ({
          ...prevState,
          [`${key}`]: new Date().getTime(),
        }));
      } else if (value == null && key == "direction") {
        setNewDateSchedule((prevState) => ({
          ...prevState,
          [`${key}`]: "CLOCKWISE",
        }));
      }
    }
  };

  const renderCondition = () => {
    if (
      (scheduleType === "StopAngle" || scheduleType === "AutoReturn") &&
      newAngleSchedule != inicialAngleIntentsState
    ) {
      return (
        <S.Container>
          <S.ResetButton onClick={() => resetSchedule()}>
            <S.ButtonText>Cancelar</S.ButtonText>
          </S.ResetButton>
          <S.ConfirmButton onClick={() => handleAngleButton()}>
            <S.ButtonText>Confirmar</S.ButtonText>
          </S.ConfirmButton>
        </S.Container>
      );
    } else if (
      (scheduleType === "Complete" || scheduleType === "EasyStop") &&
      newDateSchedule !== inicialDateIntentsState
    ) {
      return (
        <S.Container>
          <S.ResetButton onClick={() => resetSchedule()}>
            <S.ButtonText>Cancelar</S.ButtonText>
          </S.ResetButton>
          <S.ConfirmButton onClick={() => handleDateButton()}>
            <S.ButtonText>Confirmar</S.ButtonText>
          </S.ConfirmButton>
        </S.Container>
      );
    }
  };
  return <>{renderCondition()}</>;
};

export default SendAndCancelButton;
