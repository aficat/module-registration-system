import React, { Component } from "react";
import { MDBDataTable, MDBInputGroup, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import axios from "axios";
import { RandomPassword } from "../utils/RandomPassword";
import { observer, inject } from 'mobx-react';

// function goToProfilePage(userId) {
//     console.log(userId);
// }

@inject('dataStore')
@observer
class UsersManagementPage extends Component {

    state = {
        modal1: false,
        modal2: false,
        userId: 0,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        userRole: "",
        username: "",
        columns: [
            {
                "label": "User Id",
                "field": "userId",
                "width": 50,
                "attributes": {
                    "aria-controls": "DataTable",
                    "aria-label": "Name"
                }
            },
            {
                "label": "First Name",
                "field": "firstName",
                "width": 150,
                "attributes": {
                    "aria-controls": "DataTable",
                    "aria-label": "Name"
                }
            },
            {
                "label": "Last Name",
                "field": "lastName",
                "width": 150,
                "attributes": {
                    "aria-controls": "DataTable",
                    "aria-label": "Name"
                }
            },
            {
                "label": "Gender",
                "field": "gender",
                "width": 100
            },
            {
                "label": "Email",
                "field": "email",
                "width": 270
            },
            {
                "label": "Password",
                "field": "password",
                "width": 200
            },
            {
                "label": "Access Right",
                "field": "accessRight",
                "width": 100
            },
            {
                "label": "Username",
                "field": "username",
                "width": 100
            },
            {
                "label": "",
                "field": "",
                "width": 100
            }
        ],
        rows: [{ label: "Retrieving data..." }],
        status: "retrieving"
    };

    componentDidMount() {
        axios
            .get(`http://localhost:8080/LMS-war/webresources/User/getAllUser`)
            // .get("http://localhost:3001/users")
            .then(result => {
                console.log(result)
                this.setState({
                    rows: result.data.userList,
                    status: "done"
                });
            })
            .catch(error => {
                this.setState({
                    status: "error"
                });
                console.error("error in axios " + error);
            })
    }

    addNewUser = () => {
        event.preventDefault();
        this.toggle(1);
        axios
            // .post("http://localhost:3001/newUser", {
            .put(`http://localhost:8080/LMS-war/webresources/User/createUser`, {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                gender: this.state.gender,
                accessRight: this.state.accessRight,
                username: this.state.username
            })
            .then(result => {
                console.log("New User Created")
            })
            .catch(error => {
                console.error("error in axios " + error);
            });
    }

    updateUserState = (user) => {
        console.log(user.accessRight)
        this.setState({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            gender: user.gender,
            accessRight: user.accessRight,
            username: user.username
        })
    }

    editUser = () => {
        event.preventDefault();
        this.toggle(2);
        axios
            // .post("http://localhost:3001/newUser", {
            .post(`http://localhost:8080/LMS-war/webresources/User/updateUser`, {
                userId: this.props.dataStore.getUserId,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                gender: this.state.gender,
                accessRight: this.state.accessRight,
                username: this.state.username
            })
            .then(result => {
                console.log("User Updated")
            })
            .catch(error => {
                console.error("error in axios " + error);
            });
    }

    deleteUser = (userId) => {
        event.preventDefault();
        axios
            .delete(`http://localhost:8080/LMS-war/webresources/User/deleteUser?userId=${userId}`)
            .then(result => {
                console.log("User Deleted")
            })
            .catch(error => {
                console.error("error in axios " + error);
            });
    }

    generatePwd() {
        let pwd = new RandomPassword()
            .setLength(8)
            .setLowerCase(true)
            .setUpperCase(false)
            .setNumberCase(true)
            .setSymbol(false)
            .generate();
        this.setState({ password: pwd });
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
        // console.log(this.state.accessRight) 
        // console.log(this.state.gender)
        // console.log(this.state.password)
        // console.log(this.state.email)
        // console.log(this.state.username)
        // console.log(this.state.firstName)
        // console.log(this.state.lastName)
    }

    toggle = (nr, row) => {
        let modalNumber = "modal" + nr;
        this.setState({
            [modalNumber]: !this.state[modalNumber]
        });

        if (row !== undefined) {
            this.updateUserState(row);
        }
    };

    renderEditUserModalBox = () => {
        return (
            <MDBModal isOpen={this.state.modal2} toggle={() => this.toggle(2)}>
                <MDBModalHeader
                    className="text-center"
                    titleClass="w-100 font-weight-bold"
                    toggle={() => this.toggle(2)}
                >
                    Update User Details
                        </MDBModalHeader>
                <MDBModalBody>
                    <form className="mx-3 grey-text">
                        <MDBRow>
                            <MDBCol md="6" className="mt-4">
                                <label className="grey-text">
                                    First Name
                                        </label>
                                <input type="text" className="form-control" defaultValue={this.state.firstName} onChange={this.handleChange} name="firstName" />
                            </MDBCol>
                            <MDBCol md="6" className="mt-4">
                                <label className="grey-text">
                                    Last Name
                                        </label>
                                <input type="text" className="form-control" defaultValue={this.state.lastName} onChange={this.handleChange} name="lastName" />
                            </MDBCol>
                            <br />
                            <MDBCol md="12" className="mt-4">
                                <label className="grey-text">
                                    Username
                                        </label>
                                <input type="text" className="form-control" defaultValue={this.state.username} onChange={this.handleChange} name="username" />
                            </MDBCol>
                            <br />
                            <MDBCol md="12" className="mt-4">
                                <label className="grey-text">
                                    Email
                                        </label>
                                <input type="text" className="form-control" defaultValue={this.state.email} onChange={this.handleChange} name="email" />
                            </MDBCol>
                            <MDBCol md="12" className="mt-4">
                                <label className="grey-text">
                                    Password
                                        </label>
                            </MDBCol>
                            <MDBCol md="6">
                                <input type="text" className="form-control" onChange={this.handleChange} value={this.state.password} />
                            </MDBCol>
                            <MDBCol md="6" align="right">
                                <MDBBtn onClick={() => this.generatePwd()} outline size="sm" color="primary">Generate Password</MDBBtn>
                            </MDBCol>
                            <MDBCol md="6" className="mt-4">
                                <MDBInputGroup
                                    style={{ paddingTop: 32 }}
                                    containerClassName="mb-3"
                                    prepend="Gender"
                                    inputs={
                                        <select name="gender" value={this.state.gender} onChange={this.handleChange} className="browser-default custom-select">
                                            <option value="0">Choose...</option>
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>
                                        </select>
                                    }
                                />
                            </MDBCol>
                            <MDBCol md="6" className="mt-4">
                                <MDBInputGroup
                                    style={{ paddingTop: 32 }}
                                    containerClassName="mb-3"
                                    prepend="User Role"
                                    inputs={
                                        <select name="accessRight" value={this.state.accessRight} onChange={this.handleChange} className="browser-default custom-select">
                                            <option value="0">Choose...</option>
                                            <option value="Teacher">Teacher</option>
                                            <option value="Student">Student</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Public">Public</option>
                                        </select>
                                    }
                                />
                            </MDBCol>
                        </MDBRow>
                    </form>
                </MDBModalBody>
                <MDBModalFooter className="justify-content-center">
                    <MDBRow>
                        <MDBCol md="6">
                            <MDBBtn onClick={() => this.toggle(2)} color="grey">Cancel</MDBBtn>
                        </MDBCol>
                        <MDBCol md="6">
                            <MDBBtn onClick={() => this.editUser()} color="primary">Update</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBModalFooter>
            </MDBModal>
        )
    }

    renderCreateUserModalBox = () => {
        return (
            <MDBModal isOpen={this.state.modal1} toggle={() => this.toggle(1)}>
                <MDBModalHeader
                    className="text-center"
                    titleClass="w-100 font-weight-bold"
                    toggle={() => this.toggle(1)}
                >
                    Create User
                        </MDBModalHeader>
                <MDBModalBody>
                    <form className="mx-3 grey-text">
                        <MDBRow>
                            <MDBCol md="6" className="mt-4">
                                <label className="grey-text">
                                    First Name
                                        </label>
                                <input type="text" className="form-control" onChange={this.handleChange} name="firstName" />
                            </MDBCol>
                            <MDBCol md="6" className="mt-4">
                                <label className="grey-text">
                                    Last Name
                                        </label>
                                <input type="text" className="form-control" onChange={this.handleChange} name="lastName" />
                            </MDBCol>
                            <br />
                            <MDBCol md="12" className="mt-4">
                                <label className="grey-text">
                                    Username
                                        </label>
                                <input type="text" className="form-control" onChange={this.handleChange} name="username" />
                            </MDBCol>
                            <br />
                            <MDBCol md="12" className="mt-4">
                                <label className="grey-text">
                                    Email
                                        </label>
                                <input type="text" className="form-control" onChange={this.handleChange} name="email" />
                            </MDBCol>
                            <MDBCol md="12" className="mt-4">
                                <label className="grey-text">
                                    Password
                                        </label>
                            </MDBCol>
                            <MDBCol md="6">
                                <input type="text" className="form-control" onChange={this.handleChange} placeholder="********" value={this.state.password} />
                            </MDBCol>
                            <MDBCol md="6" align="right">
                                <MDBBtn onClick={() => this.generatePwd()} outline size="sm" color="primary">Generate Password</MDBBtn>
                            </MDBCol>
                            <MDBCol md="6" className="mt-4">
                                <MDBInputGroup
                                    style={{ paddingTop: 32 }}
                                    containerClassName="mb-3"
                                    prepend="Gender"
                                    inputs={
                                        <select name="gender" onChange={this.handleChange} className="browser-default custom-select">
                                            <option value="0">Choose...</option>
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>
                                        </select>
                                    }
                                />
                            </MDBCol>
                            <MDBCol md="6" className="mt-4">
                                <MDBInputGroup
                                    style={{ paddingTop: 32 }}
                                    containerClassName="mb-3"
                                    prepend="User Role"
                                    inputs={
                                        <select name="accessRight" onChange={this.handleChange} className="browser-default custom-select">
                                            <option value="0">Choose...</option>
                                            <option value="Teacher">Teacher</option>
                                            <option value="Student">Student</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Public">Public</option>
                                        </select>
                                    }
                                />
                            </MDBCol>
                        </MDBRow>
                    </form>
                </MDBModalBody>
                <MDBModalFooter className="justify-content-center">
                    <MDBRow>
                        <MDBCol md="6">
                            <MDBBtn onClick={() => this.toggle(1)} color="grey">Cancel</MDBBtn>
                        </MDBCol>
                        <MDBCol md="6">
                            <MDBBtn onClick={() => this.addNewUser()} color="primary">Create</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBModalFooter>
            </MDBModal>
        )
    }

    renderUserTable = (tableData) => {
        return (
            <MDBContainer className="mt-3">
                <MDBRow style={{ paddingTop: 60 }}>
                    <MDBCol md="8">
                        <h2 className="font-weight-bold">
                            Users Management
                </h2>
                    </MDBCol>
                    <MDBCol md="4" align="right">
                        <MDBBtn onClick={() => this.toggle(1)} color="primary">Create User</MDBBtn>
                    </MDBCol>
                    {this.renderCreateUserModalBox()}
                    {this.renderEditUserModalBox()}
                </MDBRow>
                <MDBRow className="py-3">
                    <MDBCol md="12">
                        <MDBCard>
                            <MDBCardBody>
                                <MDBDataTable striped bordered hover scrollX scrollY maxHeight="400px" data={tableData} pagesAmount={4} />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }

    renderTableWithMessage = (message) => {
        const data = () => ({ columns: this.state.columns, rows: [{ label: message }] })

        const tableData = {
            columns: [...data().columns.map(col => {
                col.width = 200;
                return col;
            })], rows: [...data().rows]
        }
        return (
            <MDBContainer className="mt-3">
                <MDBRow style={{ paddingTop: 60 }}>
                    <MDBCol md="8">
                        <h2 className="font-weight-bold">
                            Users Management
                </h2>
                    </MDBCol>
                    <MDBCol md="4" align="right">
                        <MDBBtn onClick={() => this.toggle(1)} color="primary">Create User</MDBBtn>
                    </MDBCol>
                    {this.renderCreateUserModalBox()}
                    {this.renderEditUserModalBox()}
                </MDBRow>
                <MDBRow className="py-3">
                    <MDBCol md="12">
                        <MDBCard>
                            <MDBCardBody>
                                <MDBDataTable striped bordered hover scrollX scrollY maxHeight="400px" data={tableData} pagesAmount={4} />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }

    renderAwaiting = () => {
        return (
            <MDBContainer className="mt-3">
                <MDBRow style={{ paddingTop: 60 }} align="center">
                    <MDBCol md="12">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }

    render() {
        var newRows = []
        const row = this.state.rows
        for (let i = 0; i < row.length; i++) {
            newRows.push({
                userId: row[i].userId,
                firstName: row[i].firstName,
                lastName: row[i].lastName,
                gender: row[i].gender,
                email: row[i].email,
                password: row[i].password,
                accessRight: row[i].accessRight,
                username: row[i].username,
                editButton: <MDBRow align="center">
                    <MDBCol md={6}><MDBIcon onClick={() => this.toggle(2, row[i])} style={{ cursor: "pointer", textShadow: "1px 0px 1px #000000" }} icon="edit" /></MDBCol>
                    <MDBCol md={6}><MDBIcon onClick={() => this.deleteUser(row[i].userId)} style={{ cursor: "pointer", textShadow: "1px 0px 1px #000000" }} icon="trash" /></MDBCol>
                </MDBRow>
            })
        }
        const data = () => ({ columns: this.state.columns, rows: newRows })
        // clickEvent: () => goToProfilePage(1)

        const widerData = {
            columns: [...data().columns.map(col => {
                col.width = 150;
                return col;
            })], rows: [...data().rows.map(row => {
                // row.clickEvent = () => goToProfilePage(1)
                return row;
            })]
        }

        if (this.state.status === "retrieving")
            return this.renderAwaiting();
        else if (this.state.status === "error")
            return this.renderTableWithMessage("Error in Retrieving Data. Please try again later.");
        else if (this.state.status === "done")
            return this.renderUserTable(widerData);
        else
            return this.renderTableWithMessage("No data found.");
    }
}

export default UsersManagementPage;
