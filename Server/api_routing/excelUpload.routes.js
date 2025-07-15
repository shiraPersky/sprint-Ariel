import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import  ExcelUrlProcessor  from '../services/excelUpload.service.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הגדרת multer לטיפול בקבצים
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // וודא שהתיקייה קיימת
  },
  filename: function (req, file, cb) {
    // שמירה עם timestamp למניעת התנגשויות
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // בדיקת סוג קובץ
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('רק קובצי Excel מותרים (.xlsx, .xls)'));
    }
  }
});

// POST /api/upload-excel - העלאת קובץ אקסל
router.post('/', async (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    
    // if (!fileData || !fileName) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'חסר קובץ או שם קובץ'
    //   });
    // }
    console.log('📁 Excel file upload started');
    console.log(req)
    // if (!req.file) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'לא נבחר קובץ'
    //   });
    // }

    // console.log('📋 File details:', {
    //   originalName: req.file.originalname,
    //   filename: req.file.filename,
    //   size: req.file.size,
    //   mimetype: req.file.mimetype
    // });

    // עיבוד הקובץ
    const processor = new ExcelUrlProcessor();
    console.log('📊 Processing Excel file:');
    const result = await processor.processExcelFile(req.file);

    // console.log('✅ Excel file processed successfully:', {
    //   recordsProcessed: result.recordsProcessed,
    //   recordsAdded: result.recordsAdded
    // });
    // console.log('✅ Excel file processed successfully:', result);
    // res.json({
    //   success: true,
    //   message: 'קובץ האקסל עובד בהצלחה',
    //   data: result,
    //   file: {
    //     originalName: req.file.originalname,
    //     size: req.file.size,
    //     uploadTime: new Date().toISOString()
    //   }
    // });

  } catch (error) {
    console.error('❌ Error processing Excel file:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'שגיאה בעיבוד קובץ האקסל',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET /api/upload-excel/template - הורדת קובץ תבנית
router.get('/template', (req, res) => {
  try {
    // יצירת קובץ אקסל תבנית
    const templateData = [
      {
        'שם באנגלית': 'John Doe',
        'תפקיד': 'Developer',
        'אימייל': 'john@example.com',
        'טלפון': '052-1234567',
        'עיר': 'תל אביב',
        'שנות ניסיון': 5,
        'קישור לינקדאין': 'https://linkedin.com/in/johndoe',
        'אודות': 'מפתח מנוסה',
        'פעיל': true
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'תבנית משתמשים');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="template_users.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    console.error('❌ Error creating template:', error);
    res.status(500).json({ success: false, error: 'שגיאה ביצירת התבנית' });
  }
});

export default router;
