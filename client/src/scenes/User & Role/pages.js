import Roles from "."
import Main_Dashboad from "../maindashboard"
import MisDashboard from "../MisDashboard"
import MisDashboardERP from "../MisDashboard copy"
import OrderManagement from "../OrderManagement"
import PoRegister from "../poRegister/poRegister"
import UserCreation from "./Users"

const Pages = {
    
        "Dashboard": <MisDashboard />,
        "ERP": <MisDashboardERP />,
        "Employees Detail": <PoRegister />,
        'Order Status': <OrderManagement />,
        // "User": <OutlinedCard />,
        "User": {
            label: "User Management",
            Children: {
                "User": <UserCreation />,
                "Roles": <Roles />
            }
        },
        "Main": <Main_Dashboad />,
        

}

export default Pages