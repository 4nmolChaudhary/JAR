import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import { useStyles } from './DashboardComponent';
import { lightBlue } from '@material-ui/core/colors';
import PropTypes, { func } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import _ from 'lodash';
import $ from 'jquery';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Grow';
import { connect } from "react-redux";
import dashboardOutstandingIssueListAction from "../../Actions/Dashboard/dashboardOutstandingIssueAction";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import momenttimezone from "moment-timezone";
import SnackbarAlert from "../../Snackbar/SnackbarAlert";
import enums from "../../Constants/enums";
import { invalid } from 'moment';

var self;
const styles = theme => ({

    root: {
        paddingTop: 20,
        flexGrow: 1,
    },
    container: {
        display: 'flex'
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.primary
    },
    tableCell: {
        fontSize: '12px'
    },
    warning: {
        color: '#d50000'
    },
    fab: {
        marginRight: theme.spacing(1)
    },
    buttonText: {
        fontSize: '12px',
        textTransform: 'none'
    },
    searchInput: {
        fontSize: '8px'
    },
    

});
class DashboardOutstandingIssue extends React.Component {
    constructor() {
        super();
        self = this;
        this.state = {
            inspectionFormAttributes: {},
            isAllRowExpand:false
        }
    }
    componentDidMount() {
       
        var loginData = localStorage.getItem('loginData');
        loginData = JSON.parse(loginData);
        setTimeout(function () {
            $('#pageLoading').show();
            this.props.dashboardOutstandingIssueListAction(loginData.uuid);
        }.bind(this), 200);
        setTimeout(() => {
            var inspectionFormAttributes = this.state.inspectionFormAttributes

            if(!_.isEmpty(this.props.outstandingIssueList.reports)){
                this.props.outstandingIssueList.reports.map((value, key) => {
                    if (!_.isEmpty(value.asset_details)) {
                        value.asset_details.map((value1, key1) => {
                             inspectionFormAttributes[value1.asset_id] =false
                        })
                    }
                })
            }
            this.setState({ inspectionFormAttributes: inspectionFormAttributes })
        }, 1000);
    }
    handleCollapse = (e, id) => {
        console.log("id", id);
        var inspectionFormAttributes = this.state.inspectionFormAttributes

        if(!_.isEmpty(this.props.outstandingIssueList.reports)){
            this.props.outstandingIssueList.reports.map((value, key) => {
                if (!_.isEmpty(value.asset_details)) {
                    value.asset_details.map((value1, key1) => {
                       
                         if(value1.asset_id == id){
                            inspectionFormAttributes[value1.asset_id] = !inspectionFormAttributes[value1.asset_id]
                         }
                    })
                }
            })
        }
        this.setState({ inspectionFormAttributes: inspectionFormAttributes })
        console.log("inspectionFormAttributes",inspectionFormAttributes)
        // var selectRowstCnt = _.filter(inspectionFormAttributes, function (value) { if (value == "true") return value }).length;
        var totalRowsCnt = 0;
        if(!_.isEmpty(this.props.outstandingIssueList.reports)){
            this.props.outstandingIssueList.reports.map((value, key) => {
                if (!_.isEmpty(value.asset_details)) {
                    value.asset_details.map((value1, key1) => {
                        totalRowsCnt++;
                    })
                }
            })
        }
        var selectRowstCnt=0;
        var inspectionFormAttributes1=   _.toArray(inspectionFormAttributes);
        inspectionFormAttributes1.map((value,key)=>{
            console.log(value," ",key)
            if(value){
                selectRowstCnt++
            }
        })
        console.log('selectRowstCnt',selectRowstCnt);
        console.log('totalRowsCnt',totalRowsCnt);
		if (selectRowstCnt == totalRowsCnt) {

			this.setState({ isAllRowExpand: "true"})
		} else {
			this.setState({ isAllRowExpand: false })
		}
    }
    handleExpandAllRows = (allRows) => {
       
        if(!this.state.isAllRowExpand){
            console.log("in if")
            var allinspectionFormAttributes = {}
			allRows.map((value, key) => {
				allinspectionFormAttributes[value.id] = true
            })
            console.log("allinspectionFormAttributes",allinspectionFormAttributes);
            this.setState({isAllRowExpand:"true",inspectionFormAttributes:allinspectionFormAttributes})
        }else{
            var allinspectionFormAttributes = {}
			allRows.map((value, key) => {
				allinspectionFormAttributes[value.id] = false
			})
            this.setState({isAllRowExpand:false,inspectionFormAttributes:allinspectionFormAttributes})
        }
        console.log(this.state.inspectionFormAttributes);
    }
    render() {
        console.log("this.props in outstanding-----------",this.props);
        let tostMsg = _.get(this,['props','tostMsg'],{})
        console.log("tostMsg-------",tostMsg);
        console.log("-----",_.get(this.props.outstandingIssueList,'reports[0].modified_at',null))

        let utcTime =_.get(this.props.outstandingIssueList,'reports[0].modified_at',null);
        var local_date = momenttimezone.utc(utcTime).local().format(' MM-DD-YYYY hh:mm a');
        console.log("local_date - ", local_date);
       
        var local_date2 = momenttimezone.utc(utcTime);
        local_date2 = local_date2.tz('America/Los_Angeles').format(' MM-DD-YYYY hh:mm a');
        console.log("local_date2 - ", local_date2);


        const { classes } = this.props;
        var rows = [];
        const headCells = [
            { id: 'name', numeric: false, disablePadding: false, label: 'Asset Name' },
            { id: 'assetId', numeric: false, disablePadding: false, label: 'Asset Id' },
            { id: 'site', numeric: false, disablePadding: false, label: 'Site' },
            { id: 'totaloutstandinIssue', numeric: false, disablePadding: false, label: 'Outstanding Issues' },
        ];
        const createData = (id, name, assetId, site, totaloutstandinIssue,notOkAsset) => {
            return { id, name, assetId, site, totaloutstandinIssue ,notOkAsset};
        }
        

        if (_.isEmpty(this.props.outstandingIssueList)) {
        } else {
            rows = [];
            this.props.outstandingIssueList.reports.map((value, key) => {
                if (_.isEmpty(value.asset_details)) {
                } else {
                    value.asset_details.map((value1, key1) => {
                        var result = createData(value1.asset_id,value1.asset_name,value1.internal_asset_id, value1.site_name,value1.asset.length,value1.asset)
                         rows.push(result);
                    })
                }
            })
        }
        // Child Table
        const childheadCells = [
            // { id: 'name', numeric: false, disablePadding: false, label: ' ' },
            // { id: 'assetId', numeric: false, disablePadding: false, label: '' },
            { id: 'attributes', numeric: false, disablePadding: false, label: 'Attributes' },
            { id: 'timeElapsed', numeric: false, disablePadding: false, label: 'Time Elapsed' },

        ];
        
        return (
            <Paper className={classes.paper}>
             
                <Typography className={classes.tableTitle}>Outstanding Issues </Typography>
                <FormControlLabel
                    control={
                        <Switch
                           checked={(this.state.isAllRowExpand == "true" ? true : false)}
                            onChange={e => { this.handleExpandAllRows(rows) }}
                           
                            color="primary"
                            size="medium"
                        />
                    }
                    className="expandBtn"
                    label="Expand All"
                />
                {/* <div className='lastUpdateTime'>Last Updated: {momenttimezone.utc(_.get(this,['props','outstandingIssueList','reports[0]','modified_at'],[])).tz("America/Los_Angeles").format('MM-DD-YYYY hh:mm a')}</div> */}
                <div className='lastUpdateTime'>Last Updated: {local_date2!= 'Invalid date'?local_date2:''}</div>
                
               
                <div className="table-responsive">
                <div id="style-1"  className="dashboardtblScroll"> 
                <Table className={classes.table } size="small" stickyHeader={true}>
                {/* <Table  className={classes.table } size="small" stickyHeader={true}> */}
                    <TableHead >
                        <TableRow>
                            {headCells.map(headCell => (
                                <TableCell
                                    id={headCell.id}
                                    align={headCell.numeric ? 'right' : 'left'}
                                    padding={headCell.disablePadding ? 'none' : 'default'}
                                >{headCell.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    {_.isEmpty(rows) ?
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan="4" className={classes.tableCell +' Pendingtbl-no-datafound'}> No data found</TableCell>
                            </TableRow>
                        {/* <div className="dashboard_center" style={{"position":"sticky", "marginTop":"150px"}} >No data found</div> */}
                    </TableBody>
                    :
                    <TableBody>
                        {rows.map(tableRow => (
                            <React.Fragment>
                               
                                <TableRow onClick={e => { this.handleCollapse(e, tableRow.id) }}>
                                    <TableCell className={classes.tableCell} >{tableRow.name}</TableCell>
                                    <TableCell className={classes.tableCell} >{tableRow.assetId}</TableCell>
                                    <TableCell className={classes.tableCell} >{tableRow.site}</TableCell>
                                    <TableCell className={classes.tableCell} >{tableRow.totaloutstandinIssue}</TableCell>
                                </TableRow>
                                {this.state.inspectionFormAttributes[tableRow.id] ?
                                 <TableRow id={tableRow.id}>
                                    
                                        <TableCell colSpan="4" className={classes.tableCell}>
                                        <Slide  direction="down" timeout={1000} in={true}>
                                              <div className="innertblscroll">
                                             
                                                    <Table  className={classes.table + ' innerdashboardtbl'} size="small" classes="childtable">
                                                        <TableHead>
                                                            <TableRow>
                                                                {childheadCells.map(headCell => (
                                                                    <TableCell
                                                                        id={headCell.id}
                                                                        align={headCell.numeric ? 'right' : 'left'}
                                                                        padding={headCell.disablePadding ? 'none' : 'default'}
                                                                    >{headCell.label}</TableCell>
                                                                ))}

                                                            </TableRow>
                                                        </TableHead>


                                                        <TableBody>
                                                            {tableRow.notOkAsset.map(tableRow1 => (

                                                                <TableRow>
                                                                    {/* <TableCell className={classes.tableCell}></TableCell>
                                                            <TableCell className={classes.tableCell}></TableCell> */}
                                                                    <TableCell className={classes.tableCell} width="75%">{tableRow1.attribute_name}</TableCell>
                                                                    <TableCell className={classes.tableCell} width="25%"> {tableRow1.time_elapsed}</TableCell>

                                                                </TableRow>

                                                            ))}
                                                        </TableBody>

                                                    </Table></div>
                                            </Slide>
                                        </TableCell>
                                   
                                    </TableRow>
                                   
                                    : ''}
                              
                            </React.Fragment>
                        ))}
                    </TableBody>
                    }
               </Table>
               </div>
               </div>   
                   {/* {_.isEmpty(this.state.tostMsg)?'':<SnackbarAlert tostMsg={this.state.tostMsg}/> } */}
            </Paper>
        )
    }
}
function mapState(state) {
  
      if (state.dashboardListReducer.outstandingIssueList) {
        if(state.dashboardListReducer){
            if(self){
                // self.setState({tostMsg:{}})
                setTimeout(() => {
                    self.setState({tostMsg:state.dashboardListReducer.tostMsg})
                }, 100);
               
            }
          
        }
        return state.dashboardListReducer
    } else {
        return state
    }
}

const actionCreators = {
    dashboardOutstandingIssueListAction: dashboardOutstandingIssueListAction
};

DashboardOutstandingIssue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators) (withStyles(styles)(DashboardOutstandingIssue));


