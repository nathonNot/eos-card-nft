// import Web3 from "web3";
import { ethers, Contract, Wallet, getDefaultProvider } from 'ethers';
import { request } from 'ice';
import { NFTData } from '@/types/card';
import { GetCardApiData } from './api';

function getProvider() {
  if (window.web3) {
    const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    // There is only ever up to one account in MetaMask exposed
    console.log('connect to the web3 Provider');
    return provider;
  } else {
    return getDefaultProvider('ropsten');
  }
}

const cardNFTContractAddress = '0x1f4c81d83fdf5c34405703a9540feD838DC2D31F';

async function getNFTContract() {
  const abi = await request({
    url: '/MiracleCard.json',
  });
  return new Contract(cardNFTContractAddress, abi.abi, getProvider());
}

async function getToken(cardNFTContract, id) {
  const tokenEthData = await cardNFTContract.getToken(id);
  const tokenApiData = await GetCardApiData(id);
  return {
    id: tokenEthData[0].toNumber(),
    star: tokenEthData[1].toNumber(),
    value: tokenEthData[2].toNumber(),
    cardName: tokenApiData.cardName,
    imgHashId: tokenEthData[5].replaceAll('\u0000', ''),
    owner: tokenEthData[6],
    options: '',
  };
}

async function getAllTable() {
  const cardNFTContract = await getNFTContract();
  const allTokenIds = await cardNFTContract.allTokenIds();
  const tokenList = new Array<NFTData>();
  const awaitList = allTokenIds.map((id) => getToken(cardNFTContract, id));
  for await (const tokenData of awaitList) {
    tokenList.push(tokenData);
  }
  return tokenList;
}

async function forgingCard(params) {
  const cardNFTContract = await getNFTContract();
  if (window.web3) {
    const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    const signer = provider.getSigner();
    const withSigner = cardNFTContract.connect(signer);
    const tokenId = await withSigner.createCard();
  }
  return -1;
}

export { getAllTable, forgingCard };
