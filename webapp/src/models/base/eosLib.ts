const { Api } = window.eosjs_api;
const { JsonRpc } = window.eosjs_jsonrpc;
const { JsSignatureProvider } = window.eosjs_jssig;

const rpc = new JsonRpc('https://api.testnet.eos.io');
const account = 'vtdqmgzkkpnc';
const privateKeys = ['5JQSMXZZPkbK7WYh5u6BqSJPgViCVp2KUVdnK1AmWYxPLANaMcx'];
const signatureProvider = new JsSignatureProvider(privateKeys);
const api = new Api({ rpc, signatureProvider });

async function insertCard(param) {
  const data = {
    star: 10,
    quality: 3,
  };
  await api.transact(
    {
      actions: [
        {
          account,
          name: 'issue',
          authorization: [
            {
              actor: account,
              permission: 'active',
            },
          ],
          data: {
            to: 'gwhjbuuoszou',
            quantity: '1NFTB',
            uris: [''],
            tkn_name: '奇迹',
            memo: 'Forge cards',
            tkn_data: JSON.stringify(data),
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    },
  );
  return true;
}
export { insertCard };
