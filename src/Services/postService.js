import axios from 'axios';
import URL from "../Constants/apiUrls";
import { alert } from "../components/alertMessage";
import generalApiPostExceptionlogs  from "../ErrorLogs/generalApiPostExceptionlogs"
import getToken from "./getToken";
import enums from "../Constants/enums";
import tokenValid from "../tokenValid";

function postApiCall (url, requestData,responseType = 'json',token){
    return new Promise((resolve,reject)=>{
		var apiUrl = URL.BASE + url
		const request = axios({
		method: 'POST',
		url:apiUrl ,
		data: requestData,
		responseType:responseType,
		// timeout:1000000,
		headers: {
			"Content-Type": "application/json",
			"Site_id":localStorage.getItem('siteId') ,
			"Role_id":localStorage.getItem('roleId'),
			"Token":token,
			"Domain_Name":enums.domainName
		}
	});
	request
		.then(response => {
			resolve(response)
		})
		.catch(error => {
			generalApiPostExceptionlogs(apiUrl,error,'post',requestData);
			// alert.errorMessage('Network Error');
			reject('Network Error')
		})
    })
}

export default function post(url, requestData,responseType = 'json') {
	return new Promise((resolve, reject) => {
		var isTokenExpire = tokenValid();
        if(isTokenExpire){
            getToken().then(response=>{
            
                postApiCall(url, requestData,responseType = 'json',response).then(response=>{
                    resolve(response)
                }).catch(error => {
                   
                    reject('Network Error')
                })
            }).catch(error => {
              
                reject('Network Error')
            })
    
        }else{
            postApiCall(url, requestData,responseType = 'json',localStorage.getItem('accessToken')).then(response=>{
                resolve(response)
            }).catch(error => {
               
                reject('Network Error')
            })
        }
      

	})
}