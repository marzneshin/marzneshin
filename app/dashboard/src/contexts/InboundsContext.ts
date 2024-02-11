import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useDashboard } from './DashboardContext';
import { Inbounds } from 'types/Inbounds';


export const fetchInbounds = async () => {
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
