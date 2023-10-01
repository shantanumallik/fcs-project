import React from 'react';

// If you're using the default React setup, these paths should work.
// If not, adjust them to the locations of your 'logo.svg' and 'App.css'.
import logo from '../logo.svg';
import '../App.css';

const PegasusPage = () => {
    return (
        <div className="App" style={{ height: '100vh' }}> {/* Added style here */}
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Pegasus lives here. DO NOT ENTER.
                </p>
            </header>
        </div>
    );
}

export default PegasusPage;
