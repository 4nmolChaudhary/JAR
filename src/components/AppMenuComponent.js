import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MainDrawer from './Main/MainDrawerComponent';
import Title from './TitleComponent';
import Grid from '@material-ui/core/Grid';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';
import Badge from '@material-ui/core/Badge';
import enums from "../Constants/enums";
import NotificationPopup from "./NotificationPopup";
import zIndex from '@material-ui/core/styles/zIndex';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import _ from "lodash";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio'
import { history } from "../helpers/history";
import  updateDefaultRole  from "../Actions/updateDefaultRoleAction";
import updateDefaultSiteAction from "../Actions/updateDefaultSiteAction";
import $ from 'jquery';
import SnackbarAlert from "../Snackbar/SnackbarAlert";

export const WithTitle = (props) => {
    const Body = props.bodyComponent;

    return (
        <React.Fragment>
            <Title title={props.title} />
            <MainMenu pageTitle={props.pageTitle} body={() => <Body {...props} />} userRole={props.userRole} />
        </React.Fragment>
    );
};

const drawerWidth = 180;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        backgroundColor: '#fafafa'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
            zIndex: 100
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        }
    },
    title: {
        paddingTop: '8px',
        flexGrow: 1
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#eeeeee'
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    notificationButton: {
        // marginRight: theme.spacing(2);
        paddingRight:'0'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
    drpmenuFont: {
        fontSize: '0.875rem',
        fontWeight: "bold",
        paddingTop: '2px',
        paddingBottom: '0px',
        paddingLeft: '8px',
        cursor:'default'

    },
    drpmenuItemFont: {
        fontSize: '0.875rem',
        fontWeight: "400",
        paddingTop: '0px',
        paddingBottom: '0px',
        paddingLeft: '7px',
        paddingRight: '10px',
        cursor:'default'
    },
    useremail: {
        // paddingTop: '13px',
        flexGrow: 1,
        float: 'right',
        fontSize: '0.875rem',
        fontWeight: "400"
    }
}));

