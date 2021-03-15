import React from 'react';
import Header from "./Header";
import CssBaseline from '@material-ui/core/CssBaseline';


function Layout(props) {
    return (
        <React.Fragment>
            <CssBaseline />
            <Header {...props} />
                <div>
                    {props.children}
                </div>
        </React.Fragment>
    )
}

export default Layout