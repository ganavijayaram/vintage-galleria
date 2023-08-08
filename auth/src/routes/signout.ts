import express from "express";

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
  res.send("Ganavi got an internship and fulltime in signout!!!")
})

//renaming it because we will have multiple routers
export {router as signoutRouter}