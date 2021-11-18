
import { PrismaClient, Node, Farm } from '@prisma/client';
import db from '../database'


export const createNodeController = async (node_name: Node['node_name'], farm_id: Farm['farm_id'], isGPRS: Node['isGPRS']): Promise<Node | null> => {
	const newNode = await db.node.create({data: {node_name, farm_id, isGPRS } });

	return newNode;
}

export const deleteNodeController = async(node_id: Node['node_id']): Promise<Node | null> => {
	await db.pivot.deleteMany({where: {node_id}});
	const deletedNode = await db.node.delete({where: {node_id}});

	return deletedNode;
}
