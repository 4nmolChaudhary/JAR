import React from 'react'
import { withRouter, Route, Redirect, Switch, useParams } from 'react-router-dom'
import { WithTitle } from '../AppMenuComponent'
import Dashboard from '../Dashboard/DashboardComponent'
import Assets from '../Assets/AssetsComponent'
import Inspections from '../Inspection/InspectionsComponent'
// import Transfers from './TransfersComponent';
import WorkOrders from '../WorkOrder/WorkOrdersComponent'
import Profile from '../User/ProfileComponent'
import Reports from '../Report/ReportsComponent'
import Users from '../User/UsersComponent'
import Login from '../Login/LoginComponent'
import Generallogin from '../GeneralLoginComponent'
import ForgotPassword from '../ForgotPasswordComponent'
import SetNewPasswordComponent from '../SetNewPasswordComponent'
import SetPasswordComponent from '../SetPasswordComponent'
import { connect } from 'react-redux'
import $ from 'jquery'
import '../../Content/css/style.css'
import '../../Content/css/bootstrap.min.css'
import firebase from 'firebase'
import { messaging } from '../init-fcm'
import enums from '../../Constants/enums'
import { history } from '../../helpers/history'
import { stat } from 'fs'
import DashboardQuicksights from '../Dashboard/DashboardQuicksights'
var self
const checkAuth = () => {
  var auth = localStorage.getItem('authenticated')
  var loginData = localStorage.getItem('loginData')
  loginData = JSON.parse(loginData)
  if (auth == 'true') {
    if (localStorage.getItem('roleName') == enums.userRoles[0].role || localStorage.getItem('roleName') == enums.userRoles[1].role) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

const AuthRoute = ({ component: Component, ...rest }) => <Route {...rest} render={props => (checkAuth() ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />)} />
const UnAuthRoute = ({ component: Component, ...rest }) => <Route {...rest} render={props => (checkAuth() ? <Redirect to={{ pathname: '/dashboard' }} /> : <Component {...props} />)} />
const NoMatchRoute = ({ component: Component, ...rest }) => <Route {...rest} render={props => (checkAuth() ? <Redirect to={{ pathname: '/dashboard' }} /> : <Redirect to={{ pathname: '/' }} />)} />
class Main extends React.Component {
  constructor(props) {
    super(props)
    self = this
    var logindata = localStorage.getItem('loginData')
    this.state = {
      isAuthenticated: false,
      userRole: '',
      loginData: JSON.parse(logindata),
    }
  }
  async componentDidMount() {
    $('#pageLoading').hide()

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('firebase-messaging-sw.js')
        .then(function (registration) {
          console.log('Registration successful, scope is:', registration.scope)
        })
        .catch(function (err) {
          console.log('Service worker registration failed, error:', err)
        })
    }

    if (localStorage.getItem('fcmToken')) {
    } else {
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

    navigator.serviceWorker.addEventListener('message', message => {
      console.log('Main object - ', message)
      console.log('Main object - ', message.data)
      console.log('Main object - ', message.data.firebaseMessaging)

      if (message.data['firebaseMessaging']) {
        var notificationObj = message.data['firebaseMessaging']
        console.log(notificationObj.payload.data)
      }

      // if(message.data['firebase-messaging-msg-data']){

      //     var notificationObj = message.data['firebase-messaging-msg-data']
      //     console.log(notificationObj.data)

      // }
      var redirectURl = ''
      console.log('notificationObj.payload.data.type = ', notificationObj.payload.data.type)
      if (notificationObj.payload.data.type == enums.notificationType[0].id) {
        //1 auto approve inspection
        redirectURl = '/inspections/details/' + notificationObj.payload.data.ref_id
      } else if (notificationObj.payload.data.type == enums.notificationType[1].id) {
        //2 PendingNewInspection
        redirectURl = '/inspections'
      } else if (notificationObj.payload.data.type == enums.notificationType[2].id) {
        //6 UpdateWorkOrderStatus
        redirectURl = '/workorders/details/' + notificationObj.payload.data.ref_id
      }

      if (notificationObj.type != 'notification-clicked') {
        console.log('notificationObj.type != notification-clicked')
        var notification = new Notification(notificationObj.payload.data.title, {
          icon: 'http://localhost:3005/proassets/images/project-jarvis.png',
          body: notificationObj.payload.data.body,
        })

        notification.onclick = function (event) {
          console.log('onclick ')
          event.preventDefault() // prevent the browser from focusing the Notification's tab
          history.push(redirectURl)
        }
      } else if (notificationObj.type == 'notification-clicked') {
        console.log('notificationObj.type == notification-clicked')
        console.log('redirectURl', redirectURl)
        history.push(redirectURl)
      }
      // history.push(redirectURl);
    })

    navigator.serviceWorker.addEventListener('notificationclick', function (e) {
      console.log('notificationclick - ')

      var notification = e.notification

      var action = e.action

      if (action === 'close') {
        notification.close()
      } else {
        notification.close()
      }
    })

    console.log('in app')

    messaging.onMessage(function (payload) {
      console.log('Message received 123. ', payload)
      // var notification = new Notification("payload.notification.title", {
      //   icon:"http://localhost:3005/proassets/images/project-jarvis.png",
      //   body: "payload.notification.body"
      // });
      // notification.onclick = function(event) {
      //   event.preventDefault(); // prevent the browser from focusing the Notification's tab
      //   window.open(URL.notificationUrl, "_blank");
      // };
    })
  }
  render() {
    return (
      <Switch>
        <UnAuthRoute exact={true} path='/' component={Generallogin} />
        <UnAuthRoute path='/home' component={Login} />
        <UnAuthRoute path='/forgotpassword' component={ForgotPassword} />
        <UnAuthRoute path='/resetpassword/:code' component={SetNewPasswordComponent} />
        <UnAuthRoute path='/setpassword' component={SetPasswordComponent} />

        <UnAuthRoute path='/login' component={Generallogin} />
        <AuthRoute path='/dashboard' component={() => <WithTitle bodyComponent={Dashboard} title='Dashboard' pageTitle='Dashboard' userRole={localStorage.getItem('roleName')} />} />
        <AuthRoute path='/assets' component={() => <WithTitle bodyComponent={Assets} title='Assets' pageTitle='Assets' userRole={localStorage.getItem('roleName')} />} />
        <AuthRoute path='/inspections' component={() => <WithTitle bodyComponent={Inspections} title='Inspections' pageTitle='Inspections' userRole={localStorage.getItem('roleName')} />} />
        {/* <AuthRoute
                    path="/transfers"
                    component={() => <WithTitle bodyComponent={Transfers} title='Transfers' pageTitle='Transfers' />}
                /> */}
        {/* <AuthRoute
                    path="/add-dispose"
                    component={() => <WithTitle bodyComponent={Reports} title='Add/Dispose' pageTitle='Add/Dispose' />}
                /> */}
        <AuthRoute path='/workorders' component={() => <WithTitle bodyComponent={WorkOrders} title='Work Orders' pageTitle='Work Orders' userRole={localStorage.getItem('roleName')} />} />
        <AuthRoute path='/reports' component={() => <WithTitle bodyComponent={Reports} title='Reports' pageTitle='Reports' userRole={localStorage.getItem('roleName')} />} />
        <AuthRoute path='/quickinsights' component={() => <WithTitle bodyComponent={DashboardQuicksights} title='Quick Insights' pageTitle='Quick Insights' userRole={localStorage.getItem('roleName')} />} />
        <AuthRoute path='/users' component={() => <WithTitle bodyComponent={Users} title='Users' pageTitle='Users' userRole={localStorage.getItem('roleName')} />} />
        <AuthRoute path='/profile' component={() => <WithTitle bodyComponent={Profile} title='Profile' pageTitle='Profile' userRole={localStorage.getItem('roleName')} />} />
        <NoMatchRoute />
      </Switch>
    )
  }
}
function mapState(state) {
  console.log('main component state ----------', state)
  // const isAuthenticated = false;
  // if (state.loginReducer) {
  //     const isAuthenticated = state.loginReducer.isAuthenticated;
  //     if (self) {
  //         self.setState({ isAuthenticated: state.loginReducer.isAuthenticated })
  //     }
  //     return { isAuthenticated };
  // }
  // return { isAuthenticated };
  return {}
}
export default connect(mapState)(withRouter(Main))
