import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { display } from '@material-ui/system';
import { red } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from "react-redux";
import inspectionDetailAction from "../../Actions/Inspection/inspectionDetailAction";
import approveInspectionAction from "../../Actions/Inspection/approveInspectionAction";
import $ from 'jquery';
import _ from 'lodash';
import enums from "../../Constants/enums";
import {alert} from "../alertMessage";
import { useParams } from 'react-router-dom';
import moment from 'moment';
import momenttimezone from "moment-timezone";
import SnackbarAlert from "../../Snackbar/SnackbarAlert";
var self;
class InspectionDetails extends React.Component {
	constructor() {
		super();
		self=this;
		this.state={
			managerNotes:"",meterHours:null, formError: {}, errorMessage: {},loginData:{} ,  tostMsg:{}
		}
		this.handleOnChnage = this.handleOnChnage.bind(this);
	}
	handleOnChnage(e){
		const { formError, errorMessage } = this.state;
		const { name, value } = e.target;
		this.setState({ [name]: value });
		if (value != '' || value != null) {
            delete formError[name]
            delete errorMessage[name]
        }
        this.setState({ formError, errorMessage });
	}
	componentDidMount(){
		var loginData = localStorage.getItem('loginData');
		loginData = JSON.parse(loginData);
		this.setState({loginData:loginData})
		$('#pageLoading').show();
		this.props.inspectionDetailAction(this.props.inspectionId,loginData.uuid);
	}
	approveInspection=()=>{
	
	    var meterHours = (this.state.meterHours!=null?this.state.meterHours:_.get(this,['props','meter_hours'],''))
		var requestData = {
			"inspection_id": this.props.inspectionId,
			"asset_id":_.get(this,['props','asset','asset_id'],''),
			"manager_id":this.state.loginData.uuid,
			"status": enums.inspectionStatus[2].id,
			"meter_hours":parseInt(meterHours),
			"manager_notes":this.state.managerNotes,
			
		}
		var formvalid = this.formValidation(meterHours);
		console.log("requestdata---------------",requestData);
		if(formvalid){
			$('#pageLoading').show();
			this.props.approveInspection(requestData,'',enums.approveInspectionFromType[1].id)
		}
	
	}
	handleCreateWorkOrder=(inspectionDetail)=>{
		localStorage.setItem("inspectionDetail",JSON.stringify(inspectionDetail));
		window.location.replace("../../workorders/create/"+enums.createWorkOrderType[0].id)
	}
	formValidation(meterHours) {
        const { formError, errorMessage } = this.state;
      
        if (meterHours === '' || meterHours === null) {
            formError['meterHours'] = true;
            errorMessage['meterHours'] = 'Meter hours is required';
        }
        else {
            delete formError['meterHours'];
            delete errorMessage['meterHours'];
		}
		
        if (!_.isEmpty(formError)) {
            this.setState({ formError, errorMessage });
            return false;
        }
        else {
            return true;
        }

    }

