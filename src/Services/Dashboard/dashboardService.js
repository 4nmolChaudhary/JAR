import get from "../getService";
import URL from "../../Constants/apiUrls";
import dashboardListData from "../../ResponceModel/dashboardResponse";

export default function dashboardList(userId){
    return new Promise((resolve,reject)=>{
        
        var url =URL.getDashboard+userId

        get(url).then(response=>{
            resolve(response);
        }).catch(error=>{
            reject(error);
        })
        // resolve(dashboardListData);
    })
}