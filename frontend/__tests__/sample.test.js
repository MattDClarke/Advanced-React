function add(a, b) {
  const aNum = parseInt(a);
  const bNum = parseInt(b);
  return aNum + bNum;
}

// Jest makes describe available when it runs test with test runner
// test block containing multiple tests
//     in each test - run 1 or many expect statements
describe('Sample test 101', () => {
  it('Works as expected', () => {
    // run ur expect statements to see if the test will pass
    expect(1).toEqual(1);
    const age = 100;
    expect(age).toEqual(100);
  });
  it('runs the add function properly', () => {
    expect(add(1, 2)).toBeGreaterThanOrEqual(3);
  });
  it('can add strings of numbers together', () => {
    expect(add('1', '2')).toEqual(3);
  });
});
