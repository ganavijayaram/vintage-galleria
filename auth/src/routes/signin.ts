import express from "express";

const router = express.Router()

router.post('/api/users/signin', (req, res) => {
  res.send("Ganavi got an internship and fulltime in signin!!!")
})

//renaming it because we will have multiple routers
export {router as signinRouter}