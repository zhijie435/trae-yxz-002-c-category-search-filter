import { Router } from 'express'
import {
  searchRobots,
  getRobotById,
  getScenarios,
  getSuggestions,
} from '../controllers/robots.controller'

const router = Router()

router.get('/robots', searchRobots)
router.get('/robots/:id', getRobotById)
router.get('/scenarios', getScenarios)
router.get('/suggest', getSuggestions)

export default router
