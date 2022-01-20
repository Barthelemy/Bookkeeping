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
import LogsService from './LogsService';

/**
 * Run class
 */
class Run extends Observable {
    /**
     * Constructor for a singular Run object
     * @param {Object} model Pass the model to access the given functions.
     * @returns {Object} An observable Run object.
     */
    constructor(model) {
        super();
        this.model = model;
        this.logsOfRun = [];
        this.flpsOfRun = [];
        this.runsService = new LogsService();
    }

    /**
     * Clear all editors in the model
     * @returns {void}
     */
    clearAllEditors() {
        this.tags = [];
        this.tagsChanged = false;
    }
}

module.exports = Run;
