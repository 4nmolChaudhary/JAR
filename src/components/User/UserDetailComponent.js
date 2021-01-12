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
import getUserDetailAction from "../../Actions/User/getUserDetailAction";
import updateUserAction from "../../Actions/User/updateUserAction";
import SnackbarAlert from "../../Snackbar/SnackbarAlert";

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

    }

});

var self;
class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        self = this;
        var logindata = localStorage.getItem('loginData');
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
            allCompany: JSON.parse(localStorage.getItem('AllCompany')),
            userRoles: JSON.parse(localStorage.getItem('UserRoles')),
            fname: null,
            lname: null,
            language: '',
            tostMsg: {}
        }
        this.updateUser = this.updateUser.bind(this);
        this.handleOnchnage = this.handleOnchnage.bind(this);
    }

    componentDidMount() {
        $('#pageLoading').show();
        var urlparameters = this.state.loginData.uuid + "/" + this.props.parameters.userId
        this.props.getUserDetailAction(urlparameters);
        setTimeout(() => {
            console.log("this.props---------------------", this.props);
            var selectedsites = [];
            var merge_Sites = [..._.get(this, ['props', 'userDetailReducer', 'userDetail', 'usersites'], []), ...this.state.loginData.usersites]
            var unique_allSites = [... new Set(merge_Sites)];
            var allSites = []
            var company = ''


            console.log("user accessable sites ", _.get(this, ['props', 'userDetailReducer', 'userDetail', 'usersites'], []));
            console.log("manager aceessable sites ", this.state.loginData.usersites);
            console.log("merge_Sites  ", merge_Sites);
            console.log("unique_allSites ", unique_allSites);

            if (_.get(this, ['props', 'userDetailReducer', 'userDetail', 'usersites'], []).length > 0) {



                if (localStorage.getItem('roleName') == enums.userRoles[1].role) {

                    _.get(this, ['props', 'userDetailReducer', 'userDetail', 'usersites'], []).map((value, key) => {
                        if (value.status == enums.userStatus[0].id) {//acive
                            selectedsites.push(value.site_id)
                            company = value.company_id
                            this.setState({ company: value.company_id });
                        }
                    })

                    this.state.allCompany.map((value,key)=>{
                        if(value.company_id == company){
                            value.sites.map((value1,key1)=>{
                                allSites.push({
                                    key:value1.site_id,
                                    value: value1.site_name,
                                },)
                            })
                        }
                    })

                } else {
                    unique_allSites.map((value, key) => {
                        if (value.status == enums.userStatus[0].id) {//acive
                            selectedsites.push(value.site_id)
                            company = ''
                            this.setState({ company: value.company_id });
                        }
                    })
                    unique_allSites.map((value, key) => {
                        allSites.push({
                            key: value.site_id,
                            value: value.site_name,
                        })
                    })
                }

              

            }
            console.log("selectedsites------", selectedsites);

            this.setState({
                fname: _.get(this, ['props', 'userDetailReducer', 'userDetail', 'firstname'], null),
                lname: _.get(this, ['props', 'userDetailReducer', 'userDetail', 'lastname'], null),
                name: _.get(this, ['props', 'userDetailReducer', 'userDetail', 'username'], null),
                email: _.get(this, ['props', 'userDetailReducer', 'userDetail', 'email'], null),
                status: _.get(this, ['props', 'userDetailReducer', 'userDetail', 'status'], null),
                role: _.get(this, ['props', 'userDetailReducer', 'userDetail', 'role_id'], null),
                selectedSites: selectedsites,
                site: allSites,
                language: _.get(this, ['props', 'userDetailReducer', 'userDetail', 'prefer_language_id'], null),
                // language:enums.Language[0].id
            })


        }, 1000);
        var allSites = []

    }

    updateUser() {
        var loginData = localStorage.getItem('loginData');
        loginData = JSON.parse(loginData);
        var formvalid = this.formValidation(this.state.fname, this.state.lname, this.state.name, this.state.email, this.state.password, this.state.status, this.state.role, this.state.company, this.state.selectedSites, this.state.language);

        if (formvalid) {

            var userSites = []
            this.state.selectedSites.map((value, key) => {
                userSites.push({
                    "site_id": value
                })
            })

            var languageName = null
            enums.Language.map((value, key) => {
                if (value.id == this.state.language) {
                    languageName = value.language
                }
            })

            var requestData =
            {
                "uuid": _.get(this, ['props', 'userDetailReducer', 'userDetail', 'uuid'], []),
                "username": this.state.name,
                "roleid": this.state.role,
                "email": this.state.email,
                "status": parseInt(this.state.status),
                "created_by": "Manually",
                "firstname": this.state.fname,
                "lastname": this.state.lname,
                "Usersites": userSites,
                'prefer_language_id': (this.state.language ? parseInt(this.state.language) : null),
                'prefer_language_name': languageName
            }

            console.log("request data=======================");
            console.log(requestData);

            $('#pageLoading').show();
            this.props.updateUserAction(requestData);

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
            console.log("e.target", e.target);
            console.log("options - ", options);
            const selectedValue = [];
            // for (let i = 0, l = options.length; i < l; i += 1) {
            // 	if (options[i].selected) {
            // 		selectedValue.push(options[i].value);
            // 	}
            // }

            this.setState({

                "selectedSites": value
            })
            console.log("value - ", value);

        }



    }

    formValidation(fname, lname, name, email, password, status, role, company, site, language) {
        const { formError, errorMessage } = this.state;


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
        console.log("email", email);
        if (email != '' && email != null) {
            var emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            if (!emailValid) {
                formError['email'] = true;
                errorMessage['email'] = 'Email is not valid';
            } else {
                delete formError['email'];
                delete errorMessage['email'];
            }
        }

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

        if (_.get(this, ['props', 'userDetailReducer', 'userDetail', 'role_name'], null) == enums.userRoles[2].role) {
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
                <Grid className="inspection-title bottom-lines">
                    <h5>User Details</h5>
                    <Grid className="inspection-breadcrum">
                        <ul className="bread-crum">
                            <li><Link to={'../users'}>User  </Link></li>
                            <li> > </li>
                            <li><a href="javascript:void(0)">{this.props.parameters.userId}</a></li>
                            {/* <li><a href="javascript:void(0)">{this.props.parameters.workOrderId}</a></li> */}
                        </ul>
                    </Grid>
                </Grid>
                {/* <Grid className="div_center">
                    <Grid className="row"> */}
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
                                                                value={this.state.fname == null ? _.get(this, ['props', 'userDetailReducer', 'userDetail', 'firstname'], '') : this.state.fname}
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
                                                                value={this.state.lname == null ? _.get(this, ['props', 'userDetailReducer', 'userDetail', 'lastname'], '') : this.state.lname}
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
                                                                value={this.state.name == null ? _.get(this, ['props', 'userDetailReducer', 'userDetail', 'username'], '') : this.state.name}
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
                                                                value={this.state.email == null ? _.get(this, ['props', 'userDetailReducer', 'userDetail', 'email'], '') : this.state.email}
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
                                                                        name="status"
                                                                        value={this.state.status == null ? _.get(this, ['props', 'userDetailReducer', 'userDetail', 'status_name'], '') : this.state.status}
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
                                                                        value={this.state.role == null ? _.get(this, ['props', 'userDetailReducer', 'userDetail', 'role_name'], '') : this.state.role}
                                                                        name="role"
                                                                        disabled
                                                                        inputProps={{
                                                                            name: "role",
                                                                            id: "outlined-age-native-simple"
                                                                        }}
                                                                        onChange={(e) => { this.handleOnchnage(e) }}

                                                                    >
                                                                        <option value="">Select a Role</option>
                                                                        {this.state.userRoles.map((value, key) => {
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
                                                                            value={this.state.company == null ? _.get(this, ['props', 'userDetailReducer', 'userDetail', 'comapny_name'], '') : this.state.company}
                                                                            name="company"

                                                                            inputProps={{
                                                                                name: "company",
                                                                                id: "outlined-age-native-simple"
                                                                            }}
                                                                            onChange={(e) => { this.handleOnchnage(e) }}

                                                                        >
                                                                            <option value="">Select a company</option>
                                                                            {this.state.allCompany.map((value, key) => {
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
                                                        <div className="drp-priority drp-multiselect" style={{ marginTop: "16px" }}>
                                                            <Grid className="assets-info-devider">
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

                                                    {_.get(this, ['props', 'userDetailReducer', 'userDetail', 'role_name'], null) == enums.userRoles[2].role ?
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
                                                        : ''}
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
                </Grid>
                {/* </Grid>
                </Grid> */}
                <SnackbarAlert tostMsg={this.state.tostMsg} />
            </div>
        )
    }
}

function mapState(state) {
    console.log("userdetail map state----------------", state);
    if (self) {
        if (!_.isEmpty(state.userDetailReducer.tostMsg)) {
            self.setState({ tostMsg: state.userDetailReducer.tostMsg })
        }
        if (!_.isEmpty(state.userReducer.tostMsg1)) {
            self.setState({ tostMsg: state.userReducer.tostMsg1 })
        }
    }
    return state
}

const actionCreators = {
    getUserDetailAction: getUserDetailAction,
    updateUserAction: updateUserAction
};

UserDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default connect(mapState, actionCreators)(withStyles(styles)(UserDetail))
