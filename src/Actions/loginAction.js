import login from "../Services/loginService";
import userConstants from "../Constants/userConstants";
import { alert } from "../components/alertMessage";
import enums from '../Constants/enums'
import $ from 'jquery'
import { history } from '../helpers/history';
export default function loginAction(requestData) {
    var tostMsg ={"msg":'','type':''}
    return dispatch => {
       
        localStorage.setItem('authenticated', false);
        dispatch(request(requestData,tostMsg));
        setTimeout(() => {
            login(requestData).then(response => {
              
                if (response.data.success > 0) {

                    localStorage.setItem('authenticated', true);
                    localStorage.setItem('loginData', JSON.stringify(response.data.data));
                    localStorage.setItem('emailNotificationPendingReviews', response.data.data.email_notification_status);
                  
                    var loginRes = response.data.data;
                   

                    var defaultRoleData = loginRes.userroles.filter(x=>x.role_name == loginRes.default_rolename_web_name)
                  
                    
                    localStorage.setItem('roleId', loginRes.default_rolename_web);
                    localStorage.setItem('roleName', loginRes.default_rolename_web_name);
                    localStorage.setItem('defaultroleId', loginRes.default_rolename_web);
                    localStorage.setItem('defaultroleName', loginRes.default_rolename_web_name);

                    localStorage.setItem('siteId', loginRes.default_site_id);
                    localStorage.setItem('siteName', loginRes.default_site_name);
                    localStorage.setItem('defaultSiteId',  loginRes.default_site_id);
                    localStorage.setItem('defaultSiteName',loginRes.default_site_name);

                    localStorage.setItem('selectedDefaultApp', loginRes.default_app_name);
                    $('#pageLoading').show();
                    if (loginRes.default_rolename_web_name == enums.userRoles[0].role) {//manager
                       
                        if(defaultRoleData.length>0){
                            // window.location.replace("/dashboard");
                            history.push("/dashboard")
                        }  

                    } else if (loginRes.default_rolename_web_name == enums.userRoles[1].role) {//superAdmin
                        if(defaultRoleData.length>0){
                            // window.location.replace("/assets");
                            history.push("/assets")
                        }  
                       
                    } else {

                        tostMsg.msg=enums.resMessages.userInValid
                        tostMsg.type = enums.toastMsgType[1].id

                        // alert.errorMessage(enums.resMessages.userInValid);
                    }
                    
                } else {
                    localStorage.setItem('authenticated', false);

                    tostMsg.msg=response.data.message
                    tostMsg.type = enums.toastMsgType[1].id

                    // alert.errorMessage(response.data.message);
                }
                dispatch(success(response,tostMsg));
            }).catch(error => {
               
                $('#pageLoading').hide();
                localStorage.setItem('authenticated', false);
                dispatch(failure(error,tostMsg));
            })
        }, 1000);

    }
    function request(loginData,tostMsg) { return { type: userConstants.LOGIN_REQUEST, loginData,tostMsg } }
    function success(loginData,tostMsg) { return { type: userConstants.LOGIN_SUCCESS, loginData ,tostMsg} }
    function failure(error,tostMsg) { return { type: userConstants.LOGIN_FAILURE, error ,tostMsg} }
}