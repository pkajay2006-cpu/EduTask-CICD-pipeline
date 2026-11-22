import '@testing-library/jest-dom';

// Polyfill/mock localStorage for Node 22+ and jsdom environments
const createLocalStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (i) => Object.keys(store)[i] || null
  };
};

const storageMock = createLocalStorageMock();

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
  configurable: true
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storageMock,
    writable: true,
    configurable: true
  });
}
