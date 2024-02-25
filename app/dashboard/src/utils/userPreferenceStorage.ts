

export class PageSizeManager {
  private localStorageKey: string;
  private defaultPageSize: number;

  constructor(localStorageKey: string, defaultPageSize: number) {
    this.localStorageKey = `marzneshin-num-${localStorageKey}-per-page`;
    this.defaultPageSize = defaultPageSize;
  }

  private getStoredPageSize(): string | null {
    return localStorage.getItem(this.localStorageKey);
  }

  getPageSize(): number {
    const storedPageSize = this.getStoredPageSize();
    const parsedPageSize = parseInt(storedPageSize || '', 10);
    return isNaN(parsedPageSize) ? this.defaultPageSize : parsedPageSize;
  }

  setPageSize(value: string): void {
    localStorage.setItem(this.localStorageKey, value);
  }
}

export const pageSizeManagers = {
  users: new PageSizeManager('users', 10),
  inbounds: new PageSizeManager('inbounds', 10),
  nodes: new PageSizeManager('nodes', 10),
  hosts: new PageSizeManager('hosts', 10),
  services: new PageSizeManager('services', 10),
}
