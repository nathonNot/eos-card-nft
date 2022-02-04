import { ipfs_host, ipfs_port } from '@/config';

const { create } = window.IpfsHttpClient;
/* 创建一个 IPFS 客户端实例 */
const client = create({ host: ipfs_host, port: ipfs_port, protocol: 'http' });

async function updateFile(file) {
  /* 上传文件 */
  const addHash = await client.add(file);
  return addHash;
}

export { updateFile };
