import { Router } from 'express';
import WorkItemsController from '@controllers/workItems.controller';
import ForgeController from '@/controllers/forge.controller';
import { CreateWorkItemDto } from '@dtos/workItems.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import uploadMiddleware from '@/middlewares/upload.middleware';

class ForgeRoute implements Routes {
  public path = '/forge';
  public router = Router();
  public forgeController = new ForgeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/token`, this.forgeController.getForgeToken);
    this.router.post(`${this.path}/upload`, uploadMiddleware(), this.forgeController.uploadInputFile);
    this.router.post(`${this.path}/work-items`, this.forgeController.createWorkItem);
    this.router.get(`${this.path}/work-items/:id/status`, this.forgeController.getWorkItemStatus);
  }
}

export default ForgeRoute;
