import { result } from "lodash";
import knex from "../..";
import { SchedulingModel } from "../../model/Scheduling";
import { ISchedulingRepository } from "./ISchedulingRepository";

class SchedulingRepository implements ISchedulingRepository {
    async findByPivotId(pivot_id: string): Promise<SchedulingModel | undefined> {
        return await knex<SchedulingModel>('schedulings')
        .select()
        .where([pivot_id])
        .orderBy('timestamp', 'desc')
        .first();
    }

    async findById(scheduling_id: string): Promise<SchedulingModel | undefined> {
        return await knex<SchedulingModel>('schedulings')
        .select()
        .where({scheduling_id})
        .orderBy('timestamp','desc')
        .first()
    }

    async create(
        scheduling: Omit<SchedulingModel, "scheduling_id">
    ): Promise<SchedulingModel | undefined> {
        const newScheduling = await knex<SchedulingModel>('schedulings')
        .insert(scheduling)
        .returning('*')
        
        return newScheduling[0];
    }

    async delete(scheduling_id: string): Promise<SchedulingModel | undefined> {
        return await knex<SchedulingModel>('schedulings')
        .select()
        .where({ scheduling_id })
        .del()
    }

    async update(
        scheduling: SchedulingModel): Promise<SchedulingModel | undefined> {
            const results = await knex<SchedulingModel>('schedulings')
            .where({scheduling_id: scheduling.scheduling_id})
            .update(scheduling)
            .returning('*');

            return results[0];
        
    }

}

export { SchedulingRepository }