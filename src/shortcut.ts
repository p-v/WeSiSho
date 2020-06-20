interface Shortcut {
    type: string;
    perform?: string | (() => void);
}

interface ShortcutIndex {
    [key: string]: Shortcut;
}

interface Shortcuts {
    [key: string]: ShortcutIndex;
}

const shortcuts: Shortcuts = {
  global: {
    h: {
      type: 'home',
    },
  },
};

export default shortcuts;
