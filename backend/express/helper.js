module.exports = {
    // Get Year, Month, Day, Hour, Minute from Time
    getTimeFields: () => {
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth();
        let date = newDate.getDate();
        let hour = newDate.getHours();
        let min = newDate.getMinutes();
        let time = "" + month + "/" + date + "/" + year + " " + hour + ":" + min;
        var timeLists = [time, year, month, date, hour, min];
        console.log(timeLists);
        return timeLists;
    },

    getLocKey: (lat, lng) => {
        let loc = "(" + lng + ", " + lat + ")";
        console.log(loc);
        return loc;
    }
};
