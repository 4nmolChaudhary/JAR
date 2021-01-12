import get from "../getService";
import URL from "../../Constants/apiUrls";
import inspectionDetails from "../../ResponceModel/inspectionDetailResponse";

export default function inspectionDetail(inspectionId,userId){
    return new Promise((resolve,reject)=>{
        var url = URL.getInspectionDetails+inspectionId+"/"+userId
        get(url).then(response=>{
            resolve(response);
        }).catch(error=>{
            reject(error);
        })
    })
}