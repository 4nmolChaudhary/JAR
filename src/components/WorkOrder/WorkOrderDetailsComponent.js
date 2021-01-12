import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import workOrderDetail from "../../Actions/WorkOrder/workOrderDetailAction";
import workOrderUpdate from "../../Actions/WorkOrder/workOrderUpdateAction";
import { connect } from "react-redux";
import $ from 'jquery';
import _ from 'lodash';
import enums from "../../Constants/enums";
import { alert } from "../alertMessage";
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import momenttimezone from "moment-timezone";
import moment from 'moment';
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
class WorkOrderDetails extends React.Component {
    constructor() {
        super();
        var loginData = localStorage.getItem('loginData');
        this.state = {
            loginData: JSON.parse(loginData),
            title: null,
            notes: null,
            priority: null,
            status: null,
            formError: {},
            errorMessage: {},
            tostMsg: {}
        }
        this.handleOnChnage = this.handleOnChnage.bind(this);
        self = this;
    }

    handleOnChnage(e) {
        const { formError, errorMessage } = this.state;
        const { name, value } = e.target;
        this.setState({ [name]: value });
        if (value != '' || value != null) {
            delete formError[name]
            delete errorMessage[name]
        }
        if (name == 'status') {

        }
        this.setState({ formError, errorMessage });
    }
    componentDidMount() {

        $('#pageLoading').show();
        this.props.workOrderDetail(this.state.loginData.uuid, this.props.parameters.workOrderId);
        setTimeout(() => {
            this.setState({
                notes: _.get(this, ['props', 'workOrderData', 'notes'], null),
                title: _.get(this, ['props', 'workOrderData', 'name'], null),
                priority: _.get(this, ['props', 'workOrderData', 'priority'], null),
                status: _.get(this, ['props', 'workOrderData', 'status'], null),
            })
        }, 1500);
    }

