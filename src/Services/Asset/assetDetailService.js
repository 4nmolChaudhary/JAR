import post from "../postService";
import URL from "../../Constants/apiUrls";

export default function assetDetail(requestData){
    return new Promise((resolve,reject)=>{
        post(URL.getAssetDetails+"/20/1",requestData).then(response=>{
            resolve(response);
        }).catch(error=>{
            reject(error);
        })
    })
}