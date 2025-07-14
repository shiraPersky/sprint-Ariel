import express from 'express';
const router = express.Router();

// definition
router.get('/', controllerFunc);

router.get('/id:', anotherFunc);

export default router;