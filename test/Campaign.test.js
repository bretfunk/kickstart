const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);
//const { interface, bytecode } = require('../ethereum/build/Campaign.json');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  //campaign = await new web3.eth.Contract(JSON.parse(interface));
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  //below needed or will error out with no provider set
  await factory.setProvider(provider);
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  //take first element out of the array returned and assign to campaignAddress
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  //second argument is campaign address since already deployed, otherwise new contract
  //and would need deploy and send
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );

});

describe('Campaign', async () => {
  it('deploys a factory and a campaign', async () => {
    assert.ok(await factory.options.address);
    assert.ok(await campaign.options.address);
  })
});
describe('basic functionality', async () => {
  it('has all accounts', async () => {
    assert.equal(accounts.length, 10);
  })
})


