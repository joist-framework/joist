import type { Injector } from "../injector.js";
import { type Context, createContext } from "./protocol.js";

export const INJECTOR_CTX: Context<"injector", Injector> =
	createContext("injector");
