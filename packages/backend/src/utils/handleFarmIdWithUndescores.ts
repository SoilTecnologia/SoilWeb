import { container } from 'tsyringe';
import { GetOneFarmUseCase } from '../useCases/Farms/GetOneFarm/GetOneFarmsuseCase';

const handleArray = (array: string[]) => {
  // const pivot_num = array[array.length - 1];
  const pivot_num = array.pop();

  const farm_id = array.join('_').trim();

  const arrayData: string[] = [farm_id, pivot_num!!];
  return arrayData;
};

export const handleResultAction = async (id: string) => {
  const arrayId = id.split('_');

  const newFarmId = arrayId.length > 2 ? handleArray(arrayId) : arrayId;

  const [farm_id, pivot_num] = newFarmId;

  /* Tentar melhorar isso daqui, nao depender de fazer uma query pra saber o usuario" */
  const getFarmUseCase = container.resolve(GetOneFarmUseCase);
  const farm = await getFarmUseCase.execute(farm_id);

  const { user_id, farm_name } = farm!!;

  return { user_id, farm_name, pivot_num };
};

export const handleResultString = (id: string) => {
  const arrayId = id.split('_');

  const newFarmId = arrayId.length > 2 ? handleArray(arrayId) : arrayId;

  const [farm_id, node_num] = newFarmId;

  return { farm_id, node_num };
};
