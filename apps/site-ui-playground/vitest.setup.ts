import "@workspace/test-config/setup";

const matchMedia: typeof window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return false;
  }
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: matchMedia
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value() {}
});
