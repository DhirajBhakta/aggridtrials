import React, { useState } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

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

const uniqueIdGenerator = (() => {
  const alreadyUsedIds = new Set();
  return function makeid(length) {
    var result = 'domID-';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (alreadyUsedIds.has(result))
      return makeid(length)
    else {
      alreadyUsedIds.add(result);
      return result
    }
  }
})()

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
function createHTMLFromElement(element) {
  var div = document.createElement('div');
  div.appendChild(element);
  return div.innerHTML;
}


function addOnClick(element, onclick) {
  const id = uniqueIdGenerator(5);
  console.log(id);
  element.setAttribute('id', id);
  requestAnimationFrame(() =>
    document.getElementById(id).onclick = onclick
  )
  return element;
}
const collapseIcon_Stringified = (oncollapse) => {
  const ele = createElementFromHTML(`<i style="color:blue;margin:3px;cursor:pointer">( + )</i>`);
  addOnClick(ele, () => oncollapse());
  return createHTMLFromElement(ele);

}
const expandIcon_Stringified = (onexpand) => {
  const ele = createElementFromHTML(`<i style="color:blue;margin:3px;cursor:pointer">( - )</i>`);
  addOnClick(ele, () => onexpand());
  return createHTMLFromElement(ele);
}



function App() {
  const [rows, setRows] = useState(DATA);

  const hide = (orgId) => {
    setRows(
      rows.map(row => {
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
    debugger;
    setRows(
      rows.map(row => {
        if (row.orgId === orgId && row._type === 'TRADER') {
          row.hidden = false;
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
      cellStyle: { textAlign: 'left' },
      cellRenderer: (params) => {

        if (params.data._type === 'BROKER' && hasAnyTrader(params.data.orgId)) {
          return params.data.collapsed
            ? collapseIcon_Stringified(() => show(params.data.orgId)) + params.value
            : expandIcon_Stringified(() => hide(params.data.orgId)) + params.value;
        }
        else if (params.data._type === 'BROKER')
          return `<div style='text-indent:23px'>${params.value}</div`

        return `<div style='text-indent:3em'>${params.value}</div`;
      }
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
  return (
    <div className="App ag-theme-balham" style={{ height: '600px', width: '1800px' }} >

      <AgGridReact
        rowData={rows.filter(r => r._type == 'BROKER' || !r.hidden)}
        columnDefs={coldef}
        getRowStyle={(params) => {
          if (params.data._type == 'BROKER') return { background: '#7d978959' }
        }}
        suppressScrollOnNewData={true}
      />
    </div>
  );
}

export default App;
