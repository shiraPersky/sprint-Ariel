import express from 'express';
import cors from 'cors';

import communityMemberRoutes from './api_routing/community_member.router.js';
import memberRoutes from './api_routing/members.router.js';
import searchRoutes from './api_routing/search.router.js';
import uploadRoutes from './api_routing/upload.router.js';
const app = express();
app.use(express.json());
app.use(cors());

app.use('/member', communityMemberRoutes); 
app.use('/manager/members', memberRoutes);
app.use('/manager/search', searchRoutes);
app.use('/member', uploadRoutes)
export default app;