import { metaDataCache, MetaData } from './metadata';

export function Prop() {
  return function(instance: any, key: string) {
    if (!metaDataCache.has(instance.constructor)) {
      metaDataCache.set(instance.constructor, new MetaData());
    }

    const metaData = metaDataCache.get(instance.constructor) as MetaData;

    metaData.props.push(key);
  };
}
