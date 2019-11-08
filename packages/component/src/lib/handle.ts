import { metaDataCache, MetaData } from './metadata';

export function Handle(action: string) {
  return function(instance: any, key: string) {
    if (!metaDataCache.has(instance.constructor)) {
      metaDataCache.set(instance.constructor, new MetaData());
    }

    const metaData = metaDataCache.get(instance.constructor) as MetaData<any>;

    metaData.handlers[action] = instance[key];
  };
}
