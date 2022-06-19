import { NextFunction, Request, Response } from 'express';
import { TokenData } from '@/interfaces/auth.interface';
import ForgeService from '@services/forge.service';
import { openStdin } from 'process';
import { stopCoverage } from 'v8';
import { RequestWithFile } from'@/interfaces/files.interface';
import { RequestWithUrl } from '@/interfaces/urls.interface';

class ForgeController {
    public forgeService = new ForgeService();

    public getForgeToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.forgeService.getAccessToken();
            console.log(`[Forge] Token: ${token.token}`);
            console.log(`[Forge] Token Type: ${token.tokenType}`);
            console.log(`[Forge] Token expires in: ${token.expiresIn}`);
            res.status(200).json({ status: 200, data: token, message: 'Get forge token succeed' });
        } catch (error) {
            next(error);
        }
    }

    public uploadInputFile = async (req: RequestWithFile | any, res: Response, next: NextFunction) => {
        try {
            console.log(`[Forge] Starting upload in controller...`);
            console.log(req.file);
            const fileName = `${Date.now().toString()}-${req.file.originalname}`;
            const forgeFileData = await this.forgeService.uploadInputFile(req.file.buffer, fileName);
            const [downloadUrlData, uploadUrlData] = await Promise.all([
                this.forgeService.getTemporaryDownloadUrl(fileName),
                this.forgeService.getTemporaryUploadUrl(`result-${fileName}`)
            ]);

            const data = {
                downloadUrl: downloadUrlData,
                uploadUrl: uploadUrlData
            };
            res.status(200).json({ status: 200, data: data, message: 'Upload input file succeed' });
        } catch (error) {
            next(error);
        }
    }

    public createWorkItem = async (req: RequestWithUrl, res: Response, next: NextFunction) => {
        try {
            console.log(`[Forge] Start to create a work item...`);
            const [workItem] = await Promise.all([
                this.forgeService.createWorkItem(req.body.downloadUrl, req.body.uploadUrl, req.body.rvtVersion)
            ]);
            res.status(200).json({ status: 200, data: {daWorkItemId: workItem.daWorkItemId, daWorkItem: workItem.daWorkItem}, message: 'create work item succeed' });
        } catch (error) {
            next(error);
        }
    }

    public getWorkItemStatus = async (req: RequestWithUrl, res: Response, next: NextFunction) => {
        try {
            console.log(`[Forge] Start to get a work item status...`);
            const daWorkItemId = req.params.id;
            const [daWorkItemStatus] = await Promise.all([
                this.forgeService.getWorkItemStatus(daWorkItemId)
            ]);
            res.status(200).json({ status: 200, data: daWorkItemStatus, message: 'get work item status succeed' });
        } catch (error) {
            next(error);
        }
    }

}

export default ForgeController;
