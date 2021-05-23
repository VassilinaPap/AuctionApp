import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {highestBid: 0,highestBidder:null,balance:0, web3: null, accounts: null, contract: null,input:"" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
	
      const response=await instance.methods.highestBid().call();
      const response1=await instance.methods.highestBidder().call();
      const response2=await instance.methods.getContractBalance().call();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance ,highestBid:response,highestBidder:response1,balance:response2});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.bid().send({ from: accounts[0],value:this.state.input });

   
  };
  withdraw = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.withdraw().send({ from: accounts[0]});

    // Get the value from the contract to prove it worked.
   
   
    // Update state with the result.
    };
  highestbid = async () => {
    const {contract } = this.state;

     const response = await contract.methods.highestBid().call();
     // Update state with the result.
    this.setState({ highestBid: response});
  };
  highestbidder = async () => {
    const { contract } = this.state;

     const response = await contract.methods.highestBidder().call();
     // Update state with the result.
    this.setState({ highestBidder: response});
  };
  Balance = async () => {
    const {contract } = this.state;

     const response = await contract.methods.getContractBalance().call();
     // Update state with the result.
    this.setState({ balance: response});
  };


  myChangeHandler = (event) => {
    this.setState({input:event.target.value});
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction</h1>
        <input  type='text' onChange={this.myChangeHandler}/>
	<button onClick={this.bid}>Bid</button><br></br><br></br>
        <h2>Withdraw your money</h2>   
	<button onClick={this.withdraw}>Withdraw</button><br></br><br></br><br></br>
        <button onClick={this.highestbid}>HighestBid</button><br></br>
        <div>{this.state.highestBid}</div><br></br>
        <button onClick={this.highestbidder}>HighestBidder</button><br></br>
        <div>{this.state.highestBidder}</div><br></br>
        <button onClick={this.Balance}>ContractBalance</button><br></br>
        <div>{this.state.balance}</div> 
      </div>
    );
  }
}

export default App;
