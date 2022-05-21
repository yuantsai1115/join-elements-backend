import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { _id: false } })
class DaFileArgument{  
  @prop({ type: String, required: true })
  public url: string;

  @prop({ type: String })
  public verb?: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class DaArgument{
  @prop({ type: [DaFileArgument], required: true })
  public rvtFile: DaFileArgument;

  @prop({ type: [DaFileArgument], required: true })
  public result: DaFileArgument;

}

@modelOptions({ schemaOptions: { _id: false } })
class DaWorkItem {

  @prop({ type: String, required: true })
  public activityId: string;

  @prop({ type: [DaArgument], required: true })
  public arguments: DaArgument

}

@modelOptions({ schemaOptions: { collection: 'workItems', timestamps: true, versionKey: false } })
class WorkItem {

  @prop({ type: String, required: true })
  public daWorkItemId: string;

  @prop({ type: String })
  public email?: string;

  @prop({ type: [DaWorkItem], required: true })
  public daWorkItem: DaWorkItem;

  public createdAt?: Date;

  public updatedAt?: Date;
}

const WorkItemModel = getModelForClass(WorkItem);

export default WorkItemModel;
