    import React, {Component} from "react";

    import './App.css'
    import Navbar from "./Navbar";
    import Web3 from 'web3'
    import Tether from '../truffle_abis/Tether.json'
    import RWD from '../truffle_abis/RWD.json'
    import DecentralBank from '../truffle_abis/DecentralBank.json'
    import Main from './Main.js'

    class App extends Component{
        
        async UNSAFE_componentWillMount(){
            await this.loadWeb3()
            await this.loadBlockChainData()
        }


        // this function connects to the blockchain
        async loadWeb3(){
            if(window.ethereum){
                window.web3= new Web3(window.ethereum)
                await window.ethereum.enable()
            }else if(window.web3){
                window.web3=new Web3(window.web3.currentProvider)
            }else{
                window.alert('No ethereum detected!! You can go and check out Metamask!!')
            }
        }

        async loadBlockChainData(){
            const web3 =window.web3
            const account =  await web3.eth.getAccounts()
            this.setState({account:account[0]})
            const networkId = await web3.eth.net.getId()

            //load tether contract

            const tetherData=Tether.networks[networkId]
            if(tetherData){
                const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
                this.setState({tether})

                let tetherBalance =  await tether.methods.balanceof(this.state.account).call()

                this.setState({tetherBalance: tetherBalance.toString()})
                
            }else{
                window.alert("Error!! Tether contract not deployed")
            }

            // loading rwd contract

            const rwdData=RWD.networks[networkId]
            if(rwdData){
                const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
                this.setState({rwd})

                let rwdBalance =  await rwd.methods.balanceof(this.state.account).call()

                this.setState({rwdBalance: rwdBalance.toString()})
                
            }else{
                window.alert("Error!! RWD contract not deployed")
            }

            // loading decentralcontract contract

            const decentralBankData=DecentralBank.networks[networkId]
            if(decentralBankData){
                const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
                this.setState({decentralBank})

                let stakingBalance =  await decentralBank.methods.stakingBalance(this.state.account).call()

                this.setState({stakingBalance: stakingBalance.toString()})
                
            }else{
                window.alert("Error!! Decentral contract not deployed")
            }

            this.setState({loading: false})

            
        }

        //two functions that stake and unstake
        // leverage our decentralBank contract - deposit tokens and unstaking
        // All of this is staking
        // depositTokens transferFrom
        //function approve transaction hash
        //STAKING FUNCTION ?? >> decentralBank.depositTokens(send transactionHash)


        // staking function
        stateTokens = (amount) => {
            this.setState({loading: true})
            this.state.tether.methods.approve(this.state.decentralBank._address,amount).send({from: this.state.account}).on('transactionHash',(hash) =>{
            this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash',(hash) =>{
                this.setState({loading: false})

            })
         })
        }

        unstakeTokens =()=>{
        this.setState({loading: true})
        this.state.decentralBank.methods.unStakeTokens().send({from: this.state.account}).on('transactionHash',(hash) =>{
            this.setState({loading: false})
        })
        
        }
         
        // issueTokens=()=>{
        //     this.setState({loading: true})
        //     this.state.decentralBank.methods.issueTokens().send({from: this.state.account}).on('transactionHash',(hash) =>{
        //         this.setState({loading: false})

        //     })
        // }






        



        constructor(props){
            super(props)
            this.state={
                account:'0x0',
                tether: {},
                rwd:{},
                decentralBank:{},
                tetherBalance:'0',
                rwdBalance:'0',
                stakingBalance:'0',
                loading:true 

            }

        }

            render(){
                let content 
                {this.state.loading ?content= 
                <p id='loader' className="text-center" style={{margin:'30px'}}>
                Loading Please......</p> : content =
                <Main
                tetherBalance={this.state.tetherBalance}
                rwdBalance={this.state.rwdBalance}
                stakingBalance={this.state.stakingBalance}
                stateTokens={this.stateTokens}
                unstakeTokens={this.unstakeTokens}
                issueTokens={this.issueTokens}


                /> }
                return(
                <div>
                <Navbar account={this.state.account}/>
                    <div className="container-fluid mt-5">
                        <div className="row">
                            <mian role='main' className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px',minHeight:"100vm"}}>
                                <div>
                                    {content}
                                </div>
                            </mian>

                        </div>

                    </div>
                
                
                </div>
                )
            }
    }
    export default App;