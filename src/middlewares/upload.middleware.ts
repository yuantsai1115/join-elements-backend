import multer from 'multer';
import { UPLOAD_SIZE_LIMIT } from '@config';


const uploadMiddleware = () => {
    console.log(`[Upload] Starting upload in middleware...`);
    const storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/')
        },
        filename: function (req, file, cb) {
            console.log(file);
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    const upload = multer({
        //storage: storage, //saved as buffer in req when no specify storage
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(rvt)$/)) {
                cb(new Error('Only an rvt file allowed'))
            }
            cb(null, true)
        },
        limits: {
            fileSize: parseInt(UPLOAD_SIZE_LIMIT)*1024*1024 //20MB
        }
    }).single('input');
    return upload;
};

export default uploadMiddleware;