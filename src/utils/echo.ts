import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getToken } from '@/utils/auth';

const URI = import.meta.env.VITE_API_BASE_URL;

export default class LarEcho {
  public static instance = new LarEcho();

  private readonly echo: Echo;

  public getEcho() {
    return this.echo;
  }

  public getSocketId() {
    return this.echo.socketId();
  }

  private constructor() {
    Pusher.logToConsole = true;
    const token = getToken();
    console.log('token', token);
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: '8B9SPpgntbv2T6Fo',
      wsHost: 'pusher.codedonuts.com',
      wsPort: 443,
      wssPort: 443,
      forceTLS: true,
      encrypted: true,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${URI}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer  ${token}`,
        },
      },
    });
    return this;
  }

  public subscribe(
    channel: string,
    event: string,
    callback: any,
    isPrivate = true
  ) {
    if (isPrivate) {
      return this.echo.private(channel).listen(event, callback);
    }
    return this.echo.channel(channel).listen(event, callback);
  }
}
