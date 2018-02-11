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

  it('has all accounts', async () => {
    assert.equal(accounts.length, 10);
  })

  it('new contract owner is the manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  })

  it('allows accounts to donate to campaign', async () => {
    const doner = accounts[1];
    await campaign.methods.contribute().send({
      from: doner,
      value: '1000000'
    })
    const total = await campaign.methods.approversCount().call()
    assert.equal(total, 1);
    const approver = await campaign.methods.approvers(doner).call()
    assert.ok(approver)
  })

  it('campaign has minimium contribution', async () => {
    const doner = accounts[1];
    await campaign.methods.contribute().send({
      from: doner,
      value: '1000000'
    })
    const total = await campaign.methods.approversCount().call()
    assert.equal(total, 1);

    const lowDoner = accounts[2];

    try {
    await campaign.methods.contribute().send({
      from: lowDoner,
      value: '1'
    })
      assert(false)
    } catch(error) {
      assert(error);
    }

    //const newTotal = await campaign.methods.approversCount().call()
    assert.equal(total, 1);

  })

  it('manager can make request', async () => {
    await campaign.methods.createRequest(
      "buy batteries",
      "100",
      accounts[9]
    ).send({
      from: accounts[0],
      //gas: '0'
    })

    const request = await campaign.methods.requests(0).call();
    assert.ok(request);
    console.log(request);
    //assert.equal(request.description, "buy batteries");
    //assert.equal(request.value, 1);
  })

});


