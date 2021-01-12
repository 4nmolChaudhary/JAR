import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import enums from "../Constants/enums";
import { alert } from "./alertMessage";
import $ from "jquery";
import _ from 'lodash';
import { connect } from "react-redux";
import notificationAction from "../Actions/notificationAction";
import debounce from "lodash.debounce";

class NotificationPopup extends Component {
    constructor(props) {
        super(props);
        var loginData = localStorage.getItem('loginData');
        this.state = {
            loginData: JSON.parse(loginData),
            pageIndex: 1,
            page: 0, rowsPerPage: 20
        }
    }
    componentDidMount() {
        // setTimeout(() => {
        $('#notificationLoading').show();
        var urlParameters = this.state.loginData.uuid + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
        this.props.notificationAction(urlParameters, this.state.pageIndex);
        // }, 1000);
        // window.addEventListener('scroll', this.handleScroll);
        $('#divID').bind('scroll', this.handleScroll);
        

    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    closeModal = () => {
        this.props.closeNotificationPopup();
    }
    handleScroll = debounce((e) => {

        var modal_scrollTop = $('.modal-body').scrollTop();
        var modal_scrollHeight = $('.modal-body').prop('scrollHeight');
        var modal_innerHeight = $('.modal-body').innerHeight();
        console.log("handle scroll fnction call -----------");
        console.log(e.type)
        console.log(modal_scrollTop, modal_scrollHeight, modal_innerHeight);

        if (modal_scrollTop + modal_innerHeight >= (modal_scrollHeight - 100)) {
            console.log("in end list------------------", this.props);
            console.log(_.get(this, ['props', 'notificationList'], []), " ", _.get(this, ['props', 'listsize'], 0))
            this.setState(
                { pageIndex: this.state.pageIndex + 1 },
                () => {
                    if (_.get(this, ['props', 'notificationList'], []).length != _.get(this, ['props', 'listsize'], 0)) {
                        $('#notificationLoading').show();
                        var urlParameters = this.state.loginData.uuid + "/" + this.state.rowsPerPage + "/" + this.state.pageIndex
                        this.props.notificationAction(urlParameters, this.state.pageIndex);
                    }

                })
        }
    }, 1000);
    render() {
        console.log("======+++++---------", this.props)
        return (
            <Grid id="divID" onScroll={(e) => {this.handleScroll(e);}} >
                <div id="notificationModal" className="modal  notification_modal" style={{ "display": "block" }}>

                    {/* <!-- Modal content --> */}
                    <div className="modal-content notification_modal_content">
                        <div className="modal-header modal-header-notification">
                            <button type="button" className="close close_btn_new"
                                data-dismiss="modal" aria-label="Close"
                                onClick={this.closeModal}
                            ><span
                                aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="myModalLabel2">Notification</h4>
                        </div>

                        <div className="modal-body scroll_height" id="style-1">
                            <div id="notificationLoading" className="loadingbg">
                                <div className="loader" style={{ top: "53%", left: "84%" }}>
                                </div>
                            </div>
                            {_.get(this, ['props', 'notificationList'], []).length > 0 ?
                                (_.get(this, ['props', 'notificationList'], []).map((value, key) => {
                                    return (
                                        <div className="notification_card" key={value.key}>
                                            <h5>{value.heading}</h5>
                                            <p>{value.message}</p>
                                        </div>
                                    )
                                }))
                                : <div>No Data Found
                        </div>}
                        </div>
                    </div>
                </div>
            </Grid>
        );
    }
}
function mapState(state) {

    return state.notificationListReducer
}

const actionCreators = {
    notificationAction: notificationAction,

};
export default connect(mapState, actionCreators)(NotificationPopup);

