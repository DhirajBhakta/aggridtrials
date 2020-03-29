import React from 'react';
import AgGridW2 from './AgGridW2';

import DATA, { NAMES } from './testdata';

function App() {

  const coldef = [
    {
      headerName: 'Broker Name',
      field: 'employee_name',
      cellStyle: { textAlign: 'left' },
      enableParentChild: true,
    },
    {
      headerName: 'Salary',
      valueFormatter: (params) => '$ ' + params.value,
      field: 'employee_salary'
    },
    {
      headerName: 'Age',
      field: 'employee_age'
    },
    {
      headerName: 'ORG ID',
      field: 'orgId'
    },
    ...NAMES.map(name => ({
      headerName: name,
      field: 'values',
      valueGetter: (params) => params.data.values.find(obj => name in obj)[name],
    }))

  ]
  return <AgGridW2
    rowData={DATA}
    columnDefs={coldef}
    childrenKey='children'
    enableParentChild={true}
  />
}

export default App;
