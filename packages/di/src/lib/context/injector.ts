import { Injector } from '../injector.js';
import { Context, createContext } from './protocol.js';

export const INJECTOR_CTX: Context<'injector', Injector> = createContext('injector');
