import { Notification } from '@arco-design/web-vue';
import LarEcho from '@/utils/echo';

export interface NotificationData {
  title?: string;
  type: string;
  message: string;
}

// 订阅公共频道
export const subscribeNotification = () => {
  console.log('Echo public socketId:', LarEcho.instance.getEcho().socketId());

  return LarEcho.instance.subscribe(
    'Notification',
    '.App\\Events\\MessageNotification',
    function (data: NotificationData) {
      console.log('subscribeNotification:', data);
      const title = data?.title || '提示信息';
      switch (data.type) {
        case 'success':
          Notification.success({
            title,
            content: data.message,
          });
          break;
        case 'warning':
          Notification.warning({
            title,
            content: data.message,
          });
          break;
        case 'error':
          Notification.warning({
            title,
            content: data.message,
          });
          break;
        default:
          Notification.info({
            title,
            content: data.message,
          });
          break;
      }
    },
    false
  );
};

// 订阅私有频道
export const subscribePrivateNotification = (id: number) => {
  console.log('Echo private socketId:', LarEcho.instance.getEcho().socketId());

  return LarEcho.instance
    .subscribe(
      `App.Models.User.${id}`,
      '.App\\Events\\PrivateMessageNotification',
      function (data: NotificationData) {
        console.log('subscribePrivateNotification:', data);
        const title = data?.title || '提示信息';
        switch (data.type) {
          case 'success':
            Notification.success({
              title,
              content: data.message,
            });
            break;
          case 'warning':
            Notification.warning({
              title,
              content: data.message,
            });
            break;
          case 'error':
            Notification.warning({
              title,
              content: data.message,
            });
            break;
          default:
            Notification.info({
              title,
              content: data.message,
            });
            break;
        }
      }
    )
    .notification((notification: any) => {
      console.log('notification:', notification.type);
    });
};

export interface ChatData {
  message: string;
}

// 订阅聊天室频道
export const subscribeChatRoom = (id = 1) => {
  console.log('Echo chatRoom socketId:', LarEcho.instance.getEcho().socketId());
  return LarEcho.instance
    .subscribe(
      `Chat.${id}`,
      '.App\\Events\\ChatRoomEvent',
      function (data: ChatData) {
        console.log('subscribeChatRoom:', data);
        Notification.info({
          title: '聊天室信息',
          content: data.message,
        });
      }
    )
    .listenForWhisper('typing', (e: any) => {
      console.log('typing', e.name);
    });
};
