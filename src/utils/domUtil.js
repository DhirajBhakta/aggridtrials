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
    element.setAttribute('id', id);
    requestAnimationFrame(() => document.getElementById(id).onclick = onclick);
    return element;
}

export function ClickableIcon({htmlString, onClick}){
    const domElement = createElementFromHTML(htmlString);
    addOnClick(domElement, onClick);
    return createHTMLFromElement(domElement);
}

