
class CasinoApp {
    constructor(){
      this.state = {
         lastWinningNumber: 0,
         numberOfBets: 0,
         minimumBet: 0,
         totalBet: 0
      }
 
  if (window.web3) {
    this.web3Provider = window.web3.currentProvider;
  }
  else {
    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
  }
  this.web3 = new Web3(this.web3Provider);
 
  console.log(this.web3);
 
       
 
       const contractAddress = "0x6141d19Cb01762e01Fef9b5762eFBD7C9A5c4EAf";
       this.casinoContract = new this.web3.eth.Contract([ { "constant": false, "inputs": [], "name": "generateWinner", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "betsCount", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "playerInfo", "outputs": [ { "name": "amountBet", "type": "uint256" }, { "name": "selectedNum", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "selectedNum", "type": "uint256" } ], "name": "bet", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "lastWinningNum", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "minimumBet", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "reset", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "players", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalBet", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ] , contractAddress)
       this.web3.eth.getAccounts()
       .then(accounts => this.defaultAccount = accounts[0]);
       this.componentDidMount();
    }
 
    componentDidMount(){
       this.updateState()
       this.setupListeners()
    }
 
    updateState(){
      this.casinoContract.methods.minimumBet().call({}, (error, result) => {
         if(result != null){
            this.state.minimumBet = this.web3.utils.fromWei(result, 'ether');
            document.getElementById("minimumBet").innerHTML = this.state.minimumBet;
         }
      })
      this.casinoContract.methods.betsCount().call({}, (error, result) => {
         if(result != null){
            this.state.numberOfBets = parseInt(result);
            document.getElementById("numberOfBets").innerHTML = this.state.numberOfBets;
         }
      })
      this.casinoContract.methods.totalBet().call({}, (error, result) => {
         if(result != null){
            this.state.totalBet = parseInt(this.web3.utils.fromWei(result, 'ether'));
            document.getElementById("totalBet").innerHTML = this.state.totalBet.toString();
         }
      })

      

      this.casinoContract.methods.lastWinningNum().call((error, result) => {
         if(result != null){
            this.state.lastWinningNumber = parseInt(result);
            document.getElementById("lastWinner").innerHTML = this.state.lastWinningNumber;
         }
      })
   }
 
    
    setupListeners(){
       let liNodes = document.querySelector('#numbers').querySelectorAll('li')
       liNodes.forEach(number => {
          number.addEventListener('click', event => {
             event.target.className = 'number-selected'
             this.voteNumber(parseInt(event.target.innerHTML), done => {
 
                
                for(let i = 0; i < liNodes.length; i++){
                   liNodes[i].className = ''
                }
                this.updateState();
             })
          })
       })
 
       let generateClick = document.querySelector('#generate')
       generateClick.addEventListener('click', event => {
          // Transaction to generate Winning number
          this.casinoContract.methods.generateWinner()
          .send({
             gas: 2000000,
             from: this.defaultAccount,
          }, (error, result) => {
             if(error){
                console.log(error);
             }
             this.updateState();
          })
       })
    }
 
    voteNumber(number, cb){
       let bet = document.querySelector('#ether-bet').value
       console.log(this.casinoContract);
       if(!bet) bet = 0.1
 
       if(parseFloat(bet) < this.state.minimumBet){
          alert('You must bet more than the minimum')
          cb()
       } else {
          // Transaction to bet for a number
          this.casinoContract.methods.bet(number).send({
             gas: 300000,
             from: this.defaultAccount,
             value: this.web3.utils.toWei(bet.toString(), 'ether')
          }, (error, result) => {
             if(error){console.log(error);}
             cb()
          })
       }
       
    }
 }
 
 var insta = new CasinoApp();
 