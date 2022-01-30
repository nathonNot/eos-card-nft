import React from "react";
import { ethers } from 'ethers';

class ETHDemo extends React.Component {

    state: {
        eos_info: any
    }
    constructor(props: any) {
        super(props);

        this.state = {
            eos_info: null
        }
        this.eth_init_info();
    }

    async eth_init_info() {
        const url = "http://localhost:7545";

        // Or if you are running the UI version, use this instead:
        // const url = "http://localhost:7545"
        
        const provider = new ethers.providers.JsonRpcProvider(url);
        
        // Getting the accounts
        const signer0 = provider.getSigner(0);
        const signer1 = provider.getSigner(1);
        provider.getBlockNumber().then((blockNumber) => {
            console.log("Current block number: " + blockNumber);
        });
        console.log(signer0);
        console.log(signer1);

    }

    render() {
        return (<>
        </>)
    }
}

export default ETHDemo;