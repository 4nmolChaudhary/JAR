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
import getUserProfileAction from "../../Actions/User/getUserProfileAction";
import updateProfilerAction from "../../Actions/User/updateProfilerAction";
import getUserRolesAction from "../../Actions/User/getUserRolesAction";
import getAllCompanyAction from "../../Actions/getAllCompanyAction";
import updateEmailNotificationAction from "../../Actions/User/updateEmailNotificationAction";
import SnackbarAlert from "../../Snackbar/SnackbarAlert";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    validation: {
        color: "#f44336",
        fontSize: "0.75rem",
        margin: "0 0 0 14px",
        paddingTop: "4px"

    },
    fontStyleLbl:{
    font: "inherit",
    color: "currentColor",
    width: "100%",
    border: 0,
    height: "1.1876em",
    margin: 0,
    display: "block",
    padding: "6px 0 7px",
    minWidth: 0,
    background: "none",
    
    
    }
});
var self;
class Profile extends React.Component {
    constructor(props) {
        super(props);
        self = this;
        var logindata = localStorage.getItem('loginData');
        var isemailNotification = localStorage.getItem('emailNotificationPendingReviews');
        var allCompany = JSON.parse(localStorage.getItem('AllCompany'));
        var allRoles = JSON.parse(localStorage.getItem('UserRoles'))
        this.state = {
            loginData: JSON.parse(logindata),
            name: null,
            email: null,
            password: '',
            status: null,
            role: null,
            company: null,
            selectedSites: [],
            site: [],
            formError: {},
            errorMessage: {},
            allCompany: (allCompany ? allCompany : []),
            userRoles: (allRoles ? allRoles : []),
            fname: null,
            lname: null,
            tostMsg: {},
            isEmailNotification:isemailNotification
        }
        this.updateUser = this.updateUser.bind(this);
        this.handleOnchnage = this.handleOnchnage.bind(this);
    }

    componentDidMount() {
        $('#pageLoading').show();
        var urlparameters = this.state.loginData.uuid + "/" + this.state.loginData.uuid
        this.props.getUserProfileAction(urlparameters);
        this.props.getUserRolesAction(this.state.loginData.uuid);
        if (localStorage.getItem('roleName') == enums.userRoles[1].role) {
            this.props.getAllCompany();
            }

        setTimeout(() => {
            console.log("this.props---------------------", this.props);
            var allCompany = JSON.parse(localStorage.getItem('AllCompany'));
            var allRoles = JSON.parse(localStorage.getItem('UserRoles'));
            this.setState({
                allCompany: (allCompany ? allCompany : []),
            userRoles: (allRoles ? allRoles : []),
            })
            var selectedsites = [];
            var allSites = []
            var company = ''

            if (_.get(this, ['props', 'profileReducer', 'userDetail', 'usersites'], []).length > 0) {
                _.get(this, ['props', 'profileReducer', 'userDetail', 'usersites'], []).map((value, key) => {
                    if (value.status == enums.userStatus[0].id) {//acive
                        selectedsites.push(value.site_id)
                        company = value.company_id
                        this.setState({ company: value.company_id });
                    }
                })
                _.get(this, ['props', 'profileReducer', 'userDetail', 'usersites'], []).map((value, key) => {
                    if (value.company_id == company) {
                        allSites.push({
                            key: value.site_id,
                            value: value.site_name,
                        })
                    }
                })
            }
            console.log("selectedsites------", selectedsites);
            this.setState({
                fname: _.get(this, ['props', 'profileReducer', 'userDetail', 'firstname'], null),
                lname: _.get(this, ['props', 'profileReducer', 'userDetail', 'lastname'], null),
                name: _.get(this, ['props', 'profileReducer', 'userDetail', 'username'], null),
                email: _.get(this, ['props', 'profileReducer', 'userDetail', 'email'], null),
                status: _.get(this, ['props', 'profileReducer', 'userDetail', 'status'], null),
                role: _.get(this, ['props', 'profileReducer', 'userDetail', 'role_id'], null),
                selectedSites: selectedsites,
                site: allSites
            })


        }, 1000);
        var allSites = []

    }

    updateUser() {
        var loginData = localStorage.getItem('loginData');
        loginData = JSON.parse(loginData);
        var formvalid = this.formValidation(this.state.fname, this.state.lname, this.state.name, this.state.email, this.state.password, this.state.status, this.state.role, this.state.company, this.state.selectedSites);

        if (formvalid) {

            var userSites = []
            this.state.selectedSites.map((value, key) => {
                userSites.push({
                    "site_id": value
                })
            })

            var requestData =
            {
                "uuid":loginData.uuid,
                "username": this.state.name,
                "roleid": this.state.role,
                "email": this.state.email,
                "status": parseInt(this.state.status),
                "created_by": "Manually",
                "firstname": this.state.fname,
                "lastname": this.state.lname,
                "Usersites": userSites
            }

            console.log("request data=======================");
            console.log(requestData);

            $('#pageLoading').show();
            this.props.updateProfilerAction(requestData);

        } else {
        }
    }

