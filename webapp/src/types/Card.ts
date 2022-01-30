export interface CardInfo {
  star: string;
  name: string;
  type: string;
}

export interface NFTData {
  id: string;
  owner: string; // 所有者
  value: string; // nft币种类型
  cardName: string;
  imgHashId: string[];
  options: string;
}
