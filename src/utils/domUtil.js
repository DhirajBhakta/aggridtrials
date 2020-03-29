export const uniqueIdGenerator = (() => {
    const alreadyUsedIds = new Set();
    return function makeid(length) {
        var result = '';
        var characters = '~!@#$%^&*()-+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        if (alreadyUsedIds.has(result))
            return makeid(length)
        else {
            alreadyUsedIds.add(result);
            return result
        }
    }
})()


export function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
export function createHTMLFromElement(element) {
    var div = document.createElement('div');
    div.appendChild(element);
    return div.innerHTML;
}

export function ClickableIcon({ htmlString, onClick }) {
    const domElement = createElementFromHTML(htmlString);
    domElement.onclick = onClick;
    return domElement;
}

