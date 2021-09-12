import fetch from "node-fetch";

import TimetableEntry from "./classes/TimetableEntry.js";
import Subject from "./classes/Subject.js";
import Room from "./classes/Room.js";

const convertDateToUntis = (date) => {
    return (
        date.getFullYear().toString() +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString() +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString()
    );
}

const convertUntisToDate = (untisDate) => {
    const dateString = `${untisDate}`;
    return new Date(dateString.substring(0, 4) + "-" + dateString.substring(4, 6) + "-" + dateString.substring(6));
}

/**
 * Fetch a user's timetable between the specified dates
 * 
 * @typedef {import("./classes/TimetableEntry")} TimetableEntry
 * 
 * @param {string} serverHostname - The hostname of the WebUntis server
 * @param {string} loginName - The name of the school you want to fetch from
 * @param {string} authCookieString - The string of cookies used for authentication
 * @param {Date} startDate - The start date of the requested timetable
 * @param {Date} endDate - The end date of the requested timetable
 * @param {string} userId - A valid user id on the WebUntis instance
 * @param {string} userType - The user's person type
 * 
 * @return {TimetableEntry[]} - The entries of the requested timetable
 *
 * @example fetchTimetable("example.webuntis.com", "my-hero-academia", "a=b", new Date(), new Date(), 1234, 1)
*/
const fetchTimetable = async (serverHostname, loginName, authCookieString, startDate, endDate, userId, userType) => {
    const response = await fetch(`https://${serverHostname}/WebUntis/jsonrpc.do?school=${loginName.split(" ").join("+")}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cookie": authCookieString
        },
        body: JSON.stringify([{
            "id": "untis-js",
            "params": {
                "options": {
                    id: new Date().getTime(),
                    element: {
                        id: userId,
                        type: userType,
                    },
                    showLsText: true,
                    showStudentgroup: true,
                    showLsNumber: true,
                    showSubstText: true,
                    showInfo: true,
                    showBooking: true,
                    klasseFields: ["id", "name", "longname", "externalkey"],
                    roomFields: ["id", "name", "longname", "externalkey"],
                    subjectFields: ["id", "name", "longname", "externalkey"],
                    teacherFields: ["id", "name", "longname", "externalkey"],
                    endDate: convertDateToUntis(endDate),
                    startDate: convertDateToUntis(startDate)
                }
            },
            "method": "getTimetable",
            "jsonrpc": "2.0"
        }])
    });

    const json = await response.json();

    const entries = json["result"].map(entryJSON => {
        const subject = new Subject();

        subject.id = entryJSON["su"][0]["id"];
        subject.name = entryJSON["su"][0]["name"];
        subject.longName = entryJSON["su"][0]["longname"];

        const room = new Room();

        room.id = entryJSON["ro"][0]["id"];
        room.name = entryJSON["ro"][0]["name"];
        room.longName = entryJSON["ro"][0]["longname"];
        room.isChanged = !!(entryJSON["ro"][0]["orgname"] || entryJSON["ro"][0]["orgid"])
        room.originalRoomId = entryJSON["ro"][0]["orgid"];
        room.originalRoomName = entryJSON["ro"][0]["orgname"];

        const entry = new TimetableEntry();

        entry.id = entryJSON["id"];
        entry.date = convertUntisToDate(entryJSON["date"]);
        entry.startTime = entryJSON["startTime"];
        entry.endTime = entryJSON["endTime"];
        entry.subject = subject;
        entry.room = room;
        entry.isCancelled = entryJSON["code"] === "cancelled";
        entry.lsNumber = entryJSON["lsnumber"];

        return entry;
    });

    return entries;
}

export default fetchTimetable;