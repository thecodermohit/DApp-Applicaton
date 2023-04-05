pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;
    
    mapping(address=>uint) public stakingBalance;
    mapping(address=>bool) public hasStaked;
    mapping(address=>bool) public isStaking;

    constructor(Tether _tether,RWD _rwd) public{
        owner=msg.sender;
        tether=_tether;
        rwd=_rwd;
    }

    
    function depositTokens(uint _amount) public {

        require(_amount>0,'amount cannot be less than zero');
        //transfering tether tokens to this contract address for staking
        tether.transferFrom(msg.sender,address(this), _amount);

        //updating Staking Balance
        stakingBalance[msg.sender]=stakingBalance[msg.sender]+ _amount;


        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        isStaking[msg.sender]=true;
        hasStaked[msg.sender]=true;
    }


    function unStakeTokens() public{
        
        uint balance=stakingBalance[msg.sender];
        require(balance>0);

        tether.transfer(msg.sender,balance);

        stakingBalance[msg.sender]=0;
        isStaking[msg.sender]=false;

    }

    //issue reward tokens

    function issueTokens() public {
        
        require(msg.sender==owner);

        for(uint i=0;i<stakers.length;i++){
            address recipient = stakers[i];
            uint balance=stakingBalance[recipient]/4;
            
            if(balance>0){
                rwd.transfer(recipient, balance);

            }
        }
    }



}