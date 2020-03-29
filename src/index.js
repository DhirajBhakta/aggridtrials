import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


/**
 *

const collapsedGroups = new Set();

const parentNodesMap = new Map();
const childNodesMap = new Map();
const getColumnWhichControlsParentChild = (columnDefs) => columnDefs.find(columnDef => columnDef.enableParentChild);


const collapseAll = (api, columnApi) => {
    for (const [groupId, childNodes] of childNodesMap.entries()) {
        collapsedGroups.add(groupId);
        childNodes.map(node => node.setRowHeight(0));
    }
    api.onRowHeightChanged();
    const col = columnApi.getColumn('enableParentChild');
    api.refreshCells({ columns: [col] });
}

const expandAll = (api) => {
    collapsedGroups.clear();
    api.resetRowHeights();
}

const collapseGroup = (api, columnApi, groupId) => {
    collapsedGroups.add(groupId)
    childNodesMap.get(groupId).map(node => node.setRowHeight(0));
    api.onRowHeightChanged();
    const col = columnApi.getColumn('enableParentChild');
    api.refreshCells({ rowNodes: [parentNodesMap[groupId]], columns: [col], force: true });
}

const expandGroup = (api, columnApi, groupId) => {
    collapsedGroups.delete(groupId);
    api.resetRowHeights();
    collapsedGroups.forEach((groupId) => collapseGroup(api, columnApi, groupId));
    const col = columnApi.getColumn('enableParentChild');
    api.refreshCells({ rowNodes: [parentNodesMap[groupId]], columns: [col], force: true });
}
 */