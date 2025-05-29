import { Router } from 'express';
import * as salaryController from '../controllers/salaryController';

const router = Router();

router.get('/driver/list', salaryController.getDriverSalaries);

export default router;