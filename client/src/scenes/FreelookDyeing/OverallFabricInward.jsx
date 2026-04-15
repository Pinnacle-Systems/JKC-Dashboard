import { useState } from "react";
import { useGetFinYearQuery } from "../../redux/service/misDashboardService";
import InwardType from "./FabricInward/inwardType";

const OverallFabricInward = () => {
    const [fYear, setFYear] = useState("25-26")
    const { data: finYear } = useGetFinYearQuery()
    return (
        <>
            <InwardType year={fYear} finYear={finYear} />
        </>
    )
}

export default OverallFabricInward