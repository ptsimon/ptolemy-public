// TODO when backend is formed, store all of these in the backend, and delete this file

import { Template } from '../../../libs/Template'

const DEFAULT: Template = {
  isNamed: false,
  id: 'default',
  title: 'Default',
  keywords: ['default'],
  authors: ['iman'],
  shortInfo: 'A plain number',
  nodes: [{ id: 'TCO', eval: '0  # Edit to your desired constant later' }],
}

// GCP

const GCP_TEMPLATE: Template = {
  isNamed: false,
  id: 'gcp_default',
  title: 'GCP',
  keywords: ['google cloud platform', 'gcp', 'cloud'],
  authors: ['paola'],
  shortInfo: 'Google Cloud Platform',
  nodes: [
    {
      id: 'TCO',
      eval: '0 # A parent node for GCP services',
      assumptions: {
      },
      units: "${}",
    },
  ],
}


const BQ_TEMPLATE: Template = {
  isNamed: false,
  id: 'bq_default',
  title: 'BigQuery',
  keywords: ['bigquery', 'bq', 'gcp', 'data warehouse'],
  authors: ['paola'],
  shortInfo: 'BQ data warehouse',
  nodes: [
    {
      id: 'TCO',
      eval: 'Storage_Cost + Query_Cost',
      assumptions: {
        Initial_Storage_GB: 0,
        MoM_Storage_GB: 0,
        Query_Size_GB: 0,
      },
      units: "${}",
    },
    {
      id: 'Storage_Cost',
      eval: 'Ave_Monthly_Size_GB * 0.02 #USD/GB',
      parent: 'TCO',
      units: "${}",
    },
    {
      id: 'Ave_Monthly_Size_GB',
      eval: 'max(0, 12 * Initial_Storage_GB + 66 * MoM_Storage_GB - 12 * 10) / 12',
      parent: 'Storage_Cost',
      units: "{} GB",
    },
    {
      id: 'Query_Cost',
      eval: 'max(0, Query_Size_GB - 1000) * 6.75 # USD/GB # Free 1 TB per month',
      parent: 'TCO',
      units: "${}",
    },
  ],
}

const GCS_TEMPLATE: Template = {
  isNamed: false,
  id: 'gcs_default',
  title: 'Cloud Storage',
  keywords: ['cloud storage', 'gcs', 'gcp', 'storage'],
  authors: ['paola'],
  shortInfo: 'GCS buckets',
  nodes: [
    {
      id: 'TCO',
      eval: '((12 * Initial_Storage_GB + 66 * MoM_Storage_GB) / 12) * 0.02 #USD/GB',
      assumptions: {
        Initial_Storage_GB: 0,
        MoM_Storage_GB: 0,
      },
      units: "${}",
    },
  ],
}

const COMPUTE_ENGINE_TEMPLATE: Template = {
  isNamed: false,
  id: 'ce_default',
  title: 'Compute Engine',
  keywords: ['compute engine', 'ce', 'vm', 'virtual machine', 'instance', 'gcp'],
  authors: ['paola'],
  shortInfo: 'CE instances',
  nodes: [
    {
      id: 'TCO',
      eval: 'Num_of_instances * Run_time_hr_per_month * 0.194236 #USD/hr # Edit cost accdg to machine specs',
      assumptions: {
        Num_of_instances: 0,
        Run_time_hr_per_month: 0,
      },
      units: "${}",
    },
  ],
}

const AI_PLATFORM_TEMPLATE: Template = {
  isNamed: false,
  id: 'ai_platform_default',
  title: 'AI Platform',
  keywords: ['ai platform', 'notebook', 'jupyter', 'ml', 'gcp'],
  authors: ['paola'],
  shortInfo: 'AI Platform notebooks',
  nodes: [
    {
      id: 'TCO',
      eval: 'Num_of_instances * Run_time_hr_per_month * 0.386 #USD/hr # Edit cost accdg to machine specs',
      assumptions: {
        Num_of_instances: 0,
        Run_time_hr_per_month: 0,
      },
      units: "${}",
    },
  ],
}

