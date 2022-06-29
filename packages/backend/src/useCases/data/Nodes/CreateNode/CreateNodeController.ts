import { ParamsNotExpected } from '@root/protocols/errors';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateNodeUseCase } from './CreateNodeUseCase';

class CreateNodeController {
  async handle(req: Request, res: Response) {
    const { node_num, farm_id, is_gprs, gateway } = req.body;

    const arg = Object.keys(req.body).length;
    if (arg > (gateway ? 4 : 3)) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const createNodeUseCase = container.resolve(CreateNodeUseCase);

      try {
        const newNode = await createNodeUseCase.execute({
          node_num,
          farm_id,
          is_gprs,
          gateway: gateway || null
        });

        res.status(201).send(newNode);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /nodes/addNode`);
        console.log(err);
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { CreateNodeController };
