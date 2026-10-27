export class MetadataMap<T> extends WeakMap<DecoratorMetadataObject, T> {
  #dflt;

  constructor(dflt: () => T) {
    super();

    this.#dflt = dflt;
  }

  read(key: DecoratorMetadataObject): T {
    let val = this.get(key);

    if (!val) {
      val = this.#dflt();
      this.set(key, val);
    }

    return val;
  }
}
