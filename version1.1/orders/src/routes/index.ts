import express, {Request, Response} from 'express'

const router = express.Router()

router.get('/api/orders/delete', async (req: Request, res: Response) => {
  res.send({"message": "Everything good is happening to Ganavi!"})
})

export {router as indexOrderRouter}