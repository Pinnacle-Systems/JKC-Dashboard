import React, { useState } from 'react';
import PoRegister from './poRegister';
import PoParameters from './poParameters';
import Header from './header'; // Import the Header component

import ActivePoCharts from '../ActivePoCharts';


const Index = () => {
  const [year, setYear] = useState([]);
  const [month, setMonth] = useState([])
  const [date, setDate] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState([])
  const [selectedArticleId, setSelectedArticleId] = useState([])
  return (
    <div className='h-full w-full overflow-scroll'>
      <div className='w-full h-[9%] '>
        <Header setYear={setYear} year={year} setMonth={setMonth} month={month} setDate={setDate} date={date} setSelectedSupplier={setSelectedSupplier} setSelectedArticleId={setSelectedArticleId} />
      </div>
      <div className='flex w-[100%] h-[100%] pl-2' >
        <div className='w-[80%] h-[90%] '>
          <PoRegister year={year} month={month} date={date} selectedSupplier={selectedSupplier} selectedArticleId={selectedArticleId} />
        </div>{console.log(date, 'date 23')}
        <div className='w-[20%] h-[90%]'>
          <PoParameters selectedSupplier={selectedSupplier} setSelectedSupplier={setSelectedSupplier} selectedArticleId={selectedArticleId} setSelectedArticleId={setSelectedArticleId} />
        </div>

      </div>
      <div className='h-full w-full'>

        <div className='w-full' ><ActivePoCharts /></div>
      </div>
    </div>
  );
}

export default Index;
