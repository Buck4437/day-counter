const SAVE_KEY = "Buck4437-Day-Counter-Userdata";
const LATEST_PROFILE_VERSION = "20231025-1";

function generateDefaultProfile() {
    return {
        counter: [],
        nextId: 0,
        version: LATEST_PROFILE_VERSION
    };
}

Vue.component("day-counter", {
    data() {
        return {
            isEditMode: false,
            tempData: {
                intermediateDate: ""
            },
            inputModel: {
                name: "",
                date: "",
                
            }
        };
    },
    props: {
        counter: Object,
        now: Date
    },
    computed: {
        isValidModelDate() {
            return isValidDate(this.inputModel.date);
        }
    },
    methods: {
        initializeModelField() {
            this.inputModel.name = this.counter.name;
            this.inputModel.date = this.counter.date;
            this.tempData.intermediateDate = this.counter.date;
        },
        save() {
            this.$emit("update", {
                name: this.inputModel.name,
                date: this.inputModel.date
            });
            this.isEditMode = false;
        },
        cancel() {
            this.isEditMode = false;
        },
        edit() {
            this.initializeModelField();
            this.isEditMode = true;
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

            const days = daysBetween(baseDate, this.now);

            if (reverse) {
                return days;
            }

            return days + (days >= 0 ? 1 : 0);
        }
    },
    mounted() {
        this.initializeModelField();
    },
    watch: {
        inputModel: {
            deep: true,
            handler(data) {
                if (isValidDate(data.date)) {
                    this.tempData.intermediateDate = data.date;
                }
            }
        }
    },
    template: `
    <div class="day-counter">
        <div v-if="isEditMode" class="day-counter-info-text">
            <div>
                <input v-model="inputModel.name" placeholder="New Counter">
            </div>
            <div>
                <input type="date" v-model="inputModel.date" min="1970-01-01">
            </div>
            <div>{{daysText(tempData.intermediateDate, counter.reverse)}}</div>
            <div>
                <button @click="save" :disabled="!isValidModelDate">Save</button>
                <button @click="cancel">Cancel</button>
            </div>
        </div>
        <div v-else class="day-counter-info-text">
            <div>{{counter.name}}</div>
            <div>{{counter.date}}</div>
            <div>{{daysText(counter.date, counter.reverse)}}</div>
            <div>
                <button @click="edit">Edit</button>
            </div>
        </div>
        <div class="counter-settings">
            <button @click="$emit('delete')">Delete</button>
            <input type="checkbox" v-model="counter.reverse"> Reverse mode
            (ID: {{counter.id}})
        </div>
    </div>`
});

// eslint-disable-next-line no-unused-vars
const app = new Vue({
    el: "#app",
    data: {
        userProfile: generateDefaultProfile(),
        inputModel: {
            date: "",
            name: "",
            reverse: false
        },
        isEditOrderMode: false,
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
        },
        isValidDate() {
            return isValidDate(this.inputModel.date);
        }
    },
    methods: {
        addDate() {
            this.userProfile.counter.push({
                date: this.inputModel.date,
                name: this.inputModel.name.trim() === "" ? "New Counter" : this.inputModel.name,
                reverse: this.inputModel.reverse,
                id: this.userProfile.nextId
            });
            this.userProfile.nextId++;
        },
        updateCurrentDate() {
            const date = new Date(Date.now());
            date.setHours(0, 0, 0, 0);
            this.currentDate = date;
        },
        updateCounter(index, newProp) {
            const counter = this.userProfile.counter[index];
            counter.name = newProp.name === "" ? "New Counter" : newProp.name;
            counter.date = newProp.date;
        },
        deleteCounter(i) {
            if (confirm("Do you want to delete this counter?")) {
                this.userProfile.counter.splice(i, 1);
            }
        }
    },
    watch: {
        userProfile: {
            deep: true,
            handler(data) {
                saveToLocalStorage(data);
            }
        }
    },
    created() {
        const userProfile = loadFromLocalStorage();
        // Check for profile update
        updateUserProfile(userProfile);
        this.userProfile = userProfile;
    },
    mounted() {
        this.updateCurrentDate();
        this.inputModel.date = this.currentDateStr;
        setInterval(this.updateCurrentDate, 1000);
    }
});

function isValidDate(date) {
    if (date === "") {
        return false;
    }
    try {
        const year = parseInt(date.split("-")[0], 10);
        return year >= 1970;
    } catch (e) {
        console.error(e);
        return false;
    }
}

// This should mutate the original profile
function updateUserProfile(profile) {
    // Before the existance of profile version
    if (profile.version === undefined) {
        profile.version = "20231015-1";
    }

    // Added IDs to each counter.
    if (profile.version === "20231015-1") {
        for (let i = 0; i < profile.counter.length; i++) {
            profile.counter[i].id = i;
        }
        profile.nextId = profile.counter.length;
        profile.version = "20231025-1";
    }
}

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
        console.error("Error when parsing user profile: default profile loaded instead.");
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