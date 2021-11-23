import { __decorate } from "tslib";
import { service } from '@joist/di';
let MathService = class MathService {
    increment(val) {
        return val + 1;
    }
    decrement(val) {
        return val - 1;
    }
};
MathService = __decorate([
    service()
], MathService);
export { MathService };
//# sourceMappingURL=math.service.js.map