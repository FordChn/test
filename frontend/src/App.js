import React, { Component, createContext, useState, useContext, useEffect, useCallback } from "react"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import { Container, Box } from '@material-ui/core'
import CourseList from './components/Course/CourseList'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import CreateCourse from './Createcourse'
import EditCourse from "./components/EditCourse"
import Home from './components/Home/Home'
import SearchCourse from './components/Search/SearchCourse'
import CourseScreen from './components/Search/CourseScreen'

function App() {

    const auth = localStorage.getItem('auth') == 'true' ? true : false

    // auto login by ford
    const auth2 = true;

    // use this instead of Route
    // if not login (auth is false), PrivateRoute will redirect to Landing page
    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route
            render={(props) => (
                auth2 ? <Component {...props} /> : <Redirect to='/' />
            )}
            {...rest}
        />
    )

    // if already login, redirect to home. if not, show login page
    const LoginRoute = ({ component: Component, ...rest }) => (
        <Route
            render={(props) => (
                auth2 ? <Redirect to='/home' /> : <Component {...props} />
            )}
            {...rest}
        />
    )

    return (
        <div>
            {auth && <Navbar />}
            <Container maxWidth="lg">
                <Box height='100vh'> 
                    <Router>
                        <Switch>
                            <PrivateRoute path='/create_courses' component={CreateCourse} />
                            <PrivateRoute path='/editcourses' component={EditCourse} />
                            <PrivateRoute path='/courses' component={CourseList} />
                            <PrivateRoute path='/home' component={Home}/>
                            <PrivateRoute path='/search' component ={SearchCourse}/>
                            <PrivateRoute path='/course/:id' component ={CourseScreen}/>
                            <LoginRoute path="/" component={Landing} />
                            <Route path='/courses' component={CourseList} />
                        </Switch>
                    </Router>
                </Box>
            </Container>
        </div>
    );
}

export default App;