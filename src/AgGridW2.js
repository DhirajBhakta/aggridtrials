import React, { useState } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';

import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { jsx, css, keyframes } from 'emotion';
import { ClickableIcon, createElementFromHTML, uniqueIdGenerator } from './utils/domUtil';

const SYMBOLS = {
    parentRow: Symbol('PARENT_ROW'),
    childRow: Symbol('CHILD_ROW'),
    groupId: Symbol('GROUP_ID')
}

function flattenRowData(rowData, childrenKey) {
    return rowData.reduce((alreadyFlattened, parent) => {
        const uniqueId = uniqueIdGenerator(5);
        parent[SYMBOLS.parentRow] = true;
        parent[SYMBOLS.groupId] = uniqueId;
        const children = parent[childrenKey];
        if (children) {
            children.forEach(child => {
                child[SYMBOLS.childRow] = true;
                child[SYMBOLS.groupId] = uniqueId;
            })
            return [...alreadyFlattened, parent, ...children]
        }
        return [...alreadyFlattened, parent];
    }, [])
}

const collapsedGroups = new Set();
const childNodesMap = new Map();
const parentNodesMap = new Map();

function collapseGroup(groupId) {

}


function expandGroup(groupId) {

}

const collapseExpandCellRenderer = (params) => {
    const containerDiv = createElementFromHTML(`<div><p style="display:inline">${params.value}</p></div>`);
    if (params.data[SYMBOLS.parentRow] && childNodesMap.get(params.data[SYMBOLS.groupId]) && childNodesMap.get(params.data[SYMBOLS.groupId]).length > 0) {
        const IconElement = collapsedGroups.has(params.data[SYMBOLS.groupId])
            ? ClickableIcon({
                htmlString: `<img src="https://img.icons8.com/material/17/000000/add.png" style='vertical-align:middle; margin:3px;'/>`,
                onClick: (event) => {
                    collapsedGroups.delete(params.data[SYMBOLS.groupId]);
                    params.api.updateRowData({
                        add: childNodesMap.get(params.data[SYMBOLS.groupId]).map(node => node.data),
                        addIndex: params.rowIndex + 1
                    })
                    params.api.refreshCells({ rowNodes: [params.node], columns: [params.column], force: true })
                }
            })
            : ClickableIcon({
                htmlString: `<img src="https://img.icons8.com/material/17/000000/minus.png" style='vertical-align:middle; margin:3px;'/>`,
                onClick: (event) => {
                    collapsedGroups.add(params.data[SYMBOLS.groupId]);
                    params.api.updateRowData({
                        remove: childNodesMap.get(params.data[SYMBOLS.groupId]).map(node => node.data)
                    })
                    params.api.refreshCells({ rowNodes: [params.node], columns: [params.column], force: true })

                }
            });
        containerDiv.prepend(IconElement);
    }
    else if (params.data[SYMBOLS.parentRow])
        containerDiv.style.textIndent = '23px';

    else
        containerDiv.style.textIndent = '3em';
    return containerDiv;
}

const addCellRenderer = (columnDef, cellRenderer) => {
    if (columnDef.cellRenderer) {
        const existingCellRenderer = columnDef.cellRenderer;
        columnDef.cellRenderer = (params) => {
            return cellRenderer(params) + existingCellRenderer(params);
        }
    }
    columnDef.cellRenderer = cellRenderer;
}


function transformColumnDefs(columnDefs) {
    const columnDef = columnDefs.find(columnDef => columnDef.enableParentChild);
    columnDef.colId = 'enableParentChild';
    addCellRenderer(columnDef, collapseExpandCellRenderer);
}

const AgGridW2 = (props) => {
    if (props.enableParentChild) {
        transformColumnDefs(props.columnDefs);
    }

    const { rowData, ...restProps } = props;

    return (
        <div className="App ag-theme-balham" style={{ height: '600px', width: '1800px' }} >
            <AgGridReact {...restProps}
                onGridReady={(params) => {
                    params.api.forEachNode(node => {
                        if (node.data[SYMBOLS.parentRow]) {
                            parentNodesMap.set(node.data[SYMBOLS.groupId], node);
                            childNodesMap.set(node.data[SYMBOLS.groupId], []);
                        }
                        else if (node.data[SYMBOLS.childRow]) {
                            childNodesMap.get(node.data[SYMBOLS.groupId]).push(node);
                        }
                    });
                    params.api.refreshCells({ columns: [params.columnApi.getColumn('enableParentChild')], force: true });
                    params.api.resetRowHeights();

                }}
                rowData={flattenRowData(props.rowData, props.childrenKey)}
                suppressScrollOnNewData={true}
                animateRows={true}
            />
        </div>
    )
}

export default AgGridW2;