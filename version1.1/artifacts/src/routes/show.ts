import express, {Request, Response} from "express";
import { Artifact } from "../models/artifact";
import { NotFoundError } from "@vintagegalleria/common";


const router = express.Router()

// We dont need authentication for showing artifacts
router.get('/api/artifacts/:id', async(req: Request, res: Response)=> {
  //params is from teh URL
  const artifact =  await Artifact.findById(req.params.id)
  if(artifact == null) {
    throw new NotFoundError()
  }
  res.send(artifact)
})



export {router as showArtifactRouter}