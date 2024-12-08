const moment = require('moment')
const isDate = ( value ) => {
    if( !value ) return false;
    const myDate = moment( value );
    return myDate.isValid();
}

module.exports = { isDate }