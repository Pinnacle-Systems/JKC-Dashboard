import { Router } from 'express';

import { Add_role,  createRoleOnPage, deleteRole, get_Role, getUserPages, UpdateRole } from '../services/RoleMaster.service.js';
import { getCompCodeData } from '../services/commonMasters.service.js';

const router = Router();

router.post('/', Add_role);

router.get('/get',get_Role)

router.get('/getuserpages',getUserPages)

router.post('/createRoleOnPage', createRoleOnPage);

router.delete('/', deleteRole)

router.post('/updaterole', UpdateRole)

// router.post('/addnewuser', AddNewUser);


export default router;