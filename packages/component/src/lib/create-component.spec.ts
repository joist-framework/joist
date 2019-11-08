import { createComponent } from './create-component';

describe('create-component', () => {
  it('should throw an error if trying to use a non component class to create', () => {
    class NotComponent {}

    expect(() => createComponent(NotComponent)).toThrowError(
      'NotComponent is not a Component. Decorate it with the @Component() decorator'
    );
  });
});
