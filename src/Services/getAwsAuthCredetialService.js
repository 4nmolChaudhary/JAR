
import URL from "../Constants/apiUrls";
import axios from 'axios';
import enums from "../Constants/enums";
export default function getAwsAuthCredetial(companyCode){
    return new Promise((resolve,reject)=>{

        var url = URL.getAwsAuthCredetials+"?company_code="+companyCode
        var apiUrl = URL.BASE +url
        
        const request = axios({
            method: 'GET',
            url:apiUrl,
                        timeout:100000,
            headers: {
                "Content-Type": "application/json",
                "Site_id":localStorage.getItem('siteId') ,
                "Role_id":localStorage.getItem('roleId'),
                "Token":'',
                "Domain_Name":enums.domainName
            }
        });
        request
        .then(response => {
            resolve(response)
        })
        .catch(error => {
           
            reject('Network Error')
        })
    })
}