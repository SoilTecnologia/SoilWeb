import { ActionsResult } from '../../protocols/actionsType';

interface ActionData  {
  action: ActionsResult;
  timestamp: Date;
  attempts: number;
};
interface ActionDataWithCmd extends ActionData{
  cmdResponse?: string;
}

export {ActionData, ActionDataWithCmd}