import { NextFunction, Request, Response } from 'express';
import { CreateWorkItemDto } from '@dtos/workItems.dto';
import { WorkItem } from '@interfaces/workItems.interface';
import { RequestWithFile } from '@/interfaces/files.interface';
import { SignedUrl } from '@/interfaces/urls.interface';
import workItemService from '@services/workItems.service';
import ForgeService from '@/services/forge.service';
import { transformUser, transformUsers } from '@/utils/transform';

class WorkItemsController {
  public workItemService = new workItemService();
  public forgeService = new ForgeService();

  public getWorkItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workItems: WorkItem[] = await this.workItemService.findAllWorkItem();

      res.status(200).json({ status: 200, data: workItems, message: 'Get work items succeed' });
    } catch (error) {
      next(error);
    }
  }

  public getWorkItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workItemId: string = req.params.id;
      const workItem: WorkItem = await this.workItemService.findWorkItemById(workItemId);

      if (!workItem) {
        return res.status(404).json({ status: 404, message: `Work item '${workItemId}' not found` });
      }

      res.status(200).json({ status: 200, data: workItem, message: 'Get work item succeed' });
    } catch (error) {
      next(error);
    }
  }

  public getWorkItemByDaId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.query);
      const daWorkItemId: string = req.query.daId as string;
      console.log(daWorkItemId);
      const workItem: WorkItem = await this.workItemService.findWorkItemByDaId(daWorkItemId);

      if (!workItem) {
        return res.status(200).json({ status: 200, data: {}, message: `Work item with Design Automation work item id '${daWorkItemId}' not found` });
      }

      res.status(200).json({ status: 200, data: workItem, message: 'Get work item succeed' });
    } catch (error) {
      next(error);
    }
  }

  public createWorkItem = async (req: RequestWithFile | any, res: Response, next: NextFunction) => {
    try {
      console.log(`[Forge] Starting upload in controller...`);
      console.log(req.file);
      const fileName = `${Date.now().toString()}-${req.file.originalname}`;
      const forgeFileData = await this.forgeService.uploadInputFile(req.file.buffer, fileName);
      const [downloadUrlData, uploadUrlData] = await Promise.all([
        this.forgeService.getTemporaryDownloadUrl(fileName),
        this.forgeService.getTemporaryUploadUrl(`result-${fileName}`)
      ]);
      console.log(`[Forge] upload file succeed`);

      console.log(`[Forge] creating a work item`);
      const forgeWorkItemData = await this.forgeService.createWorkItem(downloadUrlData.signedUrl, uploadUrlData.signedUrl);
      console.log(forgeWorkItemData);

      console.log(`[DB] creating a work item`);
      const workItemData = {
        email: req.body.email,
        daWorkItemId: forgeWorkItemData.daWorkItemId,
        daWorkItem: forgeWorkItemData.daWorkItem
      } as WorkItem;
      console.log(workItemData);
      const workItem: WorkItem = await this.workItemService.createWorkItem(workItemData);

      res.status(201).json({ status: 201, data: workItem, message: 'Create work item succeed' });
    } catch (error) {
      next(error);
    }
  }

  public getWorkItemStatusById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`[DB] Start to get the work item...`);
      const workItemId: string = req.params.id;
      const workItem: WorkItem = await this.workItemService.findWorkItemById(workItemId);
      if (!workItem) {
        return res.status(404).json({ status: 404, message: `Work item '${workItemId}' not found` });
      }

      console.log(`[Forge] Start to get a work item status...`);
      const daWorkItemId = workItem.daWorkItemId;
      const [daWorkItemStatus] = await Promise.all([
        this.forgeService.getWorkItemStatus(daWorkItemId)
      ]);

      res.status(200).json({ status: 200, data: daWorkItemStatus, message: 'get work item status succeed' });
    } catch (error) {
      next(error);
    }
  }

  public updateWorkItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workItemId: string = req.params.id;
      const workItemData: CreateWorkItemDto = req.body;
      const workItem: WorkItem = await this.workItemService.updateWorkItem(workItemId, workItemData);

      res.status(200).json({ status: 200, data: workItem, message: 'Update work item succeed' });
    } catch (error) {
      next(error);
    }
  }

  public deleteWorkItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workItemId: string = req.params.id;
      const workItem: WorkItem = await this.workItemService.deleteWorkItem(workItemId);

      res.status(200).json({ status: 200, data: workItem, message: 'Delete work item succeed' });
    } catch (error) {
      next(error);
    }
  };
}

export default WorkItemsController;