function MainMenu(props) {

    const { container } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    let [isShowNotificationPopUp, setShowNotificationPopUp] = React.useState(false);
    const { body: Body } = props;
   

    var logindata = localStorage.getItem('loginData');
    logindata = JSON.parse(logindata);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const notificationDrawerToggle = () => {
        setNotificationOpen(!notificationOpen);
        setShowNotificationPopUp(!isShowNotificationPopUp);
    }
    const closeNotificationPopup = () => {
        setShowNotificationPopUp(!isShowNotificationPopUp);
    }

    // start menu code
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [isOpensiteMenu, setisOpensiteMenu] = React.useState(null);

    const handleSiteMenuClick = (event) => {
        setisOpensiteMenu(event.currentTarget);
    };

    const handleSiteMenuClose = () => {
        setisOpensiteMenu(null);
    };

    const [selectedRole, setselectedRole] = React.useState(localStorage.getItem('roleName'));
    const [selectedDefaultRole, setselectedDefaultRole] = React.useState(localStorage.getItem('defaultroleName'));

    const [selectedSite, setselectedSite] = React.useState(localStorage.getItem('siteName'));
    const [selectedDefaultSite, setselectedDefaultSite] = React.useState(localStorage.getItem('defaultSiteName'));


    const [tostMsg, setTostMsg] = React.useState({});
  
    const handleRadioClick = (role) => {
        var roleid = null
        logindata.userroles.map((value, key) => {
            if(value.role_name == role){
                roleid = value.role_id
            }
        })
        localStorage.setItem('roleId', roleid);
        localStorage.setItem('roleName', role);
      
         setselectedRole(role);
         if(role == enums.userRoles[1].role){
            history.push(process.env.PUBLIC_URL + "/assets");
         }else{
            history.push(process.env.PUBLIC_URL + "/dashboard");
         }
       
    };

    const handleDefaultRadionClick = (role) => {
        setTostMsg({})
        setselectedDefaultRole(role);
        var roleid = null
        logindata.userroles.map((value, key) => {
            if(value.role_name == role){
                roleid = value.role_id
            }
        })

        localStorage.setItem('defaultroleId',roleid);
        localStorage.setItem('defaultroleName', role);
         var requestData={
            "requested_by":logindata.uuid,
            "user_id":logindata.uuid,
            "role_id":roleid,
            "platform":enums.platform
         }
         $('#pageLoading').show();
         updateDefaultRole(requestData).then(response => {
            $('#pageLoading').hide();
          
            setTostMsg(response.tostMsg)
        }).catch(error => {
            $('#pageLoading').hide();
          
            setTostMsg(error.tostMsg)

        })
    };

    const handleSiteRadioClick = (site) => {
        var siteId = null
        logindata.usersites.map((value, key) => {
            if(value.site_name == site){
                siteId = value.site_id
            }
        })

        localStorage.setItem('siteId', siteId);
        localStorage.setItem('siteName', site);

        setselectedSite(site);

        if(localStorage.getItem('roleName') == enums.userRoles[1].role){
            history.push(process.env.PUBLIC_URL + "/assets");
         }else{
            history.push(process.env.PUBLIC_URL + "/dashboard");
         }
    };
    const handleDefaultSiteRadioClick = (site) => {
        setTostMsg({})
        setselectedDefaultSite(site);
        var siteId = null
        logindata.usersites.map((value, key) => {
            if(value.site_name == site){
                siteId = value.site_id
            }
        })

        localStorage.setItem('defaultSiteId',  siteId);
        localStorage.setItem('defaultSiteName',site);
         var requestData={
            "requested_by":logindata.uuid,
            "user_id":logindata.uuid,
            "site_id":siteId,
            // "platform":enums.platform
         }
         $('#pageLoading').show();
         updateDefaultSiteAction(requestData).then(response => {
            $('#pageLoading').hide();
           
            setTostMsg(response.tostMsg)
        }).catch(error => {
            $('#pageLoading').hide();
           
            setTostMsg(error.tostMsg)

        })
    };

   
    // end menu code

    const topAppBar = (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                <Grid container className="ss-header-navbar">
                    <Grid className='ss-title-name' >
                        <Grid item  className="ss-comman-drpdown">
                            <Typography component="h1" className={classes.title} variant="h6" noWrap>
                                {props.pageTitle}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid className="ss-nav-drpdown">
                        <Grid item  className="ss-comman-drpdown ss-nav-comman-padding" >
                            <Typography component="h1" className={classes.useremail} variant="h6" noWrap >

                                <div className="ss_userrole_dropdown">
                                    <div className="ss_userrole_detail">
                                        <span className="ss_email_details"><AccountCircleOutlined fontSize="small" style={{ "paddingRight": "3px" }}></AccountCircleOutlined>
                                            <span className="ss_email_name">{logindata.username}</span>
                                            <ArrowDropDownIcon aria-controls="simple-menu-role" aria-haspopup="true" onClick={handleClick}  style={{"cursor":"pointer"}}/>
                                        </span>
                                        <span className="ss_drdn_role txt-capitale">{selectedRole}</span>
                                    </div>

                                </div>

                            </Typography>
                            <Menu
                                id="simple-menu-role"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem className={classes.drpmenuFont}  disableTouchRipple={true}
                              disableFocusRipple={true}>Accessible Roles</MenuItem>
                                {logindata.userroles.map((value, key) => {
                                    return (
                                        (value.role_name==enums.userRoles[0].role||value.role_name==enums.userRoles[1].role?//manager or super admin
                                        <MenuItem className={classes.drpmenuItemFont} key={key}  disableTouchRipple={true}
                                        disableFocusRipple={true}>
                                            <Radio
                                                checked={selectedRole === value.role_name}
                                                onChange={(e) => { handleRadioClick(value.role_name) }}
                                                value={value.role_name}
                                                name="radio-button-demo"
                                                inputProps={{ 'aria-label': 'A' }}
                                                color={"primary"}
                                                size="small"
                                            />
                                            <span className="ss-li-rolename">
                                            {value.role_name}
                                            </span>
                                           
                                            </MenuItem>
                                             :'')
                                    )
                                })}

                                <Divider />
                                <MenuItem className={classes.drpmenuFont}  disableTouchRipple={true}
                                  disableFocusRipple={true}>Default Role</MenuItem>
                                {logindata.userroles.map((value,key)=>{
                                return(
                                    (value.role_name==enums.userRoles[0].role||value.role_name==enums.userRoles[1].role?//manager or super admin
                                        <MenuItem className={classes.drpmenuItemFont} key={key}  disableTouchRipple={true}
                                        disableFocusRipple={true}>
                                        <Radio
                                            checked={selectedDefaultRole === value.role_name}
                                            onChange={(e) => { handleDefaultRadionClick(value.role_name) }}
                                            value={value.role_name}
                                            name="radio-button-demo"
                                            inputProps={{ 'aria-label': 'A' }}
                                            color={"primary"}
                                            size="small"
                                        />
                                         <span className="ss-li-rolename">
                                        {value.role_name}
                                        </span>
                                         </MenuItem>
                                    :'')
                               
                                )
                            })}
                               
                            </Menu>

                        </Grid>
                        <Grid item  className="ss-comman-drpdown ss-nav-comman-padding">

                            <Typography component="h1" className={classes.useremail} variant="h6" noWrap >
                                {/* <AccountCircleOutlined fontSize="small" style={{ "paddingRight": "3px" }}></AccountCircleOutlined> */}
                                <span>{selectedSite}</span>
                                <ArrowDropDownIcon aria-controls="simple-menu-site" aria-haspopup="true" onClick={handleSiteMenuClick}  style={{"cursor":"pointer"}}/>
                            </Typography>
                            <Menu
                                id="simple-menu-site"
                                anchorEl={isOpensiteMenu}
                                keepMounted
                                open={Boolean(isOpensiteMenu)}
                                onClose={handleSiteMenuClose}
                            >
                                <MenuItem className={classes.drpmenuFont}  disableTouchRipple={true}
                                disableFocusRipple={true}>Accessible Sites</MenuItem>
                                {logindata.usersites.map((value, key) => {
                                    return (
                                        <MenuItem className={classes.drpmenuItemFont} key={key}  disableTouchRipple={true}
                                        disableFocusRipple={true}>
                                            <Radio
                                                checked={selectedSite === value.site_name}
                                                onChange={(e) => { handleSiteRadioClick(value.site_name) }}
                                                value={value.site_name}
                                                name="radio-button-demo"
                                                inputProps={{ 'aria-label': 'A' }}
                                                color={"primary"}
                                                size="small"
                                            />
                                              <span className="ss-li-rolename">
                                              {value.site_name}
                                    </span>
                                            </MenuItem>
                                    )
                                })}

                                <Divider />
                                <MenuItem className={classes.drpmenuFont}  disableTouchRipple={true}
                                 disableFocusRipple={true}>Default Site</MenuItem>
                                {logindata.usersites.map((value,key)=>{
                                return(
                                <MenuItem className={classes.drpmenuItemFont} key={key}  disableTouchRipple={true}
                                disableFocusRipple={true}>
                                <Radio
                                    checked={selectedDefaultSite === value.site_name}
                                    onChange={(e) => { handleDefaultSiteRadioClick(value.site_name) }}
                                    value={value.site_name}
                                    name="radio-button-demo"
                                    inputProps={{ 'aria-label': 'A' }}
                                    color={"primary"}
                                    size="small"
                                />
                                 <span className="ss-li-rolename">
                                {value.site_name} 
                                </span>
                                </MenuItem>
                                )
                            })}
                                {/* <MenuItem className={classes.drpmenuItemFont} >
                                    <Radio
                                        checked={true}
                                        // onChange={(e) => { handleDefaultRadionClick(selectedDefaultRole)}}
                                        value={selectedDefaultSite}
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'A' }}
                                        color={"primary"}
                                        size="small"
                                    />
                                     <span className="ss-li-rolename">
                                     {selectedDefaultSite}
                                    </span>
                                    </MenuItem> */}

                            </Menu>
                        </Grid>
                        {props.userRole == enums.userRoles[0].role ?
                            <Grid item  className='text-right ss-nav-comman-padding'>
                                <IconButton
                                    color="inherit"
                                    aria-label="notifications"
                                    edge="start"
                                    onClick={notificationDrawerToggle}
                                    className={classes.notificationButton}
                                    data-toggle="modal" data-target="#myModal2"
                                >
                                    <Badge
                                        // badgeContent={2}
                                        color="secondary"
                                        overlap="rectangle"
                                    >
                                        <NotificationsOutlined />
                                    </Badge>
                                </IconButton>

                            </Grid>
                            : ''}
                    </Grid>

                </Grid>

                {isShowNotificationPopUp ? <NotificationPopup closeNotificationPopup={closeNotificationPopup} /> : ''}
                {tostMsg?<SnackbarAlert tostMsg={tostMsg}/>:''}  
                     
            </Toolbar>
        </AppBar>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            {topAppBar}
            <nav className={classes.drawer +' nav-sidebar'}>
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        <MainDrawer />
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        variant="permanent"
                        open
                    >
                        <MainDrawer />
                    </Drawer>
                </Hidden>
            </nav>
            <main>
                <Toolbar />
                <Container>
                    <Body />

                </Container>

            </main>
        </div>
    );
}
