const path = require('path');
//fs-extra is better than fs because it has extra functionality
const fs = require('fs-extra');
const solc = require('solc');

//__dirname is current working directly
const buildPath = path.resolve(__dirname, 'build');

//removeSync deletes file and is in fs-extra
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const output = solc.compile(source, 1).contracts;

//if dir doesn't exist this function creates it
fs.ensureDirSync(buildPath);


//.replace removes the :
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}

