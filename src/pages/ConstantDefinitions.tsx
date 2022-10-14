import { Skeleton } from '../core/types'

export abstract class Constants {
  static readonly EMPTY: Skeleton = [
    {
      id: 'TCO',
      eval: '0',
    },
  ]
  static readonly SAMPLE_TCO: Skeleton = [
    {
      id: 'TCO',
      eval: 'Azure + Tableau + Looker + AWS + GCP + 0',
      assumptions: {
        BQ_Initial_Storage_GB: 100,
        BQ_MoM_Storage_GB: 50,
        BQ_Query_Size_GB: 30,
        GCS_Initial_Storage_GB: 500,
        GCS_MoM_Storage_GB: 100,
        GCE_Num_of_instances: 2,
        GCE_Run_time_hr_per_month: 20,
        Notebook_Num_of_instances: 1,
        Notebook_Run_time_hr_per_month: 8,
        VPN_Num_of_tunnels: 2,
        Cloud_Data_Fusion_Num_of_instances: 1,
        Cloud_Data_Fusion_Run_time_hr_per_month: 20,
        Dataprep_Num_of_users: 5,
        Dataprep_vCPU_hrs_per_month: 20,
        S3_Initial_Storage_GB: 500,
        S3_MoM_Storage_GB: 100,
        EC2_Num_of_instances: 2,
        EC2_Run_time_hr_per_month: 20,
        Snowflake_Initial_Storage_GB: 0,
        Snowflake_MoM_Storage_GB: 100,
        Snowflake_Num_of_warehouse: 2,
        Snowflake_Warehouse_credits_per_hr: 1,
        Snowflake_Query_Run_time_hr_per_month: 20,
        Looker_Num_of_dashboard_users: 15,
        Tableau_Num_of_Creator_Seats: 1,
        Tableau_Num_of_Viewer_Seats: 9,
        Web_App_Num_of_instances: 2,
        Web_App_Run_time_hr_per_month: 20,
        Databricks_Num_of_VMs: 1,
        Databricks_Run_time_hr_per_month: 730,
      },
      units: '${}',
    },
    {
      id: 'GCP',
      eval: 'Web_App + Dataprep + Cloud_Data_Fusion + VPN + Web_App + Notebook + Instances + GCS + BQ + 0',
      units: '${}',
      parent: 'TCO',
    },
    {
      id: 'BQ',
      eval: 'BQ_Storage_Cost + BQ_Query_Cost',
      units: '${}',
      parent: 'GCP',
    },
    {
      id: 'BQ_Storage_Cost',
      eval: 'BQ_Ave_Monthly_Size_GB * 0.02',
      parent: 'BQ',
      units: '${}',
    },
    {
      id: 'BQ_Ave_Monthly_Size_GB',
      eval: 'max(0, 12 * BQ_Initial_Storage_GB + 66 * BQ_MoM_Storage_GB - 12 * 10) / 12',
      parent: 'BQ_Storage_Cost',
      units: '{} GB',
    },
    {
      id: 'BQ_Query_Cost',
      eval: 'max(0, BQ_Query_Size_GB - 1000) * 6.75',
      parent: 'BQ',
      units: '${}',
    },
    {
      id: 'GCS',
      eval: '((12 * GCS_Initial_Storage_GB + 66 * GCS_MoM_Storage_GB) / 12) * 0.02',
      units: '${}',
      parent: 'GCP',
    },
    {
      id: 'Instances',
      eval: 'GCE_Num_of_instances * GCE_Run_time_hr_per_month * 0.194236',
      units: '${}',
      parent: 'GCP',
    },
    {
      id: 'Notebook',
      eval: 'Notebook_Num_of_instances * Notebook_Run_time_hr_per_month * 0.386',
      units: '${}',
      parent: 'GCP',
    },
    {
      id: 'VPN',
      eval: 'VPN_Num_of_tunnels * 0.055',
      units: '${}',
      parent: 'GCP',
    },
    {
      id: 'Cloud_Data_Fusion',
      eval: 'Cloud_Data_Fusion_Num_of_instances * Cloud_Data_Fusion_Run_time_hr_per_month * 4.2',
      units: '${}',
      parent: 'GCP',
    },
    {
      id: 'Dataprep',
      eval: '(80 * Dataprep_Num_of_users) + (0.6 * Dataprep_vCPU_hrs_per_month)',
      units: '${}',
      parent: 'GCP',
    },
    {
      id: 'AWS',
      eval: 'Snowflake + EC2 + S3 + 0 # Edit to your desired constant later',
      parent: 'TCO',
      units: '${}',
    },
    {
      id: 'S3',
      eval: '0.025 * ((12 * S3_Initial_Storage_GB + 66 * S3_MoM_Storage_GB) / 12)',
      units: '${}',
      parent: 'AWS',
    },
    {
      id: 'EC2',
      eval: 'EC2_Num_of_instances * EC2_Run_time_hr_per_month * 0.2',
      units: '${}',
      parent: 'AWS',
    },
    {
      id: 'Snowflake',
      eval: 'Snowflake_Storage_Cost + Snowflake_Compute_Cost',
      units: '${}',
      parent: 'AWS',
    },
    {
      id: 'Snowflake_Storage_Cost',
      eval: 'Snowflake_Ave_Monthly_Size_GB * 0.046',
      parent: 'Snowflake',
      units: '${}',
    },
    {
      id: 'Snowflake_Ave_Monthly_Size_GB',
      eval: 'max(0, 12 * Snowflake_Initial_Storage_GB + 66 * Snowflake_MoM_Storage_GB - 12 * 10) / 12',
      parent: 'Snowflake_Storage_Cost',
      units: '{} GB',
    },
    {
      id: 'Snowflake_Compute_Cost',
      eval: 'Snowflake_Num_of_warehouse * Snowflake_Warehouse_credits_per_hr * Snowflake_Query_Run_time_hr_per_month * 3.7',
      parent: 'Snowflake',
      units: '${}',
    },
    {
      id: 'Looker',
      eval: '(60000 / 12) * (Looker_Num_of_dashboard_users / 10)',
      units: '${}',
      parent: 'TCO',
    },
    {
      id: 'Tableau',
      eval: '(70 * Tableau_Num_of_Creator_Seats) + (15 * Tableau_Num_of_Viewer_Seats)',
      units: '${}',
      parent: 'TCO',
    },
    {
      id: 'Web_App',
      eval: 'Web_App_Num_of_instances * Web_App_Run_time_hr_per_month * 0.141',
      units: '${}',
      parent: 'GCP',
    },
    {
      id: 'Azure',
      eval: 'Databricks + 0  # Edit to your desired constant later',
      parent: 'TCO',
    },
    {
      id: 'Databricks',
      eval: 'Databricks_Run_time_hr_per_month * Databricks_Num_of_VMs * 0.729',
      units: '${}',
      parent: 'Azure',
    },
  ]
  static readonly ASSUMPTIONS_DEFAULT: Record<string, number> = {
    users: 100,
    historical_data: 500,
  }
  static readonly CURRENCY_SETTINGS: Record<string, string | number> = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
  static readonly CURRENCY_LANGUAGE: string = 'en-US'
}
