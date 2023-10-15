const SAVE_KEY = "Buck4437-Day-Counter-Userdata";

function generateDefaultProfile() {
    return {
        counter: []
    };
}

// eslint-disable-next-line no-unused-vars
const app = new Vue({
    el: "#app",
    data: {
        userdata: generateDefaultProfile(),
        inputModel: {
            date: "",
            name: "",
            reverse: false
        },
        currentDate: new Date(Date.now()),
    },
    computed: {
        currentDateStr() {
            const now = this.currentDate;
            let month = (now.getMonth() + 1);               
            let day = now.getDate();
            if (month < 10) {
                month = `0${month}`;
            }  
            if (day < 10) {
                day = `0${day}`;
            }
            return `${now.getFullYear()}-${month}-${day}`;
        }
    },
    methods: {
        addDate() {
            this.userdata.counter.push({
                date: this.inputModel.date,
                name: this.inputModel.name.trim() === "" ? "Unnamed" : this.inputModel.name,
                reverse: this.inputModel.reverse
            });
        },
        updateCurrentDate() {
            const date = new Date(Date.now());
            date.setHours(0, 0, 0, 0);
            this.currentDate = date;
        },
        deleteCounter(i) {
            if (confirm("Do you want to delete this counter?")) {
                this.userdata.counter.splice(i, 1);
            }
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

            const days = daysBetween(baseDate, this.currentDate);

            if (reverse) {
                return days;
            }

            return days + (days >= 0 ? 1 : 0);
        }
    },
    watch: {
        userdata: {
            deep: true,
            handler(data) {
                saveToLocalStorage(data);
            }
        }
    },
    created() {
        this.userdata = loadFromLocalStorage();
    },
    mounted() {
        this.updateCurrentDate();
        this.inputModel.date = this.currentDateStr;
        setInterval(this.updateCurrentDate, 1000);
    }
});

function saveToLocalStorage(data) {
    const JSONdata = JSON.stringify(data);
    localStorage.setItem(SAVE_KEY, JSONdata);
}


function loadFromLocalStorage() {
    try {
        const JSONdata = localStorage.getItem(SAVE_KEY);
        if (JSONdata === null) {
            console.log("No profile find, generating default profile...");
            return generateDefaultProfile();
        }
        return JSON.parse(JSONdata);
    } catch (e) {
        console.error(e);
        console.error("Error when parsing userdata: default profile loaded instead.");
        return generateDefaultProfile();
    }
}

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