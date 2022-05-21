import { Request } from 'express';

export interface SignedUrl {
    signedUrl: string;
    expiration: number;
    singleUse: boolean;
}

export interface RequestWithUrl extends Request {
    downloadUrl: string;
    uploadUrl: string;
}