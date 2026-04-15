import React from 'react'
import PieChart from './PieChart'
import { useState } from 'react'
import AgeDetail from '../../../components/EmpAge'

const OrdersInHand = (selectedPie,setSelectedPie) => {
      const [openpopup,setOpenpopup] = useState(false)
          const [selected, setSelected] = useState();
      
    return (
        <>
          {openpopup && (<AgeDetail selectedBuyer={selected} setOpenpopup ={setOpenpopup} openpopup={openpopup}  />)}
          <PieChart  selected = {selected} setSelected= {setSelected} setOpenpopup ={setOpenpopup} openpopup={openpopup}  />
        </>
       
    )
}

export default OrdersInHand