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
import userListAction from "../../Actions/User/userListAction";
import workOrderSearchAction from "../../Actions/Search/workOrderSearchAction";
import { style } from '@material-ui/system';
import enums from "../../Constants/enums";
import moment from 'moment';
import debounce from "lodash.debounce";
import getUserRolesAction from "../../Actions/User/getUserRolesAction";
import getAllCompanyAction from "../../Actions/getAllCompanyAction";
import TablePagination from '@material-ui/core/TablePagination';
import updateUserStatusAction from "../../Actions/User/updateUserStatusAction";
import searchInuserListAction from "../../Actions/Search/searchInuserListAction";
import userActive from "../../Content/images/userActive.svg";
import userDective from "../../Content/images/userInActive.svg";
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { alert } from '../alertMessage'
import generateBarcodeUserAction  from "../../Actions/User/generateBarcodeUserAction";
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

var currentpage = 0;
var isDataNotFound = false;

class UserList extends React.Component {
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
            userList: [],
			isDownloadBarcode: false,
			selectAll: false,
			chkbox: {},tostMsg:{}
        }
        this.handleSearchOnChnage = this.handleSearchOnChnage.bind(this);
        this.handleSearchOnKeyDown = this.handleSearchOnKeyDown.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChkboxChange = this.handleChkboxChange.bind(this);
        this.handlePrintBarcode = this.handlePrintBarcode.bind(this);
    }
    componentDidMount() {
        setTimeout(function () {
            // if (_.get(this, ['props','userReducer' ,'userList'], []).length == 0) {
                $('#pageLoading').show();
                var urlParameters = this.state.loginData.uuid + "/" +enums.userStatus[2].id+"/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                this.props.userListAction(urlParameters,this.state.pageIndex);
                this.props.getUserRolesAction(this.state.loginData.uuid);
                if (localStorage.getItem('roleName') == enums.userRoles[1].role) {
                    this.props.getAllCompany();
                    }
        
            // }
        }.bind(this), 200);
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleSearchOnChnage = (e) => {
        this.setState({ searchString: e.target.value })
        if(e.target.value==''){
            currentpage = 0
            this.setState(
                { pageIndex: 1 ,page:0},
                () => {
                    $('#pageLoading').show();
                    var urlParameters = this.state.loginData.uuid + "/" + enums.userStatus[2].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    this.props.userListAction(urlParameters, this.state.pageIndex);
                    
                });
        }
    }
    handleSearchOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            var searchString = $('#userSearchInput').val();
            searchString =searchString.trim()

            if (searchString) {
                this.setState(
                    { pageIndex: 1 ,searchString:searchString ,page:0,searchStringOnEnter:true},
                    () => {
                        $('#pageLoading').show();
                        var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                        this.props.searchInuserListAction(urlParameters, this.state.pageIndex);
                        
                    });

            } else {
                this.setState(
                    {pageIndex: 1 ,searchString:searchString ,page:0},
                    () => {
                        $('#pageLoading').show();
                        var urlParameters = this.state.loginData.uuid + "/" + enums.userStatus[2].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                        this.props.userListAction(urlParameters, this.state.pageIndex);
                        
                    });
            }
        }
    }
    // Pagination Code Start
    handleChangePage = (event, newPage) => {
        console.log("handle chnage----------",newPage);
        console.log("isDataNotFound",isDataNotFound);
        currentpage = newPage;
        this.setState({ page: newPage });
        var searchString = $('#userSearchInput').val();
        searchString =searchString.trim()
        if (searchString && this.state.searchStringOnEnter) {
            this.setState(
                { pageIndex: this.state.pageIndex + 1 },
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex

                    if (isDataNotFound) {
                    } else {
                        $('#pageLoading').show();
                        this.props.searchInuserListAction(urlParameters, this.state.pageIndex);
                    }
                });

        } else {

            this.setState(
                { pageIndex: this.state.pageIndex + 1 },
                () => {
                    var urlParameters = this.state.loginData.uuid + "/" +enums.userStatus[2].id+"/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    if (isDataNotFound) {
                    } else {
                        $('#pageLoading').show();
                        this.props.userListAction(urlParameters,this.state.pageIndex);
                    }
                });
        }
    };
    handleChangeRowsPerPage = event => {
        
        this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 })
        
        if (this.props.userReducer.userList.length <= parseInt(event.target.value, 10)) {
            if(this.props.userReducer.userList.length != this.props.userReducer.listsize){
                var searchString = $('#userSearchInput').val();
                searchString =searchString.trim()
                if (searchString && this.state.searchStringOnEnter) {
                    this.setState(
                        { pageIndex: 1 },
                        () => {
                            var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                            $('#pageLoading').show();
                            this.props.searchInuserListAction(urlParameters, this.state.pageIndex);

                        });
                } else {
                    this.setState(
                        { pageIndex: 1 },
                        () => {
                            $('#pageLoading').show();
                            var urlParameters = this.state.loginData.uuid + "/" + enums.userStatus[2].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                            this.props.userListAction(urlParameters, this.state.pageIndex);
                        });
                }
            }
        }
    };
    // Pagination Code End

    hanndleUpdateUserStatus = (e,userData) => {
        console.log('userData------',userData);
        var requestData={
            "userid":userData.id,
            "status":(userData.statusId==enums.userStatus[0].id?parseInt(enums.userStatus[1].id):parseInt(enums.userStatus[0].id)),
            "updatedby": this.state.loginData.uuid
        }
        console.log("requestData------------", requestData);
        $('#pageLoading').show();
        this.props.updateUserStatusAction(requestData);
    }

    // download user barcode code start
    handleDownloadBarcode = () => {
		this.setState({ isDownloadBarcode: !this.state.isDownloadBarcode })
    }
    handleSelectAllChkboxChange = (userList) => {
		this.setState({ userList: userList })
		if (!this.state.selectAll) {

			var allChkBox = {}
			userList.map((value, key) => {
				allChkBox[value.id] = "true"
			})

			this.setState({ selectAll: "true" })
		} else {

			var allChkBox = {}
			userList.map((value, key) => {
				allChkBox[value.id] = false
			})

			this.setState({ selectAll: false })
		}

		this.setState({ chkbox: allChkBox });
    }
    handleChkboxChange = (e, userList) => {

		var chkBoxObj = this.state.chkbox;
		if (e.target.checked) {
			chkBoxObj[e.target.id] = "true";
		} else {
			chkBoxObj[e.target.id] = false;
		}
		this.setState({ chkbox: chkBoxObj });

		var chkBoxArr = _.toArray(chkBoxObj);

		var selectUserCnt = _.filter(chkBoxArr, function (value) { if (value == "true") return value }).length;

		if (selectUserCnt == userList.length) {

			this.setState({ selectAll: "true" })
		} else {
			this.setState({ selectAll: false })
		}

    }
    handlePrintBarcode = () => {
        this.setState({tostMsg:{}})
        setTimeout(() => {
            var selecteUserList = [];
            _.map(this.state.chkbox, function (value, key) {
                if (value == "true") {
                    selecteUserList.push(key)
                }
            });
            if (selecteUserList.length == 0) {
                var tostMsg = this.state.tostMsg
                tostMsg.msg=enums.resMessages.selectUser
                tostMsg.type = enums.toastMsgType[1].id
                this.setState({tostMsg:tostMsg})
                // alert.errorMessage(enums.resMessages.selectUser);
            } else {
                $('#pageLoading').show();
                var requestData = {
                    "userid": selecteUserList
                }
                console.log("request data----------------------");
                console.log(requestData);
                this.props.generateBarcodeUserAction(requestData);
            }   
        }, 100);
		
	}
    // download user barcode code end
    
    clearSearch(e){
        var searchString = $('#userSearchInput').val();
        searchString =searchString.trim()
        
        if (searchString && this.state.searchStringOnEnter) {
    
            console.log("this.handle clear search");
            
            $('#userSearchInput').val('');
            searchString=''
            
            this.setState(
                {pageIndex: 1 ,page:0,searchString: null,searchStringOnEnter:false},
                () => {
                    $('#pageLoading').show();
                    var urlParameters = this.state.loginData.uuid + "/" + enums.userStatus[2].id + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                    this.props.userListAction(urlParameters, this.state.pageIndex);
                    
                });
        }
        else{
            this.setState({searchString:''})
        }
    }
    
    render() {
        console.log("this.props.....................",this.props);
        console.log("all state value-------------------- ", this.state);
        
        let userlist = _.get(this, ['props','userReducer' ,'userList'], []);
        let searchString = (this.state.searchString!=null?this.state.searchString:decodeURI(_.get(this,['props','userReducer','searchString'],'')))
        var rows = [];
       
        const { classes } = this.props;
        const headCells = [
            { id: 'username', numeric: false, disablePadding: false, label: 'Username' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
            { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
            { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
            { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
        ];

        const createData = (id, username,name, status, email, role,statusId) => {
            return { id, username,name, status, email, role,statusId};
        }

        if (userlist.length > 0) {
            rows = [];
            userlist.map((value, key) => {
                var name = '-';
                if(value.firstname && value.lastname){
                    name = value.firstname +" "+ value.lastname
                }else if(value.firstname){
                    name = value.firstname
                }else if(value.lastname){
                    name = value.lastname
                }

                var result = createData(value.uuid, value.username,name,value.status_name ,value.email, value.role_name,value.status)
                rows.push(result);
            })
        }

        return (
            <div>
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                <Paper className={classes.paper + ' tableminheight'}>
                    <Grid container spacing={2}>
                   
                    <Grid item xs={4}>
                            <Fab
                                variant="extended"
                                color="primary"
                                aria-label="download-barcode"
                                size="small"
                                className={classes.fab}
                                onClick={this.handleDownloadBarcode}
                            >
                                <ArrowDownwardOutlinedIcon />
                                <Typography className={classes.buttonText}>Download Barcode</Typography>
                            </Fab>
                            <Fab
                                variant="extended"
                                color="primary"
                                aria-label="add-asset"
                                size="small"
                                className={classes.fab}
                                href={"../../users/create/"}
                            >
                                <AddOutlined />
                                <Typography className={classes.buttonText}>Create User</Typography>
                            </Fab>
                        </Grid>
                     
                       
                        <Grid item xs={5}></Grid>
                        <Grid className="text_r" item xs={3}>
                            <TextField
                                className={classes.searchInput}
                                id="userSearchInput"
                                fullWidth={true}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment className="pointerCursor" position="end"  onClick={e=>{this.clearSearch(e)}}>
                                           {this.state.searchString?<CloseOutlinedIcon color="primary" fontSize="small" />:''}	
                                        </InputAdornment>
                                    ),
                                }}
                                value={searchString}
                                onChange={(e) => { this.handleSearchOnChnage(e) }}
                                onKeyDown={(e) => { this.handleSearchOnKeyDown(e) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Table 
                             size="small" stickyHeader={true}>
                                <TableHead>
                                    <TableRow>
                                    {this.state.isDownloadBarcode ?
												<TableCell
													id="selectAllChkbox"
													align='left'
													padding='default'
												>

													<Checkbox
														color="primary"
														id="selectAll"
														name="selectAll"
														checked={(this.state.selectAll == "true" ? true : false)}
														onChange={(e) => this.handleSelectAllChkboxChange(rows.slice(this.state.page * this.state.rowsPerPage,this.state.page * this.state.rowsPerPage +this.state.rowsPerPage))}
													/>

												</TableCell> : ''}
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
                                                <TableCell colSpan="5" className={classes.tableCell + ' Pendingtbl-no-datafound'}> No data found</TableCell>
                                            </TableRow>
                                            {/* <div className="dashboard_center">No data found</div> */}
                                        </TableBody>
                                    :
                                    <TableBody>
                                        {rows.slice(this.state.page* this.state.rowsPerPage,this.state.page * this.state.rowsPerPage +this.state.rowsPerPage).map((tableRow, key) => {
                                            return (
                                                <TableRow key={key}>
                                                		{this.state.isDownloadBarcode ?
															<TableCell className={classes.tableCell}>
																<Checkbox
																	id={tableRow.id}
																	name={tableRow.id}
																	color="primary"
																	value="chkBox"
																	// checked="true"
																	checked={(this.state.chkbox[tableRow.id] == "true" ? true : false)}
																	onChange={(e) => this.handleChkboxChange(e, rows.slice(this.state.page * this.state.rowsPerPage,this.state.page * this.state.rowsPerPage +this.state.rowsPerPage))}
																/>

															</TableCell> : ''}
                                                    <TableCell className={classes.tableCell}>{tableRow.username ? tableRow.username : '-'}</TableCell>
                                                    <TableCell className={classes.tableCell}>{tableRow.name ? tableRow.name : '-'}</TableCell>
                                                    <TableCell className={classes.tableCell}>{tableRow.status ? tableRow.status : '-'}</TableCell>
                                                    <TableCell className={classes.tableCell}>{tableRow.email ? tableRow.email : '-'}</TableCell>
                                                    <TableCell className={classes.tableCell}>{tableRow.role ? tableRow.role : '-'}</TableCell>
                                                    <TableCell>
                                                        <Grid container alignItems="center">
                                                            <Tooltip title="View" placement="top">
                                                                <IconButton component={Link} size="small" to={"users/details/" + tableRow.id} disabled={tableRow.id==this.state.loginData.uuid?true:false}>
                                                                    <VisibilityOutlinedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            {/* <Tooltip title="Reset Password" placement="top">
                                                                <IconButton component={Link} size="small" to={"users/details/" + tableRow.id}>
                                                                    <VisibilityOutlinedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip> */}
                                                            <Tooltip title={tableRow.statusId==enums.userStatus[0].id?enums.userStatus[0].status:enums.userStatus[1].status} placement="top">
                                                                <IconButton component={Link} size="small" onClick={(e)=>{this.hanndleUpdateUserStatus(e,tableRow)}} disabled={tableRow.id==this.state.loginData.uuid?true:false}>
                                                                    {/* <VisibilityOutlinedIcon fontSize="small" /> */}
                                                                    {tableRow.statusId==enums.userStatus[0].id?
                                                                        <img src={userActive} width="16px" height="16px" fontSize="small"></img>
                                                                      : <img src={userDective} width="16px" height="16px" fontSize="small"></img> }
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
									count={this.props.userReducer.listsize}
									rowsPerPage={this.state.rowsPerPage}
									page={this.state.page}
									onChangePage={this.handleChangePage}
									onChangeRowsPerPage={this.handleChangeRowsPerPage}
								/>
								}
                        </Grid>
                        {this.state.isDownloadBarcode ?
								<Grid className="assets-buttons-part">
									<Button variant="contained" color="primary" className="assets-bottons float_r" onClick={this.handlePrintBarcode}>Print Barcode</Button>
								</Grid>
								: ''}
                    </Grid>
                </Paper>
            </Grid>
                          
        </Grid>
         <SnackbarAlert tostMsg={this.state.tostMsg}/> 
                            </div>)
    }
}
function mapState(state) {
    console.log("map state ===============",state);
    if (state.userReducer) {
        isDataNotFound=state.userReducer.isDataNoFound
        
        if (self) {
            if(!_.isEmpty(state.userReducer.tostMsg)){
                self.setState({tostMsg:state.userReducer.tostMsg})
            }
            if(!_.isEmpty(state.generateBarcodeUserReducer.tostMsg)){
                self.setState({tostMsg:state.generateBarcodeUserReducer.tostMsg})
            }
            // self.setState({ isDataNotFound: state.userReducer.isDataNoFound })
        }
    }
    if (state.generateBarcodeUserReducer) {
		if (state.generateBarcodeUserReducer.loading) {
		} else {
			if (self) {
                self.setState({ selectAll: false, chkbox: {} });
               
                if(!_.isEmpty(state.generateBarcodeUserReducer.tostMsg)){
                    self.setState({tostMsg:state.generateBarcodeUserReducer.tostMsg})
                }
			}
		}
	}
    return state
}

const actionCreators = {
    userListAction: userListAction,
    getUserRolesAction:getUserRolesAction,
    getAllCompany:getAllCompanyAction,
    updateUserStatusAction:updateUserStatusAction,
    searchInuserListAction: searchInuserListAction,
    generateBarcodeUserAction:generateBarcodeUserAction
};

UserList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(UserList));
