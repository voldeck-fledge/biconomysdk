const Web3 = require('web3');
var biconomy_module = require("@biconomy/mexa");
var Gateway = require('@burner-wallet/core/gateways/Gateway');
var Biconomy = biconomy_module.Biconomy;

class BiconomyGateway extends Gateway {
  constructor() {
    super();
    this._w3Provider = null;
    var web3 = "ws://your-web3-url";
    var api_key = "your-api-key";
    var debug = true;
    this.http_provider = "https://dai.poa.network";
    this.biconomy = new Biconomy(web3,{apiKey: api_key, debug: debug});
    this.web3 = new Web3(biconomy);
    /** check ready status ?
     * 
     * 
     * 
this.biconomy.onEvent(biconomy.READY, () => {
  // Initialize your dapp here like getting user accounts etc
}).onEvent(biconomy.ERROR, (error, message) => {
  // Handle error while initializing mexa
});
     * 
     */
  }
  isAvailable() {
    return true;
  }

  getNetworks() {
    return ['100'];
  }

  _provider(network) {
    if (!this._w3Provider) {
      this._w3Provider = new Web3.providers.HttpProvider(this.http_provider);
    }
    return this._w3Provider;
  }

  send(network, payload) {
    return new Promise((resolve, reject) => {
      if (network !== '100') {
        return reject(new Error('Biconomy does not support this network'));
      }
      var contract_api = '';
      var contract_address = '';
      // Initialize constants
      let contract = new web3.eth.Contract(
                    contract_api,
                    contract_address
                );

      let userAddress = ""; // recipient address
      //Call your target method (must be registered on the dashboard).. here we are calling setQuote() method of our contract
      let tx = contract.methods.setQuote(newQuote).send({
            from: userAddress,
            signatureType: this.biconomy.EIP712_SIGN,
            //optionally you can add other options like gasLimit
       });

      tx.on("transactionHash", function (hash) {
        console.log(`Transaction hash is ${hash}`);
        console.log(`Transaction sent. Waiting for confirmation ..`);
       }).once("confirmation", function (confirmationNumber, receipt) {
                    console.log(receipt);
                    console.log(receipt.transactionHash);
                    resolve(receipt);
                    //do something with transaction hash
       });    
    });
  }
}

module.exports = BiconomyGateway;
