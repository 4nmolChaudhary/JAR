const URL = {
  // BASE:'http://192.168.1.45/Jarvis/api/',//local
  BASE: 'https://app.dev.sensaii.com/api/', //Dev
  //  BASE:'https://app.qa.sensaii.com/api/',//QA
  // BASE:'https://app.sensaii.com/api/',//Production

  login: 'User/Login',
  getDashboard: 'Inspection/PendingInspectionCheckoutAssetsByManager/',
  getAssets: 'Asset/GetAllAssets',
  getAssetDetails: 'Asset/GetAssetsById',
  uploadAsset: 'Asset/AddAssets',
  getInspections: 'Inspection/GetAllInspections/',
  getInspectionDetails: 'Inspection/GetInspectionById/',
  approveInspection: 'Inspection/ApproveInspection',
  getWorkOrder: 'WorkOrder/GetAllWorkOrders',
  getWorkOrderDetail: 'WorkOrder/GetWorkOrderDetailsById/',
  createWorkOrder: 'WorkOrder/CreateWorkOrder',
  updateWorkOrder: 'WorkOrder/UpdateWorkOrderByManager',
  getAllCompany: 'Company/GetAllCompany',
  generateBarcode: 'Asset/GenerateAssetBarcode',
  validateAssetId: 'Asset/ValidateInternalAssetID/',
  getAssetBySearch: 'Asset/SearchAssets/',
  getInspectionBySearch: 'Inspection/SearchInspection/',
  getWorkOrderBySearch: 'WorkOrder/SearchWorkOrders/',
  searchInspectionByAssetId: 'Inspection/SearchInspectionByAsset/',
  searchWorkOrderByAssetId: 'WorkOrder/SearchWorkOrderByAssetId/',
  getInspectionListByAssetId: 'Inspection/GetInspectionByAssetId/',
  getWorkorderListByAssetId: 'WorkOrder/GetWorkOrderByAssetId/',
  getAllUser: 'User/GetUsers',
  getUserDetailById: 'User/GetUserById/',
  getUserRole: 'User/GetRoles/',
  addUpdateUser: 'User/AddUpdateUser',
  updateUserStatus: 'User/UpdateUserStatus',
  getUserById: 'User/GetUserById/',
  searchInUserList: 'User/SearchUser/',
  logout: 'User/Logout/',
  getNotificationList: 'User/GetNotifications/',
  generateBarcodeUser: 'User/GenerateUserBarcode',
  uploadInspectionForms: 'Inspection/UploadbulkInspection',
  generateReportMonthy: 'Asset/GetAssetInspectionReportMonthly/',
  generateReportWeekly: 'Asset/GetAssetInspectionReportWeekly/',
  generateReportWeekly1: 'Asset/GetAssetReportWeekly/',
  outstandingIssueList: 'Asset/DashboardOutstandingIssues/',
  latestHourReadingReport: 'Asset/GetLatestMeterHoursReport/',
  updateMeterHour: 'asset/UpdateMeterHours',
  updateEmailNotification: 'User/TriggerEmailNotificationStatus/',
  getAwsAuthCredetials: 'company/GetUserPoolDetails',
  updateDefaultRole: 'user/DefaultRole',
  updateDefaultSite: 'user/DefaultSite',
  historyOFInspectionAssetReport: 'Asset/GetAssetInspectionReport',
  GenerateInspectionOfAssetReport: 'Asset/GenerateAssetInspectionReport',
  CheckStatusOFInspectionAssetReport: 'Asset/ReportStatus',
  GetAllAssetIDList: 'Asset/AllAssets/',
  updateAssetStatus: 'Asset/UpdateAssetStatus',
  sampleXslxlocal: 'https://asset-excel-reference-data.s3-us-west-2.amazonaws.com/Sample_Asset_Excel_Local.xlsx',
  sampleXslxDev: 'https://asset-excel-reference-data.s3-us-west-2.amazonaws.com/Sample_Asset_Excel_Dev.xlsx',
  sampleXslxProd: 'https://asset-excel-reference-data.s3-us-west-2.amazonaws.com/Sample_Asset_Excel_Prod.xlsx',

  //appUrlAc:'https://ss.dev.sensaii.com/home/', //Dev
  appUrlAc: 'http://localhost:3005/home/', //local

  //appUrlTI:'https://ss.dev.sensaii.com/towinspection/home/', //dev
  appUrlTI: 'http://localhost:3006/home/', //local

  generalLogin: 'http://localhost:3005/login', //local
  //generalLogin:'https://ss.dev.sensaii.com/login' //dev
}
export default URL
