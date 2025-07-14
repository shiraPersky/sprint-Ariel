import express from 'express';
const router = express.Router();

// definition
router.get('/', (req,res)=>{
    try{

    }
    catch(err) {
res.status(400).send("[]")
    }
});

router.get('/id:', anotherFunc);

export default router;