import express from 'express';
import cors from 'cors';
import fs from 'fs';

import errorHandler from './middlewares/errorHandler.js';
import communityMemberRoutes from './api_routing/community_member.js';
import memberRoutes from './api_routing/members.js';
import communitiesRoutes from './api_routing/communities.js';
import excelUploadRoutes from './api_routing/excelUpload.routes.js'; // 🆕 הוספה

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🆕 הוספה לטיפול בform data

// יצירת תיקיית uploads אם לא קיימת
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('📁 Created uploads directory');
}

// CORS setup: allow frontend to talk to backend
app.use(cors({
     origin: '*', //("for time of dev")
//   origin: 'http://0.0.0.0:3000', 
//   credentials: true, 
}));

// Routes
app.use('/member', communityMemberRoutes); 
app.use('/members', memberRoutes);
app.use('/upload-excel', excelUploadRoutes); // for compatibility with existing code
// app.use('/', excelUploadRoutes); // 🆕 הוספה - routes לאקסל
//app.use('/manager/search', searchRoutes);

// app.use('/member', uploadRoutes);
 
app.use("/communities", communitiesRoutes);

// routes not found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// ־middleware 
app.use(errorHandler);

export default app;