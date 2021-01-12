import assetList from "../../Services/Asset/assetListService";
import userConstants from "../../Constants/userConstants";
import {alert} from "../../components/alertMessage";
import $ from 'jquery'
import _ from 'lodash';
import enums from "../../Constants/enums";
export default function assetListAction(urlParameters,pageIndex) {
    var tostMsg ={"msg":'','type':''}
    return dispatch => {
        dispatch(request({},tostMsg));
        assetList(urlParameters).then(response => {
            $('#pageLoading').hide();
            if(response.data.success>0){
                if(!_.isEmpty(response.data.data)){
                    response.data.data.list.map((value,key)=>{
                       enums.assetStatus.map((value1,key1)=>{
                            if(value.status == value1.id){
                                value.statusName = value1.status
                            }
                       })
                    })
                }
                dispatch(success(response.data.data,tostMsg));
            }else{
                // alert.errorMessage(response.data.message);
                
                dispatch(failure(response,tostMsg));
            }

        }).catch(error => {
            $('#pageLoading').hide();
            tostMsg.msg=error
            tostMsg.type = enums.toastMsgType[1].id
            dispatch(failure(error,tostMsg));
        })
    }
    function request(assetList,tostMsg) { return { type: userConstants.ASSETLIST_REQUEST,assetList,tostMsg} }
    function success(assetList,tostMsg) { return { type: userConstants.ASSETLIST_SUCCESS,pageIndex, assetList,tostMsg } }
    function failure(error,tostMsg) { return { type: userConstants.ASSETLIST_FAILURE, error ,tostMsg} }
}