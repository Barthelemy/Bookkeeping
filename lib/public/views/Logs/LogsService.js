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

import { fetchClient } from '/js/src/index.js';

/**
 * LogsService frontend
 */
export default class LogsService {
    /**
     * LogService constructor
     */
    constructor() { }

    /**
     * Retrieve every relevant log from the API
     * @param {Object} params All the given parameters
     * @returns {undefined} Injects the data object with the response data
     */
    async fetchAllLogs(params) {
        const endpoint = `/api/logs?${new URLSearchParams(params).toString()}`;
        const response = await fetchClient(endpoint, { method: 'GET' });
        return await response.json();
    }

    /**
     * Retrieve a specified log from the API
     * @param {Number} id The ID of the log to be found
     * @returns {undefined} Injects the data object with the response data
     */
    async fetchLogById(id) {
        const response = await fetchClient(`/api/logs/${id}/tree`, { method: 'GET' });
        return await response.json();
    }

    /**
     * Create the log with the variables set in the model, handling errors appropriately
     * @param {Object} log the log that needs to be uploaded
     * @param {Object} model the
     * @returns {undefined}
     */
    async createLog(log) {
        const tags = log.selectedTags;
        const runs = log.selectedRuns;
        const { parentLogId } = log;
        const { runNumbers } = log;

        const body = {
            title: log.title,
            text: log.text,
            ...runs.length > 0 && { runs },
            ...parentLogId > 0 && { parentLogId },
            ...runNumbers && { runNumbers },
        };

        const options = {
            method: 'POST',
            headers: { Accept: 'application/json' },
        };
        const { attachments } = log;

        if (attachments.length > 0 || tags.length > 0) {
            // eslint-disable-next-line no-undef
            const formData = new FormData();
            Object.entries(body).forEach(([key, value]) => formData.append(key, value));
            [...tags].forEach((tags) => formData.append('tags[]', tags));
            [...attachments].forEach((attachment, index) => formData.append(`attachments.${index}`, attachment));

            options.body = formData;
        } else {
            options.body = JSON.stringify(body);
            options.headers['Content-Type'] = 'application/json';
        }

        const response = await fetchClient('/api/logs', options);
        return await response.json();
    }
}
