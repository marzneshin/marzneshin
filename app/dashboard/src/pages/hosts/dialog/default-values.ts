import { HostSchema } from 'stores';
export const getDefaultValues = (): HostSchema => {
  return {
    host: '',
    sni: '',
    port: null,
    path: '',
    address: '',
    remark: '',
    security: 'inbound_default',
    alpn: '',
    fingerprint: '',
  }
};
