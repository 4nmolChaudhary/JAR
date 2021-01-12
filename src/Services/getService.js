import axios from 'axios';
import URL from "../Constants/apiUrls";
import {alert} from "../components/alertMessage";
import generalApiGetExceptionlogs from "../ErrorLogs/generalApiGetExceptionlogs";
import getToken from "./getToken";
import enums from "../Constants/enums";
import tokenValid from "../tokenValid";

function getApiCall (url,token){
    return new Promise((resolve,reject)=>{
        var apiUrl = URL.BASE +url
        const request = axios({
            method: 'GET',
            url:apiUrl,
                        timeout:100000,
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
            generalApiGetExceptionlogs(apiUrl,error,'get')
            // alert.errorMessage('Network Error');
            reject('Network Error')
        })
    })
}

export default function get(url){

    return new Promise((resolve,reject)=>{

        var isTokenExpire = tokenValid();
        if(isTokenExpire){
            getToken().then(response=>{
              
                getApiCall(url,response).then(response=>{
                    resolve(response)
                }).catch(error => {
                 
                    reject('Network Error')
                })
            }).catch(error => {
              
                reject('Network Error')
            })
    
        }else{
            getApiCall(url,localStorage.getItem('accessToken')).then(response=>{
                resolve(response)
            }).catch(error => {
               
                reject('Network Error')
            })
        }
      
      
    })
}