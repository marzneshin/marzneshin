import { HostSchema } from 'stores';
export const getDefaultValues = (): HostSchema => {
  return {
    host: '',
    sni: '',
    port: 1,
    path: '',
    address: '',
    remark: '',
    security: 'inbound_default',
    alpn: '',
    fingerprint: '',
  }
};
