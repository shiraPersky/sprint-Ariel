import express from 'express';
const router = express.Router();

// definition
router.get('/:id/data', controllerFunc);

router.put('/:id/data', anotherFunc);

export default router;