/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { fetchClient} from '/js/src/index.js';

/**
 * Does all the API calls for Runs.js
 */
export default class RunsService {

    /**
     * Retrieve all runs from the API
     * * @returns {Promise<JSON>} returns API response
     */
    async fetchAllRuns(params) {
        const endpoint = `/api/runs?${new URLSearchParams(params).toString()}`;
        const response = await fetchClient(endpoint, { method: 'GET' });
        return response.json();
    }

    /**
     * Retrieve a specified run from the API
     * @param {Number} id The ID of the run to be found
     * @returns {Promise<JSON>} returns API response
     */
    async fetchOneRun(id) {
        const response = await fetchClient(`/api/runs/${id}`, { method: 'GET' });
        return response.json();
    }

    /**
     * Retrieve all associated logs for a specified run from the API
     * @param {Number} id The ID of the run to be found
     * @returns {Promise<JSON>} returns API response
     */
    async fetchLogsOfRun(id) {
        const response = await fetchClient(`/api/runs/${id}/logs`, { method: 'GET' });
        return response.json();
    }

    /**
     * Retrieve all associated logs for a specified run from the API
     * @param {Number} id The ID of the run to be found
     * @returns {Promise<JSON>} returns API response
     */
    async fetchFlpsOfRun(id) {
        const response = await fetchClient(`/api/runs/${id}/flps`, { method: 'GET' });
        return response.json();
    }

    /**
     * Update (overwrite) run tags
     * @param {undefined} id The id of the run
     * @param {Array} tags The tags to update (overwrite) run with
     * @returns {Promise<JSON>} returns API response
     */
    async updateRunTags(id, tags) {
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tags,
            }),
        };
        const response = await fetchClient(`/api/runs/${id}`, options);
        return response.json();
    }
}
