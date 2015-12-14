'use strict';

const React      = require('react');
const sylkrtc    = require('sylkrtc');
const classNames = require('classnames');

const EnrollmentModal = require('./EnrollmentModal');


let RegisterForm = React.createClass({
    propTypes: {
        handleRegistration: React.PropTypes.func.isRequired,
        registrationState: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            accountId: '',
            password: '',
            registering: false,
            showEnrollmentModal: false
        };
    },

    componentWillMount: function() {
        let data = window.localStorage.getItem('blinkAccount');
        if (data) {
            let accountData = JSON.parse(data);
            this.setState(accountData);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let registrationState = nextProps.registrationState;
        if (registrationState === 'failed' || registrationState === null) {
            this.setState({registering: false});
        }
    },

    handleAccountIdChange: function(event) {
        this.setState({accountId: event.target.value});
    },

    handlePasswordChange: function(event) {
        this.setState({password: event.target.value});
    },

    handleSubmit: function(event) {
        event.preventDefault();
        this.setState({registering: true});
        this.props.handleRegistration(this.state.accountId, this.state.password);
    },

    handleEnrollment: function(account) {
        this.setState({showEnrollmentModal: false});
        if (account !== null) {
            this.setState({accountId: account.accountId, password: account.password, registering: true});
            this.props.handleRegistration(account.accountId, account.password);
        }
    },

    createAccount: function() {
        this.setState({showEnrollmentModal: true});
    },

    render: function() {
        let validInput = this.state.accountId.indexOf('@') !== -1 && this.state.password !== 0;
        let classes = classNames({
            'capitalize' : true,
            'btn'        : true,
            'btn-lg'     : true,
            'btn-block'  : true,
            'btn-default': !validInput,
            'btn-primary': validInput && !this.state.registering,
            'btn-info'   : this.state.registering,
            'btn-success': this.state.registrationState === 'registered'
        });

        return (
            <div>
                <p className="lead">Sign in to continue</p>
                <form className="form-signin" onSubmit={this.handleSubmit}>
                    <label htmlFor="inputEmail" className="sr-only">Sip Account</label>
                    <div className="input-group">
                        <span className="input-group-addon first"><i className="fa fa-globe fa-fw"></i></span>
                        <input type="email" id="inputUser" className="form-control" placeholder="Enter your SIP address" value={this.state.accountId} onChange={this.handleAccountIdChange} required autoFocus/>
                    </div>
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <div className="input-group">
                        <span className="input-group-addon second"><i className="fa fa-lock fa-fw"></i></span>
                        <input type="password" id="inputPassword" ref="pass" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} required />
                    </div>
                    <button type="submit" className={classes} disabled={this.state.registering}>Sign In</button>
                </form>
                <p>No SIP account? <button className="btn-link" onClick={this.createAccount}>Create an account</button></p>
                <EnrollmentModal show={this.state.showEnrollmentModal} handleEnrollment={this.handleEnrollment} />
            </div>
        );
    }
});

module.exports = RegisterForm;
