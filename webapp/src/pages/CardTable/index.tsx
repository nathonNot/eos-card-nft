import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { List, Card } from 'antd';
import store from '@/store';

const { Meta } = Card;

function CardTable() {
  const [cardBookState, cardBookDispatchers] = store.useModel('cardBook');

  useEffect(() => {
    cardBookDispatchers.initNFTData();
  }, []);

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={cardBookState.NFTData}
      renderItem={(item) => (
        <List.Item>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={<img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          >
            <Meta title={item.cardName} description={item.value} />
          </Card>
        </List.Item>
      )}
    />
  );
}
export default React.forwardRef(CardTable);
