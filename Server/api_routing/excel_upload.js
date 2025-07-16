import express from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const router = express.Router();

// יצירת __dirname עבור ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// יצירת תיקיית uploads אם לא קיימת
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// ==============================================
// 🔥 ייבוא הפונקציה שלך לעיבוד LinkedIn URLs
// ==============================================
import { createMemberWithLinkedIn } from '../services/memberService.js'; // התאם את הנתיב
router.post('/add-linkedin-member', async (req, res) => {
  try {
    console.log('🔗 Received LinkedIn URL addition request');
    
    const { linkedin_url } = req.body;
    
    // קריאה לפונקציה מה-service שעושה את כל העבודה
    const result = await processLinkedInUrl(linkedin_url);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'LinkedIn member added successfully',
        data: {
          member: result.data,
          linkedin_url: linkedin_url,
          processing_time: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to add LinkedIn member',
        details: result.details,
        linkedin_url: linkedin_url
      });
    }
    
  } catch (error) {
    console.error('❌ Error in add-linkedin-member route:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});
async function processLinkedInUrl(url) {
  try {
    console.log('🔄 Processing LinkedIn URL:', url);
    
    // קריאה לפונקציה שלך שמוסיפה חבר מ-LinkedIn
    const result = await createMemberWithLinkedIn(url);
    
    return {
      success: true,
      url: url,
      message: 'LinkedIn member added successfully',
      data: {
        id_community_member: result.id_community_member,
        name: result.processed_data?.english_name || 'Unknown',
        title: result.processed_data?.title || 'No Title',
        city: result.processed_data?.city || 'Unknown Location',
        linkedin_url: url,
        years_of_experience: result.processed_data?.years_of_experience || 0
      }
    };
    
  } catch (error) {
    console.error('❌ Error processing LinkedIn URL:', url, error.message);
    return {
      success: false,
      url: url,
      error: error.message,
      details: error.status ? `Status: ${error.status}` : 'Unknown error'
    };
  }
}

// פונקציה לעיבוד קובץ Excel ומציאת LinkedIn URLs
const processExcelFile = (filePath) => {
  try {
    console.log('📊 Processing Excel file:', filePath);
    
    // קריאת הקובץ
    const workbook = XLSX.readFile(filePath);
    
    // קבלת שמות הגיליונות
    const sheetNames = workbook.SheetNames;
    console.log('📋 Sheet names:', sheetNames);
    
    const allUrls = [];
    
    // עיבוד כל גיליון
    sheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      
      // ניסיון ראשון: עם headers
      const jsonDataWithHeaders = XLSX.utils.sheet_to_json(worksheet);
      // ניסיון שני: כ-array של arrays (גולמי)
      const jsonDataRaw = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log(`📄 Processing sheet: ${sheetName}`);
      console.log(`   With headers: ${jsonDataWithHeaders.length} rows`);
      console.log(`   Raw data: ${jsonDataRaw.length} rows`);
      
      // עיבוד נתונים עם headers (אם קיימים)
      if (jsonDataWithHeaders.length > 0) {
        jsonDataWithHeaders.forEach((row, index) => {
          Object.keys(row).forEach(column => {
            const cellValue = row[column];
            
            if (typeof cellValue === 'string') {
              const linkedinPattern = /https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s,;.\)]+/g;
              const urls = cellValue.match(linkedinPattern);
              
              if (urls) {
                urls.forEach(url => {
                  const cleanUrl = url.trim().replace(/[,;.\s\)]+$/, '');
                  allUrls.push({
                    url: cleanUrl,
                    sheet: sheetName,
                    row: index + 1,
                    column: column,
                    source: 'headers'
                  });
                });
              }
            }
          });
        });
      }
      
      // עיבוד נתונים גולמיים (במקרה שאין headers או שלא מצאנו כלום)
      jsonDataRaw.forEach((row, rowIndex) => {
        if (Array.isArray(row)) {
          row.forEach((cell, colIndex) => {
            if (typeof cell === 'string') {
              const linkedinPattern = /https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s,;.\)]+/g;
              const urls = cell.match(linkedinPattern);
              
              if (urls) {
                urls.forEach(url => {
                  const cleanUrl = url.trim().replace(/[,;.\s\)]+$/, '');
                  // בדיקה שלא נוסיף אותו פעמיים
                  const exists = allUrls.some(existingUrl => existingUrl.url === cleanUrl);
                  if (!exists) {
                    allUrls.push({
                      url: cleanUrl,
                      sheet: sheetName,
                      row: rowIndex + 1,
                      column: String.fromCharCode(65 + colIndex), // A, B, C...
                      source: 'raw'
                    });
                  }
                });
              }
            }
          });
        }
      });
    });
    
    console.log(`🔍 Found ${allUrls.length} LinkedIn URLs in Excel file`);
    
    // הדפסת כל ה-URLs שנמצאו
    allUrls.forEach((urlData, index) => {
      console.log(`   ${index + 1}. ${urlData.url} (${urlData.sheet}, row ${urlData.row}, col ${urlData.column})`);
    });
    
    return allUrls;
    
  } catch (error) {
    console.error('❌ Error processing Excel file:', error);
    throw error;
  }
};

