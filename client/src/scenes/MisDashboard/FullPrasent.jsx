import React, { useState, useCallback } from 'react';
import { useGetFullPrasentQuery } from '../../redux/service/misDashboardService';
import { useGetFinYearQuery } from '../../redux/service/misDashboardService';
import { useGetPayPeriodQuery } from '../../redux/service/misDashboardService';
import 'tailwindcss/tailwind.css';
import CardWrapper from '../../components/CardWrapper';
import BuyerMultiSelect4 from '../../components/ModelMultiSelect4';

const LongAbsent = () => {
 

  const [selected, setSelected] = useState();
  const [fYear,setFYear] = useState()
  const [payPeriod,setPayperiod] = useState()
  const [paycat, setPaycat] = useState('STAFF');
  const [showModel, setShowModel] = useState(false);

  // Build query parameters
  const queryParams = {
    compCode: selected || "AGF",
     payCat: paycat,
     payPeriod:payPeriod

  };

  const { data: fullPrasend, error, isLoading } = useGetFullPrasentQuery({
    params: queryParams
  },{skip:!payPeriod});
 console.log(fullPrasend,"fullparsend")
  const {data:finYear} =  useGetFinYearQuery()
const { data: payPeriodData } = useGetPayPeriodQuery(
  { params: { finYear: fYear } },
  { skip: !fYear }
);
console.log(payPeriod,"payPeriod")

   console.log(finYear, "finYear")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort data if needed
  const sortedData = React.useMemo(() => {
    if (!fullPrasend?.data) return [];

    let sortableItems = [...fullPrasend.data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle numeric sorting for idCard and sno
        if (sortConfig.key === 'idCard' || sortConfig.key === 'sno') {
          return sortConfig.direction === 'ascending'
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }

        // Handle string sorting for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [fullPrasend, sortConfig]);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <>
      <CardWrapper heading={"Full Prasent"} showFilter={true} onFilterClick={() => setShowModel(true)}>
        {showModel && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end z-50">
            <div className="w-full sm:w-[500px] bg-white rounded-t-2xl shadow-lg p-4 animate-slide-up">
              <BuyerMultiSelect4
                selected={selected}
                setSelected={setSelected}
                showModel={showModel}
                setShowModel={setShowModel}
              />
            </div>
          </div>
        )}

        {/* Date and Pay Category Filters */}
        <div className="flex flex-wrap gap-4 mb-4 p-2 bg-gray-50 rounded-md">
          
           <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">FinYear</label>
              <select
              value={fYear}
              onChange={(e) => setFYear(e.target.value)}
              className="border rounded-md text-xs p-1"
            >{finYear?.data?.map((option)=>{
              return <option key ={option.finYear} value={option.finYear}>{option.finYear}</option>
            })
            }
            </select>
          </div>
          {fYear &&
          <div className="flex flex-col">
  <label className="text-xs font-medium mb-1">PayPeriod</label>
  <select
    value={payPeriod}
    onChange={(e) => setPayperiod(e.target.value)}
    className="border rounded-md text-xs p-1"
  >
    <option value="">Select Pay Period</option>
    {payPeriodData?.data?.map((option) => (
      <option key={option.payperiod} value={option.payperiod}>
        {option.payperiod}
      </option>
    ))}
  </select>
</div>

          }
           
        </div>

        <div className="h-[350px] bg-white rounded-lg shadow-md mt-2 p-1">
          <div className="overflow-x-auto h-full">
            <table className="min-w-full bg-white border border-gray-200 text-xs">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th
                    className="py-1 px-2 border text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('sno')}
                  >
                    S.No {sortConfig.key === 'sno' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('idCard')}
                  >
                    Employee ID {sortConfig.key === 'idCard' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('empName')}
                  >
                    Name {sortConfig.key === 'empName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('department')}
                  >
                    Department {sortConfig.key === 'department' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('designation')}
                  >
                    Designation {sortConfig.key === 'designation' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                              
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-1 px-2 border text-gray-700">{item.sno}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.idCard}</td>
                    <td className="py-1 px-2 border font-medium text-gray-700">{item.empName}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.department}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedData.length === 0 && (
            <div className="text-center py-4 text-black text-xs">
              No long absent data available
            </div>
          )}
        </div>
      </CardWrapper>
    </>
  );
};

export default LongAbsent;