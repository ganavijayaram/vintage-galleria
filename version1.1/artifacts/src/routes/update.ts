import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@vintagegalleria/common";
import express, { Request, Response } from "express";
import { Artifact } from "../models/artifact";
import { body } from "express-validator";


import { ArtifactUpdatedPublisher } from "../events/publishers/artifact-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    // Checking the of the artifact is already reserved
    if(artifact.orderId) {
      throw new BadRequestError('Artifact is already reserved')
    }

    if(artifact.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    artifact.set({
      title: req.body.title,
      price:  req.body.price
    })

    await artifact.save()

    // After saving the artifact we will publish an event
    new ArtifactUpdatedPublisher(natsWrapper.client).publish({
      id: artifact.id,
      version: artifact.version,
      title: artifact.title,
      price: artifact.price,
      userId: artifact.userId
    })

    res.send(artifact)
})

export {router as updateArtifactRouter}