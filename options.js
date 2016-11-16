const prepareTree = shortcuts => {
  const treeArr = [];
  for (const key in shortcuts) {
    const tree = {};
    if ({}.hasOwnProperty.call(shortcuts, key)) {
      tree.text = key;
      tree.nodes = [];
      for (const s in shortcuts[key]) {
        if ({}.hasOwnProperty.call(shortcuts[key], s)) {
          const node = [];
          node.text = s + ' ' + shortcuts[key][s].url;
          tree.nodes.push(node);
        }
      }
    }
    treeArr.push(tree);
  }
  console.log(treeArr);
  return treeArr;
}
const restore_options = () => {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get('shortcuts', (result) => {
    const shortcuts = result.shortcuts;
    let idx = 0;
    for (const key in shortcuts) {
      if ({}.hasOwnProperty.call(shortcuts, key)) {
        idx += 1;
        const titleId = `site-${idx}`;
        const contentId = `content-${idx}`;
        $('#tree').append(`<div id="${titleId}" class="sites" data-toggle="collapse" data-target="#${contentId}">${key}</div>`);
        $('#tree').append(`<div id="${contentId}" class="collapse"></div>`);
        for (const s in shortcuts[key]) {
          if ({}.hasOwnProperty.call(shortcuts[key], s)) {
            const row = `${s} ${shortcuts[key][s].url}`;
            $(`#${contentId}`).append(`<div>${row}</div>`);
          }
        }
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
