import { JSEncrypt } from 'jsencrypt';

export default function rsaEncrypt(str: string, publicKey: string) {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(publicKey);
  const result = jsEncrypt.encrypt(str);
  return result || '';
}