const APP_ENGINE_TEMPLATE: Template = {
  isNamed: false,
  id: 'app_engine_default',
  title: 'App Engine',
  keywords: ['app engine', 'web', 'gcp'],
  authors: ['paola'],
  shortInfo: 'App Engine',
  nodes: [
    {
      id: 'TCO',
      eval: 'Num_of_instances * Run_time_hr_per_month * 0.141 #USD/hr # Edit cost accdg to machine specs',
      assumptions: {
        Num_of_instances: 0,
        Run_time_hr_per_month: 0,
      },
      units: "${}",
    },
  ],
}

const DATAFUSION_TEMPLATE: Template = {
  isNamed: false,
  id: 'datafusion_default',
  title: 'Cloud Data Fusion',
  keywords: ['cloud datafusion', 'pipeline', 'streaming', 'etl', 'gcp'],
  authors: ['paola'],
  shortInfo: 'Data Fusion',
  nodes: [
    {
      id: 'TCO',
      eval: 'Num_of_instances * Run_time_hr_per_month * 4.2 #USD/hr # Edit cost according to Edition',
      assumptions: {
        Num_of_instances: 0,
        Run_time_hr_per_month: 0,
      },
      units: "${}",
    },
  ],
}

const CLOUDVPN_TEMPLATE: Template = {
  isNamed: false,
  id: 'cloudvpn_default',
  title: 'Cloud VPN',
  keywords: ['cloud vpn', 'networking', 'gcp'],
  authors: ['paola'],
  shortInfo: 'VPN Tunnels',
  nodes: [
    {
      id: 'TCO',
      eval: 'Num_of_tunnels * 0.055 #USD/tunnel # Edit cost according to Edition',
      assumptions: {
        Num_of_tunnels: 0,
      },
      units: "${}",
    },
  ],
}

const DATAPREP_TEMPLATE: Template = {
  isNamed: false,
  id: 'dataprep_default',
  title: 'Cloud Dataprep',
  keywords: ['cloud dataprep', 'trifacta', 'transform', 'etl', 'gcp'],
  authors: ['paola'],
  shortInfo: 'Dataprep',
  nodes: [
    {
      id: 'TCO',
      eval: '(80 * Num_of_users) + (0.6 * vCPU_hrs_per_month) # Edit cost according to Edition and vCPU cost',
      assumptions: {
        Num_of_users: 0,
        vCPU_hrs_per_month: 0,
      },
      units: "${}",
    },
  ],
}

// AWS

const S3_TEMPLATE: Template = {
  isNamed: false,
  id: 's3_default',
  title: 'S3',
  keywords: ['s3', 'storage', 'aws'],
  authors: ['paola'],
  shortInfo: 'S3 buckets',
  nodes: [
    {
      id: 'TCO',
      eval: '0.025 * ((12 * Initial_Storage_GB + 66 * MoM_Storage_GB) / 12)',
      assumptions: {
        Initial_Storage_GB: 0,
        MoM_Storage_GB: 0,
      },
      units: "${}",
    },
  ],
}

const EC2_TEMPLATE: Template = {
  isNamed: false,
  id: 'ec2_default',
  title: 'EC2',
  keywords: ['ec2', 'vm', 'virtual machine', 'instance', 'aws'],
  authors: ['paola'],
  shortInfo: 'EC2 instances',
  nodes: [
    {
      id: 'TCO',
      eval: 'Num_of_instances * Run_time_hr_per_month * 0.20 #USD/hr  # Edit cost accdg to machine specs',
      assumptions: {
        Num_of_instances: 0,
        Run_time_hr_per_month: 0,
      },
      units: "${}",
    },
  ],
}

