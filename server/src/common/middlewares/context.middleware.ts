import { AsyncLocalStorage } from 'async_hooks';

import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const contextStorage = new AsyncLocalStorage<Map<string, unknown>>();

/**
 * Middleware to initialize request context
 */
const contextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const store = new Map<string, unknown>();
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();

  store.set('requestId', requestId);
  res.setHeader('x-request-id', requestId);

  contextStorage.run(store, () => {
    next();
  });
};

/**
 * Helper to get value from context
 */
export const getContextValue = (key: string) => {
  const store = contextStorage.getStore();
  return store ? store.get(key) : undefined;
};

/**
 * Helper to set value in context
 */
export const setContextValue = (key: string, value: unknown) => {
  const store = contextStorage.getStore();
  if (store) {
    store.set(key, value);
  }
};

export default contextMiddleware;
