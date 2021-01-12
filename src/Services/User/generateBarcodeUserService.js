import post from "../postService";
import URL from "../../Constants/apiUrls";

export default function generateBarcodeUser(requestData){
    return new Promise((resolve,reject)=>{
        post(URL.generateBarcodeUser,requestData,'blob').then(response=>{
            resolve(response);
        }).catch(error=>{
            reject(error);
        })
    })
}