import { createStore, IStoreModels, IStoreDispatch, IStoreRootState } from 'ice';
import cardBook from './models/cardBook';

interface IAppStoreModels extends IStoreModels {
  cardBook: typeof cardBook;
}
const appModels: IAppStoreModels = {
  cardBook,
};
export default createStore(appModels);

export type IRootDispatch = IStoreDispatch<typeof appModels>;
export type IRootState = IStoreRootState<typeof appModels>;
