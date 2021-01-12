import get from "../getService";
import URL from "../../Constants/apiUrls";

export default function getUserRoles(urlPrameters){
    return new Promise((resolve,reject)=>{
        var url =URL.getUserRole+urlPrameters
        get(url).then(response=>{
            resolve(response);
        }).catch(error=>{
            reject(error);
        })
    })
}