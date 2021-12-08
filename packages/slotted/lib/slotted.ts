export interface Slotted {
  new (...args: any[]): HTMLElement;
}

export function slotted<T extends Slotted>(Base: T) {
  let templateSlots: string[] | null = null;

  return class Slotted extends Base {
    mut = new MutationObserver(this.validateSlots.bind(this));

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      if (!templateSlots) {
        const slotEls = this.shadowRoot!.querySelectorAll<HTMLSlotElement>('slot[required]');

        templateSlots = Array.from(slotEls).map((el) => el.name);
      }

      this.validateSlots();

      this.mut.observe(this, { childList: true });
    }

    validateSlots() {
      const slotEls = this.querySelectorAll('[slot]');
      const slots = Array.from(slotEls).map((el) => el.slot);

      if (templateSlots) {
        templateSlots.forEach((slot) => {
          if (!slots.includes(slot)) {
            throw new Error(
              `Slot "${slot}" is required but not found as a child of "${this.tagName}"`
            );
          }
        });
      }
    }
  };
}
