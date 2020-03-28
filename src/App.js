import React, { useState } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { jsx, css, keyframes } from 'emotion'


import DATA from './testdata';
DATA.forEach(d => {
  if (d._type === 'BROKER') d.collapsed = true;
  if (d._type === 'TRADER') d.hidden = true;

})

const NAMES = [
  "Schmidt",
  "Thoma",
  "Gunther",
  "Beck",
  "Schneider",
  "Meyer",
  "Pohl",
  "Sommer",
  "Koch",
  "Weber",
  "Ilsner",
  "Nebert",
  "Zimmermann",
  "Hartmann",
  "Herrmann",
  "Schumacher",
  "Schubert",
  "Lorenz",
  "Teichmann",
  "Weis",
  "Scholz",
  "Christ",
  "Bergmann",
  "Winkler",
  "Simon",
  "Kuhn",
  "Krause",
  "Friedrichs",
  "Berger",
  "Becker",
  "Ziegler",
  "Seidel",
  "Engel",
  "Konig",
  "Schmitt",
  "Schultz",
  "Horn",
  "Doring",
  "Werner",
  "Frank"
]


const fadeIn = keyframes`
0%   { opacity: 0; }
50%  { opacity: 0; }
100% { opacity: 1; }
`

const fadeOut = keyframes`
0%   { opacity: 1; }
50%  { opacity: 0; }
100% { opacity: 0; }
`





function App() {
  const [rows, setRows] = useState(DATA);

  const hide = (orgId) => {
    setRows(
      rows.map(row => {
        row._appearNow = false;
        if (row.orgId === orgId && row._type === 'TRADER') {
          row.hidden = true;
        }

        if (row.orgId === orgId && row._type === 'BROKER') {
          row.collapsed = true;
        }
        return row;
      })
    )
  }

  const show = (orgId) => {
    setRows(
      rows.map(row => {
        row._appearNow = false;
        if (row.orgId === orgId && row._type === 'TRADER') {
          row.hidden = false;
          row._appearNow = true;
        }

        if (row.orgId === orgId && row._type === 'BROKER') {
          row.collapsed = false;
        }

        return row;
      })
    )
  }

  const hasAnyTrader = (orgId) => rows.some(row => row.orgId === orgId && row._type === 'TRADER')


  const coldef = [
    {
      headerName: 'Broker Name',
      field: 'employee_name',
      pinned: 'left',
      cellStyle: { textAlign: 'left' },
      cellRenderer: (params) => {
        

        if (params.data._type === 'BROKER' && hasAnyTrader(params.data.orgId)) {
          const Icon = params.data.collapsed
            ? ClickableIcon({
              htmlString: `<img src="https://img.icons8.com/material/17/000000/minus.png" style='vertical-align:middle; margin:3px;'/>`,
              onClick: (event) => show()
            })
            : ClickableIcon({
              htmlString: `<img src="https://img.icons8.com/material/17/000000/add.png" style='vertical-align:middle; margin:3px;'/>`,
              onClick: (event) => hide()
            });
          return Icon + params.value;
        }
        else if (params.data._type === 'BROKER')
          return `<div style='text-indent:23px'>${params.value}</div`

        return `<div style='text-indent:3em'>${params.value}</div`;
      }
    },
    {
      headerName: 'Salary',
      valueFormatter: (params) => '$ ' + params.value,
      pinned: 'left',
      field: 'employee_salary'
    },
    {
      headerName: 'Age',
      pinned: 'left',
      field: 'employee_age'
    },
    {
      headerName: 'ORG ID',
      pinned: 'left',
      field: 'orgId'
    },
    ...NAMES.map(name => ({
      headerName: name,
      field: 'values',
      valueGetter: (params) => params.data.values.find(obj => name in obj)[name],
    }))

  ]
  return (
    <div className="App ag-theme-balham" style={{ height: '600px', width: '1800px' }} >

      <AgGridReact
        rowData={rows.filter(r => r._type == 'BROKER' || !r.hidden)}
        columnDefs={coldef}
        getRowClass={(params) => {
          if (params.data._type == 'BROKER') return css` 
          background: 'hotpink';
           color: darkGray;
            font-size: 15px;
             font-weight: bold;
             `
          if (params.data._type == 'TRADER' && params.data._appearNow)
            return css` 
             animation: ${fadeIn} 0.5s ease-out
             `
        }}
        suppressScrollOnNewData={true}

      />
    </div>
  );
}

export default App;

