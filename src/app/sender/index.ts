import { IAbstractRequest } from '../../io/interfaces';
export { WebSender } from './webSender';
export { NodeSender } from './nodeSender';

export interface ISender {
  send(request: IAbstractRequest, callback);
  fetchAllData?(callback: Function);
}