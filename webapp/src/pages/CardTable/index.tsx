import React, { useState } from 'react';
import styles from './index.module.css';
import { List, Card } from 'antd';

const { Meta } = Card;

const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
];

function CardTable() {
  const [fileUrl, setFileUrl] = useState('');
  const [imgFile, setImgFile] = useState<any>(null);

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
        </List.Item>
      )}
    />
  );
}
export default React.forwardRef(CardTable);
