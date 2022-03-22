import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteNodeUseCase } from './DeleteNodeUseCase';

class DeleteNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const deleteNodeUseCase = container.resolve(DeleteNodeUseCase);

    try {
      const newNode = await deleteNodeUseCase.execute(id);

      res.send(newNode);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /nodes/addNode`);
      console.log(err);
      next(err);
    }
  }
}

export { DeleteNodeController };
