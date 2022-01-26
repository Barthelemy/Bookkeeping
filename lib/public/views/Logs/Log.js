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
import LogsService from './LogsService.js';
import { setMarkDownBox } from '../../components/common/markdown.js';
import { removeElement } from '../../utilities/removeElement.js';

/**
 * Log class
 */
export default class Log extends Observable {
    /**
     * Constructor for a log object
     * @param {Object} model Pass the model to access the given functions.
     * @returns {Object} An observable log creation object.
     */
    constructor(model) {
        super();
        this.model = model;

        this.clearAllEditors();
        this.logsService = new LogsService();
    }

    /**
     * Clear the single editor in the model
     * @returns {undefined}
     */
    clearSingleEditor() {
        this.editor = null;
        this.isPreviewActive = false;
    }

    /**
     * Clear all editors in the model
     * @returns {undefined}
     */
    clearAllEditors() {
        this.isPreviewActive = false;
        this._parentLogId = -1;

        this.editor = null;
        this.editors = {};

        this._text = '';
        this._title = '';
        this._tags = [];
        this._runs = [];
        this._runNumbers = null;
        this._attachments = [];

        this._lastCreatedLog = RemoteData.NotAsked();

        // Remove trailing CodeMirror div(s)
        removeElement('.CodeMirror');
    }

    /**
     * Creates log and saves the last created log.
     * After creation the users will be notified.
     * @returns {undefined}
     */
    async save() {
        this._lastCreatedLog = RemoteData.loading();
        this.notify();

        const tags = this._tags;
        const runs = this._runs;
        const attachments = this._attachments;
        const { parentLogId } = this;
        const { runNumbers } = this;

        const body = {
            title: this._title,
            text: this._text,
            ...runs.length > 0 && { runs },
            ...parentLogId > 0 && { parentLogId },
            ...runNumbers && { runNumbers },
        };

        const options = {
            method: 'POST',
            headers: { Accept: 'application/json' },
        };
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

        const result = await this.logsService.createLog(options);

        if (result.data) {
            this._lastCreatedLog = RemoteData.success(result.data);
            this._title = '';
            this._text = '';
            this._runNumbers = null;

            await this.model.router.go(`/?page=log-detail&id=${this._lastCreatedLog.payload.id}`);
        } else {
            this._lastCreatedLog = RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
            this.notify();
        }
    }

    /**
     * Convert the textarea of the preview to a Markdown box
     * @param {String} textAreaId The id of the preview box
     * @param {Object} changeHandler The optional changehandler with 2 keys: location and name to get the setter method
     * @param {Object} readOnlyProperties Properties of the readOnlyBox
     * @returns {undefined}
     */
    setMarkdownBox(textAreaId, changeHandler = {
        location: '',
        name: '',
    },
    readOnlyProperties = {
        isReadOnly: false,
        textValue: '',
    }) {
        const {
            isReadOnly,
            textValue,
        } = readOnlyProperties;
        const shouldRenderReadOnly = textValue && isReadOnly;
        const mdBoxStyling = shouldRenderReadOnly ?
            {
                width: 'auto',
                height: 'auto',
            } : {
                width: 'auto',
                height: '16rem',
            };
        if (textAreaId in this.editors) {
            this.editors[textAreaId].setValue(textValue);
            this.notify();
            return;
        }

        !this.isPreviewActive && setTimeout(() => {
            this.editor = setMarkDownBox(textAreaId, this.model, changeHandler, isReadOnly, mdBoxStyling);
        }, 40);

        !this.editor && setTimeout(() => {
            this.editor !== undefined && (this.editors[textAreaId] = this.editor);
        }, 50);

        this.isPreviewActive = !this.isPreviewActive;
        this.notify();
    }

    /**
     * Removes markdown box
     * @param {String} textAreaId The id of the preview box
     * @returns {undefined}
     */
    removeMarkdownBox(textAreaId) {
        delete this.editors[textAreaId];
        this.notify();
    }

    /**
     * Flushes all attachments of the current log being created
     * @returns {undefined}
     */
    clearAttachments() {
        this.model.document.getElementById('attachments').value = '';
        this._attachments = [];
        this.notify();
    }

    /**
     * Getters and Setters
     */

    /**
     * Returns title
     * @returns {string} returns title
     */
    get title() {
        return this._title;
    }

    /**
     * Returns the last created log.
     * @returns {Object} created log.
     */
    get lastCreatedLog() {
        return this._lastCreatedLog;
    }

    /**
     * Returns text
     * @returns {string} returns text
     */
    get text() {
        return this._text;
    }

    /**
     * Returns runs
     * @returns {Array} returns runs
     */
    get runs() {
        return this._runs;
    }

    /**
     * Returns run numbers
     * @returns {Array} returns a list run numbers
     */
    get runNumbers() {
        return this._runNumbers;
    }

    /**
     * Set the runNumbers parameter of the current log being created
     * @param {string} runNumbers Received string from the view
     * @returns {undefined}
     */
    set runNumbers(runNumbers) {
        this._runNumbers = runNumbers;
        this.notify();
    }

    /**
     * Updates the selected tag ID array according to the HTML attributes of the options
     * @param {HTMLCollection} selectedOptions The currently selected tags by the user, according to HTML specification
     * @returns {undefined}
     */
    set selectedTags(selectedOptions) {
        this._tags = [...selectedOptions].map(({ value }) => parseInt(value, 10));
        this.notify();
    }

    /**
     * Get the run values of the current log being created
     * @returns {Array} the run objects of the current log being created
     */
    get selectedTags() {
        return this._tags;
    }

    /**
     * Sets the current title and notifies other subscribers.
     * @param {string} title sets the current title.
     */
    set title(title) {
        this._title = title;
        this.notify();
    }

    /**
     * Setter for parentLog
     * @param {Integer} id the parentLogId
     */
    set parentLogId(id) {
        this._parentLogId = id;
    }

    /**
     * Get the parent log id of the current reply log being created, if any
     * @returns {Number} parent log id of the current reply log
     */
    get parentLogId() {
        return this._parentLogId;
    }

    /**
     * Setter for text not a set text method because of the setMarkdownBox functionality.
     * @param {string} text sets the text with
     * @returns {undefined}
     */
    setText(text) {
        this._text = text;
        this.notify();
    }

    /**
     * Get the run values of the current log being created
     * @returns {Array} the run objects of the current log being created
     */
    get selectedRuns() {
        return this._runs;
    }

    /**
     * Get the attachment values of the current log being created
     * @returns {Array} the attachments of the current log being created
     */
    get attachments() {
        return this._attachments;
    }

    /**
     * Adds one or more attachments to the current log being created
     * @param {FileList} files Received file objects from the view
     * @returns {undefined}
     */
    set attachments(files) {
        this._attachments = files;
        this.notify();
    }
}