    handleOnchnage = (e) => {
        const { formError, errorMessage } = this.state;
        const { name, value, options } = e.target;

        console.log("name value", name, " ", value);
        this.setState({ [name]: value });
        if (value != '' || value != null) {
            delete formError[name]
            delete errorMessage[name]
        }
        this.setState({ formError, errorMessage });

        if (name == 'company') {
            var allSites = []

            if (value != '') {
                console.log(value);
                console.log(this.state.allCompany);
                let selectCompany = this.state.allCompany.filter(x => (x.company_id == value))
                console.log(selectCompany);
                selectCompany[0].sites.map((value, key) => {
                    allSites.push({
                        key: value.site_id,
                        value: value.site_name,
                    })
                })

                this.setState({ site: allSites, selectedSites: [] })
            } else {
                this.setState({ site: [], selectedSites: [] })
            }
        } else if (name == 'selectedSites') {

            //const { options } = e.target;
            console.log("options - ", options);
            const selectedValue = [];
            for (let i = 0, l = options.length; i < l; i += 1) {
                if (options[i].selected) {
                    selectedValue.push(options[i].value);
                }
            }

            this.setState({

                "selectedSites": selectedValue
            })
            console.log("value - ", value);

        }



    }

    formValidation(fname, lname, name, email, password, status, role, company, site) {
        const { formError, errorMessage } = this.state;
        // var emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

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

        // if (password == '' || password == null) {
        //     formError['password'] = true;
        //     errorMessage['password'] = 'Password is required';
        // }
        // else {
        //     delete formError['password'];
        //     delete errorMessage['password'];
        // }

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

        if (name == '' || name == null) {
            formError['name'] = true;
            errorMessage['name'] = 'User name is required';
        }
        else {
            delete formError['name'];
            delete errorMessage['name'];
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

        if (localStorage.getItem('roleName') == enums.userRoles[1].role) {
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

        if (!_.isEmpty(formError)) {
            this.setState({ formError, errorMessage });
            return false;
        }
        else {
            return true;
        }

    }

    handleEmailNotificationChange(e){
        console.log("in email notification----------------------");
        console.log(e.target.value);
       
        if(this.state.isEmailNotification == "true"){
            this.setState({isEmailNotification:"false"});
        }else{
            this.setState({isEmailNotification:"true"});
        }
        setTimeout(() => {
            $('#pageLoading').show();
            var urlparameters = this.state.loginData.uuid + "/" + (this.state.isEmailNotification == "true"?true:false)
            this.props.updateEmailNotificationAction(urlparameters,this.state.isEmailNotification)
        }, 100);
       
    }

    render() {
        console.log("this.state---------", this.state);
        const sites = _.uniqBy(this.state.site, 'key');
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
                <Grid className="col-md-12 col-lg-12 col-xs-12 col-xl-12">
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
                                                                value={this.state.fname == null ? _.get(this, ['props', 'profileReducer', 'userDetail', 'firstname'], '') : this.state.fname}
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
                                                                value={this.state.lname == null ? _.get(this, ['props', 'profileReducer', 'userDetail', 'lastname'], '') : this.state.lname}
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
                                                                disabled
                                                                value={this.state.name == null ? _.get(this, ['props', 'profileReducer', 'userDetail', 'username'], '') : this.state.name}
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
                                                                disabled
                                                                value={this.state.email == null ? _.get(this, ['props', 'profileReducer', 'userDetail', 'email'], '') : this.state.email}
                                                                onChange={(e) => { this.handleOnchnage(e) }}
                                                                helperText={errorMessage.email}

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
                                                                        disabled
                                                                        name="status"
                                                                        value={this.state.status == null ? _.get(this, ['props', 'profileReducer', 'userDetail', 'status_name'], '') : this.state.status}
                                                                        inputProps={{
                                                                            name: "status",
                                                                            id: "outlined-age-native-simple"
                                                                        }}
                                                                        onChange={(e) => { this.handleOnchnage(e) }}

                                                                    >
                                                                        <option value="">Select a Status</option>
                                                                        {enums.userStatus.map((value, key) => {
                                                                            if (value.id != enums.userStatus[2].id) {
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
                                                        <div className="drp-priority select-line-height">
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
                                                                        value={this.state.role == null ? _.get(this, ['props', 'profileReducer', 'userDetail', 'role_name'], '') : this.state.role}
                                                                        name="role"
                                                                        disabled
                                                                        inputProps={{
                                                                            name: "role",
                                                                            id: "outlined-age-native-simple"
                                                                        }}
                                                                        onChange={(e) => { this.handleOnchnage(e) }}

                                                                    >
                                                                        <option value="">Select a Role</option>
                                                                        {_.get(this, ['state', 'userRoles'], []).map((value, key) => {
                                                                            return (<option value={value.role_id} key={key}>{value.name}</option>)
                                                                        })}

                                                                    </Select>
                                                                    {formError.role ? <div className={classes.validation}>{errorMessage.role}</div>
                                                                        : ''}
                                                                </FormControl>
                                                            </Grid>
                                                        </div>
                                                    </Grid>
                                                    {localStorage.getItem('roleName') == enums.userRoles[1].role ?
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
                                                                            disabled
                                                                            value={this.state.company == null ? _.get(this, ['props', 'profileReducer', 'userDetail', 'comapny_name'], '') : this.state.company}
                                                                            name="company"

                                                                            inputProps={{
                                                                                name: "company",
                                                                                id: "outlined-age-native-simple"
                                                                            }}
                                                                            onChange={(e) => { this.handleOnchnage(e) }}

                                                                        >
                                                                            <option value="">Select a company</option>
                                                                            {_.get(this, ['state', 'allCompany'], []).map((value, key) => {
                                                                                return (<option value={value.company_id} key={key}>{value.company_name}</option>)
                                                                            })}

                                                                        </Select>
                                                                        {formError.company ? <div className={classes.validation}>{errorMessage.company}</div>
                                                                            : ''}
                                                                    </FormControl>
                                                                </Grid>
                                                            </div>
                                                        </Grid>

                                                        : ''}

                                                    <Grid className="col-md-6">
                                                        <div className="drp-priority drp-multiselect border-gray" style={{ marginTop: "16px" }}>
                                                            <Grid className="assets-info-devider" >
                                                                <FormControl fullWidth variant="outlined" className={classes.formControl + " mr0"}>
                                                                    <InputLabel
                                                                        style={{
                                                                            background: '#eee',
                                                                            paddingLeft: "5px",
                                                                            paddingRight: "5px"

                                                                        }}
                                                                        htmlFor="outlined-age-native-simplemultiselect" className="input-lbl-drp">
                                                                        Select a site </InputLabel>
                                                                    <Select
                                                                        variant="outlined"
                                                                        fullWidth

                                                                        name="selectedSites"
                                                                        inputProps={{
                                                                            name: "selectedSites",
                                                                            id: "outlined-age-native-simplemultiselect"
                                                                        }}
                                                                        multiple
                                                                        disabled
                                                                        // native
                                                                        value={this.state.selectedSites}
                                                                        onChange={(e) => { this.handleOnchnage(e) }}
                                                                        input={<Input />}
                                                                        MenuProps={MenuProps}
                                                                    >
                                                                        {sites.map(value => (
                                                                            <MenuItem key={value.key} value={value.key}>
                                                                                {value.value}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                    {formError.selectedSites ? <div className={classes.validation}>{errorMessage.selectedSites}</div>
                                                                        : ''}
                                                                </FormControl>
                                                            </Grid>
                                                        </div>
                                                    </Grid>

                                                </Grid>

                                            </Grid>
                                            <Grid className="assets-buttons-part user_btn_bottom">
                                                <Button variant="contained" color="primary" className="assets-bottons txt-normal" style={{ "fontSize": "13px" }} onClick={this.updateUser}>Save</Button>
                                                <Button variant="contained" color="primary" className="assets-bottons txt-normal" style={{ "fontSize": "13px" }} component={Link} to={"../../users"}>Cancel</Button>
                                            </Grid>

                                        </form>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {localStorage.getItem('roleName') == enums.userRoles[0].role ?
                      <Grid className="assets-wrap-container ">
                      <Grid className="col-sm-12 col-xs-12 col-lg-12 col-md-12 col-xl-12">
                      <Grid className="assets-info-container ">
                          <FormControlLabel
                              control={
                                  <Switch
                                      checked={(this.state.isEmailNotification == "true"? true : false)}
                                      onChange={e => { this.handleEmailNotificationChange(e) }}
                                      color="primary"
                                      size="medium"
                                  />
                              }
                              className=""
                              label="Email Notification for Pending Reviews"
                          />
                      </Grid>
                      </Grid>
                    </Grid>
                    :''}                                                        
                  

                </Grid>

                <SnackbarAlert tostMsg={this.state.tostMsg} />
            </div>
        )
    }
}

function mapState(state) {
    console.log("userdetail map state----------------", state);
    if (self) {
        if (!_.isEmpty(state.profileReducer.tostMsg)) {
            self.setState({ tostMsg: state.profileReducer.tostMsg })
        }

    }
    return state
}

const actionCreators = {
    getUserRolesAction:getUserRolesAction,
    getAllCompany:getAllCompanyAction,
    getUserProfileAction: getUserProfileAction,
    updateProfilerAction: updateProfilerAction,
    updateEmailNotificationAction:updateEmailNotificationAction
};

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default connect(mapState, actionCreators)(withStyles(styles)(Profile))
