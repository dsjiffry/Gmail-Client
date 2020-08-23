
import React from 'react';
import GoogleLogin from 'react-google-login';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state =  { 
                  signedIn: false,
                  error:false
                  };
  }

  
  componentDidCatch()
  {
    this.setState({ error: true });
  }

  render() {

    const responseGoogle = (response) => {
      // alert("user signed in");

      let profile;
      try {
        profile = response.getBasicProfile();
      } catch (error) {
        alert("Unable to access Account");
        return;
      }
      
      profile = response.getBasicProfile();
      sessionStorage.setItem('authToken', profile.getId());
      sessionStorage.setItem('name', profile.getName());
      sessionStorage.setItem('imageUrl', profile.getImageUrl());
      sessionStorage.setItem('email', profile.getEmail());

      this.setState({
        signedIn: true
      });

    fetch('https://api.npms.io/v2/search?q=react', 
        { 'Content-Type': 'application/json' })
        .then(response => response.json())
        .then(data => this.setState({ totalReactPackages: data.total }));

      //sessionStorage.getItem('authToken')

    }

    if (this.state.signedIn) {
      return (
        <div className="App">
          <header className="App-header">

            <h2>Welcome</h2>

          </header>

        </div>
      );
    }
    else {
      return (
        <div className="App">


          <header className="App-header">

            <h2>Gmail Client</h2>

            <GoogleLogin
              clientId="116433470137-mfrkh56h1qsn2sjtocn116vqh4fiauss.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              scope="https://www.googleapis.com/auth/gmail.readonly"
              cookiePolicy={'single_host_origin'}
            />


          </header>




        </div>
      );
    }

  }
}
