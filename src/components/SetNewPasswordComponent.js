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
import loginAction from '../Actions/loginAction';
import { connect } from "react-redux";
import _ from 'lodash';
import $ from 'jquery'
import enums from "../Constants/enums";
import SnackbarAlert from "../Snackbar/SnackbarAlert";
// import { Auth } from 'aws-amplify';
import { history } from "../helpers/history";
// import resetPasswordAction from "../Actions/resetPasswordAction";
// import resetPasswordTIAction from "../Actions/resetPasswordTIAction";
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

Amplify.configure({
    Auth: {
        // ss-sensaii-cognito-dev-oregon
		identityPoolId: 'us-west-2:abc5d517-dc69-4eb8-a987-b7782a1ae827',
		region: 'us-west-2',
		userPoolId: 'us-west-2_M62HIBlMk',
		userPoolWebClientId: '23ftgt41k89qq43jj9q61tun8b'
    }
});
class SetNewPasswordComponent extends React.Component {
	constructor() {
		super();
		self = this;
		this.state = {
			username: '',
			password: '',
			repassword: '',
			submited: false,
			isLoading: false,
			formError: {},
			errorMessage: {},
			tostMsg: {}

		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		console.log(this.props);

		// let params = useRouteMatch('/setnewpassword/:code');
		console.log(this.props.match.params.code);
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

	confirmBtnClick = (e) => {
		e.preventDefault();

		this.setState({ submited: true, tostMsg: {} })

		var formvalid = this.formValidation(this.state.username.trim(), this.state.password, this.state.repassword);
		var verificationCode = this.props.match.params.code

		if (formvalid) {
			$('#pageLoading').show();

			Auth.forgotPasswordSubmit(this.state.username.trim(), verificationCode.trim(), this.state.password)
				.then((data) => {

					console.log("data------------", data);
					$('#pageLoading').hide();
					var tostMsg = {
						msg: enums.resMessages.resetPasswordSuccess,
						type: enums.toastMsgType[0].id
					}
					this.setState({ tostMsg: tostMsg })
					setTimeout(() => {
						history.push('/login');
					}, 2000);
				
					// var requestData ={
					// 	"email_id":this.state.username.trim(),
					// 	"password":this.state.password
					// }
					// resetPasswordAction(requestData).then(response => {
					// 	console.log("response -------------",response);
						
					// 	resetPasswordTIAction({
					// 		"email":this.state.username.trim(),
					// 		"new_password":this.state.password
					// 	}).then(response => {
					// 		console.log("response -------------",response);
							
					// 		$('#pageLoading').hide();
	
					// 		history.push('/login');
					// 	}).catch(error => {
					// 		$('#pageLoading').hide();
					// 		console.log("error -------", error);
					// 		history.push('/login');
					// 	})
	
					// }).catch(error => {
					// 	$('#pageLoading').hide();
					// 	console.log("error-------", error);
					// 	this.setState({ tostMsg: error.tostMsg })
					// })

				}).catch(err => {
					$('#pageLoading').hide();
					console.log("errr-------", err);
					var tostMsg = {
						msg: enums.resMessages.resetPasswordFail,
						type: enums.toastMsgType[1].id
					}
					if(err.code == "InvalidPasswordException"){
						tostMsg.msg = enums.resMessages.resetPasswordFail +" ,"+err.message
					}
					this.setState({
						 tostMsg: tostMsg,
					 })
					 setTimeout(() => {
						this.setState({username: '',
						password: '',
						repassword: '',
						formError: {},
						errorMessage: {},
						})
					 }, 100);
				})

		} else {
			console.log("Email Address and password required");
		}

	}

	formValidation(username, password, repassword) {
		console.log("form validation ------------", password, repassword)
		const { formError, errorMessage } = this.state;

		if (username == '' || username == null) {
			formError['username'] = true;
			errorMessage['username'] = 'Please enter Email Address';

		}
		else {
			delete formError['username'];
			delete errorMessage['username'];
		}

		if (password == '' || password == null) {
			formError['password'] = true;
			errorMessage['password'] = 'Please enter New Password';

		}
		else {
			delete formError['password'];
			delete errorMessage['password'];
		}

		if (repassword == '' || repassword == null) {
			formError['repassword'] = true;
			errorMessage['repassword'] = 'Please re-enter New Password';

		}
		else {
			delete formError['repassword'];
			delete errorMessage['repassword'];
		}

		if ((password != '' && password != null) && (repassword != '' && repassword != null)) {
			if (password == repassword) {
				delete formError['repassword'];
				delete errorMessage['repassword'];
				delete formError['password'];
				delete errorMessage['password'];
			} else {
				formError['repassword'] = true;
				errorMessage['repassword'] = 'The new passoword and re-enter new password do not match';
			}
		} else {

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
		console.log("this.props--------", this.props)
		const { classes } = this.props;
		let tostMsg = _.get(this, ['props', 'stateObj', 'tostMsg'], {})
		const { userName, password, submited, formError, errorMessage } = this.state;
		console.log(tostMsg);
		return (
			<div>
				<Container id='root1' component="main" maxWidth="xs" className="screen_c">
					<CssBaseline />
					<div className={classes.paper}>
						<div className="forgot-title">Please enter your registered email address</div>
						<img alt="Sensaii" src="/proassets/images/project-jarvis.png" style={{ "width": "140px", "height": "140px" }} className="MuiAvatar-img" />
						{/* <Typography component="h1" variant="h5" className="text_c">
						Sign in
      				  </Typography> */}
						<form className={classes.form} onSubmit={this.confirmBtnClick} >

							<TextField
								error={formError.username}
								variant="outlined"
								margin="normal"
								// required
								fullWidth
								value={this.state.username}
								name="username"
								label="Email Address"
								id="username"
								onChange={this.handleChange}
								helperText={errorMessage.username}
							/>
							<TextField
								error={formError.password}
								variant="outlined"
								margin="normal"
								// required
								fullWidth
								value={this.state.password}
								name="password"
								label="Enter New Password"
								type="password"
								id="password"
								onChange={this.handleChange}
								helperText={errorMessage.password}
							/>
							<TextField
								error={formError.repassword}
								variant="outlined"
								margin="normal"
								// required
								fullWidth
								value={this.state.repassword}
								name="repassword"
								label="Re-enter New Password"
								type="password"
								id="repassword"
								onChange={this.handleChange}
								helperText={errorMessage.repassword}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}

							>
								Confirm
        				  </Button>

							{this.state.isLoading ? <CircularProgress /> : ''}
						</form>
					</div>


				</Container>
				{!_.isEmpty(this.state.tostMsg) ? <SnackbarAlert tostMsg={this.state.tostMsg} /> : ''}
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
			self.setState({ isLoading: isLoading, tostMsg: stateObj.tostMsg })
		}
		return { loginUser, isLoading, stateObj };
	} else {
		const { loginUser } = {};
		const { isLoading } = false;
		if (self) { self.setState({ isLoading: isLoading, tostMsg: stateObj.tostMsg }) }
		return { loginUser, isLoading, stateObj };
	}
}

const actionCreators = {
	login: loginAction
};

SetNewPasswordComponent.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(SetNewPasswordComponent))
