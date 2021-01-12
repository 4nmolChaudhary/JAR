import React, { Component } from 'react';
import Main from './components/Main/MainComponent';
import { Router, Route } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './Content/css/style.css'
import $ from 'jquery'
import { history } from '../src/helpers/history';
import * as Sentry from '@sentry/browser';
Sentry.init({										
  dsn: 'https://e6e4baf0aa134399a6dc855645ea190c@sentry.io/3641219',										
  integrations(integrations) {										
  return integrations.filter(integration => integration.name !== 'Breadcrumbs');										
  }										
  });			
  							
const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#146481"
      },
      secondary: {
        main: '#26a4d7',
      },
    },
  });

class App extends Component {
  constructor(props) {
		super(props);

		const { dispatch } = this.props;
		history.listen((location, action) => {
			console.log("histroy changed")
			
		});
	}

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router  history={history}>
        <div id="pageLoading" className="loadingbg"><div className="loader"></div></div>
        <ToastContainer/>
          <Main />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
