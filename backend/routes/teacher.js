import Router from "express"
let router=Router();
router.get("/",(req,res)=>{res.send("i am teacher home")})
export default router;