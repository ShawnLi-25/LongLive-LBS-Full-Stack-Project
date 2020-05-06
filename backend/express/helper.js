const config = require('./config/config');
var clusterfck_root = require('./kmeans/clusterfck');

const imgDir = './images';

function checkEq(data, pred) {
    return pred[0] === Number(data.latitude) && pred[1] === Number(data.longitude) && pred[2] === Number(data.month) && pred[3] === Number(data.hour);
}

function getClusterType(dataPoints, cluster) {
    let typeCnt = {};
    let dataLen = dataPoints.length, clusterSize = cluster.length;

    // Todo: Brute-force now
    for(let i = 0; i < dataLen; ++i) {
        for(let j = 0; j < clusterSize; ++j) {
            // console.log(dataPoints[i], cluster[j]);
            if(checkEq(dataPoints[i], cluster[j])) {
                let type = dataPoints[i].type;
                if(type in typeCnt) {
                    ++typeCnt[type];
                } else {
                    typeCnt[type] = 1;
                }
            }
        }
    }

    let types = [];
    for (let [key, value] of Object.entries(typeCnt)) {
        types.push([key, value]);
    }

    types.sort(function(self, other) {
        return other[1] - self[1];
    });

    types.map(item => item[0]);

    // Pick Top-3 type as result
    let num = Math.min(types.length, config.PREDICT_TYPE_NUM);

    // console.log(predType);
    return types.slice(0, num);
}

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
        let min = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
        let time = "" + month + "/" + date + "/" + year + " " + hour + ":" + min;
        return [time, year, month, date, hour, min];
    },

    getLocKey: (lat, lng) => {
        let loc = "(" + lng + ", " + lat + ")";
        // console.log(loc);
        return loc;
    },

    // Data clustering based on (location & time) using K-Means
    kMeansPrediction: (myData, dataPoints) => {
        var len = dataPoints.length;
        console.log("Prediction based on datapoint:", len);

        let predictionData = new Array(len);
        for (let i = 0; i < len; ++i) {
            predictionData[i] = [];
        }

        for (let i = 0; i < len; ++i) {
            predictionData[i][0] = Number(dataPoints[i].latitude);
            predictionData[i][1] = Number(dataPoints[i].longitude);
            predictionData[i][2] = Number(dataPoints[i].month);
            predictionData[i][3] = Number(dataPoints[i].hour);
        }

        var kmeans = new clusterfck_root.Kmeans();
        var clusters = kmeans.cluster(predictionData, config.CLUSTER_NUM);

        var clusterTypes = [];
        for(let i = 0; i < clusters.length; ++i) {
            // console.log(clusters[i]);
            clusterTypes.push(getClusterType(dataPoints, clusters[i]));
        }

        var classIndex = kmeans.classify(myData);
        let predRes = clusterTypes[classIndex];
        console.log("Prediction result:", classIndex, clusterTypes[classIndex]);
        return predRes;
    },

    getImageUrls: () => {
        var imgUrlList = [];

        require('fs').readdirSync(imgDir).forEach(fileName => {
            // console.log(file);
            const resource_url = config.IMAGES_ROOT_DIR + String(fileName);
            imgUrlList.push(resource_url);
        });
        return imgUrlList;
    },

    getRandomLoc: () => {
        // All x1000
        let lat_upper_bound = 42000, lat_lower_bound = 41800,
            lng_upper_bound = 87800, lng_lower_bound = 87500;

        let rand_lat = Math.floor(Math.random() * (lat_upper_bound - lat_lower_bound + 1) + lat_lower_bound) / 1000,
            rand_lng = -Math.floor(Math.random() * (lng_upper_bound - lng_lower_bound + 1) + lng_lower_bound) / 1000;

        return [rand_lat, rand_lng];
    }
};
