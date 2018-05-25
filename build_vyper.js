const fs = require('fs');
const shell = require('shelljs');
const colors = require('colors'); // eslint-disable-line

build('./contracts/SimpleStorage', './build/contracts');

function build(contractsPath, buildPath) {
  if (!shell.test('-d', buildPath)) {
    fs.mkdir(buildPath);
  }

  // find vyper files:
  const files = fs.readdirSync(contractsPath);
  const vyperFiles = files.filter(file => file.slice(-5) == '.v.py');

  for (const file of vyperFiles) {
    const filePath = `${contractsPath}/${file}`;
    buildWithVyper(filePath, buildPath);
  };
};

function buildWithVyper(source, buildPath) {
  console.log(`Compiling vyper from source code: ${source}`.yellow); // eslint-disable-line

  // These property names are chosen to match the Truffle contract schema
  // https://github.com/trufflesuite/truffle-contract-schema
  const abi = JSON.parse(shell.exec(`vyper -f json ${source}`, { silent: true })
    .stdout.replace('\n', ''));
  const bytecode = shell.exec(`vyper -f bytecode ${source}`, { silent: true })
    .stdout.replace('\n', '');
  const deployedBytecode = shell.exec(`vyper -f bytecode_runtime ${source}`, { silent: true })
    .stdout.replace('\n', '');

  // modify from 'path/to/contract_name.v.py' to 'contract_name'
  const contractName = source.split('/').pop().split('.')[0];

  const contractDefinition = {
    contractName, abi, bytecode, deployedBytecode,
  };
  console.log(contractDefinition); // eslint-disable-line

  fs.writeFileSync(
    `${buildPath}/${contractName}.json`,
    JSON.stringify(contractDefinition, null, '  '),
  );
  console.log(`Writing output to: ${buildPath}/${contractName}.json`.green); // eslint-disable-line
}

