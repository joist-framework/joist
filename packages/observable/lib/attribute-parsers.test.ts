import { expect } from '@open-wc/testing';

import { date, json, number } from './attribute-parsers';

describe('attribute parsers', () => {
  it('number', () => {
    const read = number.read('100');
    const write = number.write(200);

    expect(read).to.equal(100);
    expect(write).to.equal('200');
  });

  it('date', () => {
    const read = date.read('11/05/1988');
    const write = date.write(read);

    expect(read).to.be.instanceOf(Date);
    expect(typeof write).to.equal('string');
  });

  it('json', () => {
    const read = json.read('{"fname":"Foo","lname":"Bar"}');
    const write = json.write(read);

    expect(Object.keys(read)).to.deep.equal(['fname', 'lname']);
    expect(write).to.equal('{"fname":"Foo","lname":"Bar"}');
  });
});
