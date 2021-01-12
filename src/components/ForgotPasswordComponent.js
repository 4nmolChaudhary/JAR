

import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import loginAction from '../Actions/loginAction';
import { connect } from "react-redux";
import _ from 'lodash';
import $ from 'jquery'
import enums from "../Constants/enums";
import SnackbarAlert from "../Snackbar/SnackbarAlert";
import  GetAwsAuthCredetial  from "../Actions/GetAwsAuthCredetialAction";
import Amplify, { Auth } from 'aws-amplify';
var self;

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

class ForgotPassword extends React.Component {
	constructor() {
		super();
		self = this;
		this.state = {
			emailAddress:'',
			submited: false,
			isLoading: false,
			formError: {},
			errorMessage: {},
			tostMsg:{}

		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		const { name, value } = e.target;
		const { formError, errorMessage } = this.state;
		this.setState({ [name]: value });

		if (value != '' || value != null) {
			delete formError[name]
			delete errorMessage[name]
		}
		this.setState({ formError, errorMessage });
	}

	okBtnClick = (e) => {
		e.preventDefault();
		
		this.setState({ submited: true,tostMsg:{} })
	
		var formvalid = this.formValidation(this.state.emailAddress.trim());

		if (formvalid) {
			// var requestData = {
			// 	"email": this.state.emailAddress,
			// }
			// console.log(requestData);

			$('#pageLoading').show();
			GetAwsAuthCredetial(enums.domainName).then(authcredetilas => {
				console.log("get aws authcredentials response ===============",authcredetilas);
				Amplify.configure({
					Auth: authcredetilas
				});
				Auth.forgotPassword(this.state.emailAddress.trim())
			.then(data => {
				$('#pageLoading').hide();
				console.log("Data ---------------",data);
				var tostMsg={
					msg:enums.resMessages.forgotpassmsg,
                    type:enums.toastMsgType[0].id
				}
				this.setState({tostMsg:tostMsg})
		
			})
			.catch(err => {
				$('#pageLoading').hide();
				console.log("error-----------",err);
				var tostMsg={
					msg:err.message,
                    type:enums.toastMsgType[1].id
				}
				this.setState({tostMsg:tostMsg})
			//   notification.error({
			// 	message: 'User confirmation failed',
			// 	description: err.message,
			// 	placement: 'topRight',
			// 	duration: 1.5
			//   });
			})
			}).catch(error=>{

			})
			
		} else {
			console.log("user name and password required");
		}

	}

	formValidation(emailAddress) {
		const { formError, errorMessage } = this.state;
		var emailAddressValid = emailAddress.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
	
		
		if (emailAddress == '' || emailAddress == null) {
			formError['emailAddress'] = true;
			errorMessage['emailAddress'] = 'Please enter a email address';

		}else if(!emailAddressValid){
			formError['emailAddress'] = true;
			errorMessage['emailAddress'] = 'Please enter a valid email address';
		}else{
			delete formError['emailAddress'];
			delete errorMessage['emailAddress'];
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
		const {  submited, formError, errorMessage } = this.state;
		
		return (
			<div>
			<Container id='root1' component="main" maxWidth="xs" className="screen_c">
				<CssBaseline />
				<div className={classes.paper}>
					<div className="forgot-title">Forgot Password</div>
					<img alt="Sensaii" src="/proassets/images/project-jarvis.png" style={{ "width":"140px", "height":"140px"}} className="MuiAvatar-img"/>
					<form className={classes.form} onSubmit={this.okBtnClick} >
					<TextField
							error={formError.emailAddress}
							variant="outlined"
							margin="normal"
							fullWidth
							defaultValue={this.state.emailAddress}
							id="emailAddress"
							label="Email Address"
							name="emailAddress"
							// autoFocus
							onChange={this.handleChange}
							helperText={errorMessage.emailAddress}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Reset Password
        				  </Button>
						 
						{this.state.isLoading ? <CircularProgress /> : ''}
					</form>
				</div>
				
					
			</Container>
			{!_.isEmpty(this.state.tostMsg)?<SnackbarAlert tostMsg={this.state.tostMsg}/>:''}
		</div>
		);
	}
}

function mapState(state) {
	var stateObj = state.loginReducer
	if (state.loginReducer.isAuthenticated) {
		const { loginUser } = state.loginReducer.loginData;
		const { isLoading } = state.loginReducer.loading;
		if (self) { 
			self.setState({ isLoading: isLoading,	tostMsg: stateObj.tostMsg})
		 }
		return { loginUser, isLoading ,stateObj};
	} else {
		const { loginUser } = {};
		const { isLoading } = false;
		if (self) { self.setState({ isLoading: isLoading,tostMsg: stateObj.tostMsg }) }
		return { loginUser, isLoading,stateObj };
	}
}

const actionCreators = {
	login: loginAction
};

ForgotPassword.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(ForgotPassword))
