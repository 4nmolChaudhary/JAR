import put from "./putService";
import URL from "../Constants/apiUrls";

export default function UpdateDefaultRoleService(requestData){
    return new Promise((resolve,reject)=>{
        put(URL.updateDefaultRole,requestData).then(response=>{
            resolve(response);
        }).catch(error=>{
        
            reject(error);
        })
    })
}