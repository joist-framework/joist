type ComparisonOperator = "==" | "!=" | ">" | "<";

interface TokenParts {
  path: string[];
  value?: string;
  operator?: ComparisonOperator;
}

/**
 * JExpression represents a token that can be used to extract and compare values from objects.
 *
 * Supported operators:
 * - `==` : Equality comparison (e.g., "status==active")
 * - `!=` : Inequality comparison (e.g., "status!=active")
 * - `>`  : Greater than comparison (e.g., "count>5")
 * - `<`  : Less than comparison (e.g., "count<10")
 *
 * Examples:
 * ```typescript
 * // Basic path access
 * new JExpression("user.name").readTokenValueFrom({ user: { name: "John" } }) // "John"
 *
 * // Equality comparison
 * new JExpression("status == active").readTokenValueFrom({ status: "active" }) // true
 *
 * // Inequality comparison
 * new JExpression("status != active").readTokenValueFrom({ status: "inactive" }) // true
 *
 * // Greater than comparison
 * new JExpression("count > 5").readTokenValueFrom({ count: 10 }) // true
 *
 * // Less than comparison
 * new JExpression("count < 10").readTokenValueFrom({ count: 5 }) // true
 *
 * // With negation
 * new JExpression("!status == active").readTokenValueFrom({ status: "inactive" }) // true
 *
 * // Nested paths
 * new JExpression("user.score > 100").readTokenValueFrom({ user: { score: 150 } }) // true
 * ```
 */
export class JExpression {
  /** The raw token string as provided to the constructor */
  rawToken: string;
  /** Whether the token is negated (starts with '!') */
  isNegated = false;
  /** The first part of the path (before the first dot) */
  bindTo: string;
  /** The remaining parts of the path (after the first dot) */
  path: string[] = [];
  /** The value to compare against for equality (==) */
  equalsValue: string | undefined;
  /** The value to compare against for inequality (!=) */
  notEqualsValue: string | undefined;
  /** The value to compare against for greater than (>) */
  gtValue: string | undefined;
  /** The value to compare against for less than (<) */
  ltValue: string | undefined;

  /**
   * Creates a new JExpression instance.
   * @param rawToken - The token string to parse. Can include operators (==, !=, >, <) and negation (!)
   */
  constructor(rawToken: string) {
    this.rawToken = rawToken;
    this.isNegated = this.rawToken.startsWith("!");

    const { path, value, operator } = this.#parseToken();
    this.path = path;
    this.bindTo = this.path.shift() ?? "";
    this.bindTo = this.bindTo.replaceAll("!", "");

    // Set the appropriate comparison value based on the operator
    switch (operator) {
      case "==":
        this.equalsValue = value;
        break;
      case "!=":
        this.notEqualsValue = value;
        break;
      case ">":
        this.gtValue = value;
        break;
      case "<":
        this.ltValue = value;
        break;
    }
  }

  /**
   * Reads a value from the provided object using the token's path and performs any comparison.
   * @param value - The object to read from
   * @returns The value at the path, or the result of the comparison if an operator is present
   * @template T - The expected return type
   */
  evaluate<T = unknown>(value: unknown): T {
    if (typeof value !== "object" && typeof value !== "string") {
      return value as T;
    }

    const pathValue = this.#getValueAtPath(value);

    return this.#performComparison(pathValue) as T;
  }

  /**
   * Parses the raw token into its components.
   * @returns An object containing the path parts and any comparison operator/value
   */
  #parseToken(): TokenParts {
    const operators: ComparisonOperator[] = ["==", "!=", ">", "<"];

    for (const operator of operators) {
      if (this.rawToken.includes(operator)) {
        const [tokenPart, value] = this.rawToken.split(operator).map((part) => part.trim());
        return {
          path: tokenPart.split("."),
          value,
          operator,
        };
      }
    }

    return {
      path: this.rawToken.split("."),
    };
  }

  /**
   * Gets the value at the token's path in the provided object.
   * @param value - The object to read from
   * @returns The value at the path, or undefined if the path doesn't exist
   */
  #getValueAtPath(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (!this.path.length) {
      return value;
    }

    let pointer: any = value;

    for (const part of this.path) {
      pointer = pointer?.[part];
      if (pointer === undefined) {
        break;
      }
    }

    return pointer;
  }

  /**
   * Performs the comparison operation if an operator is present.
   * @param value - The value to compare
   * @returns The result of the comparison, or the original value if no operator is present
   */
  #performComparison(value: unknown): boolean | unknown {
    if (this.equalsValue !== undefined) {
      return String(value) === this.equalsValue;
    }

    if (this.notEqualsValue !== undefined) {
      return String(value) !== this.notEqualsValue;
    }

    if (this.gtValue !== undefined) {
      return Number(value) > Number(this.gtValue);
    }

    if (this.ltValue !== undefined) {
      return Number(value) < Number(this.ltValue);
    }

    return value;
  }
}
