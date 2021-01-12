import * as Sentry from '@sentry/browser';

export default function generalApiGetExceptionlogs(apiUrl, error ,functionName){
    var loginData = localStorage.getItem('loginData');
    var user ='';
    if(loginData){
        loginData= JSON.parse(loginData)
        user =loginData.email
    }
    Sentry.setExtra('Info', 'Exception occur while calling api')			
    Sentry.setExtra('Api Url', apiUrl)
    // Sentry.setExtra('Function Name', functionName)
    Sentry.setExtra('Error', error)	
    Sentry.setExtra('User', user)		
    Sentry.captureException("Api Calling Exception");		
  
}