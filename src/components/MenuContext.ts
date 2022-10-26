import { createContext } from "react";

export interface MenuContextValue {
  e: EventTarget;
}

export const MenuContext = createContext<MenuContextValue | null>(null);
