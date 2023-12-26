import { ShrinkString } from './shrink-string.pipe';

describe('FullNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ShrinkString();
    expect(pipe).toBeTruthy();
  });
});
