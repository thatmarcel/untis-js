import authenticateClient from "./helpers/authenticate.js";
import fetchTimetable from "./helpers/fetch_timetable.js";
import fetchAllSubjects from "./helpers/fetch_all_subjects.js";

export default class UntisClient {
    /**
     * The school you want to connect to
     * 
     * @typedef {import("./helpers/classes/School")} School
     * @type {School}
    */
    school;

    /**
     * A valid authentication cookie string for the authenticated user, if existent
     * 
     * @type {string=}
    */
    authCookieString;

    /**
     * The id of the authenticated user, if existent
     * 
     * @type {number=}
    */
    userId;

    /**
     * The type of the authenticated user, if existent
     * 
     * @type {number=}
    */
    userType;

    /**
     * Create a client for the Untis APIs
     * 
     * @typedef {import("./helpers/classes/School")} School
     * 
     * @param {School} school - The school you want to connect to
    */
    constructor(school) {
        this.school = school;
    }

    /**
     * Authenticate with a username and password
     * 
     * @typedef {import("./helpers/classes/School")} School
     * 
     * @param {string} username - A valid username on the WebUntis instance
     * @param {string} password - The password belonging to the username
     *
     * @example authenticate("username", "password")
    */
    async authenticate(username, password) {
        const authenticationResponse = await authenticateClient(this.school.serverHostname, this.school.loginName, username, password);
        this.authCookieString = authenticationResponse.authCookieString;
        this.userId = authenticationResponse.userId;
        this.userType = authenticationResponse.userType;
    }

    /**
     * Fetch the authenticated user's timetable between the specified dates
     * 
     * @typedef {import("./helpers/classes/TimetableEntry")} TimetableEntry
     * 
     * @param {Date} startDate - The start date of the requested timetable
     * @param {Date} endDate - The end date of the requested timetable
     * 
     * @return {TimetableEntry[]} - The entries of the requested timetable
     *
     * @example fetchTimetableBetween(new Date(), new Date())
    */
    async fetchTimetableBetween(startDate, endDate) {
        return await fetchTimetable(
            this.school.serverHostname,
            this.school.loginName,
            this.authCookieString,
            startDate,
            endDate,
            this.userId,
            this.userType
        );
    }

    /**
     * Fetch the authenticated user's timetable specified weeks in the future
     * 
     * @typedef {import("./helpers/classes/TimetableEntry")} TimetableEntry
     *
     * @param {Date} startDate - The amount of weeks until the desired time
     * 
     * @return {TimetableEntry[]} - The entries of the requested timetable
     * 
     * @example fetchTimetableInWeeks(3)
    */
    async fetchTimetableInWeeks(weeks) {
        let prevMonday = new Date();
        prevMonday.setDate((prevMonday.getDate() - (prevMonday.getDay() + 6) % 7) + (weeks * 7));

        let fridayAfterMonday = new Date();
        fridayAfterMonday.setDate(prevMonday.getDate() + 4);

        return await fetchTimetable(
            this.school.serverHostname,
            this.school.loginName,
            this.authCookieString,
            prevMonday,
            fridayAfterMonday,
            this.userId,
            this.userType
        );
    }

    /**
     * Fetch the authenticated user's current timetable
     * 
     * @typedef {import("./helpers/classes/TimetableEntry")} TimetableEntry
     * 
     * @return {TimetableEntry[]} - The entries of the requested timetable
     *
     * @example fetchCurrentTimetable()
    */
    async fetchCurrentTimetable() {
        let prevMonday = new Date();
        prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);

        let fridayAfterMonday = new Date();
        fridayAfterMonday.setDate(prevMonday.getDate() + 4);

        return await fetchTimetable(
            this.school.serverHostname,
            this.school.loginName,
            this.authCookieString,
            prevMonday,
            fridayAfterMonday,
            this.userId,
            this.userType
        );
    }

    /**
     * Fetch all subjects the authenticated user can see
     * 
     * @typedef {import("./helpers/classes/Subject")} Subject
     * 
     * @return {Subject[]} - All subjects
     *
     * @example fetchAllSubjects()
    */
    async fetchAllSubjects() {
        return await fetchAllSubjects(
            this.school.serverHostname,
            this.school.loginName,
            this.authCookieString
        );
    }
}