import "@testing-library/jest-dom/vitest";

function createMemoryStorage(): Storage {
  const storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(storage.keys())[index] ?? null;
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    }
  };
}

function ensureWindowStorage(name: "localStorage" | "sessionStorage") {
  Object.defineProperty(window, name, {
    configurable: true,
    value: createMemoryStorage()
  });
}

if (typeof window !== "undefined") {
  ensureWindowStorage("localStorage");
  ensureWindowStorage("sessionStorage");
}
