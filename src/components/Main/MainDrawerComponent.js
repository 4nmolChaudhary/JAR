import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import AppsOutlined from '@material-ui/icons/AppsOutlined'
import AssignmentTurnedInOutlined from '@material-ui/icons/AssignmentTurnedInOutlined'
// import SyncAltOutlined from '@material-ui/icons/SyncAltOutlined';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined'
import PeopleOutlined from '@material-ui/icons/PeopleOutlined'
import PowerSettingNewOutlined from '@material-ui/icons/PowerSettingsNewOutlined'
// import AddOutlined from '@material-ui/icons/AddOutlined';
import BuildOutlined from '@material-ui/icons/BuildOutlined'
import AssessmentOutlined from '@material-ui/icons/AssessmentOutlined'
import DashboardOutlined from '@material-ui/icons/DashboardOutlined'
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined'
import { NavLink, withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { Avatar } from '@material-ui/core'
import enums from '../../Constants/enums'
import logoutAction from '../../Actions/logoutAction'
import $ from 'jquery'
import firebase from 'firebase'
import { messaging } from '../init-fcm'
import SnackbarAlert from '../../Snackbar/SnackbarAlert'
class MainDrawer extends React.Component {
  constructor(props) {
    super(props)
    const assetsRe = new RegExp('^/assets')
    const inspectionsRe = new RegExp('^/inspections')
    const workOrdersRe = new RegExp('^/workorders')
    const usersRe = new RegExp('^/users')
    var logindata = localStorage.getItem('loginData')
    this.state = {
      selected: {
        dashboard: true ? this.props.location.pathname === '/dashboard' : false,
        assets: true ? assetsRe.test(this.props.location.pathname) : false,
        inspections: true ? inspectionsRe.test(this.props.location.pathname) : false,
        // 'transfers': true ? this.props.location.pathname === '/transfers': false,
        // 'addDispose': true ? this.props.location.pathname === '/add-dispose': false,
        workOrders: true ? workOrdersRe.test(this.props.location.pathname) : false,
        reports: true ? this.props.location.pathname === '/reports' : false,
        users: true ? usersRe.test(this.props.location.pathname) : false,
        profile: true ? this.props.location.pathname === '/profile' : false,
        quickinsights: true ? this.props.location.pathname === '/quickinsights' : false,
      },
      loginData: JSON.parse(logindata),
      tostMsg: {},
    }
    this.logout = this.logout.bind(this)
  }
  componentDidMount() {}
  async logout() {
    $('#pageLoading').show()
    var loginData = JSON.parse(localStorage.getItem('loginData'))

    logoutAction(loginData.uuid)
    setTimeout(() => {
      var obj = JSON.parse(localStorage.getItem('tostMsg'))
      console.log(obj)
      this.setState({ tostMsg: obj })
    }, 1000)
    messaging
      .requestPermission()
      .then(async function () {
        const token = await messaging.getToken()
        console.log(token)
        localStorage.setItem('fcmToken', token)
      })
      .catch(function (err) {
        console.log('Unable to get permission to notify.', err)
      })
  }
  render() {
    return (
      <div>
        <SnackbarAlert tostMsg={this.state.tostMsg} />
        <CssBaseline />
        <Grid container justify='center' alignItems='center'>
          <Avatar
            alt='Sensai'
            src='/proassets/images/project-jarvis.png'
            style={{
              margin: 20,
              width: 100,
              height: 100,
            }}
          />
        </Grid>

        <Divider />

        <MenuList disablePadding={true}>
          {localStorage.getItem('roleName') === enums.userRoles[0].role ? (
            <MenuItem component={NavLink} to='/dashboard' selected={this.state.selected.dashboard} dense={true}>
              <ListItemIcon>
                <DashboardOutlined fontSize='small' />
              </ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </MenuItem>
          ) : (
            ''
          )}

          <MenuItem component={NavLink} to='/assets' selected={this.state.selected.assets} dense={true}>
            <ListItemIcon>
              <AppsOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText>Assets</ListItemText>
          </MenuItem>

          {/* {this.state.loginData.rolename ==enums.userRoles[0].role? */}
          <MenuItem component={NavLink} to='/inspections' selected={this.state.selected.inspections} dense={true}>
            <ListItemIcon>
              <AssignmentTurnedInOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText>Inspections</ListItemText>
          </MenuItem>
          {/* :'' } */}
          {/* <MenuItem component={NavLink} to="/transfers" selected={this.state.selected.transfers} dense={true}>
                        <ListItemIcon><SyncAltOutlined fontSize="small" /></ListItemIcon>
                        <ListItemText>Transfers</ListItemText>
                    </MenuItem> */}
          {/* <MenuItem component={NavLink} to="/add-dispose" selected={this.state.selected.addDispose} dense={true}>
                        <ListItemIcon><AddOutlined fontSize="small" /></ListItemIcon>
                        <ListItemText>Add/Dispose</ListItemText>
                    </MenuItem> */}
          {localStorage.getItem('roleName') === enums.userRoles[0].role ? (
            <MenuItem component={NavLink} to='/workorders' selected={this.state.selected.workOrders} dense={true}>
              <ListItemIcon>
                <BuildOutlined fontSize='small' />
              </ListItemIcon>
              <ListItemText>Work Orders</ListItemText>
            </MenuItem>
          ) : (
            ''
          )}
          {localStorage.getItem('roleName') === enums.userRoles[0].role ? (
            <MenuItem component={NavLink} to='/reports' selected={this.state.selected.reports} dense={true}>
              <ListItemIcon>
                <AssessmentOutlined fontSize='small' />
              </ListItemIcon>
              <ListItemText>Reports</ListItemText>
            </MenuItem>
          ) : (
            ''
          )}
        </MenuList>

        {/* <Divider variant="middle" /> */}
        {/* {this.state.loginData.rolename ==enums.userRoles[0].role? */}

        {localStorage.getItem('roleName') === enums.userRoles[0].role && (
          <MenuList disablePadding={true}>
            <MenuItem component={NavLink} to='/quickinsights' selected={this.state.selected.quickinsights} dense={true}>
              <ListItemIcon>
                <TrendingUpOutlinedIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Quick Insights</ListItemText>
            </MenuItem>
          </MenuList>
        )}

        <MenuList disablePadding={true}>
          <MenuItem component={NavLink} to='/users' selected={this.state.selected.users} dense={true}>
            <ListItemIcon>
              <PeopleOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText>Users</ListItemText>
          </MenuItem>
        </MenuList>
        {/* :''} */}

        {/* <Divider variant="middle" /> */}

        <MenuList disablePadding={true}>
          {/* {this.state.loginData.rolename ==enums.userRoles[0].role? */}
          <MenuItem component={NavLink} to='/profile' selected={this.state.selected.profile} dense={true}>
            <ListItemIcon>
              <AccountCircleOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          {/* :''} */}
          <MenuItem dense={true} onClick={this.logout}>
            <ListItemIcon>
              <PowerSettingNewOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </MenuList>
      </div>
    )
  }
}

export default withRouter(MainDrawer)