const SNOWFLAKE_TEMPLATE: Template = {
  isNamed: false,
  id: 'snowflake_default',
  title: 'Snowflake',
  keywords: ['snowflake', 'data warehouse', 'aws'],
  authors: ['paola'],
  shortInfo: 'Snowflake storage and compute costs',
  nodes: [
    {
      id: 'TCO',
      eval: 'Storage_Cost + Compute_Cost',
      assumptions: {
        Initial_Storage_GB: 0,
        MoM_Storage_GB: 0,
        Num_of_warehouse: 0,
        Warehouse_credits_per_hr: 1,
        Query_Run_time_hr_per_month: 0,
      },
      units: "${}",
    },
    {
      id: 'Storage_Cost',
      eval: 'Ave_Monthly_Size_GB * 0.046 #USD/GB  # Edit cost according to Region',
      parent: 'TCO',
      units: "${}",
    },
    {
      id: 'Ave_Monthly_Size_GB',
      eval: 'max(0, 12 * Initial_Storage_GB + 66 * MoM_Storage_GB - 12 * 10) / 12',
      parent: 'Storage_Cost',
      units: "{} GB",
    },
    {
      id: 'Compute_Cost',
      eval: 'Num_of_warehouse * Warehouse_credits_per_hr * Query_Run_time_hr_per_month * 3.70 #USD/credit  # Edit cost accdg to SF Edition',
      parent: 'TCO',
      units: "${}",
    },
  ],
}

// Dashboard  

const TABLEAU_TEMPLATE: Template = {
  isNamed: false,
  id: 'tableau_default',
  title: 'Tableau',
  keywords: ['tableau', 'dashboards', 'analytics'],
  authors: ['paola'],
  shortInfo: 'Tableau licenses',
  nodes: [
    {
      id: 'TCO',
      eval: '(70 * Num_of_Creator_Seats) + (15 * Num_of_Viewer_Seats)',
      assumptions: {
        Num_of_Creator_Seats: 0,
        Num_of_Viewer_Seats: 0,
      },
      units: "${}",
    },
  ],
}

const LOOKER_TEMPLATE: Template = {
  isNamed: false,
  id: 'looker_default',
  title: 'Looker',
  keywords: ['looker', 'microsoft', 'dashboards', 'analytics'],
  authors: ['paola'],
  shortInfo: 'Looker dashboards',
  nodes: [
    {
      id: 'TCO',
      eval: '(60000/12) * (Num_of_dashboard_users / 10) ',
      assumptions: {
        Num_of_dashboard_users: 0,
      },
      units: "${}",
    },
  ],
}

const AZURE_DATABRICKS_TEMPLATE: Template = {
  isNamed: false,
  id: 'databricks_default',
  title: 'Databricks',
  keywords: ['databricks', 'azure', 'etl', 'analytics'],
  authors: ['sofia'],
  shortInfo: 'Azure databricks',
  nodes: [
    {
      id: 'TCO',
      eval: 'Run_time_hr_per_month * Num_of_VMs * 0.729 #USD/hr  # Edit accdg to pay as you go instance total price',
      assumptions: {
        Num_of_VMs: 1,
        Run_time_hr_per_month: 730
      },
      units: "${}",
    }
  ],
}

export default [
  DEFAULT,
  // GCP
  GCP_TEMPLATE,
  BQ_TEMPLATE,
  GCS_TEMPLATE,
  COMPUTE_ENGINE_TEMPLATE,
  AI_PLATFORM_TEMPLATE,
  APP_ENGINE_TEMPLATE,
  CLOUDVPN_TEMPLATE,
  DATAFUSION_TEMPLATE,
  DATAPREP_TEMPLATE,
  // AWS
  S3_TEMPLATE,
  EC2_TEMPLATE,
  SNOWFLAKE_TEMPLATE,
  // Dashboard
  LOOKER_TEMPLATE,
  TABLEAU_TEMPLATE,
  // Azure Databricks
  AZURE_DATABRICKS_TEMPLATE
]
