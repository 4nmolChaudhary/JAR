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
import _ from 'lodash';
import enums from '../../../Constants/enums';
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import $ from 'jquery'
class WorkOrderList extends React.Component {
	constructor() {
		super();
		var loginData = localStorage.getItem('loginData');

		this.state = {
			loginData: JSON.parse(loginData),
			searchString: '',
			workOrderRowPerPage:20

		}
		this.handleSearchOnKeyDown = this.handleSearchOnKeyDown.bind(this);
		this.handleSearchOnChnage = this.handleSearchOnChnage.bind(this);
		this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
	}
	handleSearchOnChnage = (e) => {
		this.setState({ searchString: e.target.value })
		if(e.target.value==''){
			e.key = 'Enter'
			this.props.handleWorkOrderSearchOnKeyDown(e, this.state.searchString)
		}
	}
	handleSearchOnKeyDown = (e) => {
		this.props.handleWorkOrderSearchOnKeyDown(e, this.state.searchString)

	}
	handleLoadMoreData =(e)=>{
		this.props.handleSearchWorkOrderLoadMore(e,this.state.searchString)
	}
	handleChangeRowsPerPage = event => {
		this.setState({workOrderRowPerPage:parseInt(event.target.value, 10)})
		this.props.handleWorkOrderlistChangeRowsPerPage(parseInt(event.target.value, 10))
	 };
	 clearSearch(e){
	
			var searchString = $('#workOrderSearchInput').val();

				this.props.clearSearchWorkorderList(e,searchString);
				this.setState({searchString:''})
	}

	render() {
		let workorderlist = _.get(this, ['props', 'workOrderList'], []);
		console.log('workorderlist-----------------', this.props);
		var rows = [];
		const headCells = [
			{ id: 'workOrderTitle', numeric: false, disablePadding: false, label: 'Work Order Title' },
			{ id: 'status', numeric: false, disablePadding: false, label: 'Status' },
			{ id: 'priority', numeric: false, disablePadding: false, label: 'Priority' },
			{ id: 'Action', numeric: false, disablePadding: false, label: 'Action' }
		];
		const createData = (id, workOrderTitle, status, priority, Action) => {
			return { id, workOrderTitle, status, priority, Action };
		}
		const classes = {
			searchInput: {
				fontSize: '8px'
			}
		}
		
		if(!_.isEmpty(workorderlist)){
			workorderlist.map((value, key) => {
				var priority = null;
				enums.priority.map((value1, key1) => {
					if (value1.id == value.priority) {
						priority = value1.priority
					}
				})
				var result = createData(value.work_order_uuid, value.name, value.status_name, priority)
				rows.push(result);
			})
		}
		return (
			<div>
				<div className="tbl-spc pos-r tableminheight" id="no-more-tables">

					<Grid>
						<Grid className="inspection-data-search ">
							<Grid className="apply-grid-input-search searchbartable">
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
											<InputAdornment className="pointerCursor" position="end"  onClick={e=>{this.clearSearch(e)}}>
										  {this.state.searchString?	<CloseOutlinedIcon color="primary" fontSize="small" />:''}	
											</InputAdornment>
										),
									}}
									value={this.state.searchString}
									onChange={(e) => { this.handleSearchOnChnage(e) }}
									onKeyDown={(e) => { this.handleSearchOnKeyDown(e) }}
								/>
							</Grid>
						</Grid>
						<Table className="col-md-12 table-bordered table-striped table-condensed cf mangepadding ">
							<TableHead className="cf ">
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
							{workorderlist.length > 0 ?
							<TableBody>
								
								{rows.slice(this.props.workorderPage * this.state.workOrderRowPerPage,this.props.workorderPage * this.state.workOrderRowPerPage +this.state.workOrderRowPerPage).map((tableRow, key) => {
									return (
										<TableRow key={key}>
											<TableCell width="40%">{tableRow.workOrderTitle}</TableCell>
											<TableCell width="20%">{tableRow.status}</TableCell>
											<TableCell width="20%">{tableRow.priority}</TableCell>
											<TableCell width="10%">
												<Grid container alignItems="center">
													<Tooltip title="Workorder View" placement="top">
														<Link to={"../../workorders/details/" + tableRow.id}>
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
										<div style={{"marginTop": "100%"}} >No data found</div>
									</Grid>
								</TableBody>
								}
						</Table>
						{_.isEmpty(rows) ?'':
								<TablePagination
								    rowsPerPageOptions={[20,40,60,80,100]}
									component="div"
									count={this.props.size}
									rowsPerPage={this.state.workOrderRowPerPage}
									page={this.props.workorderPage}
									onChangePage={this.props.handleWorkOrderlistChangePage}
									onChangeRowsPerPage={this.handleChangeRowsPerPage}
								/>
								}
						{/* {this.props.isWorkOrderDataNotFound?'':
							<Grid className="text_c">
						{(workorderlist.length  < this.props.size) && (workorderlist.length!=0) ?<Button variant="contained" color="primary" className="assets-bottons" onClick={(e)=>this.handleLoadMoreData()}>Load More Data</Button>:''}
						</Grid>
						} */}
					</Grid>
				</div>
			</div>
		)
	}
}
function mapState(state) {
	if (state.assetDetailReducer) {
		return state.assetDetailReducer.assetDetail
	}
	return state
}

export default connect(mapState)(WorkOrderList)