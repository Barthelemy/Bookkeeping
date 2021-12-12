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

/**
 * Log class
 */
class Log {
    /**
     * Constructor for a log object
     */
    constructor() {
        this.title = null;
        this.parentLogId = null;
        this.text = null;
        this.runs = [];
        this.runNumbers = [];
        this.attachments;
    }

    /**
     * Getters and Setters
     */

    /**
     * Returns title
     * @returns {string} returns title
     */
    get title() {
        return this.title;
    }

    /**
     * Returns the id of the parent
     * @returns {Integer} returns the id of the parent
     */
    get parentLogId() {
        return this.parentLogId;
    }

    /**
     * Returns text
     * @returns {string} returns text
     */
    get text() {
        return this.text;
    }

    /**
     * Returns runs
     * @returns {Array} returns runs
     */
    get runs() {
        return this.runs;
    }

    /**
     * Returns run numbers
     * @returns {Array} returns a list run numbers
     */
    get runNumbers() {
        return this.runNumbers;
    }

    /**
     * Setter for parentLog
     * @param {Integer} id the parentLogId
     */
    set parentLogId(id) {
        this.parentLogId = id;
    }
}

module.exports = Log;
