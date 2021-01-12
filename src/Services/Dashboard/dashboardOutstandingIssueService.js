import get from "../getService";
import URL from "../../Constants/apiUrls";

export default function dashboardOutstandingIssueList(userId){
    return new Promise((resolve,reject)=>{
        
        var url =URL.outstandingIssueList+userId

        get(url).then(response=>{
            resolve(response);
        }).catch(error=>{
            reject(error);
        })
    })
}