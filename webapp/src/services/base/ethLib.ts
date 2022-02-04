// import Web3 from "web3";
import { ethers, Contract, Wallet, getDefaultProvider } from 'ethers';
import { request } from 'ice';
import { NFTData } from '@/types/card';

function getProvider() {
  if (window.web3) {
    const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    // There is only ever up to one account in MetaMask exposed
    console.log('connect to the web3 Provider');
    const signer = provider.getSigner();
    return provider;
  } else {
    return getDefaultProvider('ropsten');
  }
}

const cardNFTContractAddress = '0xCa6Ca1B309e460a6713F58547De59351747c6eF3';

async function getNFTContract() {
  const abi = await request({
    url: '/MiracleCard.json',
  });
  return new Contract(cardNFTContractAddress, abi.abi, getProvider());
}

async function getAllTable() {
  const cardNFTContract = await getNFTContract();
  const allTokenIds = await cardNFTContract.allTokenIds();
  const tokenList = new Array<NFTData>();
  const awaitList = allTokenIds.map((id) => cardNFTContract.getToken(id));
  for await (const tokenData of awaitList) {
    tokenList.push({
      id: tokenData[0].toNumber(),
      value: tokenData[1].toNumber(),
      cardName: 'qiji',
      imgHashId: tokenData[5].replaceAll('\u0000', ''),
      owner: tokenData[6],
      options: '',
    });
  }
  return tokenList;
}

export { getAllTable };
