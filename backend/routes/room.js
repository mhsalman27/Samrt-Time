import Router from "express"
let router=Router();
router.get("/",(req,res)=>{res.send("i am room home")})
export default router;