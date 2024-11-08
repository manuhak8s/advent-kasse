export interface IElectronAPI {
    send: (channel: string, data?: any) => void;
  }
  
  declare global {
    interface Window {
      electron: IElectronAPI;
    }
  }