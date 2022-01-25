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

/**
 * Builder for filter params
 */
export default class ParamsBuilder {
    /**
     * Constructor for ParamsBuilder
     */
    constructor() {
        this.params = {};
    }

    /**
     * Adds identifier and value to object
     * @param {String} identifier the given identifier
     * @param {Object} parameter the value that needs to be added
     * @returns {undefined}
     */
    addParameter(identifier, parameter) {
        if (parameter) {
            this.params[identifier] = parameter;
        }
    }

    /**
     * Validates and creates a date to add as a parameter
     * @param {String} identifier the given identifier
     * @param {String} date current date as a string object
     * @param {String} time timestring
     * @returns {undefined}
     */
    addDateTime(identifier, date, time) {
        if (date) {
            //Create datetime
            const newDate = new Date(date.replace(/\//g, '-') + time).getTime();
            this.addParameter(identifier, newDate);
        }
    }

    /**
     * Creates parameter with the current date and timer as: T00:00:00.000 to use as a start date.
     * @param {String} identifier the given identifier
     * @param {String} date a given date string.
     * @returns {undefined}
     */
    addStartDate(identifier, date) {
        const dayStart = 'T00:00:00.000';
        this.addDateTime(identifier, date, dayStart);
    }

    /**
     * Creates parameter with the current date and timer as: T23:59:59.999 to use as an end date.
     * @param {String} identifier the given identifier
     * @param {String} date a given date string
     * @returns {undefined}
     */
    addEndDate(identifier, date) {
        const dayEnd = 'T23:59:59.999';
        this.addDateTime(identifier, date, dayEnd);
    }

    /**
     * Builds params object
     * @returns {Object} returns added parameters
     */
    build() {
        return this.params;
    }
}
