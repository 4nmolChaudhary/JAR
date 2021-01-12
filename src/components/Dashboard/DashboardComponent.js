import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DashboardPendingApprovals from './DashboardPendingApprovalsComponent';
import DashboardCheckedOutAssets from './DashboardCheckedOutAssetsComponent';
import dashboardListAction from "../../Actions/Dashboard/dashboardAction";
import approveInspectionAction from "../../Actions/Inspection/approveInspectionAction";
import DashboardOutstandingIssue from "./DashboardOutstandingIssueComponent";
import { connect } from "react-redux";
import $ from 'jquery'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import enums from "../../Constants/enums";
import PendingInspectionApprovePopup from "../Inspection/pendingInspectionApprovePopup";
import {history  } from "../../helpers/history";
import _ from 'lodash';
import SnackbarAlert from "../../Snackbar/SnackbarAlert";
import dashboardStateUpdate from "../../Actions/Dashboard/dashboardStateUpdate";
let classes;
var self;
const styles = theme => ({
    root: {
        paddingTop: 20
    },
    container: {
        display: 'flex'
    },
    paper: {
        minHeight: '300px',
        padding: theme.spacing(2),
        color: theme.palette.text.primary
    },
    table: {
        minWidth: '500px'
    },
    tableTitle: {
        paddingBottom: '5px'
    },
    tableCell: {
        fontSize: '12px'
    },
    warning: {
        color: '#d50000'
    }

});

const appSpacing = 2;
export const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: 20
    },
    container: {
        display: 'flex'
    },
    paper: {
        minHeight: '300px',
        padding: theme.spacing(2),
        color: theme.palette.text.primary
    },
    table: {
        minWidth: '500px'
    },
    tableTitle: {
        paddingBottom: '5px'
    },
    tableCell: {
        fontSize: '12px'
    },
    warning: {
        color: '#d50000'
    }
}));
class Dashboard extends React.Component {
    constructor() {
        super();
        self = this;
        this.state={
            showPopUp:false,
            tostMsg:{}
        }
        this.approveInspection = this.approveInspection.bind(this);
        this.handlePendingViewInspection = this.handlePendingViewInspection.bind(this);
    }
    componentDidMount() {
        var loginData = localStorage.getItem('loginData');
        loginData = JSON.parse(loginData);
        setTimeout(function () {
            $('#pageLoading').show();
            this.props.dashboardListAction(loginData.uuid);
        }.bind(this), 200);
    }
    approveInspection(requestData, isshowPopup) {	
        if (isshowPopup) {	
            this.setState({ showPopUp: true })	
        } else {	
            $('#pageLoading').show();	
            this.props.approveInspection(requestData, '', enums.approveInspectionFromType[0].id)	
        }	
    }
    handlePendingViewInspection(isshowPopup,inspectionId){
        console.log("handleViewInspection ------------");
      
        if (isshowPopup) {
            this.setState({ showPopUp: true })
        } else {
            var link= "inspections/details/" + inspectionId
            history.push(link);
        }
     }

    closePopUp = () => {
        console.log("in close popup");
        this.setState({showPopUp:false})
     }
    render() {
        console.log("this.props dashboard----------------",this.props)
        const { classes } = this.props;
        let tostMsg = _.get(this,['props','tostMsg'],{})
        return (
            <div className={classes.root}>
                <Grid container className={classes.container} spacing={appSpacing}>
                    <Grid item xs={12}>
                        <DashboardPendingApprovals assetList={_.get(this,['props','dashboardList'],[])} approveInspection={this.approveInspection} handleViewInspection={this.handlePendingViewInspection} />
                    </Grid>
                    {/* <Grid item s={6}>
                    <DashboardTransfers />
                </Grid> */}
                   <Grid item xs={12} md={6}>
                        <DashboardOutstandingIssue />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DashboardCheckedOutAssets assetList={_.get(this,['props','dashboardList'],[])} />
                    </Grid>
                </Grid>
                {this.state.showPopUp?<PendingInspectionApprovePopup closePopUp={this.closePopUp}/> :''}
                {_.isEmpty(this.state.tostMsg)?'' : <SnackbarAlert tostMsg={this.state.tostMsg}/>} 
            </div>
        );
    }
};

function mapState(state) {
    var dashboardList = [];
    console.log("Map state ------------",state.dashboardListReducer);
    if (state.dashboardListReducer.dashboardList) {
        dashboardList = state.dashboardListReducer.dashboardList
        if(state.dashboardListReducer.isReturnFromOutstanding){
            if(self){
                self.setState({tostMsg:state.dashboardListReducer.tostMsg})
                    self.props.dashboardStateUpdate()
            }
        }
        return  state.dashboardListReducer
    } else {
        return state
    }

}

const actionCreators = {
    dashboardListAction: dashboardListAction,
    approveInspection: approveInspectionAction,
    dashboardStateUpdate:dashboardStateUpdate
};
Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(Dashboard));
