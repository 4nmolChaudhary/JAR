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
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import AddOutlined from '@material-ui/icons/AddOutlined';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import $ from 'jquery';
import _ from 'lodash';
import workOrderListAction from "../../Actions/WorkOrder/workOrderListAction";
import workOrderSearchAction from "../../Actions/Search/workOrderSearchAction";
import { style } from '@material-ui/system';
import enums from "../../Constants/enums";
import moment from 'moment';
import momenttimezone from "moment-timezone";
import debounce from "lodash.debounce";
import TablePagination from '@material-ui/core/TablePagination';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SnackbarAlert from "../../Snackbar/SnackbarAlert";
var self;
let classes;
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

class WorkOrderList extends React.Component {
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
            page:0,rowsPerPage:20,
            currentTimeZone:'',
            tostMsg:{}
        }
        this.handleSearchOnChnage = this.handleSearchOnChnage.bind(this);
        this.handleSearchOnKeyDown = this.handleSearchOnKeyDown.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
    }
    componentDidMount() {
        setTimeout(function () {

            // if (_.get(this, ['props', 'workOrderData'], []).length == 0) {
                $('#pageLoading').show();
                var urlParameters = this.state.loginData.uuid + "/" + enums.workOrderStatus[0].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                this.props.workOrderList(urlParameters,this.state.pageIndex);
            // }
        }.bind(this), 200);
        window.addEventListener('scroll', this.handleScroll);

         // get current time zone
         var timez =moment.tz.guess(true);
         timez=timez.replace("/", "-");
        
         this.setState({currentTimeZone:timez})

         if(_.get(this, ['props', 'isDataNoFound'])){
            this.setState({
                isDataNotFound:_.get(this, ['props', 'isDataNoFound'])
            })
         }
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll =
        debounce(() => {
            var searchString = $('#workOrderSearchInput').val();
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
                //                 this.props.workOrderSearchList(urlParameters, this.state.pageIndex);
                //             }
                //         });

                // } else {
                //     this.setState(
                //         { pageIndex: this.state.pageIndex + 1 },
                //         () => {
                //             var urlParameters = this.state.loginData.uuid + "/" + enums.workOrderStatus[0].id + "/" + this.state.pageSize + "/" + this.state.pageIndex
                //             if (this.state.isDataNotFound) {
                //             } else {
                //                 this.props.workOrderList(urlParameters,this.state.pageIndex);
                //             }
                //         });
                // }
            }
        }, 1000);

    handleSearchOnChnage = (e) => {
        this.setState({ searchString: e.target.value })
        if (e.target.value == '') {
            this.setState(
                { pageIndex: 1 ,page:0},
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" + enums.workOrderStatus[0].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    $('#pageLoading').show();
                    this.props.workOrderList(urlParameters, this.state.pageIndex);

                });
        }
    }
    handleSearchOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            var searchString = $('#workOrderSearchInput').val();
            searchString =searchString.trim()
            if (searchString) {
                this.setState(
                    { pageIndex: 1, searchString: searchString ,page:0,searchStringOnEnter:true},
                    () => {
                        $('#pageLoading').show();
                        var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" +this.state.currentTimeZone +"/"+this.state.rowsPerPage + "/" + this.state.pageIndex

                        this.props.workOrderSearchList(urlParameters, this.state.pageIndex);

                    });

            } else {
                this.setState(
                    { pageIndex: 1 ,searchString: searchString,page:0},
                    () => {
                        $('#pageLoading').show();
                        var urlParameters = this.state.loginData.uuid + "/" + enums.workOrderStatus[0].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex

                        this.props.workOrderList(urlParameters, this.state.pageIndex);

                    });
            }
        }
    }
    // Pagination Code Start
    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
        var searchString = $('#workOrderSearchInput').val();
        searchString =searchString.trim()
        if (searchString && this.state.searchStringOnEnter) {
            this.setState(
                { pageIndex: this.state.pageIndex + 1 },
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.currentTimeZone +"/"+this.state.rowsPerPage + "/" + this.state.pageIndex
                    if (this.state.isDataNotFound) {
                    } else {
                        $('#pageLoading').show();
                        this.props.workOrderSearchList(urlParameters, this.state.pageIndex);
                    }
                });

        } else {
            this.setState(
                { pageIndex: this.state.pageIndex + 1 },
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" + enums.workOrderStatus[0].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    if (this.state.isDataNotFound) {
                    } else {
                        $('#pageLoading').show();
                        this.props.workOrderList(urlParameters,this.state.pageIndex);
                    }
                });
        }

    };
    handleChangeRowsPerPage = event => {

        this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 })

        if (this.props.workOrderData.length <= parseInt(event.target.value, 10)) {

            if (this.props.workOrderData.length != this.props.workOrderData.listsize) {

                var searchString = $('#workOrderSearchInput').val();
                searchString =searchString.trim()

                if (searchString && this.state.searchStringOnEnter) {
                    this.setState(
                        { pageIndex: 1, searchString: searchString },
                        () => {
                            if (this.state.isDataNotFound) {
                            } else {
                            var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.currentTimeZone +"/"+this.state.rowsPerPage + "/" + this.state.pageIndex
                            $('#pageLoading').show();
                            this.props.workOrderSearchList(urlParameters, this.state.pageIndex);
                            }
                        });

                } else {
                    this.setState(
                        { pageIndex: 1 },
                        () => {
                            if (this.state.isDataNotFound) {
                            } else {
                            var urlParameters = this.state.loginData.uuid + "/" + enums.workOrderStatus[0].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                            $('#pageLoading').show();
                            this.props.workOrderList(urlParameters, this.state.pageIndex);
                            }
                        });
                }
            }
        }
    };
   // Pagination Code End

   clearSearch(e){
    var searchString = $('#workOrderSearchInput').val();
    searchString =searchString.trim()
    
    if (searchString && this.state.searchStringOnEnter) {

        console.log("this.handle clear search");
        
        $('#workOrderSearchInput').val('');
        searchString=''
        
        this.setState(
            { pageIndex: 1 ,page:0,searchString: null,searchStringOnEnter:false},
            () => {
                $('#pageLoading').show();
                var urlParameters = this.state.loginData.uuid + "/" + enums.workOrderStatus[0].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex

                this.props.workOrderList(urlParameters, this.state.pageIndex);

            });
    }
    else{this.setState({searchString:'',searchStringOnEnter:false})}
}

    render() {
        console.log("Wo Component --------------",this.props);
        let workderdata = _.get(this, ['props', 'workOrderData'], []);
        let searchString = (this.state.searchString!=null?this.state.searchString:decodeURI(_.get(this,['props','searchString'],'')))
        var rows = [];
       
        const { classes } = this.props;
        const headCells = [
            { id: 'workOrderName', numeric: false, disablePadding: false, label: 'Work Order Title' },
            { id: 'assetName', numeric: false, disablePadding: false, label: 'Asset Name' },
            { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
            { id: 'priority', numeric: false, disablePadding: false, label: 'Priority' },
            { id: 'workOrderRequestDateTime', numeric: false, disablePadding: false, label: 'Work Order Request Datetime' },
            { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
        ];

        const createData = (id, workOrderName, assetName, status, priority, workOrderRequestDateTime) => {
            return { id, workOrderName, assetName, status, priority, workOrderRequestDateTime };
        }

        if (workderdata.length > 0) {
            rows = [];
            workderdata.map((value, key) => {
                var priority = ''
                enums.priority.map((value1, key) => {
                    if (value1.id == value.priority) {
                        priority = value1.priority
                    }
                })
                var result = createData(value.work_order_uuid, value.name, value.asset_name, value.status_name, priority, value.created_at)
                rows.push(result);
            })
        }
        return (<Grid container className={classes.root}>
            <Grid item xs={12}>
                <Paper className={classes.paper + ' tableminheight'}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            {/* <Fab
                                variant="extended"
                                color="primary"
                                aria-label="add-asset"
                                size="small"
                                className={classes.fab}
                                href={"../../workorders/create/" + enums.createWorkOrderType[1].id}
                            >
                                <AddOutlined />
                                <Typography className={classes.buttonText}>Create Work Order</Typography>
                            </Fab> */}
                        </Grid>
                        <Grid item xs={5}></Grid>
                        <Grid className="text_r" item xs={3}>
                            <TextField
                                className={classes.searchInput}
                                id="workOrderSearchInput"
                                fullWidth={true}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment className="pointerCursor"  position="end"  onClick={e=>{this.clearSearch(e)}}>
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
                            <Table  onWheel={(e) => {
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
                                            <TableCell colSpan="6" className={classes.tableCell + ' Pendingtbl-no-datafound'}> No data found</TableCell>
                                        </TableRow>
                                        {/* <div className="dashboard_center">No data found</div> */}
                                    </TableBody>
                                    :
                                    <TableBody>
                                        {rows.slice(this.state.page * this.state.rowsPerPage,this.state.page * this.state.rowsPerPage +this.state.rowsPerPage).map((tableRow, key) => {
                                            return (
                                                <TableRow key={key}>
                                                    <TableCell className={classes.tableCell} width="25%">{tableRow.workOrderName ? tableRow.workOrderName : '-'}</TableCell>
                                                    <TableCell className={classes.tableCell} width="25%">{tableRow.assetName ? tableRow.assetName : '-'}</TableCell>
                                                    <TableCell className={classes.tableCell} width="10%">{tableRow.status ? tableRow.status : '-'}</TableCell>
                                                    <TableCell className={classes.tableCell} width="10%">{tableRow.priority ? tableRow.priority : '-'}</TableCell>
                                                    <TableCell className={classes.tableCell} width="20%">{tableRow.workOrderRequestDateTime ?
                                                        // moment.utc(tableRow.workOrderRequestDateTime).local().format('MM-DD-YYYY hh:mm:ss a')
                                                        momenttimezone.utc(tableRow.workOrderRequestDateTime).tz("America/Los_Angeles").format('MM-DD-YYYY hh:mm:ss a')
                                                        : '-'}</TableCell>
                                                    <TableCell width="10%">
                                                        <Grid container alignItems="center">
                                                            <Tooltip title="View" placement="top">
                                                                <IconButton component={Link} size="small" to={"workorders/details/" + tableRow.id}>
                                                                    <VisibilityOutlinedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                    </TableCell>
                                                </TableRow>)
                                        })}
                                    </TableBody>
                                }
                            </Table>
                            {_.isEmpty(rows) ?'':
								<TablePagination
								    rowsPerPageOptions={[20,40,60,80,100]}
									component="div"
									count={this.props.listsize}
									rowsPerPage={this.state.rowsPerPage}
									page={this.state.page}
									onChangePage={this.handleChangePage}
									onChangeRowsPerPage={this.handleChangeRowsPerPage}
								/>
								}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <SnackbarAlert tostMsg={this.state.tostMsg}/>
        </Grid>)
    }
}
function mapState(state) {
    if (state.workOrderListReducer) {
        if (self) {
            console.log("state.workOrderListReducer.isDataNoFound ---------",state.workOrderListReducer.isDataNoFound)
            self.setState({ isDataNotFound: state.workOrderListReducer.isDataNoFound })
           
            if(!_.isEmpty(state.workOrderListReducer.tostMsg)){
                self.setState({tostMsg:state.workOrderListReducer.tostMsg})
            }
        }
    }
    return state.workOrderListReducer
}

const actionCreators = {
    workOrderList: workOrderListAction,
    workOrderSearchList: workOrderSearchAction
};

WorkOrderList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(WorkOrderList));
