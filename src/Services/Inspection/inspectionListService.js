import get from "../getService";
import URL from "../../Constants/apiUrls";
import inspectionListData from "../../ResponceModel/inspectionListResponse";
export default function inspectionList(urlParameters){
    return new Promise((resolve,reject)=>{
        get(URL.getInspections+urlParameters).then(response=>{
            resolve(response);
        }).catch(error=>{
            reject(error);
        })
    })
}