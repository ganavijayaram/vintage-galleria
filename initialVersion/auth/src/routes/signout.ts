import express from "express";

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
  //setting the cookie to null
  req.session = null
  res.send({})
})

//renaming it because we will have multiple routers
export {router as signoutRouter}