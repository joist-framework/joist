export class JToken {
  rawToken: string;
  isNegated = false;
  bindTo: string;
  path: string[] = [];

  constructor(rawToken: string) {
    this.rawToken = rawToken;

    this.isNegated = this.rawToken.startsWith("!");

    this.path = this.rawToken.split(".");
    this.bindTo = this.path.shift() ?? "";
    this.bindTo = this.bindTo.replaceAll("!", "");
  }

  readTokenValueFrom<T = unknown>(value: unknown): T {
    let pointer: any = value;

    if ((typeof value === "object" && value !== null) || typeof value === "string") {
      if (!this.path.length) {
        return pointer;
      }

      for (const part of this.path) {
        pointer = pointer[part];

        if (pointer === undefined) {
          break;
        }
      }
    }

    return pointer;
  }
}
