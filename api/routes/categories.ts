import { Router } from 'express'
import {
  getManufacturers,
  getHotAccessories,
  getPackages,
  getSolutions,
  getAiArticles,
  getScenarioCategories,
} from '../controllers/categories.controller'

const router = Router()

router.get('/manufacturers', getManufacturers)
router.get('/accessories/hot', getHotAccessories)
router.get('/packages', getPackages)
router.get('/solutions', getSolutions)
router.get('/ai-articles', getAiArticles)
router.get('/scenario-categories', getScenarioCategories)

export default router
