export interface IAdminCreationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAdminUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface IPlatformSettingsData {
  commissionPercentage: number;
  contactEmail: string;
  supportEmail: string;
  globalBannerText?: string;
  isMaintenanceMode: boolean;
}
