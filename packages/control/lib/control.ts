export interface FormControl {
  name: string;
  value?: any;
  checked?: boolean;
  appendFormData?(e: FormDataEvent): void;
}

export class FindFormEvent extends Event {
  constructor() {
    super('findform', { composed: true });
  }
}

export interface Controlled {
  new (...args: any[]): HTMLElement & FormControl;
}

export function control<T extends Controlled>(Base: T) {
  return class FormControl extends Base {
    parentForm: HTMLFormElement | undefined = undefined;

    appendFormDataBound = this.appendFormData.bind(this);

    constructor(...args: any[]) {
      super(...args);

      this.addEventListener('findform', (e) => {
        const path = e.composedPath();

        const parentForm = path.find((el) => el instanceof HTMLFormElement);

        if (parentForm) {
          this.parentForm = parentForm as HTMLFormElement;

          this.parentForm.addEventListener('formdata', this.appendFormDataBound);
        }
      });
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      this.dispatchEvent(new FindFormEvent());
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      if (this.parentElement) {
        this.parentElement.removeEventListener('formdata', this.appendFormDataBound);
      }
    }

    appendFormData(e: FormDataEvent) {
      if (super.appendFormData) {
        super.appendFormData(e);
      } else if (this.checked !== undefined && this.checked) {
        e.formData.append(this.name, String(this.checked));
      } else {
        e.formData.append(this.name, this.value);
      }
    }
  };
}