	render() {
	
		console.log("this.props--------------",this.props);
		const { formError, errorMessage } = this.state;  
		let managerNotes = this.state.managerNotes
		let inspectionDetail = _.get(this,['props'],{})
		
		let categoryAttributes =_.get(inspectionDetail, ['attributes'],[])
		{categoryAttributes==undefined?categoryAttributes=[]:categoryAttributes=categoryAttributes}

		console.log("categoryAttributes ",categoryAttributes);

		categoryAttributes.map((value,key)=>{
			if(value.attribute_values.length>0){
				var isOK_NotOk_Type = false
				if((value.attribute_values[0].value).toLowerCase() == "ok" || (value.attribute_values[0].value).toLowerCase() == "not ok"){
					isOK_NotOk_Type = true
				}

				value.isOK_NotOk_Type =isOK_NotOk_Type
			}
		})


		managerNotes =_.get(inspectionDetail, ['manager_notes'],'')
		
		let operatorname =''

		if(inspectionDetail.operator_firstname !=null  && inspectionDetail.operator_lastname != null){

			operatorname= inspectionDetail.operator_firstname +" "+ inspectionDetail.operator_lastname

		}else if(inspectionDetail.operator_firstname!=null){

			operatorname= inspectionDetail.operator_firstname
		}
		else if(inspectionDetail.operator_lastname != null){

			operatorname= inspectionDetail.operator_lastname
		}
		
		const classes = makeStyles(theme => ({

			inspectionTitle: {

				width: '100%',
				padding: '15px 0',
			},

			bottomLines: {
				borderBottom: '1px solid #efefef',
				backgroundColor: 'red',
				color: 'red',
			},
			root: {
				paddingTop: '10px',
				flexGrow: 1,
			},
			paper: {
				padding: theme.spacing(2),
				textAlign: 'center',
				color: theme.palette.text.secondary,
			}
		}));
		
		return (
			<Box>
				<Box className="inspection-title bottom-lines">
					<h5>Inspection Details</h5>
					<Box className="inspection-breadcrum">
						<ul className="bread-crum">
							<li><Link to={'../inspections'}>Inspection </Link></li>
							<li> > </li>
							<li><a href="javascript:void(0)">{this.props.inspectionId}</a></li>
						</ul>
					</Box>
				</Box>
				<Box className="assets-info-container ">

					<form>

						<Box className="assets-wrap-container">

						<Box>
							<Box className="assets-info-title part2">
								<div className="boxheading">Asset Info</div>
							</Box>
														
							<Box className="assets-buttons-part part2 display_un">
									{/* <Button variant="contained" color="primary" className="assets-bottons float_r" href={"../photo/" + this.props.inspectionId} >Inspection Photos</Button> */}
									<Button variant="contained" color="primary" className="assets-bottons float_r txt-normal"  style={{ "fontSize": "13px" }}  component={Link} to={"../photo/" + this.props.inspectionId} >Inspection Photos</Button>
									{/* <Button variant="contained" color="primary" className="assets-bottons float_r" href={"../../assets/details/" + _.get(inspectionDetail, ['asset', 'internal_asset_id'], '')}>Asset Details</Button> */}

									<Button variant="contained" color="primary" className="assets-bottons float_r txt-normal"  style={{ "fontSize": "13px" }}  component={Link} to={"../../assets/details/" + _.get(inspectionDetail, ['asset', 'asset_id'], '')} >Asset Details</Button>
								</Box>
							</Box>

							<Box className="assent-info-form-part1">
								<Box className="row" style={{display: "block ruby"}}>
									<Box className="col-sm-6 col-md-6 col-lg-6 col-xs-12">
										<Box className="assets-info-devider">
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												value={_.get(inspectionDetail,['asset','name'],'')}
												id="name"
												label="Name"
												disabled="true"
											/>
										</Box>
									</Box>
								
									<Box className="col-sm-6 col-md-6 col-lg-2 col-xs-12">
										<Box className="assets-info-devider">
										<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												value={_.get(inspectionDetail, ['asset', 'internal_asset_id'],'')}
												id="asset"
												label="Asset #"
												disabled="true"
											/>

										</Box>
									</Box>
									<Box className="col-sm-6 col-md-6 col-lg-2 col-xs-12">
										<Box className="assets-info-devider">
											<TextField
											   error={formError.meterHours}
												variant="outlined"
												margin="normal"
												fullWidth
												value={this.state.meterHours!=null?this.state.meterHours:_.get(inspectionDetail,['meter_hours'],'')}
												id="meterHours"
												label="Meter Hours"
												name ="meterHours"
												onChange={(e)=>this.handleOnChnage(e)}
												helperText={errorMessage.meterHours}
												disabled={ _.get(inspectionDetail, ['status'],'')!= enums.inspectionStatus[0].id?true :false  }
											/>

										</Box>
									</Box>
									<Box className="col-sm-6 col-md-6 col-lg-2 col-xs-12">
										<Box className="assets-info-devider">
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												value={_.get(inspectionDetail, ['shift'],'')}
												id="shift"
												label="Shift"
												disabled="true"
											/>
										</Box>
									</Box>
									
								</Box>
							</Box>
							<Box className="assent-info-form-part2">
								<Box className="row">
									<Box className="col-sm-6 col-xs-12">
										<Box className="assents-info-devider-2">
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												value={operatorname}
												id="requestor"
												label="Requestor"
												disabled="true"
											/>
										</Box>
									</Box>
									<Box className="col-sm-6 col-xs-12">
										<Box className="assents-info-devider-2">
											{/* <TextField
												variant="outlined"
												margin="normal"
												fullWidth
												type="datetime-local"
												value={_.get(inspectionDetail, ['datetime_requested'],'')}
												className={classes.textField}
												InputLabelProps={{
													shrink: true,
												}}
												id="datetimeRequested"
												label="Datetime Requested"
												disabled="true"
											/> */}

											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												
												value={_.get(inspectionDetail, ['datetime_requested'], '')?
												// moment.utc(_.get(inspectionDetail, ['datetime_requested'], '')).local().format('MM-DD-YYYY hh:mm:ss a')
												momenttimezone.utc(_.get(inspectionDetail, ['datetime_requested'], '')).tz("America/Los_Angeles").format('MM-DD-YYYY hh:mm:ss a')
												:'-'}
												className={classes.textField}
												id="datetimeRequested"
												label="Datetime Requested"
												disabled="true"
											/>

										</Box>
									</Box>
								</Box>
							</Box>
							
							<Box className="assent-info-form-part2">
								<Box className="row">
									<Box className="col-sm-6 col-xs-12">
										<Box className="assents-info-devider-2">
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												value={_.get(inspectionDetail, ['operator_notes'],'')}
												id="operatorNotes"
												label="Operator Notes"
												multiline
												rows="2"
												disabled="true"
											/>

										</Box>
									</Box>
									<Box className="col-sm-6 col-xs-12">
										<Box className="assents-info-devider-2">
												<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												value={_.get(inspectionDetail, ['status'],'')!= enums.inspectionStatus[0].id?managerNotes:this.state.managerNotes}
												// value={managerNotes}
												id="managerNotes"
												name="managerNotes"
												label="Manager Notes"
												multiline
												rows="2"
												onChange={(e)=>this.handleOnChnage(e)}
												disabled={ _.get(inspectionDetail, ['status'],'')!= enums.inspectionStatus[0].id?true :false  }
											/>

										</Box>
									</Box>
								</Box>
							</Box>
						</Box>
						<Box className="assets-wrap-container">
							{/* Daily inspection and critical inspections */}
							{categoryAttributes.map((value, key) => {
								return (
									<Box key={key}>
										
											<Box className="assets-info-title" key={key}>
												<h4>{value.name}</h4>
											</Box>
											{value.isOK_NotOk_Type?
												<Box className="inspections-items-part-3">
													<Box className="row">
														{value.attribute_values.map((value1, key1) => {
															return (
																<Box key={key1} style={{ width: '20%' }}>
																	<Box style={{ display: "flex", maxWidth: '100%', width: '100%' }} className="col-sm-6 col-md-4 col-lg-3 col-xs-12 col-xl-2">
																		<Box style={{ display: "flex", maxWidth: '100%', width: '100%' }} className="inner-inspections-parts">
																			<label>{value1.name}</label>
																			<Box className="toggle-button-cover">
																				<Box className="button-cover">
																					<Box className="button b2" id={key1}>
																						<input type="checkbox" className="checkbox cursor-remove" disabled="true" />
																						<Box className={"knobs" + (value1.value == 'Not Ok' ? ' atrnotok' : '')}>
																							{/* <span>{value1.value}</span> */}
																							<span className=''>ok</span>
																						</Box>
																						<Box className="layer"></Box>
																					</Box>
																				</Box>
																			</Box>
																		</Box>
																	</Box>
																</Box>
															)
														})}

													</Box>
												</Box>
												:
												<section className="daily-inspection-main">
											
													{value.attribute_values.map((value1, key1) => {
														return (
																	<div className="inspection-divs">

																		<p className="insp-labels">{value1.name}</p>
																		{value1.value == enums.tankLevelAttributes[0].value||value1.value == enums.tankLevelAttributes[1].value?
																		<div className=" divcon-align-second ">

																			<div className={"idiv-clean "+(value1.value == enums.tankLevelAttributes[0].value?'attributeSelected':'')}>
																				<p>clean</p>
																			</div>

																			<div className={"idiv-nclean "+(value1.value == enums.tankLevelAttributes[1].value?'attributeSelected':'')}>
																				<p>Not Clean</p>
																			</div>

																		</div>
																	
																     	:
																		<div className="divcon-align ">
																			{enums.gasolineAttributes.map((value2, key2) => {
																				return (
																					<div className={"idiv-in " + (value1.value == value2.value ? 'attributeSelected' : '')} >
																						<p>{value2.value}</p>
																					</div>
																				)
																			})}
																		</div>
																	 }
																	 </div>
														)
													})}
													
											</section>
											}
										
									</Box>
								)
							})}
							{/* {inspectionDetail.status == enums.inspectionStatus[2].id?'': */}
							<Box className="assets-buttons-part margin-aply-tb-30">
								{/* {inspectionDetail.status != enums.inspectionStatus[0].id ? '' : <Button variant="contained" color="primary" className="assets-bottons txt-normal" style={{ "fontSize": "13px" }} onClick={(e) => this.handleCreateWorkOrder(inspectionDetail)}>Create Work Order</Button>} */}
								{inspectionDetail.status == enums.inspectionStatus[0].id ?
									<Button variant="contained" color="primary" className="assets-bottons txt-normal" style={{ "fontSize": "13px" }} onClick={this.approveInspection}>Accept</Button>
									: ''}

							</Box>
							{/* } */}
						</Box>
					</form>
				</Box>
				<SnackbarAlert tostMsg={this.state.tostMsg}/>
			</Box>
		);
	}
}
function mapState(state) {

    var inspectionData=[];
    if(state.inspectionListReducer.inspectionDetail){
		console.log("(state.inspectionListReducer ----------------",state.inspectionListReducer);
		inspectionData=state.inspectionListReducer.inspectionDetail;
		if(self){
			if(!_.isEmpty(state.inspectionListReducer.tostMsg)){
				self.setState({tostMsg:state.inspectionListReducer.tostMsg})
				
            }
		}
        return inspectionData;
    }else{
		return state
	}
   
}

const actionCreators = {
	inspectionDetailAction: inspectionDetailAction,
	approveInspection:approveInspectionAction
};

export default connect(mapState,actionCreators) (InspectionDetails);