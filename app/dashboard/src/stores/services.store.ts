import { queryClient } from 'service/react-query';
import { Service, ServiceCreate } from 'types/service';
import { pageSizeManagers } from 'utils/userPreferenceStorage';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { fetch } from 'service/http';
import { ServicesFilterType } from 'types/filter';
import { useDashboard, useUsers } from 'stores';
import { queryIds } from 'constants/query-ids';

type ServicesStateType = {
  isCreatingNewService: boolean;
  editingService: Service | null | undefined;
  deletingService: Service | null;
  servicesFilters: ServicesFilterType;
  onCreateService: (isOpen: boolean) => void;
  onEditingService: (service: Service | null) => void;
  onDeletingService: (service: Service | null) => void;
  refetchServices: () => void;
  deleteService: (service: Service) => Promise<void>;
  createService: (service: ServiceCreate) => Promise<void>;
  editService: (service: ServiceCreate) => Promise<void>;
  onFilterChange: (filters: Partial<ServicesFilterType>) => void;
};

export const fetchServices = async (query: ServicesFilterType): Promise<Service[]> => {
  for (const key in query) {
    if (!query[key as keyof ServicesFilterType]) delete query[key as keyof ServicesFilterType];
  }

  useDashboard.setState({ loading: true });

  return fetch('/services')
    .then((services) => {
      return services;
    })
    .finally(() => {
      useDashboard.setState({ loading: false });
    });
};

export const useServices = create(
  subscribeWithSelector<ServicesStateType>((set, get) => ({
    editingService: null,
    deletingService: null,
    isCreatingNewService: false,
    servicesFilters: {
      name: '',
      limit: pageSizeManagers.services.getPageSize(),
      sort: '-created_at',
    },
    onFilterChange: (filters) => {
      set({
        servicesFilters: {
          ...get().servicesFilters,
          ...filters,
        },
      });
      get().refetchServices();
    },
    refetchServices: () => {
      queryClient.invalidateQueries({ queryKey: [queryIds.services] });
    },
    onCreateService: (isCreatingNewService) => set({ isCreatingNewService }),
    onEditingService: (editingService) => {
      set({ editingService });
    },
    onDeletingService: (deletingService) => {
      set({ deletingService });
    },
    deleteService: async (service: Service) => {
      set({ editingService: null });
      return fetch(`/services/${service.id}`, { method: 'DELETE' }).then(() => {
        set({ deletingService: null });
        get().refetchServices();
        useUsers.getState().refetchUsers();
      });
    },
    createService: async (body: ServiceCreate) => {
      return fetch('/services', { method: 'POST', body }).then(() => {
        set({ editingService: null });
        get().refetchServices();
      });
    },
    editService: async (body: ServiceCreate) => {
      return fetch(`/services/${body.id}`, { method: 'PUT', body }).then(
        () => {
          get().onEditingService(null);
          get().refetchServices();
        }
      );
    },
  }))
);
