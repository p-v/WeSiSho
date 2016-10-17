
const getPathTo = (element) => {
    if (element.id!=='') {
        return 'id("'+element.id+'")';
    }
    if (element===document.body) {
        return element.tagName;
    }

    let ix= 0;
    let siblings= element.parentNode.childNodes;
    for (let i= 0; i<siblings.length; i++) {
        let sibling= siblings[i];
        if (sibling===element) {
            return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
        }
        if (sibling.nodeType===1 && sibling.tagName===element.tagName) {
            ix++;
        }
    }
}

export default { getPathTo }
