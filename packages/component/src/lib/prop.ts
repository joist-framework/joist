import { ComponentInstance } from './component';

export function Prop() {
  return function(instance: any, key: string) {
    const i = instance as ComponentInstance;

    if (!i.props) {
      i.props = [];
    }

    i.props.push(key);
  };
}
