import { request } from 'ice';

const baseUrl = 'https://localhost:7142';

async function GetCardApiData(id) {
  return await request({
    baseURL: baseUrl,
    url: `/NFT/${id}`,
  });
}

export { GetCardApiData };
