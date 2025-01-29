import { type Context, createContext } from "./protocol.js";

import type { Injector } from "../injector.js";

export const INJECTOR_CTX: Context<"injector", Injector> =
  createContext("injector");
