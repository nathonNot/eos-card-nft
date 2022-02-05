import React from 'react';
import { List, Card } from 'antd';
import { NFTData } from '@/types/card';

const { Meta } = Card;

interface CardNFTProps {
  item: NFTData;
}

function CardNFT(props: CardNFTProps) {
  const { item } = props;
  return (
    <List.Item>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
      >
        <Meta title={item.cardName} description={item.value} />
      </Card>
    </List.Item>
  );
}

export default CardNFT;
