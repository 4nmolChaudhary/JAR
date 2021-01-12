import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Warning from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import { useStyles } from './DashboardComponent';
import _ from 'lodash';
import enums from "../../Constants/enums";
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import AssignmentTurnedInOutlined from '@material-ui/icons/AssignmentTurnedInOutlined';
import { func } from 'prop-types';

const DashboardPendingApprovals = (assetList) => {
    console.log("in pending inspection----------------",assetList);
    const classes = useStyles();
    var pendingCnt = 0
    var rows=[];
    const headCells = [
        {id: 'assetNo', numeric: false, disablePadding: false, label: 'Asset No'},
        {id: 'name', numeric: false, disablePadding: false, label: 'Asset Name'},
        {id: 'hourMeter', numeric: false, disablePadding: false, label: 'Hour Meter'},
        {id: 'timeElapsed', numeric: false, disablePadding: false, label: 'Time Elapsed'},
        {id: 'operatorName', numeric: false, disablePadding: false, label: 'Operator Name'},
        {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
        {id: 'actions', numeric: false, disablePadding: false, label: 'Actions'}
    ];

    const createData = (id,assetNo,name,hourMeter, timeElapsed, operatorName,status,checkoutRequestDateTime) => {
        return { id,assetNo,name,hourMeter, timeElapsed, operatorName,status,checkoutRequestDateTime };
    }
    if(_.isEmpty(assetList.assetList.pendingInspection)){

    }else{
    pendingCnt = assetList.assetList.pendingInspection.length
     rows=[];
     assetList.assetList.pendingInspection.map((value,key)=>{
       
        var result = createData(value.inspection_id,value.internal_asset_id,value.asset_name, value.meter_hours,value.timeelapsed, value.operator_name,value.status_name,value.datetime_requested)
         rows.push(result);
     })
    }

   const checkPreviosInspectionPending= function(selctedRow,rows){
        console.log("check Previos Inspection Pending ------------------------");
        var result= _.filter(rows, function(inspection) {
          return  ((selctedRow.status == enums.inspectionStatus[0].status)&&(inspection.assetNo == selctedRow.assetNo)&&(selctedRow.checkoutRequestDateTime>inspection.checkoutRequestDateTime))
       });
    
       console.log("result",result, result.length);
       if(result){
           if(result.length>0){
              return true
           }else{
             return false
           } 
       }else{
           return false
       }
   }

    const approveInspection = function (selctedRow,rows) {
      var result=  checkPreviosInspectionPending(selctedRow,rows)
      console.log("result---------",result);
      
        var loginData = localStorage.getItem('loginData');
        loginData = JSON.parse(loginData);
    
        var inspectionData = _.filter(assetList.assetList.pendingInspection, { inspection_id: selctedRow.id });
        
        var requestData = {
            "inspection_id": selctedRow.id,
            "asset_id": _.get(inspectionData[0], ['asset_id'], ''),
            "manager_id": loginData.uuid,
            "status": enums.inspectionStatus[2].id,
            "manager_notes": null,
            "meter_hours":parseInt(selctedRow.hourMeter)
        }
        console.log("request data---------",requestData);
        assetList.approveInspection(requestData,result);
    }
    const viewInspection = function (selctedRow,rows) {
        console.log("view Inspection -------------------");
        var result=  checkPreviosInspectionPending(selctedRow,rows)
        console.log("result---------",result);
        assetList.handleViewInspection(result,selctedRow.id);
      }
    return (
        <Paper className={classes.paper}>
           
            <Badge badgeContent={pendingCnt} color="primary">
            <Typography className={classes.tableTitle} style={{"paddingTop":"3px"}}>Pending Reviews
              {/* <Badge badgeContent={pendingCnt} color="primary" style={{"paddingBottom":"5px","paddingLeft":"5px"}}>
             <AssignmentTurnedInOutlined fontSize="small"/>
            </Badge> */}
            </Typography>
            </Badge>
           
         
            <div className="table-responsive">
            <Table className={classes.table} size="small" stickyHeader={true}>
                <TableHead>
                    <TableRow>
                        {headCells.map((headCell,key)=>{
                            return(
                                <TableCell key={key}
                                id={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                            >{headCell.label}</TableCell>
                            )
                        })
                        }
                    </TableRow>
                </TableHead>
                {_.isEmpty(assetList.assetList.pendingInspection) ?
                    <TableBody>
                        {/* <div className="dashboard_center" ></div> */}
                        
                            <TableRow>
                            <TableCell colSpan="7" className={classes.tableCell +' Pendingtbl-no-datafound'}> No data found</TableCell>
                            </TableRow>
                    </TableBody>
                    :
                    <TableBody>

                        {rows.map((tableRow, key) => {
                            return (<TableRow key={key}>
                                <TableCell className={classes.tableCell}>{tableRow.assetNo?tableRow.assetNo:'-'}</TableCell>
                                <TableCell className={classes.tableCell}>{tableRow.name?tableRow.name:'-'}</TableCell>
                                <TableCell className={classes.tableCell}>{tableRow.hourMeter!=null?tableRow.hourMeter:'-'}</TableCell>
                                <TableCell className={classes.tableCell}>{tableRow.timeElapsed?tableRow.timeElapsed:'-'}</TableCell>
                                <TableCell className={classes.tableCell}>{tableRow.operatorName?tableRow.operatorName:'-'}</TableCell>
                                <TableCell className={classes.tableCell}>{tableRow.status?tableRow.status:'-'}</TableCell>
                                {/* <TableCell>
                                <Grid container alignItems="center">
                                    <Warning className={classes.warning} />
                                </Grid>
                            </TableCell> */}
                                <TableCell>
                                    <Grid container alignItems="center">
                                        <Tooltip title="Inspection View" placement="top">
                                            <IconButton  size="small"  onClick={(e)=>{viewInspection(tableRow,rows)}}>
                                                <VisibilityOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Accept" placement="top">
                                            <IconButton size="small" >
                                                <CheckCircleOutlinedIcon fontSize="small" onClick={(e)=>approveInspection(tableRow,rows)} />
                                            </IconButton>
                                        </Tooltip>
                                        {/* <Tooltip title="Reject" placement="top">
                                            <IconButton size="small">
                                                <CancelOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip> */}
                                    </Grid>
                                </TableCell>
                            </TableRow>)
                        })}
                    </TableBody>
                }
            </Table>
            </div>     
        </Paper>
    );
};

export default DashboardPendingApprovals;
