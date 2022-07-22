import { Notification } from '@arco-design/web-vue';
import LarPusher from '@/utils/pusher';

export interface NotificationData {
  title?: string;
  type: string;
  message: string;
}

// 订阅公共频道
export const subscribeNotification = () => {
  return LarPusher.instance.subscribe(
    'Notification',
    'App\\Events\\MessageNotification',
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
    }
  );
};

// 订阅私有频道
export const subscribePrivateNotification = (id: number) => {
  return LarPusher.instance.subscribe(
    `private-User.${id}`,
    'App\\Events\\PrivateMessageNotification',
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
  );
};

export interface ChatData {
  message: string;
}

// 订阅聊天室频道
export const subscribeChatRoom = (id = 1) => {
  return LarPusher.instance.subscribe(
    `private-Chat.${id}`,
    'App\\Events\\ChatRoomEvent',
    function (data: ChatData) {
      console.log('subscribeChatRoom:', data);
      Notification.info({
        title: '聊天室信息',
        content: data.message,
      });
    }
  );
};
