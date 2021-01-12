import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import WorkOrderDetails from './WorkOrderDetailsComponent';
import WorkOrderList from './WorkOrderListComponent';
import WorkOrderCreate from "./workOrderCreateComponent";
import _ from 'lodash'
const WorkOrders = () => {
    let match = useRouteMatch();
   
    let params = useRouteMatch('/workorders/create/:type');
    let paramsDetail= useRouteMatch('/workorders/details/:workOrderId');
    return (
        <div>
            <Switch>
          
                <Route exact path={`${match.path}/details/:workOrderId`}>
                    <WorkOrderDetails  parameters={_.get(paramsDetail,['params'],{})}/>
                </Route>
                <Route exact path={`${match.path}/create/:type`}>
                    <WorkOrderCreate parameters={_.get(params,['params'],{})}/>
                </Route>
                <Route exact path={match.path}>
                    <WorkOrderList />
                </Route>
                <Redirect
                    to={match.path}
                />
            </Switch>
        </div>
    );
};

export default WorkOrders;
