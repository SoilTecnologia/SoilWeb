import React, { createContext, useContext, useState } from "react";
import Schedule, { AngleSchedule, DateSchedule } from "utils/models/schedulings";


interface ScheduleProviderProps {
  children: React.ReactNode;
}
type ScheduleType = Schedule;

type ScheduleDataContexProps = {
  scheduleType: String;
  setScheduleType: React.Dispatch<React.SetStateAction<String>>;
  //creating new Schedule
  newAngleSchedule: ScheduleType;
  setNewAngleSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
  newDateSchedule: ScheduleType;
  setNewDateSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
  //List
  angleScheduleList: AngleSchedule[];
  setAngleScheduleList: React.Dispatch<React.SetStateAction<AngleSchedule[]>>;
  dateScheduleList: DateSchedule[];
  setDateScheduleList: React.Dispatch<React.SetStateAction<DateSchedule[]>>;
  //Editing
  editingScheduleType: String;
  setEditingScheduleType: React.Dispatch<React.SetStateAction<String>>;
  editingSchedule: ScheduleType
  setEditingSchedule: React.Dispatch<React.SetStateAction<ScheduleType>>
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
    start_timestamp: '',
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
    start_timestamp: '',
    end_timestamp: '',
    timestamp: new Date().getTime()
  })
  const [angleScheduleList, setAngleScheduleList] = useState<AngleSchedule[]>([])
  const [dateScheduleList, setDateScheduleList] = useState<DateSchedule[]>([])

  const [editingScheduleType, setEditingScheduleType] = useState<String>('')
  const [editingSchedule, setEditingSchedule] = useState<ScheduleType>({} as ScheduleType)

  return (
    <ScheduleDataContext.Provider
      value={{
        scheduleType: scheduleType,
        setScheduleType,
        newAngleSchedule: newAngleSchedule,
        setNewAngleSchedule,
        newDateSchedule: newDateSchedule,
        setNewDateSchedule,
        angleScheduleList: angleScheduleList,
        setAngleScheduleList,
        dateScheduleList: dateScheduleList,
        setDateScheduleList,
        editingScheduleType: editingScheduleType,
        setEditingScheduleType,
        editingSchedule: editingSchedule,
        setEditingSchedule,
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
