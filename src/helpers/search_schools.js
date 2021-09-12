import fetch from "node-fetch";

import School from "./classes/School.js";

/**
 * Search for schools matching the specified search query
 *
 * @typedef {import("./classes/School")} School
 * 
 * @param {string} query - What to search for
 * 
 * @return {School[]} - All schools matching the specified search query
 *
 * @example searchSchools("My Hero Academia")
*/
const searchSchools = async (query) => {
    const response = await fetch("https://mobile.webuntis.com/ms/schoolquery2?m=searchSchool&v=i3.22.0", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "id": "untis-js",
            "params": [{
                "search": query
            }],
            "method": "searchSchool",
            "jsonrpc": "2.0"
        })
    });

    const json = await response.json();

    const schools = json["result"]["schools"].map(schoolJSON => {
        const school = new School();

        school.serverHostname = schoolJSON["server"];
        school.serverURL = schoolJSON["serverUrl"];
        school.mobileServiceURL = schoolJSON["mobileServiceUrl"];

        school.address = schoolJSON["address"];
        school.id = schoolJSON["schoolId"];
        school.displayName = schoolJSON["displayName"];
        school.loginName = schoolJSON["loginName"];

        return school;
    });

    return schools;
}

export default searchSchools;