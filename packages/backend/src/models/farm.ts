import { Model } from 'objection';
import Node from './node';
import User from './user';
import { PowerState } from '@prisma/client';

class Farm extends Model {
	farm_id: string;
	farm_name: string;
	city: string;
	lng: number;
	lat: number;
	gateway: string;

	users?: User[];

	static tableName = "farms";

  static get idColumn() {
    return 'farm_id';
  }

	static get relationMappings() {
		return {
			users: {
				relation: Model.ManyToManyRelation,
				modelClass: User,
				join: {
					from: 'farms.farm_id',
					through: {
						from: 'farm_users.farm_id',
						to: 'farm_users.user_id',
					},
					to: 'users.user_id'
				}
			}
		}
	}

}

export default Farm;
