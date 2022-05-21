import { isValidObjectId, connection } from 'mongoose';
import { hash } from 'bcrypt';
import { HttpException } from '@exceptions/HttpException';
import { CreateWorkItemDto } from '@dtos/workItems.dto';
import { WorkItem } from '@interfaces/workItems.interface';
import { isEmpty } from '@utils/util';
import workItemModel from '@models/workItems.model';
import { dbConnection } from '@/databases';
import WorkItemModel from '@models/workItems.model';
import ValidationService from './validation.service';
import { mergeUpdate } from '@/utils/transform';

class WorkItemService {
  public async findAllWorkItem(): Promise<WorkItem[]> {
    const workItems: WorkItem[] = await workItemModel.find();
    return workItems;
  }

  public async findWorkItemById(workItemId: string): Promise<WorkItem> {
    if(isEmpty(workItemId)) throw new HttpException(400, `Work item id not provided`);
    if(!isValidObjectId(workItemId)) throw new HttpException(404, `Work item '${workItemId}' not found`);

    const workItem: WorkItem = await workItemModel.findOne({_id: workItemId});
    return workItem;
  }

  public async findWorkItemByDaId(daWorkItemId: string): Promise<WorkItem>{
    if(isEmpty(daWorkItemId)) throw new HttpException(400, `Design Automation work item id not provided`);

    const workItem: WorkItem = await workItemModel.findOne({daWorkItemId: daWorkItemId});
    return workItem;
  }

  public async createWorkItem(workItemData: CreateWorkItemDto): Promise<WorkItem>{
    if(isEmpty(workItemData)) throw new HttpException(400, 'Work item data not complete');

    const workItem: WorkItem = await workItemModel.findOne({ daWorkItemId: workItemData.daWorkItemId });
    if (workItem) throw new HttpException(409, `Work item '${workItemData.daWorkItemId}' already exists`);

    const createdWorkItem: WorkItem = await workItemModel.create({ ...workItemData });
    if(!createdWorkItem) throw new HttpException(500, 'Cannot create work item');

    return createdWorkItem;
  }

  public async updateWorkItem(workItemId: string, workItemData: CreateWorkItemDto): Promise<WorkItem> {
    if(isEmpty(workItemData)) throw new HttpException(400, 'Work item data not complete');
    if(!isValidObjectId(workItemId)) throw new HttpException(409, `Work item '${workItemId}' not found`);

    let updatedWorkItem: WorkItem;

    const session = await connection.startSession();
    await session.withTransaction(async () => {
      const workItem: WorkItem = await workItemModel.findOne({_id: workItemId}).lean().session(session);
      if(!workItem) throw new HttpException(409, `Work item '${workItemId}' not found`);

      if(workItemData.daWorkItemId) {
        const workItemByDaWorkItemId: WorkItem = await WorkItemModel.findOne({daWorkItemId: workItemData.daWorkItemId});
        if(workItemByDaWorkItemId && workItemByDaWorkItemId._id != workItemId) throw new HttpException(409, `Design Automation work item with id '${workItemData.daWorkItemId}' already exists`);
      }

      //await ValidationService.validateWorkItem(workItemData);

      updatedWorkItem = await WorkItemModel.findByIdAndUpdate(workItemId, { ...mergeUpdate(workItem, workItemData) }, { new: true, session });
    });

    session.endSession();

    if(!updatedWorkItem) throw new HttpException(409, 'Cannot update work item');
    return updatedWorkItem;
  }

  public async deleteWorkItem(workItemId: string): Promise<WorkItem> {
    if(!isValidObjectId(workItemId)) throw new HttpException(409, `Work item '${workItemId}' not found`);

    const deletedWorkItem: WorkItem = await workItemModel.findByIdAndDelete(workItemId);
    if(!deletedWorkItem) throw new HttpException(409, 'Cannot delete work item');

    return deletedWorkItem;
  }

}

export default WorkItemService;
