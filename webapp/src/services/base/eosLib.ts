const { Api } = window.eosjs_api;
const { JsonRpc } = window.eosjs_jsonrpc;
const { JsSignatureProvider } = window.eosjs_jssig;

const rpc = new JsonRpc('https://api.testnet.eos.io');
const account = 'vtdqmgzkkpnc';
const privateKeys = ['5JQSMXZZPkbK7WYh5u6BqSJPgViCVp2KUVdnK1AmWYxPLANaMcx'];
const signatureProvider = new JsSignatureProvider(privateKeys);
const api = new Api({ rpc, signatureProvider });
const selfAccount = 'brxnhwibizwk';

async function insertCard(param) {
  const data = {
    star: 10,
    quality: 3,
  };
  console.log(param);
  const cardData = {
    tkn_name: param.cardName,
    to: selfAccount,
    uris: ['acascascascasc'],
    memo: 'Forge cards',
  };
  // await api.transact(
  //   {
  //     actions: [
  //       {
  //         account,
  //         name: 'issue',
  //         authorization: [
  //           {
  //             actor: account,
  //             permission: 'active',
  //           },
  //         ],
  //         data: {
  //           to: 'gwhjbuuoszou',
  //           quantity: '1NFTB',
  //           uris: [''],
  //           tkn_name: '奇迹',
  //           memo: 'Forge cards',
  //           tkn_data: JSON.stringify(data),
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     blocksBehind: 3,
  //     expireSeconds: 30,
  //   },
  // );
  return true;
}

async function getAllNFTCardTable() {
  const table = await rpc.get_table_rows({
    json: true, // Get the response as json
    code: account, // Contract that we target
    scope: account, // Account that owns the data
    table: 'token', // Table name
    limit: 10, // Maximum number of rows that we want to get
    reverse: false, // Optional: Get reversed data
    show_payer: false, // Optional: Show ram payer
  });
  return table.rows.map((item) => ({
    id: item.id,
    owner: item.owner,
    value: item.value,
    cardName: item.tokenName,
    imgHashId: item.uri,
    options: item.tokenData,
  }));
}
export { insertCard, getAllNFTCardTable };
