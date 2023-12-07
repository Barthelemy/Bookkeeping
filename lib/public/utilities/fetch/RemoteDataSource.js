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
import { Observable, RemoteData } from '/js/src/index.js';
import { getRemoteData } from './getRemoteData.js';
import { ObservableData } from '../ObservableData.js';

/**
 * Service class providing observable data fetching process
 */
export class RemoteDataSource extends Observable {
    /**
     * Constructor
     */
    constructor() {
        super();

        /**
         * @type {ObservableData<RemoteData>}
         * @private
         */
        this._observableData = new ObservableData(RemoteData.notAsked());
        this._abortController = null;
    }

    /**
     * Fetch the given endpoint to fill current data
     *
     * @param {string} endpoint the endpoint to fetch
     * @return {Promise<void>} resolves once the data fetching has ended
     */
    async fetch(endpoint) {
        this._observableData.current = RemoteData.loading();

        const abortController = new AbortController();
        try {
            if (this._abortController) {
                this._abortController.abort();
            }
            this._abortController = abortController;
            const { data } = await getRemoteData(endpoint, { signal: this._abortController.signal });
            this._observableData.current = RemoteData.success(data);
        } catch (error) {
            // Use local variable because the class member (this._abortController) may already have been override in another call
            if (!abortController.signal.aborted) {
                this._observableData.current = RemoteData.failure(error);
            }
            throw error;
        }
    }

    /**
     * Return the observable remote data provided by this source
     *
     * @return {ObservableData<RemoteData>} the observable remote data
     */
    get observableData() {
        return this._observableData;
    }
}