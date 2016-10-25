
const shortcuts = {
  global: {
    h: {
      type: 'home',
    },
  },
  'github.com': {
    l: {
      name: 'logout',
      type: 'club',
      perform: () => {
        $('#user-links > li:nth-child(3) > a > img').click();
        $('#user-links > li.header-nav-item.dropdown.js-menu-container.active > div > div > form > button').click();
      },
    },
    t: {
      name: 'trending',
      type: 'url',
      perform: 'https://github.com/trending',
    },

    m: {
      name: 'My issues',
      type: 'url',
      perform: 'https://github.com/issues/assigned',
    },
  },
  'medium.com': {
    t: {
      name: 'Medium Tech',
      type: 'url',
      perform: 'https://medium.com/tag/tech',
    },
  },
};

export default shortcuts;
