import { Radio, RadioVariable } from '@prisma/client';
import db from '../database';

export const createRadioController = async (
  pivot_id: Radio['pivot_id'],
  radio_name: Radio['radio_name']
): Promise<Radio | null> => {
  const newRadio = await db.radio.create({
    data: {
      radio_name,
      pivot_id
    }
  });

  const newintent = await db.intent.create({
    data: {
      power: 'NULL',
      water: 'NULL',
      percentimeter: 0,
      direction: 'NULL',
      pivot_id: newRadio.pivot_id,
      timestamp: new Date(Date.now()),
      pivot_name: radio_name
    }
  });

  return newRadio;
};

export const readRadioController = async (
  radio_name: Radio['radio_name']
): Promise<Radio | null> => {
  const radio = await db.radio.findFirst({
    where: { radio_name }
  });

  return radio;
};

export const updateRadioController = async (
  radio_name: Radio['radio_name'],
  rssi: number,
  father: number,
  payload: string,
  response_time: number
): Promise<RadioVariable | null> => {
  const radio = await db.radio.findFirst({ where: { radio_name } });

  const newRadioVariables = await db.radioVariable.create({
    data: {
      radio_id: radio!.radio_id,
      rank: 0,
      rssi,
      payload,
      response_time,
      radio_name,
      timestamp: new Date(),
      father: father.toString()
    }
  });

  return newRadioVariables;
};

export const deleteRadioController = async (radio_id: Radio['radio_id']) => {
  const deletedRadio = await db.radio.delete({
    where: {
      radio_id
    }
  });

  return deletedRadio;
};
