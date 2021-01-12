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
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddOutlined from '@material-ui/icons/AddOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import assetListAction from '../../Actions/Assets/assetListAction';
import { connect } from "react-redux";
import enums from "../../Constants/enums";
import _ from 'lodash';
import $ from 'jquery';
import PropTypes, { func } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import generateBarcodeAction from "../../Actions/Assets/generateBarcodeAction";
import assetSearchListAction from "../../Actions/Search/assetSearchAction";
import updateAssetStatusAction from "../../Actions/Assets/updateAssetStatusAction";
import TablePagination from '@material-ui/core/TablePagination';
import debounce from "lodash.debounce";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SnackbarAlert from "../../Snackbar/SnackbarAlert";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import FilterListIcon from '@material-ui/icons/FilterList';

var self;
let classes;

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

	backgroundColor: theme.palette.background.paper,
});

const options = [
	'',
	'All',
	'Active',
	'Inactive',

];

class AssetList extends React.Component {
	constructor() {
		super();
		self = this;
		var loginData = localStorage.getItem('loginData');
		this.state = {
			loginData: JSON.parse(loginData),
			assetList: [],
			isDownloadBarcode: false,
			selectAll: false,
			chkbox: {},
			searchString: null,
			searchStringOnEnter: false,
			pageIndex: 1,
			pageSize: 20,
			isDataNotFound: false,
			page: 0, rowsPerPage: 20,
			tostMsg: {},
			status: enums.assetFilterStatus[1].id,
			anchorEl: null,
			selectedIndex: 1
		};
		this.handleChkboxChange = this.handleChkboxChange.bind(this);
		this.handlePrintBarcode = this.handlePrintBarcode.bind(this);
		this.handleSearchOnKeyDown = this.handleSearchOnKeyDown.bind(this);
		this.handleSearchOnChnage = this.handleSearchOnChnage.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
	}
	componentDidMount() {

		setTimeout(function () {
			// if (_.get(this, ['props', 'assetListReducer', 'assetList'], []).length == 0) {
			$('#pageLoading').show();
			var urlParameters = this.state.loginData.uuid +"/"+this.state.status +"/" + this.state.rowsPerPage + "/" + this.state.pageIndex
			this.props.assetList(urlParameters, this.state.pageIndex);
			// }
		}.bind(this), 200);
		window.addEventListener('scroll', this.handleScroll);

		if (_.get(this, ['props', 'assetListReducer', 'isDataNoFound'])) {
			this.setState({ isDataNotFound: _.get(this, ['props', 'assetListReducer', 'isDataNoFound']) })
		}

	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll =
		debounce(() => {
			var searchString = $('#assetSearchInput').val();
			if (
				window.innerHeight + document.documentElement.scrollTop
				=== document.documentElement.offsetHeight ||
				$(window).height() > $("body").height()
			) {
				// if (searchString) {
				// 	this.setState(
				// 		{ pageIndex: this.state.pageIndex + 1 },
				// 		() => {
				// 			var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString) + "/" + this.state.pageSize + "/" + this.state.pageIndex

				// 			if (this.state.isDataNotFound) {
				// 			} else {
				// 				$('#pageLoading').show();
				// 			this.props.assetSearchList(urlParameters,this.state.pageIndex);
				// 			}
				// 		});

				// } else {

				// 	this.setState(
				// 		{ pageIndex: this.state.pageIndex + 1 },
				// 		() => {
				// 			var urlParameters = this.state.loginData.uuid + "/" + this.state.pageSize + "/" + this.state.pageIndex
				// 			if (this.state.isDataNotFound) {
				// 			} else {
				// 				$('#pageLoading').show();
				// 				this.props.assetList(urlParameters,this.state.pageIndex);
				// 			}
				// 		});
				// }
			}
		}, 1000);

	handleDownloadBarcode = () => {
		this.setState({ isDownloadBarcode: !this.state.isDownloadBarcode })
	}
	handleSelectAllChkboxChange = (assetList) => {
		this.setState({ assetList: assetList })
		if (!this.state.selectAll) {

			var allChkBox = {}
			assetList.map((value, key) => {
				allChkBox[value.assetID] = "true"
			})

			this.setState({ selectAll: "true" })
		} else {

			var allChkBox = {}
			assetList.map((value, key) => {
				allChkBox[value.assetID] = false
			})

			this.setState({ selectAll: false })
		}

		this.setState({ chkbox: allChkBox });
	}
	handleChkboxChange = (e, assetList) => {

		var chkBoxObj = this.state.chkbox;
		if (e.target.checked) {
			chkBoxObj[e.target.id] = "true";
		} else {
			chkBoxObj[e.target.id] = false;
		}
		this.setState({ chkbox: chkBoxObj });

		var chkBoxArr = _.toArray(chkBoxObj);

		var selectAssetCnt = _.filter(chkBoxArr, function (value) { if (value == "true") return value }).length;

		if (selectAssetCnt == assetList.length) {

			this.setState({ selectAll: "true" })
		} else {
			this.setState({ selectAll: false })
		}

	}
	handlePrintBarcode = () => {
		this.setState({ tostMsg: {} })
		setTimeout(() => {
			var selectedAssetList = [];
			_.map(this.state.chkbox, function (value, key) {
				if (value == "true") {
					selectedAssetList.push(key)
				}
			});
			if (selectedAssetList.length == 0) {

				var tostMsg = this.state.tostMsg
				tostMsg.msg = enums.resMessages.selectAsset
				tostMsg.type = enums.toastMsgType[1].id
				this.setState({ tostMsg: tostMsg })
				this.forceUpdate();
				// alert.errorMessage();
			} else {
				$('#pageLoading').show();
				var requestData = {
					"assetList": selectedAssetList
				}
				console.log("requestData--------------", requestData);
				this.props.generateBarcode(requestData);
			}
		}, 100);

	}

	handleSearchOnChnage = (e) => {
		this.setState({ searchString: e.target.value })
		if (e.target.value == '') {
			this.setState(
				{ pageIndex: 1, page: 0 },
				() => {
					var urlParameters = this.state.loginData.uuid +"/"+this.state.status + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
					$('#pageLoading').show();
					this.props.assetList(urlParameters, this.state.pageIndex);
				});
		}
	}
	handleSearchOnKeyDown = (e) => {
		var searchString = $('#assetSearchInput').val();
		searchString = searchString.trim()
		if (e.key === 'Enter') {
			this.setState({ searchString: searchString, searchStringOnEnter: true })
			if (searchString) {
				this.setState(
					{ pageIndex: 1, page: 0 },
					() => {
						var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString)+"/"+this.state.status  + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
						$('#pageLoading').show();
						this.props.assetSearchList(urlParameters, this.state.pageIndex);

					});
			} else {
				this.setState(
					{ pageIndex: 1, page: 0 },
					() => {
						var urlParameters = this.state.loginData.uuid+"/"+this.state.status  + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
						$('#pageLoading').show();
						this.props.assetList(urlParameters, this.state.pageIndex);
					});
			}
		}
	}
	// Pagination Code Start
	handleChangePage = (event, newPage) => {
		this.setState({ page: newPage });
		var searchString = $('#assetSearchInput').val();
		searchString = searchString.trim()
		if (searchString && this.state.searchStringOnEnter) {
			this.setState(
				{ pageIndex: this.state.pageIndex + 1 },
				() => {
					var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString)+"/"+this.state.status  + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex

					if (this.state.isDataNotFound) {
					} else {
						$('#pageLoading').show();
						this.props.assetSearchList(urlParameters, this.state.pageIndex);
					}
				});

		} else {

			this.setState(
				{ pageIndex: this.state.pageIndex + 1 },
				() => {
					var urlParameters = this.state.loginData.uuid+"/"+this.state.status  + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
					if (this.state.isDataNotFound) {
					} else {
						$('#pageLoading').show();
						this.props.assetList(urlParameters, this.state.pageIndex);
					}
				});
		}
	};
	handleChangeRowsPerPage = event => {
		console.log("chnage row per page----------------", event.target.value, parseInt(event.target.value, 10));
		this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 })
		if (this.props.assetListReducer.assetList.length <= parseInt(event.target.value, 10)) {
			if (this.props.assetListReducer.assetList.length != this.props.assetListReducer.listsize) {
				var searchString = $('#assetSearchInput').val();
				searchString = searchString.trim()
				if (searchString && this.state.searchStringOnEnter) {
					this.setState(
						{ pageIndex: 1 },
						() => {
							var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString)+"/"+this.state.status  + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
							$('#pageLoading').show();
							this.props.assetSearchList(urlParameters, this.state.pageIndex);

						});
				} else {
					this.setState(
						{ pageIndex: 1 },
						() => {
							var urlParameters = this.state.loginData.uuid +"/"+this.state.status + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
							$('#pageLoading').show();
							this.props.assetList(urlParameters, this.state.pageIndex);
						});
				}
			}
		}
	};
	// Pagination Code End  

	clearSearch(e) {
		var searchString = $('#assetSearchInput').val();
		searchString = searchString.trim()
		if (searchString && this.state.searchStringOnEnter) {
			console.log("this.handle clear search");
			$('#assetSearchInput').val('');
			searchString = ''
			this.setState(
				{ pageIndex: 1, page: 0, searchString: null, searchStringOnEnter: false },
				() => {
					var urlParameters = this.state.loginData.uuid+"/"+this.state.status  + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
					$('#pageLoading').show();
					this.props.assetList(urlParameters, this.state.pageIndex);
				});
		}
		else {
			this.setState({ searchString: '', searchStringOnEnter: false })
		}
	}

	hanndleUpdateAssetStatus = (e, tablerow) => {
		console.log("handle update asset status call", tablerow);
		var requestdata = {
			"asset_id": tablerow.assetID,
			"status": (tablerow.statusId == enums.assetStatus[0].id ? enums.assetStatus[1].id : enums.assetStatus[0].id),
			"updatedby": this.state.loginData.uuid
		}
		$('#pageLoading').show();
		this.props.updateAssetStatusAction(requestdata)
	}

	handleStatusChnage = (e,status) => {
		this.setState({ status: status, pageIndex: 1, page: 0},()=>{
		
			var searchString = $('#assetSearchInput').val();
			searchString = searchString.trim()
			if (searchString && this.state.searchStringOnEnter) {
				var urlParameters = this.state.loginData.uuid + "/" + encodeURI(searchString)+"/"+this.state.status  + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
				$('#pageLoading').show();
				this.props.assetSearchList(urlParameters, this.state.pageIndex);
			}else{
				var urlParameters = this.state.loginData.uuid +"/"+status +"/" + this.state.rowsPerPage + "/" + this.state.pageIndex
				$('#pageLoading').show();
				this.props.assetList(urlParameters, this.state.pageIndex);
			}
		
		});

	

		this.setState({ anchorEl: null });
	}

	handleClick = (event) => {
		this.setState({ anchorEl: event.currentTarget })
	};

	handleClose = () => {
		this.setState({ anchorEl: null })

	};

	render() {
		console.log("Asset list component ======================", this.props);
		console.log("toast msg------------", this.state.tostMsg);
		let searchString = (this.state.searchString != null ? this.state.searchString : decodeURI(_.get(this, ['props', 'assetListReducer', 'searchString'], '')))
		const { classes } = this.props;

		var rows = []

		var headCells = [
			{ id: 'name', numeric: false, disablePadding: false, label: 'Asset Name' },
			{ id: 'company', numeric: false, disablePadding: false, label: 'Company' },
			{ id: 'category', numeric: false, disablePadding: false, label: 'Model' },
			{ id: 'modelYear', numeric: false, disablePadding: false, label: 'Model Year' },
			{ id: 'site', numeric: false, disablePadding: false, label: 'Site Name' },
			{ id: 'status', numeric: false, disablePadding: false, label: 'Status' },
			// { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
		];

		if (localStorage.getItem('roleName') == enums.userRoles[0].role) {
			headCells.push({ id: 'actions', numeric: false, disablePadding: false, label: 'Actions' })
		}

		const createData = (id, name, company, category, modelYear, site, status, statusId, assetID) => {
			return { id, name, company, category, modelYear, site, status, statusId, assetID };
		}

		if (_.isEmpty(this.props.assetListReducer.assetList)) {

		} else {
			rows = [];
			this.props.assetListReducer.assetList.map((value, key) => {

				var result = createData(value.asset_id, value.name, value.company_name, value.asset_type, value.model_year, value.site_name, value.status_name, value.status, value.asset_id)
				rows.push(result);
			})
		}

		let statusName =' Status - All'
		if(this.state.status == enums.assetFilterStatus[0].id){
			statusName = ' Status - All'
		}else if(this.state.status == enums.assetFilterStatus[1].id){
			statusName = 'Status - Active'
		}else if(this.state.status == enums.assetFilterStatus[2].id){
			statusName = 'Status - Inactive'
		}
		return (
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
									// className={classes.fab}
									onClick={this.handleDownloadBarcode}
								>
									<ArrowDownwardOutlinedIcon />
									<Typography className={classes.buttonText}>Download Barcode</Typography>
								</Fab>
								{localStorage.getItem('roleName') == enums.userRoles[1].role ?
									<Fab
										variant="extended"
										color="primary"
										aria-label="add-asset"
										size="small"
										// className={classes.fab}
										href="/assets/upload"
									>
										<AddOutlined />
										<Typography className={classes.buttonText}>Upload Asset</Typography>
									</Fab>
									: ''}
							 <Divider orientation="vertical" variant="middle" className="verticle-divider"/>
								<Button 
									// color="primary"
									variant="contained"
									aria-controls="status-menu" 
									aria-haspopup="true" 
									className="dropdown-icon"
									onClick={this.handleClick}>
									<FilterListIcon />
										<Typography className={classes.buttonText}>{statusName}</Typography>
									
                </Button>
								<Menu
									id="status-menu"
									className="status-menu"
									anchorEl={this.state.anchorEl}
									keepMounted
									open={Boolean(this.state.anchorEl)}
									onClose={this.handleClose}
								>
									<MenuItem 
								   	onClick={(e)=>{this.handleStatusChnage(e,enums.assetFilterStatus[0].id)}}
										selected={this.state.status == enums.assetFilterStatus[0].id}
										className="status-txt"
									> 
									All
									</MenuItem>
									<MenuItem 
										onClick={(e)=>{this.handleStatusChnage(e,enums.assetFilterStatus[1].id)}}
										selected={this.state.status == enums.assetFilterStatus[1].id}
										className="status-txt"
									>
										Active
									</MenuItem>
									<MenuItem 
										onClick={(e)=>{this.handleStatusChnage(e,enums.assetFilterStatus[2].id)}}
										selected={this.state.status == enums.assetFilterStatus[2].id}
										className="status-txt"
									>
									Inactive
									</MenuItem>
								</Menu>
							
								{/* } */}
							</Grid>
							<Grid item xs={5}>

								
								{/* </div> */}
							</Grid>
							<Grid className="text_r" item xs={3}>
								<TextField
									className={classes.searchInput}
									id="assetSearchInput"
									fullWidth={true}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchOutlined color="primary" />
											</InputAdornment>
										),

										endAdornment: (
											<InputAdornment className="pointerCursor" position="end" onClick={e => { this.clearSearch(e) }}>
												{this.state.searchString ? <CloseOutlinedIcon color="primary" fontSize="small" /> : ''}
											</InputAdornment>
										),
									}}
									value={searchString}
									onChange={(e) => { this.handleSearchOnChnage(e) }}
									onKeyDown={(e) => { this.handleSearchOnKeyDown(e) }}
								/>
							</Grid>

							<Grid item xs={12}>
								<Table onWheel={(e) => {
									this.handleScroll();
								}}
									size="small" stickyHeader={true} >
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
														onChange={(e) => this.handleSelectAllChkboxChange(rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage))}
													/>

												</TableCell> : ''}

											{headCells.map((headCell, key) => {
												return (
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
									{/* <TableBody>
										<div className="dashboard_center">No data found..</div>
									</TableBody> */}
									{_.isEmpty(rows) ?
										<TableBody>
											<TableRow>
												<TableCell colSpan="7" className={classes.tableCell + ' Pendingtbl-no-datafound'}> No data found</TableCell>
											</TableRow>
											{/* <div className="dashboard_center">No data found</div> */}
										</TableBody>
										:
										<TableBody >

											{rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((tableRow, key) => {
												return (

													<TableRow key={key} className={tableRow.status == enums.assetStatus[0].status ? '' : 'inactive-bg'}>
														{this.state.isDownloadBarcode ?
															<TableCell className={classes.tableCell}>
																<Checkbox
																	id={tableRow.assetID}
																	name={tableRow.assetID}
																	color="primary"
																	value="chkBox"
																	// checked="true"
																	checked={(this.state.chkbox[tableRow.assetID] == "true" ? true : false)}
																	onChange={(e) => this.handleChkboxChange(e, rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage))}
																/>

															</TableCell> : ''}
														<TableCell className={classes.tableCell}>{tableRow.name ? tableRow.name : '-'}</TableCell>
														<TableCell className={classes.tableCell}>{tableRow.company ? tableRow.company : '-'}</TableCell>
														<TableCell className={classes.tableCell}>{tableRow.category ? tableRow.category : '-'}</TableCell>
														<TableCell className={classes.tableCell}>{tableRow.modelYear ? tableRow.modelYear : '-'}</TableCell>
														<TableCell className={classes.tableCell}>{tableRow.site ? tableRow.site : '-'}</TableCell>
														<TableCell className={classes.tableCell}>{tableRow.status ? tableRow.status : '-'}</TableCell>
														{localStorage.getItem('roleName') == enums.userRoles[0].role ?
															<TableCell>
																<Grid container alignItems="center" className="asset-status-icon">
																	<Tooltip title="View" placement="top">
																		<IconButton component={Link} size="small" to={"assets/details/" + tableRow.id}>
																			<VisibilityOutlinedIcon fontSize="small" />
																		</IconButton>
																	</Tooltip>
																	{/* <Tooltip  title={tableRow.statusId==enums.assetStatus[0].id?enums.assetStatus[0].status:enums.assetStatus[1].status} placement="top">
                                                                <IconButton component={Link} size="small" onClick={(e)=>{this.hanndleUpdateAssetStatus(e,tableRow)}}>
                                                                   
                                                                    {tableRow.statusId==enums.assetStatus[0].id?
                                          ;                              <AppsOutlined fontSize="small" color="primary"/>
                                                                      :  <AppsOutlined fontSize="small" /> }
                                                                </IconButton>
                                                            </Tooltip> */}
																</Grid>
															</TableCell> : ''}
													</TableRow>)
											})}
										</TableBody>
									}
								</Table>
								{_.isEmpty(rows) ? '' :
									<TablePagination
										rowsPerPageOptions={[20, 40, 60, 80, 100]}
										component="div"
										count={this.props.assetListReducer.listsize}
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
				{_.isEmpty(this.state.tostMsg) ? '' : <SnackbarAlert tostMsg={this.state.tostMsg} />}

			</Grid>
		);
	}
};
function mapState(state) {
	if (state.assetListReducer) {
		if (self) {
			console.log("in self-    ---", state.assetListReducer.tostMsg);
			self.setState({ isDataNotFound: state.assetListReducer.isDataNoFound, tostMsg: state.assetListReducer.tostMsg })
			if (!_.isEmpty(state.assetListReducer.tostMsg)) {
				self.setState({ tostMsg: state.assetListReducer.tostMsg })
			}
		}
	}
	if (state.generateBarcodeReducer) {
		if (state.generateBarcodeReducer.loading) {
		} else {
			if (self) {
				self.setState({ selectAll: false, chkbox: {} });
				if (!_.isEmpty(state.generateBarcodeReducer.tostMsg)) {
					self.setState({ tostMsg: state.generateBarcodeReducer.tostMsg })
				}
			}
		}
	}
	return state
}

const actionCreators = {
	assetList: assetListAction,
	generateBarcode: generateBarcodeAction,
	assetSearchList: assetSearchListAction,
	updateAssetStatusAction: updateAssetStatusAction
};

AssetList.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapState, actionCreators)(withStyles(styles)(AssetList));
