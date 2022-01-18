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
     * Adds identifier and value to object if shouldAdd == true
     * @param {String} identifier the given identifier
     * @param {undefined} parameter 
     * @param {boolean} shouldAdd 
     */
    addParameter(identifier, parameter, shouldAdd) {
        if (shouldAdd) {
            this.params[identifier] = parameter;
        }
    }

    /**
     * Builds params object
     * @returns {Object} returns added params
     */
    build() {
        return this.params;
    }
}
