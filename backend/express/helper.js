module.exports = {

    // Given Time Format "month/date/year hour:min", get fields
    parseTime: (time) => {
        let month = time.split('/')[0];
        let date = time.split('/')[1];
        var rest = time.split('/')[2];
        let year = rest.split(' ')[0];
        rest = rest.split(' ')[1];
        let hour = rest.split(':')[0];
        let min = rest.split(':')[1];
        return [year, month, date, hour, min];
    },

    // Get Year, Month, Day, Hour, Minute from Time
    getTimeFields: () => {
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let date = newDate.getDate();
        let hour = newDate.getHours();
        let min = newDate.getMinutes();
        let time = "" + month + "/" + date + "/" + year + " " + hour + ":" + min;
        return [time, year, month, date, hour, min];
    },

    getLocKey: (lat, lng) => {
        let loc = "(" + lng + ", " + lat + ")";
        console.log(loc);
        return loc;
    }
};
