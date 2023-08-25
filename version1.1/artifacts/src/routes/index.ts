import express, {Request, Response} from "express";
import { Artifact } from "../models/artifact";

const router = express.Router()

router.get('/api/artifacts', async(req: Request, res: Response) => {
  const artifacts =  await Artifact.find({})
  res.send(artifacts)
})

export {router as indexArtifactRouter}