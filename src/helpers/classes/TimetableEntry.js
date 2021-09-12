export default class TimetableEntry {
    /**
     * @type {number}
    */
    id;

    /**
     * @type {Date}
    */
    date;

    /**
     * @type {number}
    */
    startTime;

    /**
     * @type {string}
    */
    endTime;

    /**
     * @typedef {import("./Subject")} Subject
     * @type {Subject}
    */
    subject;

    /**
     * @typedef {import("./Room")} Room
     * @type {Room}
    */
    room;

    /**
     * @type {number}
    */
    lsNumber;

    /**
     * @type {boolean}
    */
    isCancelled;
}