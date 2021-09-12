import UntisClient from "./src/UntisClient.js";

import searchSchools from "./src/helpers/search_schools.js";

export default class UntisLib {
    /**
     * Create a client for the Untis APIs
     * 
     * @typedef {import("./src/helpers/classes/School")} School
     * @typedef {import("./src/UntisClient")} UntisClient
     * 
     * @param {School} school - The school you want to connect to
     * 
     * @return {UntisClient}
    */
    static client(school) {
        return new UntisClient(school);
    }

    /**
     * Search for schools matching the specified search query
     *
     * @typedef {import("./src/helpers/classes/School")} School
     * 
     * @param {string} query - What to search for
     * 
     * @return {School[]} All schools matching the specified search query
     *
     * @example searchSchools("My Hero Academia")
    */
    static async searchSchools(query) {
        return await searchSchools(query);
    }
}