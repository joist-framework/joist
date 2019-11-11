import { createComponent } from './create-component';

describe('createComponent', () => {
  it('should throw an error if trying to use a non component class to create', () => {
    class NotComponent {
      helloWorld = '';
    }

    expect(() => createComponent<NotComponent, void>(NotComponent)).toThrowError(
      'NotComponent is not a Component. Decorate it with the @Component() decorator'
    );
  });
});
