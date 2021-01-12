import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from "react-redux";
import $ from 'jquery';
import _ from 'lodash';
import enums from "../../Constants/enums";
import { alert } from "../alertMessage";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import truck from "../../Content/images/truck.jpeg";
import { Link } from 'react-router-dom';
import Input from '@material-ui/core/Input';
import createUserAction from "../../Actions/User/createUserAction";
import SnackbarAlert from "../../Snackbar/SnackbarAlert";

const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    validation :{
		color: "#f44336",
		fontSize: "0.75rem",
		margin: "0 0 0 14px",
		paddingTop: "4px"
	
	}
});
class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        var logindata = localStorage.getItem('loginData');
        logindata = JSON.parse(logindata);
        this.state = {
            loginData:logindata,
            name: '',
            email: '',
            password:'',
            status: '',
            role: '',
            company:'',
            selectedSites:[],
            site: [],
            formError: {},
            errorMessage: {},
            allCompany:JSON.parse(localStorage.getItem('AllCompany')),
            userRoles:JSON.parse(localStorage.getItem('UserRoles')),
            fname:'',
            lname:'',
            language:'',
            operatorRoleId:''
        }
        this.createUser = this.createUser.bind(this);
        this.handleOnchnage = this.handleOnchnage.bind(this);
    }
    componentDidMount(){
     if(localStorage.getItem('roleName')==enums.userRoles[0].role){
        this.setState({site:this.state.loginData.usersites,selectedSites:[]})
     }  
     this.setState({language:enums.Language[0].id})
     
     this.state.userRoles.map((value,key)=>{
        if(value.name == enums.userRoles[2].role){
            this.setState({operatorRoleId:value.role_id})
        }
     })
    }
    createUser() {
        var loginData = localStorage.getItem('loginData');
        loginData = JSON.parse(loginData);

        var formvalid = this.formValidation(this.state.fname,this.state.lname,this.state.name, this.state.email,this.state.password ,this.state.status, this.state.role,this.state.company, this.state.selectedSites,this.state.language);
       
        if (formvalid) {

            var userSites=[]
            this.state.selectedSites.map((value,key)=>{
                userSites.push({
                    "site_id":value
                })
            })
            var languageName = null 
            enums.Language.map((value, key)=>{
                if(value.id == this.state.language){
                     languageName = value.language 
                }
            })
            
            var requestData=
                {
                    "username":this.state.name,
                    "password":this.state.password,
                    "roleid":this.state.role,
                    "email":this.state.email,
                    "status":parseInt(this.state.status),
                    "created_by":"Manually",
                    "firstname":this.state.fname,
                    "lastname":this.state.lname,
                    "Usersites":userSites,
                    'prefer_language_id':(this.state.language?parseInt(this.state.language):null),
                    'prefer_language_name':languageName
            }

          console.log("request data=======================");
          console.log(requestData);

          $('#pageLoading').show();
          this.props.createUserAction(requestData);

        } else {
        }
    }

    handleOnchnage = (e) => {
        const { formError, errorMessage } = this.state;
        const { name, value } = e.target;
       
        this.setState({ [name]: value });
        
        if (value != '' || value != null) {
            delete formError[name]
            delete errorMessage[name]
        }
        this.setState({ formError, errorMessage });

        if(name=='company'){
            if(value!=''){
                console.log(value);
                console.log(this.state.allCompany);
                let selectCompany = this.state.allCompany.filter(x=>(x.company_id==value))
                console.log(selectCompany);
                this.setState({site:selectCompany[0].sites,selectedSites:[]})
            }else{
                this.setState({site:[],selectedSites:[]}) 
            }
        }

      
    }

    formValidation(fname, lname ,name, email,password, status, role,company, site,language) {
        const { formError, errorMessage } = this.state;
        var emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
       var isUppercaseLetter= (/[A-Z]/.test(password));
       var isNumericLetter= /\d/.test(password);
		// if (email == '' || email == null) {
		// 	formError['email'] = true;
		// 	errorMessage['email'] = 'Email is required';

		// }else if(!emailValid){
        //     formError['email'] = true;
		// 	errorMessage['email'] = 'Email is not valid';
        // } 
		// else {
		// 	delete formError['email'];
		// 	delete errorMessage['email'];
        // }

        if(email!=''){
            if(!emailValid){
                formError['email'] = true;
                errorMessage['email'] = 'Email is not valid';
            }else{
                delete formError['email'];
                delete errorMessage['email'];
            }
        }

        if (password == '' || password == null) {
            formError['password'] = true;
            errorMessage['password'] = 'Password is required';
        }
        else if(password.length < 8){
            formError['password'] = true;
            errorMessage['password'] = 'Password must contain atleast 8 characters, including atleast one uppercase and one number';
        }
        else if(!isUppercaseLetter && !isNumericLetter){
            formError['password'] = true;
            errorMessage['password'] = 'Password must contain atleast one upper case and one number';
        }
        else if(!isUppercaseLetter){
            formError['password'] = true;
            errorMessage['password'] = 'Password must contain atleast one upper case';
        }
        else if(!isNumericLetter){
            formError['password'] = true;
            errorMessage['password'] = 'Password must contain atleast one number';
        }
        else {
            delete formError['password'];
            delete errorMessage['password'];
        }
        if (name == '' || name == null) {
            formError['name'] = true;
            errorMessage['name'] = 'User name is required';
        }
        else {
            delete formError['name'];
            delete errorMessage['name'];
        }

        if (fname == '' || fname == null) {
            formError['fname'] = true;
            errorMessage['fname'] = 'First name is required';
        }
        else {
            delete formError['fname'];
            delete errorMessage['fname'];
        }

        if (lname == '' || lname == null) {
            formError['lname'] = true;
            errorMessage['lname'] = 'Last name is required';
        }
        else {
            delete formError['lname'];
            delete errorMessage['lname'];
        }

        if (status == '' || status == null) {
            formError['status'] = true;
            errorMessage['status'] = 'Please select status';
        }
        else {
            delete formError['status'];
            delete errorMessage['status'];
        }

        if (role == '' || role == null) {
            formError['role'] = true;
            errorMessage['role'] = 'Please select role';
        }
        else {
            delete formError['role'];
            delete errorMessage['role'];
        }

        if(localStorage.getItem('roleName') == enums.userRoles[1].role) {
            if (company == '' || company == null) {
                formError['company'] = true;
                errorMessage['company'] = 'Please select company';
            }
            else {
                delete formError['company'];
                delete errorMessage['company'];
            }
        }


        if (site == '' || site == null) {
            formError['selectedSites'] = true;
            errorMessage['selectedSites'] = 'Please select site';
        }
        else {
            delete formError['selectedSites'];
            delete errorMessage['selectedSites'];
        }

        if(this.state.role == this.state.operatorRoleId){
            if (language == '' || language == null) {
                formError['language'] = true;
                errorMessage['language'] = 'Please select language';
            }
            else {
                delete formError['language'];
                delete errorMessage['language'];
            }
    
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
       
        const { formError, errorMessage } = this.state;
        const { classes } = this.props;
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
              },
            },
          };
          return (
            <div >
                <Grid className="div_center">
                    <Grid className="row">
                        <Grid className="col-md-12 col-lg-12 col-xs-12 col-xl-12">
                            <Grid className="inspection-title bottom-lines">
                                <h5>Create User</h5>
                            </Grid>
                            <Grid className="assets-wrap-container padding-sections">
                                <Grid >
                                    <Grid className="col-sm-12 col-xs-12 col-lg-12 col-md-12 col-xl-12">
                                        <Grid className="assets-info-container ">
                                            <Grid className="row">
                                                <form>
                                                    <Grid className="assent-info-form-part1">
                                                        <Grid className="row" >
                                                        <Grid className="col-md-6">
                                                                <Grid className="assets-info-devider">
                                                                    <TextField
                                                                        error={formError.fname}
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        fullWidth
                                                                        id="fname"
                                                                        label="First name"
                                                                        name="fname"
                                                                        onChange={(e) => { this.handleOnchnage(e) }}
                                                                        helperText={errorMessage.fname}
                                                                        // onKeyPress={e => { if (e.which != 8 && e.which != 0 && e.which < 65 || e.which > 90 && e.which < 97 || e.which > 122) { e.preventDefault(); } }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid className="col-md-6">
                                                                <Grid className="assets-info-devider">
                                                                    <TextField
                                                                        error={formError.lname}
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        fullWidth
                                                                        id="lname"
                                                                        label="Last name"
                                                                        name="lname"
                                                                        onChange={(e) => { this.handleOnchnage(e) }}
                                                                        helperText={errorMessage.lname}
                                                                        // onKeyPress={e => { if (e.which != 8 && e.which != 0 && e.which < 65 || e.which > 90 && e.which < 97 || e.which > 122) { e.preventDefault(); } }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid className="col-md-6">
                                                                <Grid className="assets-info-devider">
                                                                    <TextField
                                                                        error={formError.name}
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        fullWidth
                                                                        id="name"
                                                                        label="User name"
                                                                        name="name"
                                                                        onChange={(e) => { this.handleOnchnage(e) }}
                                                                        helperText={errorMessage.name}
                                                                        // onKeyPress={e => { if (e.which != 8 && e.which != 0 && e.which < 65 || e.which > 90 && e.which < 97 || e.which > 122) { e.preventDefault(); } }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid className="col-md-6">
                                                                <Grid className="assets-info-devider">
                                                                    <TextField
                                                                        error={formError.email}
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        fullWidth
                                                                        id="email"
                                                                        label="Email"
                                                                        name="email"
                                                                        onChange={(e) => { this.handleOnchnage(e) }}
                                                                        helperText={errorMessage.email}
                                                                        
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid className="col-md-6">
                                                                <Grid className="assets-info-devider">
                                                                    <TextField
                                                                        error={formError.password}
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        fullWidth
                                                                        id="password"
                                                                        label="Password"
                                                                        name="password"
                                                                        type="password"
                                                                        onChange={(e) => { this.handleOnchnage(e) }}
                                                                        helperText={errorMessage.password}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid className="col-md-6">
                                                                <div className="drp-priority">
                                                                    <Grid className="assets-info-devider">
                                                                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                                                            <InputLabel
                                                                                style={{
                                                                                    background: '#eee',
                                                                                    paddingLeft: "5px",
                                                                                    paddingRight: "5px"

                                                                                }}
                                                                                htmlFor="outlined-age-native-simple" className="input-lbl-drp">
                                                                                Select a status </InputLabel>
                                                                            <Select
                                                                                native
                                                                                fullWidth
                                                                                name="status"
                                                                                inputProps={{
                                                                                    name: "status",
                                                                                    id: "outlined-age-native-simple"
                                                                                }}
                                                                                onChange={(e) => { this.handleOnchnage(e) }}
                                                                                error={formError.status}
                                                                                helperText={errorMessage.status}
                                                                            >
                                                                                <option value="">Select a Status</option>
                                                                                {enums.userStatus.map((value, key) => {
                                                                                   if(value.id!=enums.userStatus[2].id){
                                                                                    return (<option value={value.id} key={key}>{value.status}</option>)
                                                                                   }
                                                                                })}

                                                                            </Select>
                                                                              {formError.status ? <div className={classes.validation}>{errorMessage.status}</div>
                                                                                  : ''}
                                                                          </FormControl>
                                                                    </Grid>
                                                                </div>
                                                            </Grid>
                                                            <Grid className="col-md-6">
                                                                <div className="drp-priority">
                                                                    <Grid className="assets-info-devider">
                                                                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                                                            <InputLabel
                                                                                style={{
                                                                                    background: '#eee',
                                                                                    paddingLeft: "5px",
                                                                                    paddingRight: "5px"

                                                                                }}
                                                                                htmlFor="outlined-age-native-simple" className="input-lbl-drp">
                                                                                Select a Role </InputLabel>
                                                                            <Select
                                                                                native
                                                                                fullWidth
                                                                                name="role"
                                                                                inputProps={{
                                                                                    name: "role",
                                                                                    id: "outlined-age-native-simple"
                                                                                }}
                                                                                onChange={(e) => { this.handleOnchnage(e) }}
                                                                                error={formError.role}
                                                                                helperText={errorMessage.role}
                                                                            >
                                                                                <option value="">Select a Role</option>
                                                                                {_.get(this,['state','userRoles'],[]).map((value, key) => {
                                                                                    if(localStorage.getItem('roleName') == enums.userRoles[0].role){
                                                                                       
                                                                                    }
                                                                                    return (<option value={value.role_id} key={key}>{value.name}</option>)
                                                                                })}

                                                                            </Select>
                                                                            {formError.role ? <div className={classes.validation}>{errorMessage.role}</div>
                                                                                  : ''}
                                                                        </FormControl>
                                                                    </Grid>
                                                                </div>
                                                            </Grid>
                                                            {localStorage.getItem('roleName') ==enums.userRoles[1].role?
                                                                  <Grid className="col-md-6">
                                                                      <div className="drp-priority">
                                                                          <Grid className="assets-info-devider">
                                                                              <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                                                                  <InputLabel
                                                                                      style={{
                                                                                          background: '#eee',
                                                                                          paddingLeft: "5px",
                                                                                          paddingRight: "5px"

                                                                                      }}
                                                                                      htmlFor="outlined-age-native-simple" className="input-lbl-drp">
                                                                                      Select a company </InputLabel>
                                                                                  <Select
                                                                                      native
                                                                                      fullWidth
                                                                                      name="company"
                                                                                      inputProps={{
                                                                                          name: "company",
                                                                                          id: "outlined-age-native-simple"
                                                                                      }}
                                                                                      onChange={(e) => { this.handleOnchnage(e) }}
                                                                                      error={formError.company}
                                                                                      helperText={errorMessage.company}
                                                                                  >
                                                                                      <option value="">Select a company</option>
                                                                                      {_.get(this,['state','allCompany'],[]).map((value, key) => {
                                                                                          return (<option value={value.company_id} key={key}>{value.company_name}</option>)
                                                                                      })}

                                                                                  </Select>
                                                                                  {formError.company ? <div className={classes.validation}>{errorMessage.company}</div>
                                                                                      : ''}
                                                                              </FormControl>
                                                                          </Grid>
                                                                      </div>
                                                                  </Grid>
                                                         
                                                            :''
                                                            }
                                                           
                                                            <Grid className="col-md-6">
                                                            <div className="drp-priority drp-multiselect" style={{marginTop:"16px"}}>
                                                                    <Grid className="assets-info-devider">
                                                                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                                                            <InputLabel
                                                                                style={{
                                                                                    background: '#eee',
                                                                                    paddingLeft: "5px",
                                                                                    paddingRight: "5px"

                                                                                }}
                                                                                htmlFor="outlined-age-native-simple" className="input-lbl-drp">
                                                                                Select a site </InputLabel>
                                                                    <Select
                                                                     variant="outlined"
                                                                     fullWidth
                                                                     name="selectedSites"
                                                                        inputProps={{
                                                                            name: "selectedSites",
                                                                            id: "outlined-age-native-simple"
                                                                        }}
                                                                        multiple
                                                                        value={this.state.selectedSites}
                                                                        onChange={(e) => { this.handleOnchnage(e) }}
                                                                        input={<Input />}
                                                                        MenuProps={MenuProps}
                                                                    >
                                                                        {this.state.site.map(value => (
                                                                            <MenuItem key={value.site_id} value={value.site_id}>
                                                                                {value.site_name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                    {formError.selectedSites ? <div className={classes.validation}>{errorMessage.selectedSites}</div>
                                                                                      : ''}
                                                                </FormControl>
                                                                </Grid>
                                                                </div>
                                                            </Grid>

                                                                            {this.state.role == this.state.operatorRoleId?
                                                                            <Grid className="col-md-6">
                                                                            <div className="drp-priority">
                                                                                <Grid className="assets-info-devider">
                                                                                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                                                                        <InputLabel
                                                                                            style={{
                                                                                                background: '#eee',
                                                                                                paddingLeft: "5px",
                                                                                                paddingRight: "5px"
      
                                                                                            }}
                                                                                            htmlFor="outlined-age-native-simple" className="input-lbl-drp">
                                                                                            Select a language </InputLabel>
                                                                                        <Select
                                                                                            native
                                                                                            fullWidth
                                                                                            name="language"
                                                                                            value={this.state.language}
                                                                                            inputProps={{
                                                                                                name: "language",
                                                                                                id: "outlined-age-native-simple"
                                                                                            }}
                                                                                            onChange={(e) => { this.handleOnchnage(e) }}
                                                                                            error={formError.language}
                                                                                            helperText={errorMessage.language}
                                                                                        >
                                                                                            <option value="">Select a language</option>
                                                                                            {enums.Language.map((value, key) => {
                                                                                                return (<option value={value.id} key={key}>{value.language}</option>)
                                                                                            })}
      
                                                                                        </Select>
                                                                                        {formError.language ? <div className={classes.validation}>{errorMessage.language}</div>
                                                                                            : ''}
                                                                                    </FormControl>
                                                                                </Grid>
                                                                            </div>
                                                                            </Grid>
                                                               
                                                                           :''}
                                                           
                                                        </Grid>

                                                    </Grid>
                                                    <Grid className="assets-buttons-part user_btn_bottom">
                                                        <Button variant="contained" color="primary" className="assets-bottons txt-normal" style={{ "fontSize": "13px" }} onClick={this.createUser}>Save</Button>
                                                        <Button variant="contained" color="primary" className="assets-bottons txt-normal" style={{ "fontSize": "13px" }} component={Link} to={"../../users"}>Cancel</Button>
                                                    </Grid>

                                                </form>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <SnackbarAlert tostMsg={_.get(this,['props','userReducer','tostMsg'],{})}/> 
            </div>
        )
    }
}
function mapState(state) {
    console.log('map state---------',state);
    return state
}

const actionCreators = {
    createUserAction:createUserAction
};

CreateUser.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default connect(mapState,actionCreators)(withStyles(styles)(CreateUser))