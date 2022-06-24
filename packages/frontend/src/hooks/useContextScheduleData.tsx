import React, { createContext, useContext, useState } from "react";
import Schedule from "utils/models/schedulings";


interface ScheduleProviderProps {
  children: React.ReactNode;
}
type ScheduleType = Schedule;


type ScheduleDataContexProps = {
  scheduleType: String;
  setScheduleType: React.Dispatch<React.SetStateAction<String>>;
  newAngleSchedule: ScheduleType,
  setNewAngleSchedule: React.Dispatch<React.SetStateAction<Schedule>>,
  newDateSchedule: ScheduleType,
  setNewDateSchedule: React.Dispatch<React.SetStateAction<Schedule>>
};

const ScheduleDataContext = createContext({} as ScheduleDataContexProps);

function UseScheduleDataProvider({ children }: ScheduleProviderProps) {
  const [scheduleType, setScheduleType] = useState<String>('')
  const [newAngleSchedule, setNewAngleSchedule] = useState<ScheduleType>({
    pivot_id: '',
    author: '',
    is_return: null,
    power: null,
    water: null,
    direction: null,
    percentimeter: 0,
    start_angle: 0,
    end_angle: 0,
    start_timestamp: new Date(),
    timestamp: new Date().getTime()

  })
  const [newDateSchedule, setNewDateSchedule] = useState<ScheduleType>({
    pivot_id: '',
    author: '',
    is_stop: null,
    power: null,
    water: null,
    direction: null,
    percentimeter: 0,
    start_timestamp: new Date(),
    end_timestamp: new Date(),
    timestamp: new Date().getTime()
  })

  return (
    <ScheduleDataContext.Provider
      value={{
        scheduleType: scheduleType,
        setScheduleType,
        newAngleSchedule: newAngleSchedule,
        setNewAngleSchedule,
        newDateSchedule: newDateSchedule,
        setNewDateSchedule

      }}
    >
      {children}
    </ScheduleDataContext.Provider>
  );
}

function useContextScheduleData() {
  const context = useContext(ScheduleDataContext);

  return context;
}

export { useContextScheduleData, ScheduleDataContext, UseScheduleDataProvider };
