const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);
const { interface, bytecode } = require('../ethereum/build/Campaign.json');

beforeEach(async () => {
  const accounts = await web3.eth.getAccounts();
  const campaign = await new web3.eth.Contract(JSON.parse(interface));
  web3.setProvider(provider);

});

describe('basic functionality', async () => {
  it('has all accounts', async () => {
    console.log(accounts);
  })
})


