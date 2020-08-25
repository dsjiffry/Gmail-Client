import React, { Component } from 'react';
import { Accordion, Button, Card, } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


export default class App extends Component {

  Auth_url = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000&client_id=943578142641-ok98g09drjmued0qr0f33i1m92362ted.apps.googleusercontent.com";

  constructor(props) {
    super(props);

    let params = new URLSearchParams(window.location.hash.replace("#", "?"));

    this.state = {
      Auth_id: params.get('access_token'),
      message_ids: [],  //Message identifiers
      message_details: [], // Contains email subject, from, date and snippet

    };


  }

  /**
   * Once logged into Google will retrieve the email details
   */
  async componentDidMount() {
    if (this.state.Auth_id) { //Only happens if logged in

      await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?access_token=' + this.state.Auth_id) //Getting the user's email ids
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Server response wasn\'t OK');
          }
        })
        .then((json) => {
          this.setState({
            message_ids: json.messages
          })
        })
        .catch((error) => {
          this.setState({
            Auth_id: null
          })
          console.log(error);
        });

      await Promise.all(this.state.message_ids.slice(0, 10).map(async (item) => { //Getting the top 10 emails

        await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/' + item.id + '?access_token=' + this.state.Auth_id)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error();
            }
          })
          .then((json) => {

            let email = { //Email object
              snippet: "",
              from: "",
              subject: "",
              Date: "",
            };

            email.snippet = json.snippet; //Email Description

            for (let i = 0; i < json.payload.headers.length; i++) {

              if (json.payload.headers[i].name === "From") {
                email.from = json.payload.headers[i].value; //Email from whome
              }
              if (json.payload.headers[i].name === "Subject") {
                email.subject = json.payload.headers[i].value; //Email subject
              }
              if (json.payload.headers[i].name === "Date") {
                email.Date = json.payload.headers[i].value; //Email subject
              }

            }

            this.setState(prevState => ({
              message_details: [...prevState.message_details, email]
            }))

          })
          .catch((error) => {
            this.setState({
              Auth_id: null
            })
            console.log(error);
          });


      }))

    }
  }




  render() {
    if (this.state.Auth_id) { //If logged in

      return (
        <div>

          <br />
          <h2 style={{ textAlign: "center" }} >Gmail Client</h2>
          <p style={{ textAlign: "center" }}>(click on email to expand)</p>
          <br />
          <Accordion>
            {this.state.message_details.map((item, index) =>


              <Card>
                <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                  From: {item.from.substring(0, item.from.indexOf("<"))}
                &nbsp;&nbsp;&nbsp;&nbsp; Subject: {item.subject}
                  &nbsp;&nbsp;&nbsp;&nbsp; Date: {item.Date.substring(0, 16)}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index + 1}>
                  <Card.Body>{item.snippet}</Card.Body>
                </Accordion.Collapse>
              </Card>



            )}
          </Accordion>
        </div>


      );

    }
    else { // If not logged in

      return (
        <div style={{ textAlign: "center" }}>
          <header>

            <br />
            <h2 style={{ textAlign: "center" }}>Gmail Client</h2>

            <br />
            <a href={this.Auth_url}>
              <Button variant="primary">
                Login with Google
              </Button>
            </a>


          </header>
        </div>
      );
    }
  }
}
