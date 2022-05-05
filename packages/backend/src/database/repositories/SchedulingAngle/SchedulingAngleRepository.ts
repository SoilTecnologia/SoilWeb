import knex from "../..";
import { SchedulingAngleModel } from "../../model/SchedulingAngle";
import { ISchedulingAngleRepository } from "./ISchedulingAngleRepository";

class SchedulingAngleRepository implements ISchedulingAngleRepository {
    async findByPivotId(pivot_id: string): Promise<SchedulingAngleModel[]> {
        return await knex<SchedulingAngleModel>('schedulingangles')
        .select('*')
        .where({ pivot_id })
        .orderBy('timestamp', 'desc');
    }

    async findById(schedulingangle_id: string): Promise<SchedulingAngleModel | undefined> {
        return await knex<SchedulingAngleModel>('schedulingangles')
        .select()
        .where({schedulingangle_id})
        .orderBy('timestamp','desc')
        .first()
    }

    async getAllSchedulingsAngle(): Promise<SchedulingAngleModel[]> {
        return await knex<SchedulingAngleModel>('schedulingangles').select();
      }

    async create(
        schedulingangle: Omit<SchedulingAngleModel, "schedulingangle_id">
    ): Promise<SchedulingAngleModel | undefined> {
        const newSchedulingAngle = await knex<SchedulingAngleModel>('schedulingangles')
        .insert(schedulingangle)
        .returning('*')
        
        return newSchedulingAngle[0];
    }

    async delete(schedulingangle_id: string): Promise<SchedulingAngleModel | undefined> {
        return await knex<SchedulingAngleModel>('schedulingangles')
        .select()
        .where({ schedulingangle_id })
        .del()
    }

    async update(
        schedulingangle: SchedulingAngleModel): Promise<SchedulingAngleModel | undefined> {
            const results = await knex<SchedulingAngleModel>('schedulingangles')
            .where({schedulingangle_id: schedulingangle.schedulingangle_id})
            .update(schedulingangle)
            .returning('*');
            console.log("aquiiii")
            return results[0];
        
    }

}

export { SchedulingAngleRepository }