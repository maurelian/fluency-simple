const Compare = artifacts.require('vyper_compare');

let compare; // init an empty variable that will occupy our contract


contract(`compare`, (accounts) => {
  beforeEach(async () => {
    compare = await Compare.new({ from: accounts[0] });
  });

  it('should have the max_uint_256 set properly', async () => {
    let max = await compare.max_uint_256.call();
    const match = max.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77');
    assert(match, 'result is not correct');
  })


  it('should know that 20 is less than  max_uint_256', async () => {
    assert(await compare.lessThanMaxUint(20));
  })


  it('should know that 20 is not equal to max_uint_256', async () => {
    assert(await compare.lessThanMaxUint(20));
  })
});

