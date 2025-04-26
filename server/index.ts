// server/index.ts
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 4000;

const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'resumes'));
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const resumeUpload = multer({ 
  storage: resumeStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  }
});

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/resumes', express.static(path.join(__dirname, 'resumes')));

app.post('/upload-resume', resumeUpload.single('resume'), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'لم يتم رفع أي ملف.' });
  }
  return res.json({ message: 'تم رفع السيرة الذاتية بنجاح', fileName: req.file.filename });
});

// إعداد التخزين باستخدام multer
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.array('files'), (req: any, res: any) => {
  const fileNames = req.files?.map((file: any) => file.filename) || [];
  res.json({ message: 'تم رفع الملفات بنجاح', fileNames });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
