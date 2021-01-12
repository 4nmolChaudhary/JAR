import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import AssetDetails from './AssetDetail/AssetDetailsComponent';
import AssetList from './AssetListComponent';
import UploadAsset from './UploadAssetComponent';
import { WithTitle } from '../AppMenuComponent';
import _ from 'lodash';
const Assets = () => {
    let match = useRouteMatch();
    var logindata = localStorage.getItem('loginData');
    logindata=JSON.parse(logindata)
    let params = useRouteMatch('/assets/details/:assetId');
    return (
        <div>    
            <Switch>
            {/* <AuthRoute
                    path="/dashboard"
                    component={() => <WithTitle bodyComponent={Dashboard} title="Dashboard" pageTitle="Dashboard" userRole={this.state.loginData.rolename}/>}
                /> */}
                {/* <Route exact path={`${match.path}/details/:assetId`}
                component={() => <WithTitle bodyComponent={AssetDetails} title="Asset Details" pageTitle="Asset Details" userRole={logindata.rolename}/>}
                /> */}
                <Route exact path={`${match.path}/details/:assetId`}>
                    <AssetDetails assetId={_.get(params,['params','assetId'])}/>
                </Route>
                <Route exact path={`${match.path}/upload`}>
                    <UploadAsset />
                </Route>
                <Route exact path={match.path}>
                    <AssetList />
                </Route>
                <Redirect
                    to={match.path}
                />
            </Switch>
        </div>
    );
};

export default Assets;
