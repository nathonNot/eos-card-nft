declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare interface Window {
  IpfsHttpClient: any;
  eosjs_jsonrpc: any;
  eosjs_jssig: any;
  eosjs_api: any;
}
