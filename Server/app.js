import express from 'express';
import cors from 'cors';

import errorHandler from './middlewares/errorHandler.js';
import communityMemberRoutes from './api_routing/community_member.js';

import memberRoutes from './api_routing/members.js';


import communitiesRoutes from './api_routing/communities.js'

const app = express();
app.use(express.json());

// CORS setup: allow frontend to talk to backend
app.use(cors({
     origin: 'http://localhost:5173',
      credentials: true
}));

app.use('/member', communityMemberRoutes); 
app.use('/members', memberRoutes);

//app.use('/manager/search', searchRoutes);
 
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