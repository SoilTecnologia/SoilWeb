
import { PrismaClient, Node, Farm } from '@prisma/client';
import db from '../database'


export const createNodeController = async (node_id: Node['node_id'], farm_id: Farm['farm_id'], isGPRS: Node['isGPRS']): Promise<Node | null> => {
	const newNode = await db.node.create({data: {node_id, farm_id, isGPRS } });

	return newNode;
}