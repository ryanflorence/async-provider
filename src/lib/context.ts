import { AsyncLocalStorage } from "async_hooks";

export interface Context<T> {
  _type?: T; // phantom type for TypeScript
}

export function createContext<T>(): Context<T> {
  return {};
}

let storage = new AsyncLocalStorage<Map<Context<any>, any>>();

export async function provide<T>(
  contextMap: Map<Context<any>, any> | Array<readonly [Context<any>, any]>,
  cb: () => T | Promise<T>,
): Promise<T> {
  if (!(contextMap instanceof Map)) {
    contextMap = new Map(contextMap);
  }
  return new Promise(resolve => {
    storage.run(contextMap, async () => {
      let result = await cb();
      resolve(result);
    });
  });
}

export function pull<T>(context: Context<T>): T {
  let contextMap = storage.getStore();
  if (!contextMap) {
    throw new Error("Cannot `pull` outside of `provide`");
  }

  let value = contextMap.get(context);
  if (value === undefined) {
    throw new Error(`No context provided for ${context}`);
  }

  return value;
}
