import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateNodeUseCase } from './CreateNodeUseCase';

class CreateNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { node_num, farm_id, is_gprs, gateway } = req.body;

    const createNodeUseCase = container.resolve(CreateNodeUseCase);

    try {
      const newNode = await createNodeUseCase.execute({
        node_num,
        farm_id,
        is_gprs,
        gateway: gateway || null
      });

      res.send(newNode);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /nodes/addNode`);
      console.log(err);
      next(err);
    }
  }
}

export { CreateNodeController };
