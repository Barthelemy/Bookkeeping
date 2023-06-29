/**
 *  @license
 *  Copyright CERN and copyright holders of ALICE O2. This software is
 *  distributed under the terms of the GNU General Public License v3 (GPL
 *  Version 3), copied verbatim in the file "COPYING".
 *
 *  See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 *  In applying this license CERN does not waive the privileges and immunities
 *  granted to it by virtue of its status as an Intergovernmental Organization
 *  or submit itself to any jurisdiction.
 */

const { dplProcessService } = require('../../../../../lib/server/services/dpl/DplProcessService.js');

const assert = require('assert');
const { expect } = require('chai');
const { NotFoundError } = require('../../../../../lib/server/errors/NotFoundError.js');

module.exports = () => {
    it('should successfully return the list of detectors that have an executed process for a given run', async () => {
        const detectors = await dplProcessService.getAllDetectorsWithExecutedProcessesByRun({ runNumber: 106 });
        expect(detectors.map(({ id }) => id)).to.eql([1, 2]);
        expect(detectors.every(({ processesExecutions }) => processesExecutions.length === 0)).to.be.true;
    });

    it('should throw an error if the given run do not exist', async () => {
        await assert.rejects(
            () => dplProcessService.getAllDetectorsWithExecutedProcessesByRun({ runNumber: 999 }),
            new NotFoundError('Run with this run number (999) could not be found'),
        );
    });
};