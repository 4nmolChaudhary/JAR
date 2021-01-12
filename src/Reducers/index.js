import { combineReducers } from 'redux';
import loginReducer from "./loginReducer";
import assetListReducer from "./Asset/assetListReducer";
import inspectionListReducer from "./Inspection/inspectiontListReducer";
import inspectionDetailReducer from "./Inspection/inspectionDetailReducer";
import approveInspectionReducer from "./Inspection/approveInspectionReducer";
import dashboardListReducer from "./Dashboard/dashboardReducer";
import uploadAssetReducer from "./Asset/uploadAssetReducer";
import workOrderListReducer from "./WorkOrder/workOrderListReducer";
import workOrderDetailReducer from "./WorkOrder/workOrderDetailReducer";
import workOrderCreateReducer from "./WorkOrder/workOrderCreateReducer";
import workOrderUpdateReducer from "./WorkOrder/workOrderUpdateReducer";
import generateBarcodeReducer from "./Asset/generateBarcodeReducer";
import assetDetailReducer from "./Asset/assetDetailReducer";
import ValidateAssetIdReducer from "./Asset/validateAssetIdReducer";
import assetInspectionListReducer from './Asset/assetInspectionListReducer';
import assetWorkOrderListReducer from './Asset/assetWorkOrderListReducer';
import userReducer from "./User/userReducer";
import getAllCompanyReducer from "./User/getAllCompanyReducer";
import getUserRolesReducer from "./User/getUserRolesReducer";
import userDetailReducer from "./User/userDetailReducer";
import notificationListReducer from "./notificationListReducer";
import generateBarcodeUserReducer from "./User/generateBarcodeUserReducer";
import profileReducer from "./profileReducer";
import reportsReducer from "./Reports/reportReducer";
import dashboardOutstandingIssueListReducer from "./Dashboard/dashboardOutstandingIssueReducer";
import logoutReducer from "./logoutReducer";

const rootReducer = combineReducers({
  loginReducer,
  assetListReducer,
  inspectionListReducer,
  // inspectionDetailReducer,
  // approveInspectionReducer,
  dashboardListReducer,
  uploadAssetReducer,
  workOrderListReducer,
  workOrderDetailReducer,
  workOrderCreateReducer,
  workOrderUpdateReducer,
  generateBarcodeReducer,
  assetDetailReducer,
  ValidateAssetIdReducer,
  assetInspectionListReducer,
  assetWorkOrderListReducer,
  userReducer,
  getAllCompanyReducer,
  getUserRolesReducer,
  userDetailReducer,
  notificationListReducer,
  generateBarcodeUserReducer,
  profileReducer,
  reportsReducer,
  // dashboardOutstandingIssueListReducer,
  logoutReducer
});

export default rootReducer;