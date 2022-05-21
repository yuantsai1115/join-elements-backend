import { IsEmail, IsString, ValidateNested, IsInt, IsPositive, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class DaFileArgument {
  @IsString()
  public url: string;

  @IsString()
  @IsOptional()
  public verb?: string;
}

export class DaArgument {
  @ValidateNested()
  @Type(() => DaFileArgument)
  public rvtFile: DaFileArgument;

  @ValidateNested()
  @Type(() => DaFileArgument)
  public result: DaFileArgument;
}

export class DaWorkItem {
  @IsString()
  public activityId: string;

  @ValidateNested()
  @Type(() => DaArgument)
  public arguments: DaArgument;
}

export class CreateWorkItemDto {
  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  public daWorkItemId: string;

  @ValidateNested()
  @Type(() => DaWorkItem)
  public daWorkItem: DaWorkItem; 
}
