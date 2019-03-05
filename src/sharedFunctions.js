export {
    capitalizeString,
    fbSnapshotToArray,
    getAge,
    calculateAge,
    formatDate,
    toIdString,
    addCommas,
    generatePushID,
    chatTimeAndDate,
    smooth_scroll_to
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function capitalizeString(str) {
    var lower = str.toLowerCase();
    return lower.replace(/(^| )(\w)/g, function (x) {
        return x.toUpperCase();
    });
}

function addCommas(intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

function fbSnapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function (childSnapshot) {
        var item = childSnapshot.val();
        item.$key = childSnapshot.key;

        returnArr.push(item);
    });
    return returnArr;
}

function getAge(date) {
    var today = new Date();
    var birthday = new Date(date);

    var differenceInMilisecond = today.valueOf() - birthday.valueOf();

    var year_age = Math.floor(differenceInMilisecond / 31536000000);
    var day_age = Math.floor((differenceInMilisecond % 31536000000) / 86400000);

    var month_age = Math.floor(day_age / 30);

    day_age = day_age % 30;

    if (year_age || month_age || day_age) {
        if (year_age > 0) {
            if (year_age == 1) {
                return year_age + " year old";
            }
            else {
                return year_age + " years old";
            }
        }
        else if (year_age == 0 && month_age > 0) {
            if (month_age == 1) {
                return month_age + " month old";
            }
            else {
                return month_age + " months old";
            }
        }
        else if (year_age == 0 && month_age == 0 && day_age > 0) {
            if (day_age == 1) {
                return day_age + " day old";
            }
            else {
                return day_age + " days old";
            }
        }
        else {
            return year_age + " years " + month_age + " months " + day_age + " days old";
        }
    }
}

function formatDate(date, format) {
    date = new Date(date);
    switch (format) {
        case 'dd-month-yyyy':
            return ("0" + date.getDate()).slice(-2) + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear();
        case 'month dd, yyyy':
            return monthNames[date.getMonth()] + " " + ("0" + date.getDate()).slice(-2) + ", " + date.getFullYear();
        case 'yyyy-mm-dd':
            return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        case 'mm/dd/yyyy':
            return ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
        default:
            console.warn('Invalid format ' + format);
    }
}

function calculateAge(bday) {
    const daysBetweenDates = function (d1, d2) {
        var diffDays, oneDay;
        oneDay = 24 * 60 * 60 * 1000;
        diffDays = (d2 - Date.parse(d1)) / oneDay;
        return diffDays;
    };;

    var ageNum = daysBetweenDates(bday, new Date()) / 365;

    function N(num, places) {
        return +(Math.round(num + "e+" + places) + "e-" + places);
    }

    var x = N(ageNum, 3);

    if (x <= 0) return 0;
    else return x;
}

function toIdString(num) {
    if (num > 0 && num < 10) {
        num = '000' + num;
    }
    else if (num > 9 && num < 100) {
        num = '00' + num;
    }
    else if (num > 99 && num < 1000) {
        num = '0' + num;
    }
    else if (num > 999) {
        num = num;
    }
    else {
        num = '0000';
    }

    return num.toString();
}

function generatePushID(date, url) {
    return new Promise(resolve => {
        var now = new Date(date).getTime();
        firebase.database().ref(url).orderByChild('timestamp').equalTo(now).once('value', function (snapshot) {
            if (snapshot.exists()) now = Object.values(snapshot.val())[0].timestamp + 100;
            resolve({
                timestamp: now,
                key: generateNow(now)
            });
        });

        //reference: https://gist.github.com/mikelehen/3596a30bd69384624c11
        function generateNow(now) {
            var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
            var lastRandChars = [];
            var timeStampChars = new Array(8);
            for (var i = 7; i >= 0; i--) {
                timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
                now = Math.floor(now / 64);
            }
            if (now !== 0) throw new Error('We should have converted the entire timestamp.');
            var id = timeStampChars.join('');
            for (i = 0; i < 12; i++) { lastRandChars[i] = Math.floor(Math.random() * 64); }
            for (i = 0; i < 12; i++) { id += PUSH_CHARS.charAt(lastRandChars[i]); }
            if (id.length != 20) throw new Error('Length should be 20.');
            return id;
        }
    });
}

function chatTimeAndDate(date) {
    var givenDate = new Date(date);
    var time = givenDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    var dateDiff = DateDiff(givenDate, new Date());
    var title;
    if (dateDiff === 0) {
        title = "Today";
    } else if (dateDiff === 1) {
        title = "Yesterday";
    } else {
        title = monthNames[givenDate.getMonth()] + ' ' + givenDate.getDate();
    }

    return time + ' | ' + title;
}

function DateDiff(date1, date2) {
    date1.setHours(0);
    date1.setMinutes(0, 0, 0);
    date2.setHours(0);
    date2.setMinutes(0, 0, 0);
    var datediff = Math.abs(date1.getTime() - date2.getTime());
    return parseInt(datediff / (24 * 60 * 60 * 1000), 10);
}

function smooth_scroll_to(element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
        return Promise.reject("bad duration");
    }

    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve();
    }

    var start_time = Date.now();
    var end_time = start_time + duration;

    var start_top = element.scrollTop;
    var distance = target - start_top;

    var smooth_step = function (start, end, point) {
        if (point <= start) { return 0; }
        if (point >= end) { return 1; }
        var x = (point - start) / (end - start);
        return x * x * (3 - 2 * x);
    }

    return new Promise(function (resolve, reject) {
        var previous_top = element.scrollTop;

        var scroll_frame = function () {
            if (element.scrollTop != previous_top) { return; }
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;

            if (now >= end_time) {
                resolve();
                return;
            }

            if (element.scrollTop === previous_top
                && element.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollTop;
            setTimeout(scroll_frame, 0);
        }

        setTimeout(scroll_frame, 0);
    });
}
