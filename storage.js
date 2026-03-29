window.StorageService = (() => {
  const KEY = "dashboard_assembleia_v3";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  return { load, save, clear };
})();
