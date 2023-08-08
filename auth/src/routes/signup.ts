import express from "express";

const router = express.Router()

router.post('/api/users/signup', (req, res) => {
  //instead of using if else to check if the right info has been provided
  // we will use express validator to validate our incoming requests
  // 
  const {email, password} = req.body
  res.send("Ganavi got an internship and fulltime in signup!!!")
})

//renaming it because we will have multiple routers
export {router as signupRouter}