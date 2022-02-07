// import Web3 from "web3";
import { ethers, Contract, Wallet, getDefaultProvider } from 'ethers';
import { request } from 'ice';
import { NFTData } from '@/types/card';
import { GetCardApiData } from './api';

if (window.ethereum) {
  window.ethereum.request({ method: 'eth_requestAccounts' });
}
function getProvider() {
  if (window.web3) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // There is only ever up to one account in MetaMask exposed
    console.log('connect to the web3 Provider');
    return provider;
  } else {
    return getDefaultProvider('ropsten');
  }
}

const cardNFTContractAddress = '0xF0058c7081FA9bCf60D6B849B7951F4ddBc62164';

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
  console.log(params);
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const contractWithSigner = cardNFTContract.connect(signer);
    let payValue = params.payNum ? params.payNum : 0;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    payValue = (payValue + 10) / 10000;
    const options = { value: ethers.utils.parseEther(`${payValue}`) };
    const fromTypeBigNum = ethers.utils.formatBytes32String(`${params.fromType}`);
    const randomTypeBigNum = params.randomType.map((item) => ethers.utils.formatBytes32String(`${item}`));
    const tx = await contractWithSigner.createCard(fromTypeBigNum, randomTypeBigNum, options);
    const receipt = await tx.wait(2);
    const sumEvent = receipt.events.pop();
    if (sumEvent.event === 'CardCreated') {
      const createAddress = sumEvent.args[0];
      if (createAddress === signerAddress) {
        const tokenId = sumEvent.args[1].toNumber();
        console.log('tokenId is', tokenId);
        return tokenId;
      }
    }
    console.log('create card ok', sumEvent);
    return -2;
  }
  return -1;
}

export { getAllTable, forgingCard };
