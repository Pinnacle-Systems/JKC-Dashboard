import { Router } from 'express';

import { get, getActualVsBudget, getActualVsBudgetValueMonthWise, getBuyerWiseRevenue, getESIPF,executeProcedure, getOrdersInHand,getEmployeesDetail,
    getSalarydet,  getOrdersInHandMonthWise, getShortShipmentRatio, getYearlyComp, 
    getpfdet,getesidet,getattdet,getagedet,getexpdet,getbgdet,getEmployeesDetail1,getPfDataDet,getEsiDataDet,
    getESIPF1,getattdetTable,
    getretdetTable,getLeaveAvailable,getlongAbsent,getFullPrasent,getPayPeriod,
    getFinYear,getEmployeeHeadCount,getHeadDetail,
    getESIlastmonth,
    getPFlastmonth,
    getregionCount,
    getOTwagesdet,
    getSalaryAgewise,
    getAgewiseESI,
    getLastSalarydet,
    getSalarydet1,
    getnewjoin,
    getStateWiseHeadCount} from '../services/misDashboard.service.js';

const router = Router();

router.get('/', get);

router.get('/ordersInHand', getOrdersInHand);

router.get('/employeeDet',getEmployeesDetail);

router.get('/employeeDetail',getEmployeesDetail1);

router.get('/otwagesdet',getOTwagesdet);

router.get ('/salaryDet',getSalarydet)

router.get ('/salaryDet1',getSalarydet1)

router.get ('/lastsalaryDet',getLastSalarydet)

router.get ('/pfDet', getpfdet )

router.get ('/esiDet', getesidet )

router.get ('/AttDet', getattdet )

router.get ('/getNewjoin', getnewjoin )

router.get ('/AttDetTable', getattdetTable )

router.get ('/RetDetTable', getretdetTable)

router.get ('/HeadDetail', getHeadDetail)

router.get ('/AgeDet', getagedet )

router.get ('/ExpDet', getexpdet )

router.get ('/BgDet', getbgdet )

router.get ('/PfDataDet', getPfDataDet)

router.get ('/EsiDataDet', getEsiDataDet)

router.get ('/leaveAvailable',getLeaveAvailable)

router.get ('/headCount',getEmployeeHeadCount)

router.get ("/LongAbsent",getlongAbsent)

router.get('/FullPrasent', getFullPrasent)

router.get('/PayPeriod',getPayPeriod)

router.get('/finYear',getFinYear)

router.get('/salaryAgewise',getSalaryAgewise)

router.get('/agewiseesi',getAgewiseESI)

router.get('/ordersInHandMonthWise', getOrdersInHandMonthWise);

router.get('/actualVsBudgetValueMonthWise', getActualVsBudgetValueMonthWise);

router.get('/yearlyComp', getYearlyComp)

router.get('/getregionCount', getregionCount)

router.get('/buyerWiseRev', getBuyerWiseRevenue)

router.get('/actualVsBudget', getActualVsBudget)

router.get('/shortShipment', getShortShipmentRatio)

router.get('/getESIPF', getESIPF)

router.get('/getESIPF1', getESIPF1)

router.get('/getEsilastmonth',getESIlastmonth)

router.get('/getPFlastmonth',getPFlastmonth)

router.put('/execute-procedure', executeProcedure)

router.get('/stateWiseHeadCount', getStateWiseHeadCount)


export default router;