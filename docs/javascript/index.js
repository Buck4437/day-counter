// eslint-disable-next-line no-unused-vars
const app = new Vue({
    el: "#app",
    data: {
        userdata: {
            counter: []
        },
        inputModel: {
            date: "",
            name: ""
        }
    },
    methods: {
        increment() {
            this.userdata.count++;
        },
        addDate() {
            this.userdata.counter.push({
                date: this.inputModel.date,
                name: this.inputModel.name,
            });
        },
        deleteCounter(i) {
            this.userdata.counter.splice(i, 1);
        },
        calculateTimeDiff(strBaseDate, treatDay1) {
            const baseDate = new Date(strBaseDate);
            const currDate = new Date(Date.now());
            currDate.setHours(0, 0, 0, 0);

            const days = daysBetween(baseDate, currDate);

            return days + (treatDay1 ? Math.sign(days) : 0);
        }
    },
    mounted() {
        const now = new Date();
        let month = (now.getMonth() + 1);               
        let day = now.getDate();
        if (month < 10) {
            month = `0${month}`;
        }  
        if (day < 10) {
            day = `0${day}`;
        }
        const today = `${now.getFullYear()}-${month}-${day}`;
        this.inputModel.date = today;
    }
});

// function dateToYMD(dateObject) {
//     return [dateObject.getYear(), dateObject.getMonth(), dateObject.getDay()];
// }

// function compareDate(date1, date2) {
//     const parsedDate1 = dateToYMD(date1);
//     const parsedDate2 = dateToYMD(date2);
//     for (let i = 0; i < 3; i++) {
//         if (parsedDate1[i] < parsedDate2[i]) {
//             return -1;
//         }
//         if (parsedDate1[i] > parsedDate2[i]) {
//             return 1;
//         }
//     }
//     return 0;
// }

// Stolen from stack overflow 
// https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
function daysBetween(prev, now) {

    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = now - prev;

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);

}