import axios from 'axios';
import URL from "../Constants/apiUrls";
import { alert } from "../components/alertMessage";
import generalApiPostExceptionlogs from "../ErrorLogs/generalApiPostExceptionlogs"
import getToken from "./getToken";
import enums from "../Constants/enums";
export default function put(url, requestData, responseType = 'json') {
	return new Promise((resolve, reject) => {
		getToken().then(response => {
		
			
				var apiUrl = URL.BASE + url
				const request = axios({
					method: 'PUT',
					url: apiUrl,
					data: requestData,
					responseType: responseType,
					// timeout:1000000,
					headers: {
						"Content-Type": "application/json",
						"Site_id": localStorage.getItem('siteId'),
						"Role_id": localStorage.getItem('roleId'),
						"Token": response,
						"Domain_Name": enums.domainName
					}
				});
				request
					.then(response => {
						resolve(response)
					})
					.catch(error => {
						generalApiPostExceptionlogs(apiUrl, error, 'put', requestData);
						// alert.errorMessage('Network Error');
						reject('Network Error')
					})
			
		}).catch(error => {
			
			reject('Network Error')
		})

	})
}