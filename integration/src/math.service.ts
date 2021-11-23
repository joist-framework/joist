import { service } from '@joist/di';

@service()
export class MathService {
  increment(val: number) {
    return val + 1;
  }

  decrement(val: number) {
    return val - 1;
  }
}
