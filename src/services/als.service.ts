import { AsyncLocalStorage } from 'async_hooks';
// Create a singleton instance of AsyncLocalStorage
export const asyncLocalStorage: AsyncLocalStorage<any> = new AsyncLocalStorage();
