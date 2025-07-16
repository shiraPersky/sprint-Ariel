import express from 'express';
import cors from 'cors';

import errorHandler from './middlewares/errorHandler.js';
import communityMemberRoutes from './api_routing/community_member.js';
import memberRoutes from './api_routing/members.js';
import communitiesRoutes from './api_routing/communities.js';
import excelUploadRoutes from './api_routing/excel_upload.js'; // הוספת הroute החדש
import eventRoutes from './api_routing/events.js';
const app = express();

// הגדלת limit עבור קבצים גדולים
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS setup: allow frontend to talk to backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/member', communityMemberRoutes); 
app.use('/members', memberRoutes);
app.use("/communities", communitiesRoutes);
app.use('/excel', excelUploadRoutes); // הוספת הroute להעלאת Excel
app.use('/events',eventRoutes);
//app.use('/manager/search', searchRoutes);

// routes not found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// middleware 
app.use(errorHandler);

export default app;