import React from 'react';
import truck from "../../Content/images/truck.jpeg";
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import inspectionDetailAction from "../../Actions/Inspection/inspectionDetailAction";
import $ from 'jquery';
import _ from 'lodash';
import InspectionImage from "./inspectionImagePopup";

class InspectionPhoto extends React.Component{
    constructor(){
        super();
        this.state={
            showPopup:false,
            img:''
        }
    }
    componentDidMount(){
        var loginData = localStorage.getItem('loginData');
		loginData = JSON.parse(loginData);
        $('#pageLoading').show();
		this.props.inspectionDetailAction(this.props.inspectionId,loginData.uuid);
    }
    handleImgClick=(value)=>{
        this.setState({showPopup:true,img:value})
    }
    closePopUp=()=>{
        this.setState({showPopup:false})
    }
    render(){
        var imgList = _.get(this,['props','image_list','image_names'],[]);
        console.log(imgList);
        return(
            <div>
            <Box>
				<Box className="inspection-title bottom-lines">
					<h5>Inspection Photos</h5>
					<Box className="inspection-breadcrum">
						<ul className="bread-crum">
							<li><Link to={'../inspections'}>Inspection </Link></li>
							<li> > </li>
							<li><a href="javascript:void(0)">{this.props.inspectionId}</a></li>
						</ul>
					</Box>
				</Box>
                <Box className="assets-info-container ">
                <div className="gallery-image">
                 
                {imgList.map((value,key)=>{
                    return(
                        // <TransformWrapper>
                        //     <TransformComponent>
                                <div className="img-box" key={key}>
                                    {/* <img src={value} alt="" /> */}
                                    <img src={value} alt="" onClick={(e)=>this.handleImgClick(value)}/>

                                    {/* <div className="transparent-box">
                            <div className="caption">
                                <p className="opacity-low">Truck</p>
                            </div>
                        </div> */}
                                </div>
                        //     </TransformComponent>
                        // </TransformWrapper>
               
                    )
                })}
                </div>
                </Box>
                </Box>
                {this.state.showPopup?  <InspectionImage closePopUp={this.closePopUp} img={this.state.img}/>:''}
              
            </div>
        )
    }
}

function mapState(state) {
    var inspectionData=[];
    if(state.inspectionListReducer.inspectionDetail){
        inspectionData=state.inspectionListReducer.inspectionDetail;
        return inspectionData;
    }else{
		return state
	}
   
}

const actionCreators = {
	inspectionDetailAction: inspectionDetailAction,
};

export default connect(mapState,actionCreators) (InspectionPhoto);