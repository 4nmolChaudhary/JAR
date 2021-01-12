import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import inspectionListAction from "../../Actions/Inspection/inspectionListAction";
import inspectionSearchListAction from "../../Actions/Search/inspectionSearchAction";
import approveInspectionAction from "../../Actions/Inspection/approveInspectionAction";
import inspectionStateUpdate from "../../Actions/Inspection/inspectionStateUpdate";
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import TablePagination from '@material-ui/core/TablePagination';
import $ from 'jquery';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';
import debounce from "lodash.debounce";
import enums from "../../Constants/enums";
import { decode } from 'querystring';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import Fab from '@material-ui/core/Fab';
import { Typography } from '@material-ui/core';
import momenttimezone from "moment-timezone";
import { history } from "../../helpers/history";
import PendingInspectionApprovePopup from "./pendingInspectionApprovePopup";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SnackbarAlert from "../../Snackbar/SnackbarAlert";
let classes;
var self;

const styles = theme => ({
    root: {
        paddingTop: 20,
        flexGrow: 1
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
    }
});
class InspectionList extends React.Component {
    constructor() {
        super();
        self = this;
        var loginData = localStorage.getItem('loginData');
        this.state = {
            loginData: JSON.parse(loginData),
            searchString: null,
            searchStringOnEnter:false,
            pageIndex: 1,
            pageSize: 20,
            isDataNotFound: false,
            page: 0, rowsPerPage: 20,
            currentTimeZone: '',
            showInspectionPopUp: false,
            tostMsg:{}
        }
        this.handleSearchOnChnage = this.handleSearchOnChnage.bind(this);
        this.handleSearchOnKeyDown = this.handleSearchOnKeyDown.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleViewInspection = this.handleViewInspection.bind(this);
        this.closePopUp = this.closePopUp.bind(this);
    }
    componentDidMount() {
        $('#pageLoading').show();
        setTimeout(function () {
            // if (_.get(this, ['props', 'inspectionListReducer', 'inspectionLists'], []).length == 0) {
                $('#pageLoading').show();
                var urlParameters = this.state.loginData.uuid + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                this.props.inspectionList(urlParameters, this.state.pageIndex);
            // }
        }.bind(this), 200);
        window.addEventListener('scroll', this.handleScroll);

        // get current time zone
        var timez = moment.tz.guess(true);
        timez = timez.replace("/", "-");
        var currenttimestamp = moment().valueOf()
        // var tzAbbrivation = moment.tz.zone(timez).abbr(currenttimestamp)

        // console.log("timezone---------",timez," ",tzAbbrivation);
        this.setState({ currentTimeZone: timez })

        if (_.get(this, ['props', 'inspectionListReducer', 'isDataNoFound'])) {
            this.setState({ isDataNotFound: _.get(this, ['props', 'inspectionListReducer', 'isDataNoFound']) })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll =
        debounce(() => {
            var searchString = $('#inspectionSearchInput').val();
            if (
                window.innerHeight + document.documentElement.scrollTop
                === document.documentElement.offsetHeight ||
                $(window).height() > $("body").height()
            ) {

                // if (searchString) {
                //     this.setState(
                //         { pageIndex: this.state.pageIndex + 1 },
                //         () => {
                //             var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.pageSize + "/" + this.state.pageIndex
                //             if (this.state.isDataNotFound) {
                //             } else {
                //                 $('#pageLoading').show();
                //                 this.props.inspectionSearchList(urlParameters, this.state.pageIndex);
                //             }
                //         });

                // } else {

                //     this.setState(
                //         { pageIndex: this.state.pageIndex + 1 },
                //         () => {
                //             var urlParameters = this.state.loginData.uuid + "/" + this.state.pageSize + "/" + this.state.pageIndex
                //             if (this.state.isDataNotFound) {
                //             } else {
                //                 $('#pageLoading').show();
                //                 this.props.inspectionList(urlParameters, this.state.pageIndex);
                //             }
                //         });
                // }

            }
        }, 1000);

    handleSearchOnChnage = (e) => {
        this.setState({ searchString: e.target.value })
        if (e.target.value == '') {
            this.setState(
                { pageIndex: 1, page: 0 },
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    $('#pageLoading').show();
                    this.props.inspectionList(urlParameters, this.state.pageIndex);

                });
        }
    }
    handleSearchOnKeyDown = (e) => {
        var searchString = $('#inspectionSearchInput').val();
        searchString =searchString.trim()
        if (e.key === 'Enter') {
            this.setState({ searchString: searchString ,searchStringOnEnter:true});
            if (searchString) {
                this.setState(
                    { pageIndex: 1, page: 0 },
                    () => {
                        var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.currentTimeZone + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                        $('#pageLoading').show();
                        this.props.inspectionSearchList(urlParameters, this.state.pageIndex);

                    });
            } else {

                this.setState(
                    { pageIndex: 1, page: 0 },
                    () => {
                        var urlParameters = this.state.loginData.uuid + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                        $('#pageLoading').show();
                        this.props.inspectionList(urlParameters, this.state.pageIndex);

                    });
            }
        }
    }
    handleApproveInspection = (e, selctedRow, rows) => {

        var result = this.checkPreviosInspectionPending(selctedRow, rows)
        console.log("result-----", result)
        if (result) {
            this.setState({ showInspectionPopUp: true })
        } else {
            var inspectionDetail = _.get(this, ['props', 'inspectionListReducer', 'inspectionLists'], []).filter(x => x.inspection_id == selctedRow.id)
            $('#pageLoading').show();
            var requestData = {
                "inspection_id": selctedRow.id,
                "asset_id": _.get(inspectionDetail[0], ['asset', 'asset_id'], ''),
                "manager_id": this.state.loginData.uuid,
                "status": enums.inspectionStatus[2].id,
                "manager_notes": null,
                "meter_hours":parseInt(selctedRow.hourMeter)
            }
            console.log("request Data------------", requestData);
            this.props.approveInspection(requestData, this.state.searchString, enums.approveInspectionFromType[1].id)
        }


    }
    // Pagination Code Start
    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
        var searchString = $('#inspectionSearchInput').val();
        searchString =searchString.trim()
        if (searchString && this.state.searchStringOnEnter) {
            this.setState(
                { pageIndex: this.state.pageIndex + 1 },
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.currentTimeZone + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    if (this.state.isDataNotFound) {
                    } else {
                        $('#pageLoading').show();
                        this.props.inspectionSearchList(urlParameters, this.state.pageIndex);
                    }
                });

        } else {

            this.setState(
                { pageIndex: this.state.pageIndex + 1 },
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    if (this.state.isDataNotFound) {
                    } else {
                        $('#pageLoading').show();
                        this.props.inspectionList(urlParameters, this.state.pageIndex);
                    }
                });
        }
    };
    handleChangeRowsPerPage = event => {

        this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 })

        if (this.props.inspectionListReducer.inspectionLists.length <= parseInt(event.target.value, 10)) {

            if (this.props.inspectionListReducer.inspectionLists.length != this.props.inspectionListReducer.listsize) {

                var searchString = $('#inspectionSearchInput').val();
                searchString =searchString.trim()

                if (searchString && this.state.searchStringOnEnter) {
                    this.setState(
                        { pageIndex: 1 },
                        () => {
                            var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.currentTimeZone + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                            $('#pageLoading').show();
                            this.props.inspectionSearchList(urlParameters, this.state.pageIndex);

                        });
                } else {

                    this.setState(
                        { pageIndex: 1 },
                        () => {
                            var urlParameters = this.state.loginData.uuid + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                            $('#pageLoading').show();
                            this.props.inspectionList(urlParameters, this.state.pageIndex);

                        });
                }

            }
        }
    };
    // Pagination Code End  

    checkPreviosInspectionPending(selctedRow, rows) {
        var result = _.filter(rows, function (inspection) {
            return ((selctedRow.status == enums.inspectionStatus[0].status) && (inspection.status == enums.inspectionStatus[0].status) && (inspection.internalAssetId == selctedRow.internalAssetId) && (selctedRow.checkoutRequestDateTime > inspection.checkoutRequestDateTime))
        });

        console.log("result", result, result.length);
        if (result) {
            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    handleViewInspection(e, selctedRow, rows) {
        console.log("selctedRow -----------", selctedRow);
        console.log("rows-----------", rows);
        var result = this.checkPreviosInspectionPending(selctedRow, rows)
        console.log("result-----", result)
        if (result) {
            this.setState({ showInspectionPopUp: true })
        } else {
            var link = "inspections/details/" + selctedRow.id
            history.push(link);
        }
    }

    closePopUp = () => {
        console.log("in close popup");
        this.setState({ showInspectionPopUp: false })
    }

    clearSearch(e) {
        var searchString = $('#inspectionSearchInput').val();
        searchString =searchString.trim()
        if (searchString && this.state.searchStringOnEnter) {

            console.log("this.handle clear search");

            $('#inspectionSearchInput').val('');
            searchString = ''

            this.setState(
                { pageIndex: 1, page: 0, searchString: null ,searchStringOnEnter:false},
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    $('#pageLoading').show();
                    this.props.inspectionList(urlParameters, this.state.pageIndex);

                });
        }
        else {this.setState({searchString:'',searchStringOnEnter:false}) }
    }

    render() {
        console.log("Inspection List Component ==========================", this.props);

        let searchString = (this.state.searchString != null ? this.state.searchString : decodeURI(_.get(this, ['props', 'inspectionListReducer', 'searchString'], '')))

        var rows = [];
        const { classes } = this.props;
        const headCells = [
            { id: 'site', numeric: false, disablePadding: false, label: 'Site Name' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Asset Name' },
            { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
            { id: 'checkoutRequestDateTime', numeric: false, disablePadding: false, label: 'Checkout Request Datetime' },
            { id: 'shift', numeric: false, disablePadding: false, label: 'Shift No' },
            { id: 'requestingOperator', numeric: false, disablePadding: false, label: 'Requestor' },
            // { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
        ];
        if (localStorage.getItem('roleName') == enums.userRoles[0].role) {
            headCells.push({ id: 'actions', numeric: false, disablePadding: false, label: 'Actions' })
        }

        const createData = (id, site, name, status, checkoutRequestDateTime, shift, requestingOperator, internalAssetId,hourMeter) => {
            return { id, site, name, status, checkoutRequestDateTime, shift, requestingOperator, internalAssetId ,hourMeter};
        }
        if (this.props.inspectionListReducer.inspectionLists) {

            if (_.get(this, ['props', 'inspectionListReducer', 'inspectionLists'], []).length > 0) {

                rows = [];
                this.props.inspectionListReducer.inspectionLists.map((value, key) => {
                    var result = createData(value.inspection_id, value.sites.site_name, value.asset.name, value.status_name, value.datetime_requested, value.shift, value.operator_name, value.asset.internal_asset_id,value.meter_hours)
                    rows.push(result);
                })
            }
        }
        return (
            <div>
                <Grid container className={classes.root} >
                    <Grid item xs={12}>
                        <Paper className={classes.paper + ' tableminheight'}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    {/* {this.state.loginData.rolename == enums.userRoles[1].role ?
                            // <Fab
							// 			variant="extended"
							// 			color="primary"
							// 			aria-label="add-asset"
							// 			size="small"
							// 			className={classes.fab}
							// 			href="/inspections/upload"
							// 		>
							// 			<ArrowUpwardOutlinedIcon />
							// 			<Typography className={classes.buttonText}>Upload Inspection Forms</Typography>
                            //         </Fab>
                                    
                                    :''} */}

                                </Grid>


                                <Grid item xs={5}></Grid>

                                <Grid className="text_r" item xs={3}>

                                    <TextField
                                        className={classes.searchInput}
                                        id="inspectionSearchInput"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchOutlined color="primary" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment className="pointerCursor" position="end" onClick={e => { this.clearSearch(e) }}>
                                                  {this.state.searchString?	<CloseOutlinedIcon color="primary" fontSize="small" />:''}	
                                                </InputAdornment>
                                            ),
                                        }}
                                        value={searchString}
                                        onChange={(e) => { this.handleSearchOnChnage(e) }}
                                        onKeyDown={(e) => { this.handleSearchOnKeyDown(e) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {/* {rows.length>0? */}
                                    <Table onWheel={(e) => {
                                        this.handleScroll();
                                    }}
                                        size="small" stickyHeader={true}>
                                        <TableHead>
                                            <TableRow>
                                                {headCells.map((headCell, key) => {
                                                    return (<TableCell key={key}
                                                        id={headCell.id}
                                                        align={headCell.numeric ? 'right' : 'left'}
                                                        padding={headCell.disablePadding ? 'none' : 'default'}
                                                    >{headCell.label}</TableCell>)
                                                })}
                                            </TableRow>
                                        </TableHead>
                                        {_.isEmpty(rows) ?
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell colSpan="7" className={classes.tableCell + ' Pendingtbl-no-datafound'}> No data found</TableCell>
                                                </TableRow>
                                                {/* <div className="dashboard_center">No data found</div> */}
                                            </TableBody>
                                            :
                                            <TableBody>

                                                {rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((tableRow, key) => {
                                                    return (
                                                        <TableRow key={key}>
                                                            <TableCell className={classes.tableCell}>{tableRow.site ? tableRow.site : '-'}</TableCell>
                                                            <TableCell className={classes.tableCell}>{tableRow.name ? tableRow.name : '-'}</TableCell>
                                                            <TableCell className={classes.tableCell}>{tableRow.status ? tableRow.status : '-'}</TableCell>
                                                            <TableCell className={classes.tableCell}>{tableRow.checkoutRequestDateTime ?
                                                                momenttimezone.utc(tableRow.checkoutRequestDateTime).tz("America/Los_Angeles").format('MM-DD-YYYY hh:mm:ss a')
                                                                // moment.utc(tableRow.checkoutRequestDateTime).local().format('MM-DD-YYYY hh:mm:ss a')

                                                                : '-'}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>{tableRow.shift != null ? tableRow.shift : '-'}</TableCell>
                                                            <TableCell className={classes.tableCell}>{tableRow.requestingOperator ? tableRow.requestingOperator : '-'}</TableCell>
                                                            {localStorage.getItem('roleName') == enums.userRoles[0].role ?
                                                                <TableCell width="10%">
                                                                    <Grid container alignItems="center">
                                                                        <Tooltip title="View" placement="top">
                                                                            <IconButton size="small" onClick={(e) => this.handleViewInspection(e, tableRow, rows)} >
                                                                                <VisibilityOutlinedIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Accept" placement="top">
                                                                            {tableRow.status == enums.inspectionStatus[0].status ?
                                                                                <IconButton size="small" >
                                                                                    <CheckCircleOutlinedIcon fontSize="small" onClick={(e) => this.handleApproveInspection(e, tableRow, rows)} />
                                                                                </IconButton>
                                                                                :
                                                                                <IconButton size="small" disabled>
                                                                                    <CheckCircleOutlinedIcon fontSize="small" onClick={(e) => this.handleApproveInspection(e, tableRow.id)} />
                                                                                </IconButton>

                                                                            }
                                                                        </Tooltip>
                                                                    </Grid>
                                                                </TableCell> : ''}
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        }
                                    </Table>
                                    {_.isEmpty(rows) ? '' :
                                        <TablePagination
                                            rowsPerPageOptions={[20, 40, 60, 80, 100]}
                                            component="div"
                                            count={this.props.inspectionListReducer.listsize}
                                            rowsPerPage={this.state.rowsPerPage}
                                            page={this.state.page}
                                            onChangePage={this.handleChangePage}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                        />
                                    }
                                    {/* :
                                    <h6>No data found.</h6>} */}


                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                </Grid>
                {this.state.showInspectionPopUp ? <PendingInspectionApprovePopup closePopUp={this.closePopUp} /> : ''}
                {_.isEmpty(this.state.tostMsg)?'':<SnackbarAlert tostMsg={this.state.tostMsg}/>} 
            </div>
        );
    }
}
function mapState(state) {
    if (state.inspectionListReducer) {
        if (self) {
            self.setState({ isDataNotFound: state.inspectionListReducer.isDataNoFound })
            if(state.inspectionListReducer.isReturnFromInspectionList){
                self.setState({tostMsg:state.inspectionListReducer.tostMsg})
                self.props.inspectionStateUpdate()
            }
        }
    }
    return state
}

const actionCreators = {
    inspectionList: inspectionListAction,
    inspectionSearchList: inspectionSearchListAction,
    approveInspection: approveInspectionAction,
    inspectionStateUpdate:inspectionStateUpdate
};

InspectionList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(InspectionList));
