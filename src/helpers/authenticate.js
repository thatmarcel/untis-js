import fetch from "node-fetch";

/**
 * Authenticate a user with a username and password
 * 
 * @typedef {{ userId: number, userType: number, authCookieString: string }} AuthenticationResponse
 * 
 * @param {string} serverHostname - The hostname of the WebUntis server
 * @param {string} loginName - The name of the school you want to authenticate with
 * @param {string} username - A valid username on the WebUntis instance
 * @param {string} password - The password belonging to the username
 * 
 * @return {AuthenticationResponse} - The cookie string needed to make authenticated requests and the user's id and type
 *
 * @example authenticateClient("example.webuntis.com", "my-hero-academia", "username", "password")
*/
const authenticateClient = async (serverHostname, loginName, username, password) => {
    const response = await fetch(`https://${serverHostname}/WebUntis/jsonrpc.do?school=${loginName.split(" ").join("+")}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "id": "untis-js",
            "params": {
                "user": username,
                "password": password,
                "client": "untis-js"
            },
            "method": "authenticate",
            "jsonrpc": "2.0"
        })
    });

    const json = await response.json();

    if (!json["result"]["sessionId"] || !json["result"]["personId"]) {
        throw "Authentication failed";
    }

    return {
        authCookieString: `JSESSIONID=\"${json["result"]["sessionId"]}\"; schoolname=\"${loginName}\"`,
        userId: json["result"]["personId"],
        userType: json["result"]["personType"]
    }
}

export default authenticateClient;