import multer from "multer";
import path from "path";
import fs from "fs"
import { AuthRequest } from "../middlewares/auth.js";

export const createUpload = (folder: string) => {
  const folderPath = path.join(process.cwd(), "storage", folder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const storeId: undefined = undefined;
      const fileName = getFileName(req, file, storeId)
      
      // const { id } = req.params
      // const { name, ext } = path.parse(file.originalname);
      // const fileName = `${id || 'tmp'}-${name}${ext}`;
      cb(null, fileName);
    },
  });

  return multer({ storage });
}

export const getFileName = (req: AuthRequest, file: Express.Multer.File, storeId?: number) => {
  const { id } = req.params
  const { name, ext } = path.parse(file.originalname);
  const fileName = `${id || storeId || 'tmp'}-${name}${ext}`;
  return fileName
}
