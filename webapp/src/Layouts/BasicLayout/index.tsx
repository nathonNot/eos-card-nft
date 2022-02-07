import { createElement } from 'react';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { Link } from 'ice';
import { asideMenuConfig } from './menuConfig';
import { Layout, Menu } from 'antd';
import styles from './index.module.css';

const { Header, Content, Footer } = Layout;

const loopMenuItem = (menus) =>
  menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: createElement(icon),
    children: children && loopMenuItem(children),
  }));

export default function BasicLayout({ children, location }) {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          {asideMenuConfig.map((item, index) => {
            const key = index + 1;
            return (
              <Menu.Item key={key}>
                <Link to={item.path}>{item.name}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }} className={styles.siteLayoutContent}>
        <div style={{ minHeight: '60vh' }}>{children}</div>
      </Content>
    </Layout>
  );
}
