import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import _ from 'lodash';
import $ from 'jquery'
import enums from "../Constants/enums";
import URL from "../Constants/apiUrls";
import SnackbarAlert from "../Snackbar/SnackbarAlert";
import awsLoginAction from "../Actions/awsLoginAction";
import Amplify, { Auth } from 'aws-amplify';
import Cryptr from "cryptr";
const cryptr = new Cryptr('myTotalySecretKey');

var self;
Amplify.configure({
    Auth: {
        // ss-sensaii-cognito-dev-oregon
		identityPoolId: 'us-west-2:abc5d517-dc69-4eb8-a987-b7782a1ae827',
		region: 'us-west-2',
		userPoolId: 'us-west-2_M62HIBlMk',
		userPoolWebClientId: '23ftgt41k89qq43jj9q61tun8b'
    }
});

const styles = theme => ({
	root: {
		background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
		border: 0,
		borderRadius: 3,
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
		color: 'red',
		height: 48,
		padding: '0 30px',
	},
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white,
		},
	},
	paper: {
		
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
		backgroundColor: "#0000"
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});


class Generallogin extends React.Component {
	constructor() {

		super();
		self = this;
		this.state = {
			userName: '',
			password: '',
			submited: false,
			loginUser: '',
			isLoading: false,
			formError: {},
			errorMessage: {},
			tostMsg:{}
		}
		this.handleChange = this.handleChange.bind(this);
	}
	 componentDidMount(){
		localStorage.clear();
		sessionStorage.clear();
		// try {
		// 	const user = await Auth.signUp({
		// 		username:"bhavinijoshi96@gmail.com",
		// 		password:"bhavini@123",
		// 		attributes: {
		// 			email:"bhavinijoshi96@gmail.com",          // optional
		// 			phone_number:"+919712371424",   // optional - E.164 number convention
		// 			// other custom attributes 
		// 		}
		// 	});
		// 	console.log({ user });
		// } catch (error) {
		// 	console.log('error signing up:', error);
		// }

		// Auth.confirmSignUp("bhavinijoshi96@gmail.com", '171615')
		// .then(() => {
		// 	console.log('success');
		// })
		// .catch(err => {
		//  console.log("err-------",err)
		// });
		// try {
		// 	const user = await Auth.signIn("bhavinijoshi96@gmail.com","bhavini@123");
		// 			console.log("user - ",user);
		// } catch (error) {
		// 	console.log('error signing in', error);
		// }
	}
	handleChange(e) {
		const { name, value } = e.target;
		const { formError, errorMessage } = this.state;
		this.setState({ [name]: value });

		if (value != '' || value != null) {
			delete formError[name]
		}
		this.setState({ formError, errorMessage });
	}

	loginBtnClick = (e) => {
		e.preventDefault();
		
		this.setState({ submited: true,tostMsg:{} })
		const { userName, password } = this.state;

		var formvalid = this.formValidation(userName, password);

		if (formvalid) {
			
			$('#pageLoading').show();
			var requestData = {
				"username": this.state.userName.trim(),
				// "password":this.state.password,
				"password":null,
				// "password":cryptr.decrypt(response.password),
				"notification_token": localStorage.getItem("fcmToken"),
				"os":"web",
			}
			awsLoginAction(this.state.userName.trim(),this.state.password,enums.domainName,requestData).then(awsLoginResponse=>{
				// $('#pageLoading').hide();
			
				var loginRequestData = {
					"username":this.state.userName.trim(),
					"password": this.state.password,
				}
				loginRequestData.password = cryptr.encrypt(loginRequestData.password);
				localStorage.setItem("LoginRequestData",JSON.stringify(loginRequestData));

				if(awsLoginResponse){
					$('#pageLoading').hide();

						if(awsLoginResponse.default_app_name==enums.webApp[1].app){
						   window.location.replace(URL.appUrlTI+localStorage.getItem('accessToken')+"/"+cryptr.encrypt(loginRequestData.username) +"/"+loginRequestData.password);
						}

						if(awsLoginResponse.default_app_name==enums.webApp[0].app){
							 window.location.replace(URL.appUrlAc+localStorage.getItem('accessToken')+"/"+cryptr.encrypt(loginRequestData.username) +"/"+loginRequestData.password);
						}

				
				}
			

			}).catch(err => {
				$('#pageLoading').hide();
		
				if(err){
					this.setState({tostMsg:err.tostMsg});
				}
			})
		
		}else {
		
		}
	}

	formValidation(userName, password) {
		const { formError, errorMessage } = this.state;
		var userNameValid = userName.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

		if (userName == '' || userName == null) {
			formError['userName'] = true;
			errorMessage['userName'] = 'Username is required';

		} 
		else {
			delete formError['userName'];
			delete errorMessage['userName'];
		}
		

		if (password == '' || password == null) {
			formError['password'] = true;
			errorMessage['password'] = 'Password is required';

		}
		else {
			delete formError['password'];
			delete errorMessage['password'];
		}

		if (!_.isEmpty(formError)) {
			this.setState({ formError, errorMessage });
			console.log(this.state.formError, this.state.errorMessage);
			return false;
		}
		else {
			return true;
		}

	}

	render() {
		console.log("this.props--------",this.props)
		const { classes } = this.props;
		let tostMsg = _.get(this,['props','stateObj','tostMsg'],{})
		const { userName, password, submited, formError, errorMessage } = this.state;
		console.log(tostMsg);
		return (
			<div>
			<Container id='root1' component="main" maxWidth="xs" className="screen_c">
				<CssBaseline />
				<div className={classes.paper}>
				{/* <div className="loginwelcome">Welcome</div> */}
					{/* <div className="loginwelcome"> AssetCare</div> */}
					<img alt="Sensaii" src="/proassets/images/project-jarvis.png" style={{ "width":"160px", "height":"160px"}} className="MuiAvatar-img"/>
					<Typography component="h1" variant="h5" className="text_c">
					AssetCare
      				  </Typography>
					<form className={classes.form} onSubmit={this.loginBtnClick} >
						<TextField
							error={formError.userName}
							variant="outlined"
							margin="normal"
							// required
							fullWidth
							defaultValue={this.state.userName}
							id="userName"
							label="Email Address"
							name="userName"
							autoFocus
							onChange={this.handleChange}
							helperText={errorMessage.userName}
						/>
						<TextField
							error={formError.password}
							variant="outlined"
							margin="normal"
							// required
							fullWidth
							defaultValue={this.state.password}
							name="password"
							label="Password"
							type="password"
							id="password"
							onChange={this.handleChange}
							helperText={errorMessage.password}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}

						>
							Sign In
        				  </Button>
									<div className="for_psw" style={{"textAlign":"right"}}><a href="/forgotpassword">Forgot password?</a></div>
						{this.state.isLoading ? <CircularProgress /> : ''}
					</form>
				</div>
				
					
			</Container>
			{_.isEmpty(this.state.tostMsg)?'':<SnackbarAlert tostMsg={this.state.tostMsg}/>}
			</div>
		);
	}
}
function mapState(state) {
	return state
}

const actionCreators = {
	// login: loginAction
};

Generallogin.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(Generallogin))