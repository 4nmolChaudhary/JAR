import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import UserListComponent from "./UserListComponent";
import CreateUserComponent from "./CreateUserComponent";
import UserDetailComponent from "./UserDetailComponent";
import _ from 'lodash'

const Users = () => {
    let match = useRouteMatch();
    let params= useRouteMatch('/users/details/:userId');
    return (
        <div>
            <Switch>
                <Route exact path={`${match.path}/create`}>
                    <CreateUserComponent/>
                </Route>
                <Route exact path={`${match.path}/details/:userId`}>
                   <UserDetailComponent parameters={_.get(params,['params'],{})}/>
                </Route>
                <Route exact path={match.path}>
                    <UserListComponent/>
                </Route>
                <Redirect
                    to={match.path}
                />
            </Switch>
        </div>
    );
};

export default Users;
