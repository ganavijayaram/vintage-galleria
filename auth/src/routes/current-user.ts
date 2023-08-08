import express from "express";

const router = express.Router()

router.get('/api/users/currentuser', (req, res) => {

})

//renaming it because we will have multiple routers
export {router as currentUserRouter}