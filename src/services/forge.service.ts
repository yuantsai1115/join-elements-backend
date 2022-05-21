import { FORGE_BASE_URL, FORGE_CLIENT_ID, FORGE_CLIENT_SECRET, FORGE_OSS_BUCKET_KEY, FORGE_DAS_API_ROOT, FORGE_ACTIVITY_ID } from '@config';
import axios from 'axios';
import { readBodyAsBuffer } from '@utils/util';
import { TokenData } from '@/interfaces/auth.interface';
import { SignedUrl } from '@interfaces/urls.interface';
import { DaWorkItemStatus, WorkItem } from '@interfaces/workItems.interface';

class ForgeService {    
    public async getAccessToken() {
        try {
            const options = {
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                }
            };
            const params = new URLSearchParams();
            params.append('client_id', FORGE_CLIENT_ID);
            params.append('client_secret', FORGE_CLIENT_SECRET);
            params.append('grant_type', 'client_credentials');
            params.append('scope', 'code:all data:write data:read bucket:create bucket:delete');
            let { data } = await axios.post(`${FORGE_BASE_URL}/authentication/v1/authenticate`, params, options);
            let token: TokenData = { token: data.access_token, expiresIn: data.expires_in, tokenType: data.token_type };
            console.log('[Forge] token received');
            return token;
        } catch (error) {
            console.error(error);
        }
    }

    public async uploadInputFile(buffer: Buffer, fileName: string) {
        // console.log('[Forge] start accessing token');
        let token = await this.getAccessToken();
        // console.log('[Forge] token received');
        const options = {
            headers: {
                "Content-Type": 'application/octet-stream',
                "Authorization": `${token.tokenType} ${token.token}`,
                "Accept-Encoding": 'gzip, deflate'
            }
        };
        let { data } = await axios.put(`${FORGE_BASE_URL}/oss/v2/buckets/${FORGE_OSS_BUCKET_KEY}/objects/${fileName}`, buffer, options);
        console.log("[Forge] upload file to forge OSS succeed");
        console.log(data);
        return data;
    }

    public async getTemporaryDownloadUrl(objectKey: string) {
        return new Promise<SignedUrl>(async (resolve, reject) => {
            console.log("[Forge] getting temporary download signed url");
            let token = await this.getAccessToken();
            const options = {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `${token.tokenType} ${token.token}`,
                    "Accept-Encoding": 'gzip, deflate'
                }
            };
            let { data } = await axios.post(`${FORGE_BASE_URL}/oss/v2/buckets/${FORGE_OSS_BUCKET_KEY}/objects/${objectKey}/signed`, {}, options);
            console.log("[Forge] get temporary download signed url succeed");
            console.log(data);
            resolve(data as SignedUrl);
        });
    }

    public async getTemporaryUploadUrl(objectKey: string) {
        return new Promise<SignedUrl>(async (resolve, reject) => {
            console.log("[Forge] getting temporary upload signed url");
            let token = await this.getAccessToken();
            const options = {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `${token.tokenType} ${token.token}`,
                    "Accept-Encoding": 'gzip, deflate'
                }
            };
            let { data } = await axios.post(`${FORGE_BASE_URL}/oss/v2/buckets/${FORGE_OSS_BUCKET_KEY}/objects/${objectKey}/signed?access=readwrite`, {}, options);
            console.log("[Forge] get temporary upload signed url succeed");
            console.log(data);
            resolve(data as SignedUrl);
        });
    }

    public async createWorkItem(ossDownloadUrl: string, ossUploadUrl: string){
        return new Promise<WorkItem>(async (resolve, reject) => {
            let token = await this.getAccessToken();
            const options = {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `${token.tokenType} ${token.token}`,
                    "Accept-Encoding": 'gzip, deflate'
                }
            };
            const body = {
                activityId: FORGE_ACTIVITY_ID,
                arguments: {
                    rvtFile: {
                        url: ossDownloadUrl
                    },
                    result: {
                        verb: "put",
                        url: ossUploadUrl
                    }
                }
            };
            let { data } = await axios.post(`${FORGE_DAS_API_ROOT}/workitems`, body, options);
            console.log("[Forge] create a work item succeed");
            console.log(data);

            let daWorkItemId = data.id;
            let daWorkItem = body;
            resolve({daWorkItemId: daWorkItemId, daWorkItem: daWorkItem} as WorkItem);
        });
    }

    public async getWorkItemStatus(daWorkItemId: string){
        return new Promise<DaWorkItemStatus>(async (resolve, reject) => {
            let token = await this.getAccessToken();
            const options = {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `${token.tokenType} ${token.token}`,
                    "Accept-Encoding": 'gzip, deflate'
                }
            };
            let { data } = await axios.get(`${FORGE_DAS_API_ROOT}/workitems/${daWorkItemId}`, options);
            console.log("[Forge] get status of a work item succeed");
            console.log(data);
            resolve(data as DaWorkItemStatus);
        });
    } 

}

export default ForgeService;


