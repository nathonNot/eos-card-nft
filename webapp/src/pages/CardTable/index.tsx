import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { List, Card } from 'antd';
import store from '@/store';
import CardNFT from './components/CardNFT';

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
      renderItem={(item) => <CardNFT item={item} />}
    />
  );
}
export default React.forwardRef(CardTable);
