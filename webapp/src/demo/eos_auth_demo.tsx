import { Api, JsonRpc } from 'eosjs';

// import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';  // development only
import React from "react";
import { withRouter } from "react-router-dom";
import { Input, Button, Form } from 'antd';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';  // development only
// import { GetAccountResult } from 'eosjs/dist/eosjs-rpc-interfaces';
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

class EOSAuthDemo extends React.Component {

    rpc = new JsonRpc('https://api.testnet.eos.io');
    state: {

    }
    private_key = "5JUsWgAQWJpxB8ohSgekyESagHEf1Pisxo7AWgtmXeTvkMP19Kc";
    constructor(props: any) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
    }

    addAuth() {
        return (
            <>
                <Form className="eos_auto_form" {...layout} name="nest-messages" onFinish={this.onAddAuthFinish} validateMessages={validateMessages}>
                    <Form.Item name={['user', 'owner']} label="owner" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'from_auth']} label="校验权限名" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'owner_pri_key']} label="owner密钥" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'to_add_auth_account']} label="增加权限账户" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'add_auth_name']} label="增加权限名" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'add_auth_pub_key']} label="增加权限public key" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            授权
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }

    onAddAuthFinish = (values: any) => {
        console.log(values);
        this.AddAuth(values.user);
    };

    onFinish = (values: any) => {
        console.log(values);
    };

    AddAuth = async (userData: any) => {
        if (this.rpc === null) {
            return;
        }
        const rpc = this.rpc;
        const authorization_object = {
            threshold: 1,
            accounts: [{
                permission: {
                    actor: userData.owner,
                    permission: userData.from_auth
                },
                weight: 1
            }],
            keys: [{
                key: userData.add_auth_pub_key,
                weight: 1
            }],
            waits: []
        };
        const updateauth_input = {
            account: userData.to_add_auth_account,
            permission: userData.add_auth_name,
            parent: 'active',
            auth: authorization_object
        };
        let privateKeys = [userData.owner_pri_key];
        const signatureProvider = new JsSignatureProvider(privateKeys);
        const api = new Api({ rpc, signatureProvider });
        await api.transact({
            actions: [
                {
                    account: 'eosio',
                    name: 'updateauth',
                    authorization: [{
                        actor: userData.owner,
                        permission: userData.from_auth,
                    }],
                    data: updateauth_input,
                }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
    }

    render() {
        return (<>
            <Form className="eos_auto_form" {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                <Form.Item name={['user', 'auth_from']} label="授权者" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'auth_to']} label="被授权人" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'auth_from_pub_key']} label="授权公钥" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'auth_name']} label="授予权限" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'auth_from_pri_key']} label="授权者私钥" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        授权
                    </Button>
                </Form.Item>
            </Form>
            {this.addAuth()}
            );
        </>)
    }
}

export default withRouter(EOSAuthDemo);