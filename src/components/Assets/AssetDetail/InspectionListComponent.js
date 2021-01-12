import React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { Link } from 'react-router-dom';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import _ from "lodash";
import moment from 'moment';
import momenttimezone from "moment-timezone";
import $ from 'jquery';
import { connect } from "react-redux";
import inspectionSearchListAction from "../../../Actions/Search/inspectionSearchByAssetIdAction";
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
class InspectionList extends React.Component{
	constructor(){
		super()
		var loginData = localStorage.getItem('loginData');
		
		this.state = {
			loginData: JSON.parse(loginData),
			searchString:'',searchStringOnEnter:false,
			inspectionRowPerPage:20
			
		}
		this.handleSearchOnKeyDown = this.handleSearchOnKeyDown.bind(this);
		this.handleSearchOnChnage = this.handleSearchOnChnage.bind(this);
		this.handleLoadMoreData = this.handleLoadMoreData.bind(this);
		this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
	}
	
	handleSearchOnChnage = (e) =>{
		this.setState({searchString:e.target.value})
		console.log(e.target);
		if(e.target.value==""){
			e.key = 'Enter'
			this.setState({searchStringOnEnter:true})
			this.props.handleSearchOnKeyDown(e,e.target.value)
		}
	}
	handleSearchOnKeyDown =(e)=>{
		this.props.handleSearchOnKeyDown(e,this.state.searchString)
	
	}
	handleLoadMoreData =(e)=>{
		this.props.handleSearchLoadMore(e,this.state.searchString)
	}
	handleChangeRowsPerPage = event => {
		
		this.setState({inspectionRowPerPage:parseInt(event.target.value, 10)})
		this.props.handleInspectionlistChangeRowsPerPage(parseInt(event.target.value, 10))
	 };
	 
	clearSearch(e){
		console.log("clear search-------------------",this.state.searchStringOnEnter);
			var searchString = $('#inspectionSearchInput').val();

				this.props.clearSearchInspectionList(e,searchString);
				this.setState({searchStringOnEnter:false,searchString:''})
	}

	render(){
		console.log("-----------------",this.props);
	
		let inspectionlist = _.get(this,['props','inspectionList'],[]);
		
		var rows = []
		const headCells = [
			{ id: 'inspectionDatetime', numeric: false, disablePadding: false, label: 'Inspection Datetime' },
			{ id: 'operator', numeric: false, disablePadding: false, label: 'Operator' },
			{ id: 'shiftN', numeric: false, disablePadding: false, label: 'Shift No' },
			{ id: 'meterReadir', numeric: false, disablePadding: false, label: 'Meter Reading' },
			{ id: 'Action', numeric: false, disablePadding: false, label: 'Action' }
		];
		const createData = (id, inspectionDatetime, operator, shiftN,meterReadir, Action) => {
			return { id, inspectionDatetime, operator, shiftN,meterReadir, Action };
		}
		const classes={
			searchInput: {
				fontSize: '8px'
			}
		}

		if(!_.isEmpty(inspectionlist)){
			inspectionlist.map((value, key) => {
				var result = createData(value.inspection_id, value.datetime_requested, value.operator_name, value.shift, value.meter_hours)
				rows.push(result);
			})
		}


		if(rows.length>0){
			rows =_.orderBy(rows, ['inspectionDatetime'], ['desc']);
			
		}
		 
		return(
			<div>

				<div className="tbl-spc pos-r tableminheight" id="no-more-tables">
				
						<Grid>
							<Grid className="inspection-data-search ">
								<Grid className="apply-grid-input-search searchbartable" >
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
												<InputAdornment className="pointerCursor" position="end"  onClick={e=>{this.clearSearch(e)}}>
											  {this.state.searchString?	<CloseOutlinedIcon color="primary" fontSize="small" />:''}	
												</InputAdornment>
											),
										}}
										value={this.state.searchString}
										onChange={(e)=>{this.handleSearchOnChnage(e)}}
										onKeyDown={(e)=>{this.handleSearchOnKeyDown(e)}}
									/>
								</Grid>
							</Grid>
							<Table className="col-md-12 table-bordered table-striped table-condensed cf mangepadding">
								<TableHead className="cf">
									<TableRow>
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
								{inspectionlist.length > 0 ?
								<TableBody>
									{rows.slice(this.props.inspectionPage * this.props.inspectionRowPerPage,this.props.inspectionPage * this.props.inspectionRowPerPage +this.props.inspectionRowPerPage).map((tableRow, key) => {
										return (
											<TableRow key={key}>
												<TableCell >
													 {tableRow.inspectionDatetime?
														moment.utc(tableRow.inspectionDatetime).local().format('MM-DD-YYYY hh:mm:ss a')
														// momenttimezone.utc(tableRow.inspectionDatetime).tz("America/Los_Angeles").format('MM-DD-YYYY hh:mm:ss a')
														:'-'}
													 </TableCell>
												<TableCell>{tableRow.operator?tableRow.operator:'-'}</TableCell>
												<TableCell >{tableRow.shiftN!=null?tableRow.shiftN:'-'}</TableCell>
												<TableCell >{tableRow.meterReadir!=null?tableRow.meterReadir:'-'}</TableCell>
												<TableCell>
													<Grid container alignItems="center">
														<Tooltip title="Inspection View" placement="top">
															<Link to={"../../inspections/details/" + tableRow.id}>
																<IconButton size="small">
																	<VisibilityOutlinedIcon fontSize="small" />
																</IconButton>
															</Link>
														</Tooltip>
													</Grid>
												</TableCell>
											</TableRow>)
									})}
								</TableBody>
									:
								<TableBody>
									<Grid className="no-data-center">
										<div style={{"marginTop": "100%"}}>No data found</div>
									</Grid>
								 </TableBody>

							}
						</Table>
						{_.isEmpty(rows) ?'':
								<TablePagination
								    rowsPerPageOptions={[20,40,60,80,100]}
									component="div"
									count={this.props.size}
									rowsPerPage={this.state.inspectionRowPerPage}
									page={this.props.inspectionPage}
									onChangePage={this.props.handleInspectionlistChangePage}
									onChangeRowsPerPage={this.handleChangeRowsPerPage}
								/>
								}
						{/* {this.props.isInspectionDataNotFound?'':
						<Grid className="text_c">
						{(inspectionlist.length < this.props.size)&&(inspectionlist.length !=0)?
						<Button style={{"margin":"8px 0"}} variant="contained" color="primary" className="assets-bottons" onClick={(e)=>this.handleLoadMoreData()}>Load More Data</Button>:''
						}
						</Grid>
						} */}
						</Grid>
						
				</div>
			
		</div>
		)
	}
}

export default InspectionList;