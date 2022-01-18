/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. this._software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this._license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { Observable, RemoteData } from '/js/src/index.js';
import LogsService from './LogsService.js';

/**
 * Model representing handlers for log entries page
 */
export default class Overview extends Observable {
    /**
     * The constructor of the Overview model object
     * @param {Object} model Pass the model to access the defined functions
     * @returns {Object} Constructs the Overview model
     */
    constructor(model) {
        super();
        this.model = model;

        this.clearLogs();
        this.resetLogsParams(false);
        this.logsService = new LogsService();
    }

    /**
     * Retrieve every relevant log from the API
     * @returns {undefined} Injects the data object with the response data
     */
    async fetchFilteredLogs() {
        if (!this.model.tags.getTags().isSuccess()) {
            this._logs = RemoteData.loading();
            this.notify();
        }

        if (!this.model.runs.getRuns().isSuccess()) {
            this._logs = RemoteData.loading();
            this.notify();
        }
        const params = {
            ...this._titleFilterText && {
                'filter[title]': this._titleFilterText,
            },
            ...this._authorFilterText && {
                'filter[author]': this._authorFilterText,
            },
            ...this._createdFilterFrom && {
                'filter[created][from]':
                    new Date(`${this._createdFilterFrom.replace(/\//g, '-')}T00:00:00.000`).getTime(),
            },
            ...this._createdFilterTo && {
                'filter[created][to]':
                    new Date(`${this._createdFilterTo.replace(/\//g, '-')}T23:59:59.999`).getTime(),
            },
            ...this._tagFilterValues.length > 0 && {
                'filter[tag][values]': this._tagFilterValues.join(),
                'filter[tag][operation]': this._tagFilterOperation.toLowerCase(),
            },
            ...this._runFilterValues.length > 0 && {
                'filter[run][values]': this._runFilterValues.join(),
                'filter[run][operation]': this._runFilterOperation.toLowerCase(),
            },
            ...this._sortingColumn && this._sortingOperation && {
                [`sort[${this._sortingColumn}]`]: this._sortingOperation,
            },
            'page[offset]': this._logs.payload && this._logsPerPage === Infinity ?
                this._logs.payload.length : (this._selectedPage - 1) * this._logsPerPage,
            'page[limit]': this._logsPerPage === Infinity ? this.model.INFINITE_SCROLL_CHUNK_SIZE : this._logsPerPage,
        };
        const result = await this.logsService.fetchAllLogs(params);
        if (result.data) {
            if (this.isInfiniteScrollEnabled()) {
                const payload = this._logs && this._logs.payload ? [...this._logs.payload, ...result.data] : result.data;
                this._logs = RemoteData.success(payload);
            } else {
                this._logs = RemoteData.success(result.data);
            }

            this._totalPages = result.meta.page.pageCount;
        } else {
            this._logs = RemoteData.failure(result.errors || [
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
    async fetchLogById(id) {
        this._logs = RemoteData.loading();
        this.notify();

        const result = await this.logsService.fetchLogById(id);

        if (result.data) {
            this._logs = RemoteData.success([result.data]);
        } else {
            this._logs = RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
        }
        this._detailed_post_ids = [];
        this._posts = [];
        this._showAllPosts = true;
        this.notify();
    }

    /**
     * Toggles view mode of all posts in detailed view
     * @returns {undefined}
     */
    toggleAllPostView() {
        this._detailed_post_ids = this._showAllPosts ? this._posts : [];
        this._showAllPosts = !this._showAllPosts;
        this.notify();
    }

    /**
     * Getter for show/collapse all button state
     * @returns {boolean} Button state
     */
    isShowAll() {
        return this._showAllPosts;
    }

    /**
     * Function for adding post in detailed view posts list
     * @param {Integer} post_id ID of post to add
     * @returns {undefined}
     */
    addPost(post_id) {
        if (!(post_id in this._posts)) {
            this._posts.push(post_id);
        }
    }

    /**
     * Show log entry in detailed view
     * @param {Integer} id of log to show detailed
     * @returns {undefined}
     */
    showPostDetailed(id) {
        this._detailed_post_ids.push(id);
        this.notify();
    }

    /**
     * Show log entry collapsed
     * @param {Integer} id of log to collapsed
     * @returns {undefined}
     */
    collapsePostById(id) {
        const index = this._detailed_post_ids.indexOf(id, 0);
        if (index > -1) {
            this._detailed_post_ids.splice(index, 1);
        }
        this.notify();
    }

    /**
     * Returns all filtering, sorting and pagination settings to their default values
     * @param {Boolean} fetch Whether to refetch all logs after filters have been reset
     * @return {undefined}
     */
    resetLogsParams(fetch = true) {
        this._expandedFilters = [];
        this._activeFilters = [];

        this._titleFilterText = '';
        this._titleFilterDebounce = null;

        this._authorFilterText = '';
        this.authorFilterDebounce = null;

        this._createdFilterFrom = '';
        this._createdFilterTo = '';
        this.createdFilterDebounce = null;

        this._tagFilterOperation = 'AND';
        this._tagFilterValues = [];
        this._moreTags = false;

        this._runFilterDebounce = null;
        this._runFilterOperation = 'AND';
        this._runFilterValues = [];
        this._moreRuns = false;

        this._sortingColumn = '';
        this._sortingOperation = '';
        this._sortingPreviewColumn = '';
        this._sortingPreviewOperation = '';

        this._amountDropdownVisible = false;
        this._logsPerPage = 10;
        this._selectedPage = 1;
        this._totalPages = 1;

        /**
         * Value saved from perPageAmountInputComponent
         * @see perPageAmountInputComponent
         * @type {number}
         */
        this._customPerPage = 10;

        if (fetch) {
            this.fetchFilteredLogs();
        }
    }

    /**
     * Checks if any filter value has been modified from their default (empty)
     * @returns {Boolean} If any filter is active
     */
    isAnyFilterActive() {
        return (
            this._titleFilterText !== ''
            || this._authorFilterText !== ''
            || this._createdFilterFrom !== ''
            || this._createdFilterTo !== ''
            || this._tagFilterValues.length !== 0
            || this._runFilterValues.length !== 0
        );
    }

    /**
     * Toggle the expansion state (visibility) of a filter menu
     * @param {String} targetKey The key of the filter whose visibility should be toggled
     * @returns {undefined}
     */
    toggleFilterExpanded(targetKey) {
        if (this.isFilterExpanded(targetKey)) {
            this._expandedFilters = this._expandedFilters.filter((key) => key !== targetKey);
        } else {
            this._expandedFilters.push(targetKey);
        }
        this.notify();
    }

    /**
     * Check if a certain filter should be expanded (visible)
     * @param {String} targetKey The key of the filter whose visibility should be checked
     * @returns {Boolean} Whether the provided filter is expanded or not
     */
    isFilterExpanded(targetKey) {
        return this._expandedFilters.includes(targetKey);
    }

    /**
     * Add a run to the filter
     * @param {string} runs The runs to be added to the filter criteria
     * @returns {undefined}
     */
    set runsFilter(runs) {
        if (!/^[0-9,]*$/.test(runs)) {
            return;
        } else if (!runs.length) {
            this._runFilterValues = [];
            this.fetchFilteredLogs();
        } else {
            clearTimeout(this._runFilterDebounce);
            this._runFilterDebounce = setTimeout(() => {
                this._runFilterValues = runs.match(/\d+/g).map(Number);
                this.fetchFilteredLogs();
            }, 500);
        }
    }

    /**
     * Set a datetime for the creation datetime filter
     * @param {String} key The filter value to apply the datetime to
     * @param {Object} date The datetime to be applied to the creation datetime filter
     * @param {Boolean} valid Whether the inserted date passes validity check
     * @returns {undefined}
     */
    setCreatedFilter(key, date, valid) {
        if (valid) {
            this[`_createdFilter${key}`] = date;
            this.fetchFilteredLogs();
        }
    }

    /**
     * Set a datetime for the creation datetime filter, with a debounce delay
     * @param {String} key The filter value to apply the datetime to
     * @param {Object} date The datetime to be applied to the creation datetime filter
     * @param {Boolean} valid Whether the inserted date passes validity check
     * @returns {undefined}
     */
    setCreatedFilterWithDebounce(key, date, valid) {
        clearTimeout(this.createdFilterDebounce);
        this.createdFilterDebounce = setTimeout(() => this.setCreatedFilter(key, date, valid), 200);
    }

    /**
     * Add a tag to the filter
     * @param {string} tag The tag to be added to the filter criteria
     * @returns {undefined}
     */
    addTagToFilter(tag) {
        this._tagFilterValues = [...this._tagFilterValues, tag];
        this.fetchFilteredLogs();
    }

    /**
     * Remove a tag from the filter
     * @param {string} targetTag The tag that should be removed
     * @returns {undefined}
     */
    removeTagFromFilter(targetTag) {
        this._tagFilterValues = this._tagFilterValues.filter((tag) => tag !== targetTag);
        this.fetchFilteredLogs();
    }

    /**
     * Checks if a tag is already defined within the user's filter criteria
     * @param {String} tag The tag to check on
     * @return {Boolean} Whether the tag is in the user's filter criteria
     */
    isTagInFilter(tag) {
        return this._tagFilterValues.includes(tag);
    }

    /**
     * Toggles the visibility of tag filters above the predefined limit
     * @return {undefined}
     */
    toggleMoreTags() {
        this._moreTags = !this._moreTags;
        this.notify();
    }

    /**
     * Returns the currently set sorting operation for the given column
     * @param {String} key The column key to check on
     * @return {String} The sorting operation for the given column, null if this._column is not selected
     */
    getSortingOperation(key) {
        return key === this._sortingColumn ? this._sortingOperation : null;
    }

    /**
     * Returns the currently set sorting preview operation for the given column
     * @param {String} key The column key to check on
     * @return {String} The sorting preview operation for the given column, null if this._column is not hovered over
     */
    getSortingPreviewOperationByKey(key) {
        return key === this._sortingPreviewColumn ? this._sortingPreviewOperation : null;
    }

    /**
     * Empties the sorting preview
     * @return {undefined}
     */
    clearSortingPreviewValues() {
        this._sortingPreviewOperation = '';
        this.notify();
    }

    /**
     * Toggles the visibility of the menu within the log amounts dropdown
     * @return {Boolean} The new state of the amounts dropdown
     */
    toggleLogsDropdownVisible() {
        this._amountDropdownVisible = !this._amountDropdownVisible;
        this.notify();
    }

    /**
     * Sets all data related to the Logs to `NotAsked` and clears pagination settings.
     * @returns {undefined}
     */
    clearLogs() {
        this._logs = RemoteData.NotAsked();
        this._collapsableColumns = [];
        this._collapsedColumns = [];
        this.infiniteScrollEnabled = false;
    }

    /**
     * Add eligble columns for collapse to the array in the model
     * @param {String} rowId The rowId being collapsed
     * @param {String} name The name of the column to be collapsed
     * @param {Integer} height Minimal height of the column
     * @returns {undefined}
     */
    addCollapsableColumn(rowId, name, height) {
        const existingColumn = this._collapsableColumns
            .find((element) => element.rowId === rowId && element.name === name);
        if (existingColumn) {
            existingColumn.disabled = false;
        } else {
            this._collapsableColumns.push({
                rowId,
                name,
                height,
                disabled: false,
            });
        }
        this.notify();
    }

    /**
     * Remove eligble columns from the collapse array
     * @param {String} rowId The rowId being collapsed
     * @param {String} name The name of the column to be collapsed
     * @returns {undefined}
     */
    disableCollapsableColumn(rowId, name) {
        this._collapsableColumns
            .find((element) => element.rowId === rowId && element.name === name).disabled = true;
        this.notify();
    }

    /**
     * Toggles whether the filters are shown
     * @returns {Boolean} returns boolean
     */
    toggleShowFilters() {
        this.showFilters = !this.showFilters;
        this.notify();
    }

    /**
     * Returns wether the column should collapse or not
     * @param {String} rowId The rowId to be checked
     * @param {String} name The name of the column to be collapsed
     * @returns {Boolean} Returns wether the column in the row should collapse
     */
    canColumnExpand(rowId, name) {
        return this._collapsableColumns.some((entry) => entry.rowId === rowId && entry.name === name && !entry.disabled);
    }

    /**
     * Returns the minimal height of a column
     * @param {String} rowId The rowId to be checked
     * @param {String} name The name of the column
     * @returns {Integer} The smallest known height of the specified column
     */
    getMinimalColumnHeight(rowId, name) {
        const targetColumn = this._collapsableColumns.find((entry) => entry.rowId === rowId && entry.name === name);
        return targetColumn && targetColumn.height;
    }

    /**
     * Getters and Setters
     */

    /**
     * Returns whether the filter should be shown or not
     * @returns {Boolean} returns whether the filter should be shown
     */
    get showFilters() {
        return this._showFilters || false;
    }

    /**
     * Sets whether the filters are shown or not
     * @param {Boolean} showFilters Whether the filter should be shown
     * @returns {Boolean} returns boolean
     */
    set showFilters(showFilters) {
        this._showFilters = showFilters;
        this.notify();
    }

    /**
     * Returns the state of table infinite scroll mode
     * @return {boolean} The state of table infinite scroll mode
     */
    isInfiniteScrollEnabled() {
        return this.infiniteScrollEnabled;
    }

    /**
     * Returns the current author substring filter
     * @returns {String} The current author substring filter
     */
    get authorFilterText() {
        return this._authorFilterText;
    }

    /**
     * Sets the author substring filter if no new inputs were detected for 200 milliseconds
     * @param {String} newAuthor The author substring to apply to the filter
     * @returns {undefined}
     */
    set authorFilterText(newAuthor) {
        clearTimeout(this._authorFilterDebounce);
        this._authorFilterDebounce = setTimeout(() => {
            this._authorFilterText = newAuthor.trim();
            this.fetchFilteredLogs();
        }, 200);
    }

    /**
     * Returns the current minimum creation datetime
     * @returns {Integer} The current minimum creation datetime
     */
    get createdFilterFrom() {
        return this._createdFilterFrom;
    }

    /**
     * Returns the current maximum creation datetime
     * @returns {Integer} The current maximum creation datetime
     */
    get createdFilterTo() {
        return this._createdFilterTo;
    }

    /**
     * Getter for the filter operation of tags
     * @returns {String} The filter operation to be performed on the tags (AND, OR)
     */
    get tagFilterOperation() {
        return this._tagFilterOperation;
    }

    /**
     * Getter for show more tags criteria
     * @returns {Boolean} Returns if more tags should be shown above the predefined limit
     */
    get moreTags() {
        return this._moreTags;
    }

    /**
     * Getter for visisble Log dropdown
     *  @returns {Number} Returns if the dropdown for choosing an amount of logs should be visible
     */
    get amountDropdownVisible() {
        return this._amountDropdownVisible;
    }

    /**
     * Getter for logs per page
     * @returns {Number} Returns the number of logs to show on a single page
     */
    get logsPerPage() {
        return this._logsPerPage;
    }

    /**
     * Getter for the currently selected page
     * @returns {Number} The currently selected page
     */
    getSelectedPage() {
        return this._selectedPage;
    }

    /**
     * Getter for total pages
     * @returns {Number} Returns the total amount of pages available for the page selector
     */
    getTotalPages() {
        return this._totalPages;
    }

    /**
     * Returns the current title substring filter
     * @returns {String} The current title substring filter
     */
    get titleFilterText() {
        return this._titleFilterText;
    }

    /**
     * Sets the title substring filter if no new inputs were detected for 200 milliseconds
     * @param {String} newTitle The title substring to apply to the filter
     * @returns {undefined}
     */
    set titleFilterText(newTitle) {
        clearTimeout(this._titleFilterDebounce);
        this._titleFilterDebounce = setTimeout(() => {
            this._titleFilterText = newTitle.trim();
            this.fetchFilteredLogs();
        }, 200);
    }

    /**
     * Returns the current title substring filter
     * @returns {String} The current title substring filter
     */
    get runsFilter() {
        return this._runFilterValues;
    }

    /**
     * Getter for all the data
     * @returns {RemoteData} Returns all of the filtered logs
     */
    get logs() {
        return this._logs;
    }

    /**
     * Getter for all the detailed log entry ids
     * @returns {array} Returns all of the detailed log ids
     */
    get detailedPosts() {
        return this._detailed_post_ids;
    }

    /**
     * Sets how many logs are visible per a page, in accordance with the page selector
     * @param {Number} amount The amount of logs that should be shown per page
     * @return {Number} The first page of the new logs, totalling the amount set by the user
     */
    set logsPerPage(amount) {
        if (this._logsPerPage !== amount) {
            this.infiniteScrollEnabled = amount === Infinity;
            this._logsPerPage = amount;
            this._selectedPage = 1;
            this.fetchFilteredLogs();
        }

        this._amountDropdownVisible = false;
    }

    /**
     * Saves custom per page value
     * @param {Number} amount The amount of logs that should be shown per page
     * @see perPageAmountInputComponent
     * @return {void}
     */
    set customPerPage(amount) {
        this._customPerPage = amount;
    }

    /**
     * Sets the page chosen through the page selector for usage in pagination, and re-fetches data based on this
     * @param {Number} page The chosen page number
     * @return {Number} The chosen page number
     */
    set selectedPage(page) {
        if (this._selectedPage !== page) {
            this._selectedPage = page;
            this.fetchFilteredLogs();
        }
    }

    /**
     * Sets the filter operation according to the user input
     * @param {String} operation The filter operation to be performed (AND, OR)
     * @returns {undefined}
     */
    set tagFilterOperation(operation) {
        this._tagFilterOperation = operation;
        if (this._tagFilterValues.length > 0) {
            this.fetchFilteredLogs();
        }
    }

    /**
     * Sets the sorting column and operation based on the existing values for these variables
     * @param {String} key The column key to apply an operation to
     * @return {undefined}
     */
    set sortingValues(key) {
        if (this._sortingColumn !== key) {
            this._sortingColumn = key;
            this._sortingOperation = 'asc';
        } else {
            switch (this._sortingOperation) {
                case '':
                    this._sortingOperation = 'asc';
                    break;
                case 'asc':
                    this._sortingOperation = 'desc';
                    break;
                case 'desc':
                    this._sortingColumn = '';
                    this._sortingOperation = '';
                    break;
            }
        }

        this.clearSortingPreviewValues();
        this.fetchFilteredLogs();
    }

    /**
     * Sets the sorting preview column and operation based on the existing values for these variables
     * @param {String} key The column key to apply an operation preview to
     * @return {undefined}
     */
    set sortingPreviewValues(key) {
        if (this._sortingPreviewColumn !== key) {
            this._sortingPreviewColumn = key;
            this._sortingPreviewOperation = 'asc';
        } else {
            switch (this._sortingOperation) {
                case '':
                    this._sortingPreviewOperation = 'asc';
                    break;
                case 'asc':
                    this._sortingPreviewOperation = 'desc';
                    break;
                case 'desc':
                    this._sortingPreviewOperation = 'none';
                    break;
            }
        }

        this.notify();
    }

    /**
     * Returns active filters
     * @returns {array} array of active filters
     */
    get activeFilters() {
        this._activeFilters = [];

        if (this._titleFilterText !== '') {
            this._activeFilters.push('Title');
        }
        if (this._authorFilterText !== '') {
            this._activeFilters.push('Author');
        }
        if (this._createdFilterFrom !== '') {
            this._activeFilters.push('Created from');
        }
        if (this._createdFilterTo !== '') {
            this._activeFilters.push('Created to');
        }
        if (this._tagFilterValues.length !== 0) {
            this._activeFilters.push('Tags');
        }
        if (this._runFilterValues.length !== 0) {
            this._activeFilters.push('Runs');
        }

        return this._activeFilters;
    }

    /**
     * Set the text parameter of the current log being created
     * @param {String} logs Received string from the view
     * @returns {undefined}
     */
    set logs(logs) {
        this._logs = logs;
        this.notify();
    }

    /**
     * Sets the current active filters
     * @param {String} filters Received string from the view
     * @returns {undefined}
     */
    set activeFilters(filters) {
        this._activeFilters = filters;
    }

    /**
     * Set the text parameter of the current log being created
     * @param {String} text Received string from the view
     * @returns {undefined}
     */
    set text(text) {
        this._text = text;
        this.notify();
    }

    /**
     * Getter for show/collapse all button state
     * @returns {boolean} Button state
     */
    get showAllPosts() {
        return this._showAllPosts;
    }
}
