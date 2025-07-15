import XLSX from 'xlsx';
import {createMemberWithLinkedIn} from './memberService.js';
class ExcelUrlProcessor {
  
 async processExcelFile(file) {
    console.log(`📁 Processing Excel file: `);
  // קריאת הקובץ
   console.log(file);
  const workbook = XLSX.readFile(file)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`📋 Found ${data.length} rows from file: ${file.originalname || file.filename || 'unknown'}`);
;
    
    console.log(`📋 Found ${data.length} rows`);
    
    // עיבוד כל שורה
    const results = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const url = Object.values(row)[0]; // URL מהעמודה הראשונה
      
      if (url && url.trim()) {
        console.log(`🔄 Processing row ${i + 1}: ${url}`);
        
        try {
          // הפעלת השורה - כאן תוכל להוסיף הלוגיקה שלך
          const result = await this.processUrl(url, i + 1);
          results.push(result);
          
        } catch (error) {
          console.error(`❌ Error in row ${i + 1}:`, error);
          results.push({
            rowNumber: i + 1,
            url: url,
            success: false,
            error: error.message
          });
        }
      }
    }
    
    return {
      totalRows: data.length,
      processedRows: results.length,
      results: results
    };
  }
  
  async processUrl(url, rowNumber) {
    // כאן תוכל להוסיף מה שצריך לעשות עם כל URL
    console.log(`✅ Processing URL: ${url}`);
    const data = await createMemberWithLinkedIn(url);
    console.log(`📊 Data for row ${rowNumber}:`, data);
    // דוגמה - כאן תוכל להוסיף:
    // - חיפוש במסד נתונים
    // - קריאה ל-API
    // - עדכון נתונים
    // - וכו'
    
    return {
      rowNumber: rowNumber,
      url: url,
      success: true,
      processedAt: new Date().toISOString()
    };
  }
}

export default ExcelUrlProcessor;