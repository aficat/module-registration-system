import React, { Component } from "react";
import { MDBEdgeHeader, MDBContainer, MDBRow, MDBCol, MDBJumbotron, MDBAnimation } from "mdbreact";
import { observer, inject } from 'mobx-react'
import { Redirect } from "react-router-dom";
import axios from "axios";

@inject('dataStore')
@observer
class StudentLoginPage extends Component {

  state = {
    loggedInStatus: false,
    email: "",
    password: "",
    message: "",
    accessRight: "",
    gender: "",
    firstName: "",
    lastName: "",
    username: ""
  }

  handleChangeEmail = event => this.setState({ email: event.target.value });
  handleChangePassword = event => this.setState({ password: event.target.value });

  checkLogIn = () => {
    const { email, password } = this.state;
    event.preventDefault();

    axios
      // .post("http://localhost:3001/login", {
      .get(`http://localhost:8080/LMS-war/webresources/User/userLogin?email=${email}&password=${password}`)
      .then(result => {
        if (result.data.user.accessRight === "Student") {
          this.props.dataStore.setSignInStatus(true, this.state.email, this.state.password, result.data.user.accessRight)
          this.props.dataStore.setUserDetails(result.data.user.userId, result.data.user.gender, result.data.user.firstName, result.data.user.lastName, result.data.user.username)
          this.setState({ loggedInStatus: true })
        } else {
          this.setState({ message: "invalid access" })
        }
      })
      .catch(error => {
        this.setState({ message: "error" })
        console.error("error in axios " + error);
      });
  }

  render() {
    if (this.state.loggedInStatus === true) {
      return <Redirect to={this.props.dataStore.getPath} />
    }
    return (
      <>
        <MDBEdgeHeader color="indigo darken-3" className="loginPage" />
        <MDBAnimation type="zoomIn" duration="500ms">
          <MDBContainer>
            <MDBRow>
              <MDBCol md="8" className="mt-3 mx-auto">
                <MDBJumbotron>
                  <h1 className="text-center" style={{ fontWeight: "bold" }}>
                    MODREG
                </h1>
                  <h3 className="text-center">
                    Module Registration System
                </h3>
                  <ul className="list-unstyled example-components-list">
                    <form onSubmit={this.checkLogIn}>
                      <br />
                      <label htmlFor="defaultFormRegisterEmailEx" className="grey-text">
                        Email
                </label>
                      <input type="email" id="defaultFormRegisterEmailEx" onChange={this.handleChangeEmail} className="form-control" />
                      <br />
                      <label htmlFor="defaultFormRegisterPasswordEx" className="grey-text">
                        Password
                </label>
                      <input type="password" id="defaultFormRegisterPasswordEx" onChange={this.handleChangePassword} className="form-control" />
                      <div className="text-center mt-4">
                        <button className="btn btn-indigo">
                          Login
                        </button>
                        <br />
                        <br />
                      </div>
                    </form>
                    {this.state.message === "error" && <h6 align="center" style={{ color: "red" }}>Invalid email/ password!</h6>}
                    {this.state.message === "invalid access" && <h6 align="center" style={{ color: "red" }}>Access Denied</h6>}
                  </ul>
                    <center>Go to <a href="/admin">Administrator Login Page</a></center>
                </MDBJumbotron>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBAnimation>
      </>
    );
  }
}

export default StudentLoginPage;
