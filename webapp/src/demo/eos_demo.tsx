import { Api, JsonRpc } from "eosjs";

// import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';  // development only
import React from "react";
import { withRouter } from "react-router-dom";
import { Descriptions, Input, Button, Table } from "antd";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig"; // development only
import { GetAccountResult } from "eosjs/dist/eosjs-rpc-interfaces";
// import { eosTeacherTableRow } from "../base/table_row_name";

const { Search } = Input;
class EOSDemo extends React.Component {
  interval: number;
  state: {
    head_block: any;
    rpc: JsonRpc;
    block_info: any;
    account_info: GetAccountResult;
    content: any;
  };
  private_key = "5JUsWgAQWJpxB8ohSgekyESagHEf1Pisxo7AWgtmXeTvkMP19Kc";
  constructor(props: any) {
    super(props);

    this.state = {
      block_info: null,
      head_block: null,
      rpc: null,
      account_info: null,
      content: null,
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.eos_init_info();
  }

  async eos_init_info() {
    let rpc = new JsonRpc("https://api.testnet.eos.io"); //required to read blockchain state
    this.setState({
      rpc: rpc,
    });
    try {
      let info = await rpc.get_info();
      let last_block = await rpc.get_block(info.head_block_id); //get the first block
      this.setState({
        head_block: last_block,
        block_info: info,
      });
    } catch (error) {
      console.error(error);
    }
    this.interval = window.setInterval(async () => {
      try {
        const rows = await rpc.get_table_rows({
          json: true,
          code: "loacbfwbcgeu",
          scope: "NFTA",
          table: "stat",
          limit: 1000,
        });
        if (rows.rows.length > 0) {
          const rowName = rows.rows[0];
          let listName = [];
          console.log(rowName);
          for (const key in rowName) {
            if (Object.prototype.hasOwnProperty.call(rowName, key)) {
              listName.push({
                title: key,
                dataIndex: key,
                key: key,
              });
            }
          }
          let table = <Table dataSource={rows.rows} columns={listName} />;
          this.setState({ content: table });
        }
      } catch (e: any) {
        if (e.json) this.setState({ content: JSON.stringify(e.json, null, 4) });
        else this.setState({ content: "" + e });
      }
    }, 5000);
  }

  get_block_info_table = () => {
    const { head_block, block_info } = this.state;
    if (head_block === null) {
      return <></>;
    }
    let date = new Date(head_block.timestamp);
    return (
      <Descriptions title="最新出块信息" bordered>
        <Descriptions.Item label="区块高度">
          {block_info.head_block_num}
        </Descriptions.Item>
        <Descriptions.Item label="版本">
          {block_info.server_version_string}
        </Descriptions.Item>
        <Descriptions.Item label="出块时间">
          {date.toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="最新块id" span={3}>
          {block_info.head_block_id}
        </Descriptions.Item>
      </Descriptions>
    );
  };
  get_account_info = () => {
    const { account_info } = this.state;
    if (account_info === null) {
      return <></>;
    }

    let permissions_item = [];
    account_info.permissions.forEach((element) => {
      let keys = [];
      element.required_auth.keys.forEach((ele) => {
        keys.push(ele.key);
      });
      permissions_item.push(
        <>
          {element.perm_name + ":" + keys.join(";")} <br />
        </>
      );
    });
    return (
      <>
        <Descriptions title="账户信息" bordered>
          <Descriptions.Item label="钱包名称">
            {account_info.account_name}
          </Descriptions.Item>
          <Descriptions.Item label="金额">
            {account_info.core_liquid_balance}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {account_info.created}
          </Descriptions.Item>
          <Descriptions.Item label="公钥">{permissions_item}</Descriptions.Item>
          {/* <Descriptions.Item label="最新块id" span={3}>
                    {block_info.head_block_id}
                </Descriptions.Item> */}
        </Descriptions>
        <Button onClick={this.test_contract}>调用合约</Button>
      </>
    );
  };

  get_account = async (pack_name) => {
    const { rpc } = this.state;
    if (rpc === null) {
      return;
    }
    let res = await rpc.get_account(pack_name);
    console.log(res);
    this.setState({
      account_info: res,
    });
    await this.get_abi();
    return;
  };

  add_auth = async () => {
    const { rpc, account_info } = this.state;
    if (account_info === null || rpc === null) {
      return;
    }
    const authorization_object = {
      threshold: 1,
      accounts: [
        {
          permission: {
            actor: "useraaaaaaaa",
            permission: "active",
          },
          weight: 1,
        },
      ],
      keys: [
        {
          key: "PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu",
          weight: 1,
        },
      ],
      waits: [],
    };
    const updateauth_input = {
      account: "useraaaaaaaa",
      permission: "my_new_permission",
      parent: "active",
      auth: authorization_object,
    };
    let privateKeys = ["5Jk8QCXzV855qB9Af3hAbYcY9supUcgFNcTT6cD6ojwNybg6Rkt"];
    const signatureProvider = new JsSignatureProvider(privateKeys);
    const api = new Api({ rpc, signatureProvider });
    await api.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "updateauth",
            authorization: [
              {
                actor: "useraaaaaaaa",
                permission: "active",
              },
            ],
            data: updateauth_input,
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );
  };

  get_abi = async () => {
    const { rpc, account_info } = this.state;
    if (rpc === null || account_info === null) {
      return;
    }
    let abi = await rpc.get_abi(account_info.account_name);
    console.log(abi);
  };

  test_contract = async () => {
    const { rpc } = this.state;
    let vtdqmgzkkpnc_keys =
      "5JQSMXZZPkbK7WYh5u6BqSJPgViCVp2KUVdnK1AmWYxPLANaMcx";
    let privateKeys = [vtdqmgzkkpnc_keys];
    const signatureProvider = new JsSignatureProvider(privateKeys);
    const api = new Api({ rpc, signatureProvider });
    let endTodaySpam = new Date(
      new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1
    ); //获取当天23:59:59的时间
    let post_data = {
      user: "vtdqmgzkkpnc",
      to_teacher: "顺顺",
      is_open: 0,
      end_time: endTodaySpam.valueOf(),
      need_num: 2000,
      every_num: 200,
    };
    console.log(post_data);
    const result = await api.transact(
      {
        actions: [
          {
            account: "vtdqmgzkkpnc",
            name: "createpddtype",
            authorization: [
              {
                actor: "vtdqmgzkkpnc",
                permission: "active",
              },
            ],
            data: post_data,
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );
    console.log(result);
  };

  onSearch = async (value) => {
    await this.get_account(value);
  };

  render() {
    return (
      <>
        {this.get_block_info_table()}
        <Search
          placeholder="查询钱包状态"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={this.onSearch}
        />
        {this.get_account_info()}
        {this.state.content}
      </>
    );
  }
}

export default withRouter(EOSDemo);
