import knex from "../..";
import { PumpModel } from "../../model/Pump";
import { IPumpRepository } from "./IPumpRepository";

class PumpRepository implements IPumpRepository{
    async findByPivotId(pivot_id: string): Promise<PumpModel[]> {
        return await knex<PumpModel>('pumps')
        .select('*')
        .where({pivot_id})
    }

    async findById(pump_id: string): Promise<PumpModel | undefined> {
        return await knex<PumpModel>('pumps')
        .select()
        .where({pump_id})
        .first()
    }

    async getAllPump(): Promise<PumpModel[]> {
        return await knex<PumpModel>('pumps').select();
    }

    async create(pump: Omit<PumpModel, "pump_id">): Promise<PumpModel | undefined> {
        const newPump = await knex <PumpModel>('pumps')
        .insert(pump)
        .returning('*')

        return newPump[0];
    }

    async delete(pump_id: string): Promise<PumpModel | undefined> {
        return await knex<PumpModel>('pumps')
        .select()
        .where({pump_id})
        .del()
    }

    async update(pump: PumpModel): Promise<PumpModel | undefined> {
        const results = await knex<PumpModel>('pumps')
        .where({pump_id: pump.pump_id})
        .update(pump)
        .returning('*');

        return results[0];
    }

}

export { PumpRepository }