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
        addDate() {
            this.userdata.counter.push({
                date: this.inputModel.date,
                name: this.inputModel.name,
                reverse: false
            });
        },
        deleteCounter(i) {
            this.userdata.counter.splice(i, 1);
        },

        // If no reverse:
        // X day(s) until Day 1 => Day 1 + x
        
        // If reverse:
        // Oct 13: Oct 12 will show 1 day remaining, 
        // Oct 13 will show today is the day, 
        // Oct 14 will show 1 day since.
        daysText(strBaseDate, reverse) {
            const days = this.daysFromNow(strBaseDate, reverse);

            if (reverse) {
                if (days < 0) {
                    return `${-days} day${days === -1 ? "" : "s"} remaining`;
                }
                if (days > 0) {
                    return `${days} day${days === 1 ? "" : "s"} since`;
                }
                return `Today`;
            }

            if (days >= 0) {
                return `Day ${days}`;
            }
            return `${-days} day${days === -1 ? "" : "s"} until Day 1`;
        },
        daysFromNow(strBaseDate, reverse) {
            const baseDate = new Date(strBaseDate);
            const currDate = new Date(Date.now());
            currDate.setHours(0, 0, 0, 0);

            const days = daysBetween(baseDate, currDate);

            if (reverse) {
                return days;
            }

            return days + (days >= 0 ? 1 : 0);
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