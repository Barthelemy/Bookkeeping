/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtute of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { Observable, RemoteData } from '/js/src/index.js';
import RunsService from './RunsService.js';

/**
 * Run class
 */
export default class Run extends Observable {
    /**
     * Constructor for a singular Run object
     * @param {Object} model Pass the model to access the given functions.
     * @returns {Object} An observable Run object.
     */
    constructor(model) {
        super();
        this.model = model;

        this.clearRun();
        this.clearAllEditors();
        this.runsService = new RunsService();
    }

    /**
     * Clear all editors in the model
     * @returns {void}
     */
    clearAllEditors() {
        this.tags = [];
        this.tagsChanged = false;
    }

    /**
     * Sets all data related to a run to their defaults.
     * @returns {undefined}
     */
    clearRun() {
        this.run = RemoteData.NotAsked();
        this.logsOfRun = RemoteData.NotAsked();
        this.flpsOfRun = RemoteData.NotAsked();
    }

    /**
     * Updates the selected tag ID array according to the HTML attributes of the options
     * @param {HTMLCollection} selectedOptions The currently selected tags by the user, according to HTML specification
     * @returns {void}
     */
    setSelectedTags(selectedOptions) {
        const selectedTagsIds = Array.from(selectedOptions)
            .map(({ value }) => parseInt(value, 10))
            .sort((a, b) => a - b);
        if (!selectedTagsIds.every((value, i) => value === this.tags[i])
            || selectedTagsIds.length === 0) {
            this.tags = selectedTagsIds;
            this.tagsChanged = true;
            this.notify();
        }
    }

    /**
     * Update (overwrite) run tags
     * @return {void}
     */
    async updateRunTags() {
        const { id } = this.run.payload;
        const tags = this.getSelectedTags();

        this.run = RemoteData.loading();
        this.notify();

        const result = await this.runsService.updateRunTags(id, tags);

        if (result.data) {
            this.run = RemoteData.success(result.data);
            this.tags = this.run.payload.tags.map(({ id }) => id);
        } else {
            RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
        }
        this.tagsChanged = false;
        this.notify();
    }

    /**
     * Retrieve all associated logs for a specified run from the API
     * @param {Number} id The ID of the run to be found
     * @returns {undefined} Injects the data object with the response data
     */
    async fetchLogsOfRun(id) {
        this.logsOfRun = RemoteData.loading();
        this.notify();

        const result = await this.runsService.fetchLogsOfRun(id);

        if (result.data) {
            this.logsOfRun = RemoteData.success(result.data);
        } else {
            this.logsOfRun = RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
        }
        this.notify();
    }

    /**
     * Retrieve all associated logs for a specified run from the API
     * @param {Number} id The ID of the run to be found
     * @returns {undefined} Injects the data object with the response data
     */
    async fetchFlpsOfRun(id) {
        this.flpsOfRun = RemoteData.loading();
        this.notify();

        const result = await this.runsService.fetchFlpsOfRun(id);

        if (result.data) {
            this.flpsOfRun = RemoteData.success(result.data);
        } else {
            this.flpsOfRun = RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
        }
        this.notify();
    }

    /**
     * Getters and Setters
     */

    /**
     * Get the tag values of the current run being edited
     * @returns {Array} the tag objects of the current run being edited
     */
    getSelectedTags() {
        return this.tags;
    }

    /**
     * Get the current state of tags: if they were changed by user or not
     * @return {boolean} if tags were changed by user or not
     */
    selectedTagsChanged() {
        return this.tagsChanged;
    }

    /**
     * Getter for Logs data associated with a singular run
     * @returns {RemoteData} Returns the logs of a run
     */
    get logsOfRun() {
        return this._logsOfRun;
    }

    /**
     * Setter for Logs data associated with a singular run.
     * @param {Object} logs Sets the logs of the run.
     */
    set logsOfRun(logs) {
        this._logsOfRun = logs;
    }

    /**
     * Getter for Logs data associated with a singular run
     * @returns {RemoteData} Returns the flps of a run
     */
    get flpsOfRun() {
        return this._flpsOfRun;
    }

    /**
     * Setter for Logs data associated with a singular run
     * @param {Object} flps Sets the flps of the run.
     */
    set flpsOfRun(flps) {
        this._flpsOfRun = flps;
    }
}
