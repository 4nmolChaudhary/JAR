const enums ={
    userRoles:[
        {id:1,role:'Manager'},
        {id:2,role:'SuperAdmin'},
        {id:3,role:'Operator'},
        {id:4,role:'Maintenance staff'}
    ],
    userRoles1:[
        {id:1,role:'Manager'},
        {id:2,role:'SuperAdmin'},
    ],
    sites:[
        {id:1,site:'Richmond - CA '},
        {id:2,site:'San Jose'},
    ],
    webApp:[
        {id:1,app:'Asset Care',name:'AssetCare'},
        {id:2,app:'Tow Inspection',name:'Tow Inspections'},
    ],
    assetStatus:[
        {id:3,status:'Active'},
        {id:4,status:'Inactive'},
        {id:5,status:'InMaintenanace'},
        {id:6,status:'Disposed'},
        {id:7,status:'InTransfer'},
    ],
    inspectionStatus:[
        {id:8,status:'Pending'},
        {id:9,status:'Cencelled'},
        {id:10,status:'Approved'},
        {id:11,status:'InMaintenanace'},
        {id:16,status:'Rejected'}
    ],
    workOrderStatus:[
        {id:0,status:'all'},
        {id:12,status:'New'},
        {id:13,status:'InProgress'},
        {id:14,status:'Waiting'},
        {id:15,status:'Completed'}
    ],
    workOrderStatus1:[
        {id:'',status:'Select a Status'},
        {id:12,status:'New'},
        {id:13,status:'InProgress'},
        {id:14,status:'Waiting'},
        {id:15,status:'Completed'}
    ],
    createWorkOrderType:[
        {id:1,status:'Inspection'},
        {id:2,status:'WorkOrder'}
    ],
    approveInspectionFromType:[
        {id:1,status:'Dashboard'},
        {id:2,status:'Inspection'}
    ],
    priority:[
        {id:1,priority:'Very High'},
        {id:2,priority:'High'},
        {id:3,priority:'Medium'},
        {id:4,priority:'Low'},
    ],
    userStatus:[
        {id:1,status:'Active'},
        {id:2,status:'Inactive'},
        {id:0,status:'All'}
    ],
    notificationType:[
        {id:1,status:'AutoApproveInspection '},
        {id:2,status:'PendingNewInspection'},
        {id:6,status:'UpdateWorkOrderStatus '}
    ],
    reportType:[
        {id:1,type:'Yard Report'},
        {id:2,type:'Equipment Type Report'},
        {id:3,type:'Asset Report'},
        {id:4,type:'Latest Hour Reading Report'},
        {id:5,type:'Asset Inspection Report'}
    ],
    reportStatus:[
        {id:17,type:'ReportInProgress'},
        {id:2,type:'complete'},
    ],
    inspectionFormCategory:[
        {id:1,category:'Daily Inspection Items'},
        {id:2,category:'Critical Inspection Items'},
        {id:3,category:''},
        {id:4,category:'Tank Level'},
        {id:5,category:'Tank Containment'}
    ],
    gasolineAttributes:[
        {id:1,value:'E'},
        {id:2,value:'1/4'},
        {id:3,value:'1/3'},
        {id:4,value:'1/2'},
        {id:5,value:'2/3'},
        {id:6,value:'3/4'},
        {id:7,value:'F'}
    ],
    tankLevelAttributes:[
        {id:1,value:'Clean'},
        {id:2,value:'Not Clean'},
    ],
    toastMsgType:[
        {"id":1,type:"Success"},
        {"id":2,type:"error"}
    ],
    Language:[
        {"id":1,language:"English"},
        {"id":2,language:"Spanish"},
    ],
    assetFilterStatus:[
        {id:0,status:'All'},
        {id:1,status:'Active'},
        {id:2,status:'Inactive'}, 
    ],

    resMessages:{
        "uploadAsset":"Assets uploaded successfully",
        "userInValid":"Username or password is invalid",
        "ApproveInspection":"Inspection approved successfully.",
        "UpdateWorkOrder":"Work order updated successfully.",
        "createeWorkOrder":"Work order created successfully.",
        "selectAsset":"Please select atleast one asset",
        "selectUser":"Please select atleast one user",
        "createUser":"User created successfully.",
        "updateUser":"User updated successfully.",
        "updateProfile":"User profile updated successfully.",
        "uploadInspectionForms":"Inspection forms uploaded successfully",
        "pendingInspectionApprove":"Please first verify previous pending inspections",
        "updateMeterHour":"Meter hours successfully updated",
        "emailNotificationSuccess":"Settings updated successfully!",
        "emailNotificationError":"Unable to update the setting, please try again",
        "awsLoginFailResponse":"Something went wrong!",
        "updateDefaultRole":"Default role is updated",
        "updateDefaultSite":"Default site is updated",
        "updateDefaultApp":"Default app is updated",
        "forgotpassmsg":"Please check your email for instructions to reset your password",
        "resetPasswordFail":"Unable to change password, please verify email",
        "resetPasswordSuccess":"Password updated successfully!",
        'notificationClickMsg':'Your active role is not authorised to access this notification.'
    },
    platform:2,//web,
    domainName:'ss'
}
export default enums;