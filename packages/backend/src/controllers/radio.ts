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

  return newRadio;
};

export const deleteRadioController = async(radio_id: Radio['radio_id']) => {
	const deletedRadio = await db.radio.delete({
		where: {
			radio_id
		}
	})

	return deletedRadio;
}
