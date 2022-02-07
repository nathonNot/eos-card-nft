import { updateFile } from './base/ipfs';
// import { insertCard, getAllNFTCardTable } from './base/eosLib';
import { forgingCard, getAllTable } from './base/ethLib';

async function doForgingCard(params) {
  // const ipfsData = await updateFile(params);
  // console.log('update file:', ipfsData);
  // const hashId = ipfsData.path;
  // await insertCard('hashId');
  console.log('do forging card', params);
  // 先铸造，拿到tokenId后再上传
  const tokenId = await forgingCard(params);
  // const uri = await updateFile(JSON.stringify(params));
}

async function allNFTCardTable() {
  return await getAllTable();
}
export { doForgingCard, allNFTCardTable };
