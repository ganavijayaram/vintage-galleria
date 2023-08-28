import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@vintagegalleria/common";
import express, { Request, Response } from "express";
import { Artifact } from "../models/artifact";
import { body } from "express-validator";


import {Artifact}
const router = express.Router()

router.put('/api/artifacts/:id',
 requireAuth ,
 [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Please provide Title'),
  body('price')
    .isFloat({gt: 0})
    .withMessage('Price has to be greater than 0')
],
 validateRequest,
  async(req: Request, res: Response) => {

    const artifact = await Artifact.findById(req.params.id)
    if(!artifact) {
      throw new NotFoundError()
    }

    if(artifact.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    artifact.set({
      title: req.body.title,
      price:  req.body.price
    })

    await artifact.save()

    res.send(artifact)
})

export {router as updateArtifactRouter}