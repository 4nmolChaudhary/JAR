import $ from 'jquery'
import tokenValid from "../tokenValid";
import awsLoginAction from "../Actions/awsLoginAction";
import _ from 'lodash';
import enums from "../Constants/enums";
import Cryptr from "cryptr";
import GetAwsAuthCredetial from "../Actions/GetAwsAuthCredetialAction";
import Amplify, { Auth } from 'aws-amplify';
import moment from "moment";
const cryptr = new Cryptr('myTotalySecretKey');
export default function  getToken (){
    return new Promise((resolve, reject) => {
        
        var isTokenExpire = tokenValid();

		var loginRequestData = JSON.parse( localStorage.getItem("LoginRequestData"));
		
		setTimeout(() => {
			if(_.isEmpty(loginRequestData)){
				resolve('');
			}else{
				loginRequestData.password = cryptr.decrypt(loginRequestData.password);
		   
			if(isTokenExpire){
			
				$('#pageLoading').show();
			
				
	
				GetAwsAuthCredetial(enums.domainName).then(authcredetilas => {
				
					Amplify.configure({
						Auth: authcredetilas
					});
					
		
					Auth.signIn(loginRequestData.username,loginRequestData.password)
						.then(user => {
							$('#pageLoading').hide();
							if (user) {
								// localStorage.setItem("AuthResponse",JSON.stringify(user))
								
									if (user.signInUserSession != null) {
										
										localStorage.setItem("accessToken",user.signInUserSession.idToken.jwtToken);
										var currentDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");
										// var expireTokenDate = moment(currentDate).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ');
										var expireTokenDate = moment(currentDate).add(55, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
										// var expireTokenDate = moment(currentDate).add(2, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
										localStorage.setItem('expireAwsTokenDate', expireTokenDate);
									   
										// resolve(user)
										resolve(user.signInUserSession.idToken.jwtToken)
									
									} else {
										reject(user.signInUserSession);
									}
								
							}
						}).catch(err => {
							$('#pageLoading').hide();
							reject(err)
						})
		
				}).catch(error => {
					$('#pageLoading').hide();
					
					reject(error);
				})
		
	
			}else{
			
				resolve(localStorage.getItem('accessToken'))
			}
			}
			
		}, 100);
		
    })
}