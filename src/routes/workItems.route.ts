import { Router } from 'express';
import WorkItemsController from '@controllers/workItems.controller';
import { CreateWorkItemDto } from '@dtos/workItems.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import uploadMiddleware from '@/middlewares/upload.middleware';


class WorkItemsRoute implements Routes {
  public path = '/work-items';
  public router = Router();
  public workItemsController = new WorkItemsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.workItemsController.getWorkItems);
    this.router.get(`${this.path}/:id`, this.workItemsController.getWorkItemById);
    this.router.get(`${this.path}/:id/status`, this.workItemsController.getWorkItemStatusById);
    this.router.post(`${this.path}/query`, this.workItemsController.getWorkItemByDaId);
    this.router.post(`${this.path}`, uploadMiddleware(), this.workItemsController.createWorkItem);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateWorkItemDto, 'body', true), this.workItemsController.updateWorkItem);
    this.router.delete(`${this.path}/:id`, this.workItemsController.deleteWorkItem);
  }
}

export default WorkItemsRoute;