// ==============================================
// פונקציה לעיבוד כל ה-LinkedIn URLs
// ==============================================
async function processAllLinkedInUrls(urls) {
  try {
    console.log('🚀 Starting to process all LinkedIn URLs...');
    
    const results = {
      total: urls.length,
      successful: 0,
      failed: 0,
      details: [],
      errors: []
    };
    
    // עיבוד כל LinkedIn URL בלולאה
    for (let i = 0; i < urls.length; i++) {
      const urlData = urls[i];
      
      console.log(`🔄 Processing LinkedIn URL ${i + 1}/${urls.length}: ${urlData.url}`);
      
      try {
        // קריאה לפונקציה שלך להוספת חבר מ-LinkedIn
        const result = await processLinkedInUrl(urlData.url);
        
        if (result.success) {
          results.successful++;
          results.details.push({
            ...result,
            position: { 
              sheet: urlData.sheet, 
              row: urlData.row, 
              column: urlData.column 
            }
          });
          console.log(`✅ Successfully added member: ${result.data.name}`);
        } else {
          results.failed++;
          results.errors.push({
            ...result,
            position: { 
              sheet: urlData.sheet, 
              row: urlData.row, 
              column: urlData.column 
            }
          });
          console.log(`❌ Failed to add member from: ${urlData.url}`);
        }
        
      } catch (error) {
        results.failed++;
        results.errors.push({
          success: false,
          url: urlData.url,
          error: error.message,
          position: { 
            sheet: urlData.sheet, 
            row: urlData.row, 
            column: urlData.column 
          }
        });
        console.log(`❌ Exception processing: ${urlData.url} - ${error.message}`);
      }
      
      // הוספת delay בין בקשות כדי לא להעמיס על LinkedIn/Apify
      if (i < urls.length - 1) {
        console.log('⏳ Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`✅ Finished processing LinkedIn URLs. Success: ${results.successful}, Failed: ${results.failed}`);
    return results;
    
  } catch (error) {
    console.error('❌ Error processing LinkedIn URLs:', error);
    throw error;
  }
}

// Route להעלאת Excel ועיבוד URLs
router.post('/upload-excel', async (req, res) => {
  try {
    console.log('📤 Received Excel upload request');
    
    const { fileData, fileName, fileSize } = req.body;
    
    // בדיקת תקינות הנתונים
    if (!fileData || !fileName) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: fileData or fileName' 
      });
    }
    
    // בדיקת גודל הקובץ (מקסימום 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      return res.status(413).json({ 
        success: false,
        error: 'File too large. Maximum size is 10MB' 
      });
    }
    
    // בדיקת פורמט הקובץ
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = path.extname(fileName).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid file format. Only .xlsx and .xls files are allowed' 
      });
    }
    
    // יצירת שם קובץ ייחודי
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);
    
    // המרת base64 לקובץ
    const buffer = Buffer.from(fileData, 'base64');
    fs.writeFileSync(filePath, buffer);
    
    console.log('💾 File saved to:', filePath);
    
    // עיבוד הקובץ ומציאת URLs
    const urls = processExcelFile(filePath);
    
    if (urls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No LinkedIn URLs found in Excel file. Please make sure the file contains LinkedIn profile URLs.'
      });
    }
    
    // עיבוד כל ה-LinkedIn URLs
    const processingResults = await processAllLinkedInUrls(urls);
    
    // מחיקת הקובץ הזמני
    try {
      fs.unlinkSync(filePath);
      console.log('🗑️ Temporary file deleted');
    } catch (deleteError) {
      console.warn('⚠️ Could not delete temporary file:', deleteError.message);
    }
    
    // החזרת תגובה
    res.json({
      success: true,
      message: `Excel file processed successfully. ${processingResults.successful} LinkedIn members added successfully, ${processingResults.failed} failed.`,
      data: {
        fileName: fileName,
        fileSize: fileSize,
        linkedinUrlsFound: urls.length,
        processingResults: {
          total: processingResults.total,
          successful: processingResults.successful,
          failed: processingResults.failed,
          successfulMembers: processingResults.details,
          failedAttempts: processingResults.errors
        },
        uploadTime: new Date().toISOString(),
        summary: {
          totalLinkedInUrls: processingResults.total,
          successfullyAdded: processingResults.successful,
          failedToAdd: processingResults.failed,
          successRate: processingResults.total > 0 ? `${Math.round((processingResults.successful / processingResults.total) * 100)}%` : '0%'
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error in upload-excel route:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Route לקבלת סטטוס העלאות
router.get('/upload-status', async (req, res) => {
  try {
    // כאן תוכל להוסיף לוגיקה לקבלת סטטוס העלאות מה-DB
    res.json({
      success: true,
      message: 'Upload status retrieved successfully',
      data: {
        totalUploads: 0, // החלף בנתונים אמיתיים מה-DB
        recentUploads: [] // החלף בנתונים אמיתיים מה-DB
      }
    });
  } catch (error) {
    console.error('❌ Error getting upload status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

export default router;