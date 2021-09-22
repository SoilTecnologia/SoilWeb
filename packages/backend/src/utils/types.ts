import { UserType } from ".prisma/client"
import { User } from '@prisma/client';

// user_types: tipo a ser testado
// target_types: tipos que retornarão true
export function isType(user_type: string, target_types: (keyof typeof UserType)[]): boolean {
	for(let target of target_types) {
		if(user_type === target) return true;
	}
	return false;
}