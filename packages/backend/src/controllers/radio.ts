import { Radio } from '@prisma/client';
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
      percentimenter: 0,
      direction: 'NULL',
      radio_id: newRadio.radio_id,
      radio_name: newRadio.radio_name
    }
  });

  return newRadio;
};

export const readRadioController = async (
  radio_name: Radio['radio_name']
): Promise<Radio | null> => {
  const radio = await db.radio.findFirst({
    where: {radio_name}
  })

  return radio;
};

export const deleteRadioController = async (radio_id: Radio['radio_id']) => {
  const deletedRadio = await db.radio.delete({
    where: {
      radio_id
    }
  });

  return deletedRadio;
};
