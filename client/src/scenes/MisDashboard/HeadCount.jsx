import React, { useState, useMemo } from 'react';
import { useGetHeadCountQuery, useGetHeadCountDetailQuery } from '../../redux/service/misDashboardService';
import 'tailwindcss/tailwind.css';
import CardWrapper from '../../components/CardWrapper';
import BuyerMultiSelect4 from '../../components/ModelMultiSelect4';

const HeadCount = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedComp, setSelectedComp] = useState('AGF');
  const [docDate, setDocDate] = useState(today);
  const [selectedDept, setSelectedDept] = useState('');
  const [showModel, setShowModel] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [detailSortConfig, setDetailSortConfig] = useState({ key: null, direction: 'ascending' });

  const { data: response, error, isLoading, refetch } = useGetHeadCountQuery(
    { params: { compCode: selectedComp, docDate } },
    { skip: !selectedComp }
  );

  const { data: detailResponse } = useGetHeadCountDetailQuery(
    { params: { compCode: selectedComp, docdate: docDate, department: selectedDept } },
    { skip: !selectedDept }
  );

  const headCount = response?.data || [];
  const detailData = detailResponse?.data || [];

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const requestDetailSort = (key) => {
    let direction = 'ascending';
    if (detailSortConfig.key === key && detailSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setDetailSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...headCount];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    if (selectedDept) {
      sortableData = sortableData.filter(item => item.department === selectedDept);
    }
    return sortableData;
  }, [headCount, sortConfig, selectedDept]);

  const sortedDetailData = useMemo(() => {
    let sortableData = [...detailData];
    if (detailSortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[detailSortConfig.key];
        const bValue = b[detailSortConfig.key];

        if (detailSortConfig.key === 'doj' || detailSortConfig.key === 'dob') {
          return detailSortConfig.direction === 'ascending'
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }

        if (aValue < bValue) return detailSortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return detailSortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [detailData, detailSortConfig]);

  const handleDateChange = (e) => {
    setDocDate(e.target.value);
    refetch();
  };

  const handleDeptChange = (e) => {
    setSelectedDept(e.target.value);
  };

  const handleViewDetails = (dept) => {
    setSelectedDept(dept);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateTenure = (doj) => {
    if (!doj) return '-';
    const joinDate = new Date(doj);
    const today = new Date();
    let years = today.getFullYear() - joinDate.getFullYear();
    let months = today.getMonth() - joinDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years}y ${months}m`;
  };

  if (isLoading) return <div className="flex justify-center items-center h-48 text-sm">Loading...</div>;
  if (error) return <div className="text-red-500 p-3 text-sm">Error: {error.message}</div>;

  const departmentOptions = [...new Set(headCount.map(item => item.department))];
  const totalEmployees = headCount.reduce((sum, item) => sum + (item.headCount || 0), 0);
  const totalDepartments = new Set(headCount.map(item => item.department)).size;

  return (
    <>
      <CardWrapper heading="Head Count" showFilter={true} onFilterClick={() => setShowModel(true)}>
        {showModel && (
          <BuyerMultiSelect4
            selected={selectedComp}
            setSelected={setSelectedComp}
            showModel={showModel}
            setShowModel={setShowModel}
          />
        )}

        <div className="flex flex-wrap items-center gap-3  p-3 bg-gray-50 rounded-md">
          <div className="min-w-[120px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
            <button
              onClick={() => setShowModel(true)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="truncate">{selectedComp}</span>
              <svg className="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="min-w-[120px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={docDate}
              onChange={handleDateChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white"
            />
          </div>

          <div className="min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={handleDeptChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white"
            >
              <option value="">All</option>
              {departmentOptions.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept.length > 20 ? dept.substring(0, 20) + '...' : dept}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[80px]">
            <label className="block text-xs font-medium text-gray-600 mb-1 invisible">Apply</label>
            <button
              className="w-full bg-blue-500 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-600"
              onClick={() => setShowModel(false)}
            >
              Apply
            </button>
          </div>

          {/* <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <div className="text-xs text-gray-600">Employees</div>
              <div className="text-sm font-semibold">{totalEmployees}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Departments</div>
              <div className="text-sm font-semibold">{totalDepartments}</div>
            </div>
          </div> */}
        </div>

        <div className="bg-white rounded border border-gray-200 h-[350px] overflow-y-scroll">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th
                    className="py-1.5 px-2 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-200 border-r border-gray-200"
                    onClick={() => requestSort('department')}
                  >
                    <div className="flex items-center gap-0.5">
                      <span>Department</span>
                      {sortConfig.key === 'department' && (
                        <span className="text-xs">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="py-1.5 px-2 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-200 border-r border-gray-200"
                    onClick={() => requestSort('headCount')}
                  >
                    <div className="flex items-center gap-0.5">
                      <span>Count</span>
                      {sortConfig.key === 'headCount' && (
                        <span className="text-xs">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="py-1.5 px-2 text-left font-medium text-gray-600 w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-1.5 px-2 font-medium text-gray-900 truncate max-w-[180px] border-r border-gray-200">
                      {item.department}
                    </td>
                    <td className="py-1.5 px-2 font-semibold text-gray-700 border-r border-gray-200">
                      {item.headCount}
                    </td>
                    <td className="py-1.5 px-2 flex justify-center">
                      <button
                        onClick={() => handleViewDetails(item.department)}
                        className="inline-flex items-center p-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600 transition-colors duration-200"
                        title="View Details"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          {sortedData.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-xs">
              No head count data available
            </div>
          )}
        </div>
      </CardWrapper>

      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Department Details</h2>
                <p className="text-xs text-gray-600 mt-1">{selectedDept} • {sortedDetailData.length} employees</p>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedDept("");
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 max-h-[calc(80vh-80px)] overflow-auto">
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <div className="text-xs text-blue-600">Total</div>
                  <div className="text-sm font-bold text-blue-900">{sortedDetailData.length}</div>
                </div>
                <div className="bg-green-50 rounded p-2 text-center">
                  <div className="text-xs text-green-600">Male</div>
                  <div className="text-sm font-bold text-green-900">
                    {sortedDetailData.filter(emp => emp.gender === 'MALE').length}
                  </div>
                </div>
                <div className="bg-pink-50 rounded p-2 text-center">
                  <div className="text-xs text-pink-600">Female</div>
                  <div className="text-sm font-bold text-pink-900">
                    {sortedDetailData.filter(emp => emp.gender === 'FEMALE').length}
                  </div>
                </div>
                <div className="bg-purple-50 rounded p-2 text-center">
                  <div className="text-xs text-purple-600">Avg Tenure</div>
                  <div className="text-sm font-bold text-purple-900">
                    {sortedDetailData.length > 0 ? calculateTenure(
                      sortedDetailData.reduce((latest, emp) =>
                        new Date(emp.doj) > new Date(latest.doj) ? emp : latest
                      ).doj
                    ) : '-'}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left font-medium text-gray-600 border">ID</th>
                      <th className="p-2 text-left font-medium text-gray-600 border">Name</th>
                      <th className="p-2 text-left font-medium text-gray-600 border">Gender</th>
                      <th className="p-2 text-left font-medium text-gray-600 border">Age</th>
                      <th className="p-2 text-left font-medium text-gray-600 border">Tenure</th>
                      <th className="p-2 text-left font-medium text-gray-600 border">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDetailData.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="p-2 border font-mono text-gray-600">{employee.id}</td>
                        <td className="p-2 border font-medium text-gray-900 truncate max-w-[120px]">
                          {employee.name}
                        </td>
                        <td className="p-2 border">
                          <span className={`inline-block w-12 text-center px-1 py-0.5 rounded text-xs ${employee.gender === 'MALE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                            }`}>
                            {employee.gender === 'MALE' ? 'M' : 'F'}
                          </span>
                        </td>
                        <td className="p-2 border text-gray-600 text-center">{calculateAge(employee.dob)}</td>
                        <td className="p-2 border text-gray-600 text-center">{calculateTenure(employee.doj)}</td>
                        <td className="p-2 border">
                          <span className="inline-block max-w-[80px] truncate px-1 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                            {employee.payCat}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedDetailData.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-xs">
                  No employee details available
                </div>
              )}
            </div>

            <div className="flex justify-end p-3 border-t">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedDept("");
                }}

                className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeadCount;