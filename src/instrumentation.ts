export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const ls = (globalThis as Record<string, unknown>).localStorage;
    if (ls === undefined || typeof (ls as Storage)?.getItem !== "function") {
      const store: Record<string, string> = {};
      (globalThis as Record<string, unknown>).localStorage = {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { for (const k in store) delete store[k]; },
        get length() { return Object.keys(store).length; },
        key: (i: number) => Object.keys(store)[i] ?? null,
      } as Storage;
    }
  }
}
