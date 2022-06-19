export interface DaFileArgument{
  url: string;
  verb?: string;
}

export interface DaArgument{
  rvtFile: DaFileArgument;
  result: DaFileArgument;
}

export interface DaWorkItem {
  activityId: string;
  arguments: DaArgument;
}

export interface WorkItem {
  _id?: string;
  email?: string;
  rvtVersion?: number;
  daWorkItemId: string;
  daWorkItem: DaWorkItem;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DaStats{
  timeQueued?: string;
  timeDownloadStarted?: string;
  timeInstructionsStarted?: string;
  timeInstructionsEnded?: string;
  timeFinished?: string;
  bytesDownloaded?: number;
}

export interface DaWorkItemStatus {
  status?: string;
  reportUrl?: string;
  stats?: DaStats;
  id: string;
}