import { updateFile } from './base/ipfs';
import { insertCard } from './base/eosLib';

async function doForgingCard(params) {

  // const ipfsData = await updateFile(params);
  // console.log('update file:', ipfsData);
  // const hashId = ipfsData.path;
  await insertCard('hashId');
}
export { doForgingCard };
