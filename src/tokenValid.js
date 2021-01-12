import moment from "moment";

export default function  isTokenValid (){
    var expireTokenDate = localStorage.getItem('expireAwsTokenDate');
    var currentDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");
   
    if(currentDate>expireTokenDate){

        return true

    }else{

        return false
    }
}