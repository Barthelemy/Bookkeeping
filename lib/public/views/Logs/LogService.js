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

import { fetchClient, RemoteData } from '/js/src/index.js';

/**
 * LogsService frontend
 */
class LogService {
    /**
     * LogService constructor
     */
    constructor() {
    }

    /**
     * Retrieve every relevant log from the API
     * @returns {undefined} Injects the data object with the response data
     */
    async fetchAllLogs() {
        if (!this.model.tags.getTags().isSuccess()) {
            this.logs = RemoteData.loading();
            this.notify();
        }

        if (!this.model.runs.getRuns().isSuccess()) {
            this.logs = RemoteData.loading();
            this.notify();
        }

        const params = {
            ...this.titleFilterText && {
                'filter[title]': this.titleFilterText,
            },
            ...this.authorFilterText && {
                'filter[author]': this.authorFilterText,
            },
            ...this.createdFilterFrom && {
                'filter[created][from]':
                    new Date(`${this.createdFilterFrom.replace(/\//g, '-')}T00:00:00.000`).getTime(),
            },
            ...this.createdFilterTo && {
                'filter[created][to]':
                    new Date(`${this.createdFilterTo.replace(/\//g, '-')}T23:59:59.999`).getTime(),
            },
            ...this.tagFilterValues.length > 0 && {
                'filter[tag][values]': this.tagFilterValues.join(),
                'filter[tag][operation]': this.tagFilterOperation.toLowerCase(),
            },
            ...this.runFilterValues.length > 0 && {
                'filter[run][values]': this.runFilterValues.join(),
                'filter[run][operation]': this.runFilterOperation.toLowerCase(),
            },
            ...this.sortingColumn && this.sortingOperation && {
                [`sort[${this.sortingColumn}]`]: this.sortingOperation,
            },
            'page[offset]': this.logs.payload && this.logsPerPage === Infinity ?
                this.logs.payload.length : (this.selectedPage - 1) * this.logsPerPage,
            'page[limit]': this.logsPerPage === Infinity ? this.model.INFINITE_SCROLL_CHUNK_SIZE : this.logsPerPage,
        };

        const endpoint = `/api/logs?${new URLSearchParams(params).toString()}`;
        const response = await fetchClient(endpoint, { method: 'GET' });
        const result = await response.json();

        if (result.data) {
            if (this.isInfiniteScrollEnabled()) {
                const payload = this.logs && this.logs.payload ? [...this.logs.payload, ...result.data] : result.data;
                this.logs = RemoteData.success(payload);
            } else {
                this.logs = RemoteData.success(result.data);
            }

            this.totalPages = result.meta.page.pageCount;
        } else {
            this.logs = RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
        }

        this.notify();
    }

    /**
     * Retrieve a specified log from the API
     * @param {Number} id The ID of the log to be found
     * @returns {undefined} Injects the data object with the response data
     */
    async fetchOneLog(id) {
        this.logs = RemoteData.loading();
        this.notify();

        const response = await fetchClient(`/api/logs/${id}/tree`, { method: 'GET' });
        const result = await response.json();

        if (result.data) {
            this.logs = RemoteData.success([result.data]);
        } else {
            this.logs = RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
        }
        this.detailed_post_ids = [];
        this.posts = [];
        this.showAllPosts = true;
        this.notify();
    }

    /**
     * Create the log with the variables set in the model, handling errors appropriately
     * @param {Object} log the log that needs to be uploaded
     * @returns {undefined}
     */
    async createLog(log) {
        this.createdLog = RemoteData.loading();
        this.notify();

        const title = log.getTitle();
        const text = this.getText();
        const tags = this.getSelectedTags();
        const runs = this.getSelectedRuns();
        const parentLogId = this.getParentLogId();
        const runNumbers = this.getRunNumbers();

        const body = {
            title,
            text,
            ...runs.length > 0 && { runs },
            ...parentLogId > 0 && { parentLogId },
            ...runNumbers && { runNumbers },
        };

        const options = {
            method: 'POST',
            headers: { Accept: 'application/json' },
        };
        const attachments = this.getAttachments();

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
        const result = await response.json();

        if (result.data) {
            this.createdLog = RemoteData.success(result.data);
            this.title = '';
            this.text = '';
            this.runNumbers = null;

            await this.model.router.go(`/?page=log-detail&id=${this.createdLog.payload.id}`);
        } else {
            this.createdLog = RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
            this.notify();
        }
    }

    /**
     * Sets all data related to the Logs to `NotAsked` and clears pagination settings.
     * @returns {undefined}
     */
    clearLogs() {
        this.logs = RemoteData.NotAsked();
        this.collapsableColumns = [];
        this.collapsedColumns = [];
        this.infiniteScrollEnabled = false;
    }

    /**
     *
     *  Getters and setters
     */

    /**
     * Get the attachment values of the current log being created
     * @returns {Array} the attachments of the current log being created
     */
    getAttachments() {
        return this.attachments;
    }
}

module.exports = LogService;
