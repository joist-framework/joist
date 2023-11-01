import { Injector, Provider, ProviderToken, Injectable } from '@joist/di';
import React, { PropsWithChildren, createContext, useContext } from 'react';

export const InjectorCtx = createContext<Injector | null>(null);

export function InjectorProvider(props: PropsWithChildren<{ providers: Provider<any>[] }>) {
  const injector = new Injector(props.providers);
  const parent = useContext(InjectorCtx);

  if (parent) {
    injector.setParent(parent);
  }

  return <InjectorCtx.Provider value={injector}>{props.children}</InjectorCtx.Provider>;
}

export function useInject<T extends Injectable>(token: ProviderToken<T>): T {
  const ctx = useContext(InjectorCtx);

  if (ctx === null) {
    throw Error('useInject cannot be used outside of InjectorProvider');
  }

  return ctx.get(token);
}
