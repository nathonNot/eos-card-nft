import React, { useState } from 'react';
import styles from './index.module.css';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
  Input,
  message,
  Spin,
} from 'antd';
import { doForgingCard } from '@/services/forgingCard';
import { imgToBase64 } from '@/services/util/imgToBase64';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const fromTypeSelectOptions = [
  { label: '测试网络1', value: 'type1' },
  { label: '测试网络2', value: 'type2' },
];

const randomType = [
  { value: '1', name: '伤害' },
  { value: '2', name: '影响' },
  { value: '3', name: '特性' },
];

function ForginCard() {
  const [fileUrl, setFileUrl] = useState('');
  const [fileBase64, setImgFile] = useState('');
  const [isImgOk, setImageOk] = useState(false);

  const onFinish = async (values: any) => {
    if (fileBase64 === '') {
      message.error('请上传图片');
      return;
    }
    const forgingData = {
      fileBase64,
      ...values,
    };
    await doForgingCard(forgingData);
  };

  const onFileToBase64 = (imgStr) => {
    setImgFile(imgStr);
    setImageOk(false);
  };
  const processImage = (event) => {
    setImgFile('');
    const imageFile = event.target.files[0];
    if (!imageFile) return;
    setImageOk(true);
    imgToBase64(imageFile, onFileToBase64);
    const imageUrl = URL.createObjectURL(imageFile);
    setFileUrl(imageUrl);
  };
  return (
    <>
      {fileUrl !== '' ? (
        <Row justify="center">
          <img src={fileUrl} />
        </Row>
      ) : (
        <></>
      )}
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          'input-number': 3,
          'checkbox-group': ['A', 'B'],
          rate: 3.5,
        }}
      >
        <Form.Item name="cardName" label="卡名" rules={[{ required: true, message: '卡名是必须的' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="fromType" label="链" hasFeedback rules={[{ required: true, message: '选择那条链' }]}>
          <Select placeholder="选择那条链" options={fromTypeSelectOptions} />
        </Form.Item>

        <Form.Item name="payNum" label="铸造投入的币量">
          <Slider
            marks={{
              0: '0',
              20: '1',
              40: '2',
              60: '3',
              80: '4',
              100: '5',
            }}
          />
        </Form.Item>

        <Form.Item name="cardType" label="卡牌类型" rules={[{ required: true, message: '请选择你的卡牌类型' }]}>
          <Radio.Group>
            <Radio.Button value="1">奇迹</Radio.Button>
            <Radio.Button value="2">战略</Radio.Button>
            <Radio.Button value="3">英雄</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="randomType" label="随机词条属性">
          <Checkbox.Group>
            <Row>
              {randomType.map((item) => (
                <Col span={8} key={item.value}>
                  <Checkbox value={item.value} style={{ lineHeight: '32px' }}>
                    {item.name}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name="upload"
          label="上传卡面"
          getValueFromEvent={normFile}
          rules={[
            {
              validator: (_, value) => (fileBase64 !== '' ? Promise.resolve() : Promise.reject(new Error('请上传卡面图片'))),
            },
          ]}
        >
          <input type="file" accept="image/*" onChange={processImage} />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          {isImgOk ? (
            <Spin />
          ) : (
            <Button type="primary" htmlType="submit">
              铸造
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
}
export default React.forwardRef(ForginCard);
