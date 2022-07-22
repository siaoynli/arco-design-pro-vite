import Pusher from 'pusher-js';
import { getToken } from '@/utils/auth';

const URI = import.meta.env.VITE_API_BASE_URL;

export default class LarPusher {
  public static instance = new LarPusher();

  private pusher: Pusher;

  private constructor() {
    Pusher.logToConsole = true;
    const key = 'f5a370ec394bcbab27e1';
    const cluster = 'ap3';
    const token = getToken();
    this.pusher = new Pusher(key, {
      cluster,
      channelAuthorization: {
        transport: 'ajax',
        endpoint: `${URI}/broadcasting/auth`,
        headers: [{ Authorization: `Bearer  ${token}` }],
      },
    });
    return this;
  }

  public subscribe(channel: string, event: string, callback: any) {
    return this.pusher.subscribe(channel).bind(event, callback);
  }
}
