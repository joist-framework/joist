export function upgradable<T extends new (...args: any[]) => HTMLElement>(Base: T) {
  return class Upgradeable extends Base {
    __upgradedProps = new Map<keyof this, unknown>();

    constructor(...args: any[]) {
      super(...args);

      for (let prop in this) {
        if (this.hasOwnProperty(prop) && prop !== 'upgradedProps') {
          this.__upgradedProps.set(prop, this[prop]);
        }
      }
    }
  };
}

export const UpgradableElement = upgradable(HTMLElement);