    formValidation(title, priority, status, notes) {
        const { formError, errorMessage } = this.state;
        console.log(title, priority, status, notes);
        console.log(typeof priority);
        if (title == '' || title == null) {
            formError['title'] = true;
            errorMessage['title'] = 'Work order title is required';
        }
        else {
            delete formError['title'];
            delete errorMessage['title'];
        }

        if (priority == '' || priority == null || priority == NaN) {
            formError['priority'] = true;
            errorMessage['priority'] = 'Please select a priority';
        }
        else {
            delete formError['priority'];
            delete errorMessage['priority'];
        }

        if (status == '' || status == null || status == 'NaN') {
            formError['status'] = true;
            errorMessage['status'] = 'Please select a status';
        }
        else {


            var apiStatus = _.get(this, ['props', 'workOrderData', 'status'], null)

            if (apiStatus == enums.workOrderStatus[2].id) {

                if (status == enums.workOrderStatus[1].id) {

                    formError['status'] = true;
                    errorMessage['status'] = 'Please select a valid status';
                }
            }
            else if (apiStatus == enums.workOrderStatus[3].id) {

                if (status == enums.workOrderStatus[1].id || status == enums.workOrderStatus[2].id) {
                    formError['status'] = true;
                    errorMessage['status'] = 'Please select a valid status';
                }
            }
            else if (apiStatus == enums.workOrderStatus[4].id) {
                if (status == enums.workOrderStatus[1].id || status == enums.workOrderStatus[2].id || status == enums.workOrderStatus[3].id) {
                    formError['status'] = true;
                    errorMessage['status'] = 'Please select a valid status';
                }
            } else {
                delete formError['status'];
                delete errorMessage['status'];
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

   updateWorkOrder = (reqdata) => {
    var loginData = localStorage.getItem('loginData');
    loginData = JSON.parse(loginData);
    var requestData =
    {
        "work_order_uuid": reqdata.work_order_uuid,
        "title": this.state.title,
        "notes": this.state.notes,
        "priority": parseInt(this.state.priority),
        "status": parseInt(this.state.status),
        "userid": this.state.loginData.uuid,
        "updated_at":momenttimezone.utc().tz("America/Los_Angeles").format('YYYY-MM-DD HH:mm:ss')
    }
    console.log("request data-------------");
    console.log(requestData);

    var formvalid = this.formValidation(requestData.title, this.state.priority, this.state.status, requestData.notes);

    if (formvalid) {
        $('#pageLoading').show();
        this.props.workOrderUpdate(requestData);
    }


}
render() {
    const { formError, errorMessage } = this.state;
    const { classes } = this.props;
    var workOrderData = _.get(this, ['props', 'workOrderData'], [])

    console.log("workOrderData------", workOrderData);

    var reqdata =
    {
        "work_order_uuid": _.get(workOrderData, ['work_order_uuid'], ''),
        "title": _.get(workOrderData, ['name'], ''),
        "notes": _.get(workOrderData, ['notes'], ''),
        "priority": _.get(workOrderData, ['priority'], '')
    }

    return (
        <div>
            <Grid className="inspection-title bottom-lines">
                <h5>Work Order Details</h5>
                <Grid className="inspection-breadcrum">
                    <ul className="bread-crum">
                        <li><Link to={'../workorders'}>WorkOrder  </Link></li>
                        <li> > </li>
                        <li><a href="javascript:void(0)">{this.props.parameters.workOrderId}</a></li>
                    </ul>
                </Grid>
            </Grid>

            <Grid className="assets-wrap-container padding-sections">
                <Grid className="row">
                    <Grid className="col-sm-12 col-xs-12 col-lg-6 col-md-12 col-xl-6">
                        <Grid className="assets-info-container ">
                            <Grid className="row">
                                <form>

                                    <Grid className="assent-info-form-part1">

                                        <Grid className="row" >
                                            <Grid className="col-md-12">
                                                <Grid class="assets-info-devider">
                                                    <TextField
                                                        disabled={_.get(workOrderData, ['status'], '') == enums.workOrderStatus[4].id ? true : false}
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        value={this.state.title == null ? _.get(this, ['props', 'workOrderData', 'name'], '') : this.state.title}
                                                        id="title"
                                                        name="title"
                                                        label="Work Order Title"
                                                        onChange={(e) => this.handleOnChnage(e)}
                                                        error={formError.title}
                                                        helperText={errorMessage.title}
                                                    />

                                                </Grid>
                                            </Grid>
                                            <Grid className="col-md-12">
                                                <div className="drp-priority">
                                                    <Grid class="assets-info-devider">

                                                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                                            <InputLabel
                                                                style={{
                                                                    background: '#eee',
                                                                    paddingLeft: "5px",
                                                                    paddingRight: "5px"

                                                                }}
                                                                htmlFor="outlined-age-native-simple">
                                                                Select a Priority </InputLabel>
                                                            <Select
                                                                disabled={_.get(workOrderData, ['status'], '') == enums.workOrderStatus[4].id ? true : false}
                                                                native
                                                                fullWidth
                                                                name="priority"
                                                                value={this.state.priority == null ? _.get(this, ['props', 'workOrderData', 'priority'], '') : this.state.priority}
                                                                inputProps={{
                                                                    name: "priority",
                                                                    id: "outlined-age-native-simple"
                                                                }}

                                                                onChange={(e) => { this.handleOnChnage(e) }}
                                                            >
                                                                <option value="">Select a Priority</option>
                                                                {enums.priority.map((value, key) => {
                                                                    return (<option value={value.id} key={key}>{value.priority}</option>)
                                                                })}

                                                            </Select>
                                                            {formError.priority ? <div className={classes.validation}>{errorMessage.priority}</div>
                                                                : ''}
                                                        </FormControl>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                            <Grid className="col-md-12">
                                                <div className="drp-priority">
                                                    <Grid class="assets-info-devider ss-multi-select">
                                                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                                            <InputLabel
                                                                style={{
                                                                    background: '#eee',
                                                                    paddingLeft: "5px",
                                                                    paddingRight: "5px"

                                                                }}
                                                                className={this.state.status!=null?'wo-status-lbl':''}
                                                                htmlFor="outlined-age-native-simple">
                                                                Select a Status </InputLabel>
                                                            <Select
                                                               disabled={_.get(workOrderData, ['status'], '') == enums.workOrderStatus[4].id ? true : false}
                                                                native
                                                                fullWidth
                                                                name="status"
                                                                value={this.state.status == null ? _.get(this, ['props', 'workOrderData', 'status'], '') : this.state.status}
                                                                // value={this.state.status}
                                                                inputProps={{
                                                                    name: "status",
                                                                    id: "outlined-age-native-simple"
                                                                }}
                                                                onChange={(e) => { this.handleOnChnage(e) }}

                                                            >
                                                                {/* <option value="">Select a Status</option> */}
                                                                {enums.workOrderStatus1.map((value, key) => {

                                                                    return (<option value={value.id} key={key}>{value.status}</option>)

                                                                })}

                                                            </Select>
                                                            {formError.status ? <div className={classes.validation}>{errorMessage.status}</div>
                                                                : ''}
                                                        </FormControl>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                            <Grid className="col-md-12">
                                                <Grid class="assets-info-devider">
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        value={_.get(workOrderData, ['assets', 'internal_asset_id'], '')}
                                                        id="assetNo"
                                                        label="Asset No"
                                                        name="assetNo"
                                                        disabled="true"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid className="col-md-12">
                                                <Grid class="assets-info-devider">

                                                    <TextField
                                                        disabled={_.get(workOrderData, ['status'], '') == enums.workOrderStatus[4].id ? true : false}
                                                        multiline
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        value={this.state.notes == null ? _.get(this, ['props', 'workOrderData', 'notes'], '') : this.state.notes}
                                                        id="notes"
                                                        label="Notes"
                                                        name="notes"
                                                        rows="2"
                                                        onChange={(e) => this.handleOnChnage(e)}
                                                        error={formError.notes}
                                                        helperText={errorMessage.notes}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid class="assets-buttons-part">
                                            <Button variant="contained" color="primary" className="assets-bottons txt-normal float_r" style={{ "fontSize": "13px" }} onClick={(e) => this.updateWorkOrder(reqdata)} disabled={_.get(workOrderData, ['status'], '') == enums.workOrderStatus[4].id ? true : false}>Update Work Order</Button>
                                            <Button variant="contained" color="primary" className="assets-bottons txt-normal float_r" style={{ "fontSize": "13px" }} component={Link} to={"../../assets/details/" + _.get(workOrderData, ['assets', 'asset_id'], '')}>Asset Details</Button>
                                            {_.get(workOrderData, ['inspection_id'], null) != null ?
                                                <Button variant="contained" color="primary" className="assets-bottons txt-normal float_r" style={{ "fontSize": "13px" }} component={Link} to={"../../inspections/details/" + _.get(workOrderData, ['inspection_id'], '')}>Inspection Details</Button>
                                                : ''}
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid className="col-sm-12  col-xs-12 col-lg-6 col-md-12 col-xl-6">
                        <Grid className="row">
                            {_.get(workOrderData, ['comments'], []).length > 0 ?
                                <Grid className="wrap-all-comment-container">
                                    {_.get(workOrderData, ['comments'], []).map((value, key) => {
                                        return (
                                            <Grid className="work-order-comments" key={key}>
                                                <Grid className="refilled-oil">
                                                    <div className="cmt_heading"> {value.comment} </div>
                                                </Grid>
                                                <Grid className="refilled-date-time">
                                                    {/* {moment.utc(value.created_at).local().format('MM-DD-YYYY hh:mm:ss a')}, {value.created_by_name} */}
                                                    {momenttimezone.utc(value.created_at).tz("America/Los_Angeles").format('MM-DD-YYYY hh:mm:ss a')} , {value.created_by_name}
                                                </Grid>
                                            </Grid>
                                        )
                                    })}

                                </Grid>
                                : ''}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <SnackbarAlert tostMsg={this.state.tostMsg} />
        </div>
    )
}
}
function mapState(state) {
    if (state.workOrderDetailReducer) {
        if (self) {
            if (state.workOrderDetailReducer.workOrderData) {
                var data = state.workOrderDetailReducer.workOrderData;
                // self.setState({
                //     notes: data.notes,
                //     title: data.name,
                //     priority: data.priority,
                //     status: data.status,
                // })
            }
            if (!_.isEmpty(state.workOrderDetailReducer.tostMsg)) {
                self.setState({ tostMsg: state.workOrderDetailReducer.tostMsg })
            }
            if (state.workOrderUpdateReducer) {
                if (self) {
                    if (!_.isEmpty(state.workOrderUpdateReducer.tostMsg)) {
                        self.setState({ tostMsg: state.workOrderUpdateReducer.tostMsg })
                    }
                }
            }
        }
        return state.workOrderDetailReducer
    }

    if (state.workOrderUpdateReducer) {
        if (self) {
            if (!_.isEmpty(state.workOrderUpdateReducer.tostMsg)) {
                self.setState({ tostMsg: state.workOrderUpdateReducer.tostMsg })
            }
        }
    }
    return state
}

const actionCreators = {
    workOrderDetail: workOrderDetail,
    workOrderUpdate: workOrderUpdate
};

WorkOrderDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default connect(mapState, actionCreators)(withStyles(styles)(WorkOrderDetails));
