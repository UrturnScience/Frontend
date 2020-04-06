import React from 'react';

// Context for the User stored in the DB
const DbContext = React.createContext({
    user: {},
    room: "",
    
});

export { DbContext };