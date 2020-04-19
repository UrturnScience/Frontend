import React from 'react';

// Context for the User stored in the DB
const DbContext = React.createContext({
    user: {},
    room: "",
    expoPushToken: null,
});

export { DbContext };