import fetch from "node-fetch";

import Subject from "./classes/Subject.js";

/**
 * Fetch all subjects a user can see
 * 
 * @typedef {import("./classes/Subject")} Subject
 * 
 * @param {string} serverHostname - The hostname of the WebUntis server
 * @param {string} loginName - The name of the school you want to fetch from
 * @param {string} authCookieString - The string of cookies used for authentication
 * 
 * @return {Subject[]} - All subjects
 *
 * @example fetchAllSubjects("example.webuntis.com", "my-hero-academia", "a=b")
*/
const fetchAllSubjects = async (serverHostname, loginName, authCookieString) => {
    const response = await fetch(`https://${serverHostname}/WebUntis/jsonrpc.do?school=${loginName.split(" ").join("+")}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cookie": authCookieString
        },
        body: JSON.stringify([{
            "id": "untis-js",
            "params": {},
            "method": "getSubjects",
            "jsonrpc": "2.0"
        }])
    });

    const json = await response.json();

    const subjects = json["result"].map(subjectJSON => {
        const subject = new Subject();

        subject.id = subjectJSON["id"];
        subject.name = subjectJSON["name"];
        subject.longName = subjectJSON["longName"];

        return subject;
    });

    return subjects;
}

export default fetchAllSubjects;