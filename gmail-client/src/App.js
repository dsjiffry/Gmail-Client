import React from 'react';
import Button from '@material-ui/core/Button';
import './App.css';

export default class App extends React.Component {

  Auth_url = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000&client_id=943578142641-ok98g09drjmued0qr0f33i1m92362ted.apps.googleusercontent.com";

  constructor(props) {
    super(props);

    let params = new URLSearchParams(window.location.hash.replace("#","?"));    

    this.state = {
      Auth_id: params.get('access_token'),
    };
    // alert(this.state.Auth_id);

    this.getEmailIds = this.getEmailIds.bind(this);
  }

  async getEmailIds()
  {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?access_token='+this.state.Auth_id, {});
    const json = await response.json();

    // let data = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?access_token='+this.state.Auth_id)
    //   .then(response => response.json())
    //   .then(json => {
    //     return json.messages;
    // });
      // console.log(data);
  }

  render() {

    if (this.state.Auth_id) { 


      return (
        <div className="App">
        <header className="App-header">

        <h2>Gmail Client</h2>

        {this.getEmailIds()}

        </header>
        </div>


      );

    }
    else {

      return (
        <div className="App">
          <header className="App-header">

            <h2>Gmail Client</h2>


            <a href={this.Auth_url}>
              <Button variant="contained" color="primary">
                Login with Google
          </Button>
            </a>


          </header>
        </div>
      );
    }
  }
}
