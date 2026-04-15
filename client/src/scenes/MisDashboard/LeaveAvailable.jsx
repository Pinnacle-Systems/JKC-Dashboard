import React, { useState } from 'react';
import { useGetLeaveAvbQuery } from '../../redux/service/misDashboardService';
import 'tailwindcss/tailwind.css';
import CardWrapper from '../../components/CardWrapper';
import BuyerMultiSelect4 from '../../components/ModelMultiSelect4';

const LeaveAvailable = () => {
  const [selected, setSelected] = useState()
  const [selectedYear, setSelectedYear] = useState('');
  const [showModel, setShowModel] = useState(false);
  const currentYear = new Date().getFullYear();


const { data: leaveAvb, error, isLoading } = useGetLeaveAvbQuery(
  { 
    params: { 
      compCode: selected || "AGF", 
      filterYear: currentYear 
    } 
  },
  { 
    skip: !selected && false 
  }
);

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
    if (!leaveAvb?.data) return [];

    let sortableItems = [...leaveAvb.data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
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
  }, [leaveAvb, sortConfig]);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <>

      <CardWrapper heading={"Leave Availability"} showFilter={true} onFilterClick={() => setShowModel(true)}>
        {showModel && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end z-50">
            <div className="w-full sm:w-[500px] bg-white rounded-t-2xl shadow-lg p-4 animate-slide-up">
              <BuyerMultiSelect4
                selected={selected}
                setSelected={setSelected}
                showModel={showModel}
                setShowModel={setShowModel}
                // refetch={refetch}
              />
            </div>
          </div>
        )}

        <div className="h-[350px] bg-white rounded-lg shadow-md mt-2 p-1">
          <div className="overflow-x-auto h-full">
            <table className="min-w-full bg-white border border-gray-200 text-xs">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('mid')}
                  >
                    ID Card {sortConfig.key === 'mid' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('fname')}
                  >
                    Name {sortConfig.key === 'fname' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>

                  <th className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider">
                    Leave Desc
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('lbal')}
                  >
                    Balance {sortConfig.key === 'lbal' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('lt')}
                  >
                    Taken {sortConfig.key === 'lt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('Avl')}
                  >
                    Available {sortConfig.key === 'Avl' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('paycat')}
                  >
                    Pay Category {sortConfig.key === 'paycat' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-1 px-2 border text-gray-700">{item.mid}</td>
                    <td className="py-1 px-2 border font-medium text-gray-700">{item.fname}</td>
                    <td className="py-1 px-2 border  text-gray-700">{item.ldesc}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.lbal}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.lt}</td>
                    <td className="py-1 px-2 border font-medium text-green-600">{item.Avl}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.paycat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedData.length === 0 && (
            <div className="text-center py-4 text-black text-xs">
              No leave data available
            </div>
          )}
        </div>
      </CardWrapper>
    </>
  );
};

export default LeaveAvailable;