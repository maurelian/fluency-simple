const { assertRevert } = require('./helpers/assertRevert');


/*
    TODO: inject these variables with process.env... or find another nice way to run 
    this on both impls with one command

*/
// const SimpleStorage = artifacts.require('solidity_SimpleStorage');
// const lang = 'Solidity';
const SimpleStorage = artifacts.require('vyper_SimpleStorage');
const lang = 'Vyper';

let ss; // init an empty variable that will occupy our contract


contract(`SimpleStorage: ${lang}`, (accounts) => {
    beforeEach(async () => {
            ss = await SimpleStorage.new({from: accounts[0]});
        }   
    });

  it('Initializes with a value of zero', async () => {
    // let ss = await SimpleStorage.new({from: accounts[0], gas: 2000000});
    const value = await ss.value();
    assert.equal(value.toNumber(),0);
  });

  it('calling setValue changes the value', async () => {
    // let ss = await SimpleStorage.new({from: accounts[0], gas: 2000000});

    let value = await ss.value();
    assert.equal(value.toNumber(), 0);

    await ss.setValue(10, {from: accounts[0]});
    value = await ss.value();
    assert.equal(value.toNumber(), 10);

    await ss.setValue(457, {from: accounts[0]});
    value = await ss.value();
    assert.equal(value.toNumber(), 457);
  });

  it('Should not accept ether payments to the fallback', async () => {
    const balanceBefore = await web3.eth.getBalance(ss.address);
    assert.strictEqual(balanceBefore.toNumber(), 0);

    await assertRevert(new Promise((resolve, reject) => {
      web3.eth.sendTransaction({ from: accounts[0], to: ss.address, value: web3.toWei('10', 'Ether') }, (err, res) => {
        if (err) { reject(err); }
        resolve(res);
      });
    }));

    const balanceAfter = await web3.eth.getBalance(ss.address);
    assert.strictEqual(balanceAfter.toNumber(), 0);
  });
});
