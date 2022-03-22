import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateNodeUseCase } from './UpdateNodeUseCase';

class UpdateNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { node_id, node_num, farm_id, is_gprs, gateway } = req.body;

    const updateNodeUseCase = container.resolve(UpdateNodeUseCase);

    try {
      const newNode = await updateNodeUseCase.execute({
        node_id,
        node_num,
        farm_id,
        is_gprs,
        gateway
      });

      res.send(newNode);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /nodes/addNode`);
      console.log(err);
      next(err);
    }
  }
}

export { UpdateNodeController };
