import { updateFile } from './base/ipfs';
// import { insertCard, getAllNFTCardTable } from './base/eosLib';
import { getAllTable } from './base/ethLib';

async function doForgingCard(params) {
  // const ipfsData = await updateFile(params);
  // console.log('update file:', ipfsData);
  // const hashId = ipfsData.path;
  // await insertCard('hashId');
}

async function allNFTCardTable() {
  return await getAllTable();
}
export { doForgingCard, allNFTCardTable };
