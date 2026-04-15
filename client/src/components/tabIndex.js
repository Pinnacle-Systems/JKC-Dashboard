import MisDashboard from "../scenes/MisDashboard";
import ERP from "../scenes/MisDashboard copy/index";
// import FinYear from "../../components/FinYear";
import Users from "../scenes/User & Role/Users";
import Roles from "../scenes/User & Role/Roles";
import mainDashboard from "../scenes/maindashboard/index";
import NumericCard from "../../src/components/NumericCard";
import HRDashboard from "../../src/scenes/hrdashboard/index";
import GarmentDashboard from "../../src/scenes/GarmentsDashboard/index";
import { list } from "@chakra-ui/system";
import { FreeLookDyeing, PurchaseDashboard } from "../scenes";
const tabs = [
  // {
  //   key: "Dashboard",
  //   name: "Dashboard",
  //   component: MisDashboard,
  //   list: true,
  //   list_name: "DashBoard",
  // },
  // { key: "EPR", name: "ERP", component: ERP, list: true, list_name: "ERP " },
  // { key: 'User', name: "User", component: Users ,list:true,list_name:"User Management"},
  // { key: "Roles", name: "Roles", component: Roles,list:true,list_name:"Role Management" },
  // {
  //   key: "MISDashboard",
  //   name: "MIS Dashboard",
  //   component: mainDashboard,
  //   list: true,
  //   list_name: "MIS Dashboard",
  // },
  // {
  //   key: "HR Dashboard",
  //   name: "HR Dashboard",
  //   component: HRDashboard,
  //   list: true,
  //   list_name: "HR Dashboard",
  // },
  // { key: "OnrollInsight", name: "Stock", component:NumericCard  ,list:true,default:false,list_name:"On Roll Insight" },
  // {
  //   key: "Dyeing Dashboard",
  //   name: "Dyeing Dashboard",
  //   component: FreeLookDyeing,
  //   list: true,
  //   list_name: "Dyeing Dashboard",
  // },
  {
    key: "Garments Dashboard",
    name: "Garments Dashboard",
    component: GarmentDashboard,
    list: true,
    list_name: "Garments Dashboard",
  },
  // {
  //   key: "Purchase Dashboard",
  //   name: "Purchase Dashboard",
  //   component: PurchaseDashboard,
  //   list: true,
  //   list_name: "Purchase Dashboard",
  // }
];

export default tabs;
