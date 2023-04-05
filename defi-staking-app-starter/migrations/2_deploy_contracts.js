const Tether= artifacts.require('Tether');
const RWD= artifacts.require('RWD');
const DecentralBank= artifacts.require('DecentralBank');


module.exports = async function(deployer, network, accounts){
    // deploy Tether Contract
    await deployer.deploy(Tether)
    const tether = await Tether.deployed()

    await deployer.deploy(RWD)
    const rwd= await  RWD.deployed()


    await deployer.deploy(DecentralBank,tether.address,rwd.address)
    const decentralBank= await DecentralBank.deployed()


    //Transfer all RWD Tokens to decentral bank

    await rwd.transfer(decentralBank.address,'1000000000000000000000000')

    // Distribute 100 tether tokens to investers

    await tether.transfer(accounts[1],'100000000000000000000')

};

