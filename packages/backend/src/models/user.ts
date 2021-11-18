import { Model } from 'objection';
import Farm from './farm';

class User extends Model {
	user_id: string;
	login: string;
  password: string;
	user_type: "USER" | "SUDO";

	farms?: Farm[];

	static tableName = 'users';

  static get idColumn() {
    return 'user_id';
  }

  static get relationMappings() {

    return {
			farms: {
				relation: Model.ManyToManyRelation,
				modelClass: Farm,
				join: {
					from: 'users.user_id',
					through: {
						from: 'farm_users.user_id',
						to: 'farm_users.farm_id',
					},
					to: 'farms.farm_id'
				}
			}
		};
  }
}

export default User;