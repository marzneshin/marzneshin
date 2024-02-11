import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useDashboard } from './DashboardContext';
import { fetch } from 'service/http';
import { Inbounds } from 'types/Inbounds';


export const fetchInbounds = async () => {
  useDashboard.setState({ loading: true });
  return fetch('/inbounds')
    .then((inbounds: Inbounds) => {
      useInbounds.setState({ inbounds });
    })
    .finally(() => {
      useDashboard.setState({ loading: false });
    });
};


type InboundsStateType = {
  inbounds: Inbounds;
  refetchInbounds: () => void;
};

export const useInbounds = create(
  subscribeWithSelector<InboundsStateType>(() => ({
    inbounds: [],
    refetchInbounds: () => {
      fetchInbounds();
    },
  }))
);
