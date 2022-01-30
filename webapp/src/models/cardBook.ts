import { getAllNFTCardTable } from '@/services/base/eosLib';
import { IRootState, IRootDispatch } from '@/store';
import { NFTData } from '@/types/card';
import { logger } from 'ice';

export default {
  // 定义 model 的初始 state
  state: {
    NFTData: new Array<NFTData>(),
  },

  // 定义改变该模型状态的纯函数
  reducers: {
    update(prevState, payload) {
      return {
        ...prevState,
        ...payload,
      };
    },
  },

  // 定义处理该模型副作用的函数
  effects: (dispatch: IRootDispatch) => ({
    async initNFTData() {
      const data = await getAllNFTCardTable();
      logger.info(data);
      dispatch.cardBook.update({
        NFTData: data,
      });
    },
  }),
  like(playload, rootState: IRootState) {},
};
