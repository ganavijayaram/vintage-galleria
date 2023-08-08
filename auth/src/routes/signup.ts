import express from "express";

const router = express.Router()

router.post('/api/users/signup', (req, res) => {
  res.send("Ganavi got an internship and fulltime in signup!!!")
})

//renaming it because we will have multiple routers
export {router as signupRouter}