import React, { useState } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { ClickableIcon, createElementFromHTML, uniqueIdGenerator } from './utils/domUtil';

const SYMBOLS = {
    parentRow: Symbol('PARENT_ROW'),
    childRow: Symbol('CHILD_ROW'),
    groupId: Symbol('GROUP_ID')
}

const ICON_EXPAND = `<img src="https://img.icons8.com/material/17/000000/add.png" style='vertical-align:middle; margin:3px;'/>`;
const ICON_COLLAPSE = `<img src="https://img.icons8.com/material/17/000000/minus.png" style='vertical-align:middle; margin:3px;'/>`;

function ParentChildManager(columnDefs, rowData, childrenKey) {
    this.collapsedGroups = new Set();
    this.childNodesMap = new Map();
    this.parentNodesMap = new Map();

    this.MAIN_COLUMN_ID = 'enableParentChild';

    /** Add an extra CELL RENDERER to main column to show (+) (-) icons */
    const columnDef = columnDefs.find(columnDef => columnDef.enableParentChild);
    columnDef.colId = this.MAIN_COLUMN_ID;
    columnDef.cellRenderer = this.collapseExpandCellRenderer.bind(this);

    this.flattenedRowData = rowData.reduce((alreadyFlattened, parent) => {
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

ParentChildManager.prototype.init = function (api, columnApi) {
    this.api = api;
    this.columnApi = columnApi;
    this.MAIN_COLUMN = this.columnApi.getColumn(this.MAIN_COLUMN_ID);
    api.forEachNode(node => {
        if (node.data[SYMBOLS.parentRow]) {
            this.parentNodesMap.set(node.data[SYMBOLS.groupId], node);
            this.childNodesMap.set(node.data[SYMBOLS.groupId], []);
        }
        else if (node.data[SYMBOLS.childRow]) {
            this.childNodesMap.get(node.data[SYMBOLS.groupId]).push(node);
        }
    });
    for (let groupId of this.parentNodesMap.keys())
        this.collapseGroup(groupId)
    api.refreshCells({ columns: [this.MAIN_COLUMN], force: true });
    api.resetRowHeights();
}

ParentChildManager.prototype.toggleIcon = function (groupId) {
    this.collapsedGroups.has(groupId)
        ? this.collapsedGroups.delete(groupId)
        : this.collapsedGroups.add(groupId);
    const parentNode = this.parentNodesMap.get(groupId);
    this.api.refreshCells({
        rowNodes: [parentNode],
        columns: [this.MAIN_COLUMN],
        force: true
    })
}

ParentChildManager.prototype.collapseGroup = function (groupId) {
    this.toggleIcon(groupId);
    this.api.updateRowData({
        remove: this.childNodesMap.get(groupId).map(node => node.data)
    })
}

ParentChildManager.prototype.expandGroup = function (groupId) {
    this.toggleIcon(groupId);
    const parentNode = this.parentNodesMap.get(groupId);

    this.api.updateRowData({
        add: this.childNodesMap.get(groupId).map(node => node.data),
        addIndex: parentNode.childIndex + 1
    })
}

ParentChildManager.prototype.collapseExpandCellRenderer = function (params) {
    const groupId = params.data[SYMBOLS.groupId];
    const isParentRow = params.data[SYMBOLS.parentRow];
    const hasChildren = this.childNodesMap.has(groupId) && this.childNodesMap.get(groupId).length > 0;

    const containerDiv = createElementFromHTML(`<div><p style="display:inline">${params.value}</p></div>`);

    if (isParentRow && hasChildren) {
        const IconElement = this.collapsedGroups.has(groupId)
            ? ClickableIcon({
                htmlString: ICON_EXPAND,
                onClick: (event) => this.expandGroup(groupId)
            })
            : ClickableIcon({
                htmlString: ICON_COLLAPSE,
                onClick: (event) => this.collapseGroup(groupId)
            });
        containerDiv.prepend(IconElement);
    }
    else if (isParentRow)
        containerDiv.style.textIndent = '23px';

    else
        containerDiv.style.textIndent = '3em';
    return containerDiv;
}

const AgGridW2 = (props) => {

    const _PC = new ParentChildManager(props.columnDefs, props.rowData, props.childrenKey);

    const { rowData, ...restProps } = props;

    return (
        <div className="App ag-theme-balham" style={{ height: '600px', width: '1800px' }} >
            <AgGridReact {...restProps}
                onGridReady={(params) => {
                    _PC.init(params.api, params.columnApi);
                }}
                rowData={_PC.flattenedRowData}
                suppressScrollOnNewData={true}
                animateRows={true}
            />
        </div>
    )
}

export default AgGridW2;