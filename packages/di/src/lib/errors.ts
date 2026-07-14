export class DependencyInjectionError extends Error {
  override name = "DependencyInjectionError";
}

export class InjectorError extends DependencyInjectionError {
  override name = "InjectorError";
}

export class DOMInjectorError extends InjectorError {
  override name = "DOMInjectorError";
}

export class InjectableError extends DependencyInjectionError {
  override name = "InjectableError";
}

export class NoInjectorError extends InjectableError {
  override name = "NoInjectorError";
}

export class InstantiatedDirectlyError extends InjectableError {
  override name = "InstantiatedDirectlyError";
}

export class InjectableCreationFailedError extends InjectableError {
  override name = "InjectableCreationFailedError";
}

export class AlreadyAttachedError extends DOMInjectorError {
  override name = "AlreadyAttachedError";
}

export class InjectNonServiceError extends InjectorError {
  override name = "InjectNonServiceError";
}

export class InjectionError extends InjectorError {
  override name = "InjectionError";
}

export class ProviderMissingOptionsError extends InjectionError {
  override name = "ProviderMissingOptionsError";
}

export class ProviderNotFoundError extends InjectionError {
  override name = "ProviderNotFoundError";
}
