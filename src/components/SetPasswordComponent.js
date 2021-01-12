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
import setPassword from "../Actions/setPasswordAction";
import {history  } from "../helpers/history";

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

class SetPasswordComponent extends React.Component {
	constructor() {
		super();
		self = this;
		this.state = {
			password: '',
			submited: false,
			isLoading: false,
			formError: {},
			errorMessage: {},
			tostMsg:{}

		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount(){
		
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

		this.setState({ submited: true,tostMsg:{} })
		
		var formvalid = this.formValidation(this.state.password);
	
		if (formvalid) {
			// $('#pageLoading').show();
		  setPassword(this.state.password,enums.domainName).then(response=>{
		
			history.push('/login');
			}).catch(error=>{
			
			})
   
		} else {
		
		}

	}

	formValidation(password) {
	
		const { formError, errorMessage } = this.state;
		
		
		if (password == '' || password == null) {
			formError['password'] = true;
			errorMessage['password'] = 'Please enter new password';

		}
		else {
			delete formError['password'];
			delete errorMessage['password'];
		}

	

		if (!_.isEmpty(formError)) {
			this.setState({ formError, errorMessage });
		
			return false;
		}
		else {
			return true;
		}

	}

	render() {
	
		const { classes } = this.props;
		let tostMsg = _.get(this,['props','stateObj','tostMsg'],{})
		const { submited, formError, errorMessage } = this.state;
	
		return (
			<div>
			<Container id='root1' component="main" maxWidth="xs" className="screen_c">
				<CssBaseline />
				<div className={classes.paper}>
					<div className="loginwelcome">Set New Password</div>
					{/* <img alt="Sensaii" src="/proassets/images/project-jarvis.png" style={{ "width":"160px", "height":"160px"}} className="MuiAvatar-img"/> */}
					{/* <Typography component="h1" variant="h5" className="text_c">
						Sign in
      				  </Typography> */}
					<form className={classes.form} onSubmit={this.confirmBtnClick} >
				
			
						<TextField
							error={formError.password}
							variant="outlined"
							margin="normal"
							// required
							fullWidth
							defaultValue={this.state.password}
							name="password"
							label="Enter New Password"
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
							Submit
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
 return state
}

const actionCreators = {

};

SetPasswordComponent.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(SetPasswordComponent))
