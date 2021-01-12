import React from 'react';
import _ from 'lodash';
import SnackbarSuccess from "./SnackbarSuccess";
import SnackbarError from "./SnackbarError";
import enums from  "../Constants/enums";

class SnackbarAlert extends React.Component {
	render() {
        console.log("SnackbarAlert-----------",this.props);
		return (
			<div>
				{!_.isEmpty(this.props.tostMsg) && !_.isEmpty(this.props.tostMsg.msg) ?
					(this.props.tostMsg.type == enums.toastMsgType[0].id ?
						<SnackbarSuccess tostMsg={this.props.tostMsg} />
						:
						<SnackbarError tostMsg={this.props.tostMsg} />)
					: ''}
		</div>
		);
	}
}

export default SnackbarAlert