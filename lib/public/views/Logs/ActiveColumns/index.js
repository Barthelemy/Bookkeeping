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

import { h } from '/js/src/index.js';
import { iconCommentSquare, iconPaperclip, iconCheck } from '/js/src/icons.js';

import titleFilter from '../../../components/Filters/LogsFilter/title.js';
import authorFilter from '../../../components/Filters/LogsFilter/author.js';
import createdFilter from '../../../components/Filters/LogsFilter/created.js';
import tagsFilter from '../../../components/Filters/LogsFilter/tags.js';
import runsFilter from '../../../components/Filters/LogsFilter/runs.js';

/**
 * A method to display a small and simple number/icon collection as a column
 * @param {Number} count The number to display
 * @param {Object} icon The icon to display
 * @return {vnode} A wrapped vnode containing the specified icon and count
 */
const iconWithCountContainer = (count, icon) => count > 0 ? h('.flex-row.items-center.gray-darker', [
    h('.f7', icon),
    h('.f6.ml1', count),
]) : '-';

/**
 * Method to retrieve the list of active columns for a generic LOGS component
 * @param {Object} model The global model object
 * @return {Object} A collection of columns with parameters for the Log table
 */
const activeColumns = (model) => ({
    id: {
        name: 'Entry ID',
        visible: false,
        primary: true,
    },
    title: {
        name: 'Title',
        visible: true,
        sortable: true,
        size: 'w-30',
        format: (title, log) => title ? title : log.parentLogId ? `Re: log id ${log.parentLogId}` : 'Re: - ',
        filter: titleFilter(model),
    },
    author: {
        name: 'Author',
        visible: true,
        sortable: true,
        size: 'w-15',
        format: (author) => author.name,
        filter: authorFilter(model),
    },
    createdAt: {
        name: 'Created',
        visible: true,
        sortable: true,
        size: 'w-15',
        format: (date) => date ? new Date(date).toLocaleString('en-GB', { timeStyle: 'medium', dateStyle: 'short' }) : '-',
        filter: createdFilter(model),
    },
    tags: {
        name: 'Tags',
        visible: true,
        sortable: true,
        size: 'w-15',
        format: (tags) => tags && tags.length > 0 ? tags.map(({ text }) => text).join(', ') : '-',
        filter: tagsFilter(model),
    },
    runs: {
        name: 'Runs',
        visible: true,
        sortable: true,
        size: 'w-10',
        format: (runs) => runs && runs.length > 0 ? runs.map(({ runNumber }) => runNumber).join(', ') : '-',
        filter: runsFilter(model),
    },
    parentLogId: {
        name: '',
        visible: false,
        size: 'w-5',
        format: (parentLogId, log) => parentLogId === log.id ? '' : iconCheck(),
    },
    replies: {
        name: 'Replies',
        visible: true,
        size: 'w-5',
        format: (replies) => iconWithCountContainer(replies, iconCommentSquare()),
    },
    attachments: {
        name: 'Attachments',
        visible: true,
        size: 'w-5',
        format: (attachments) => iconWithCountContainer(attachments.length, iconPaperclip()),
    },
    actions: {
        name: '',
        visible: true,
        sortable: false,
        size: 'w-5',
        format: (_, log) => h('.w-100.flex-row', {
            style: 'justify-content: end',
        }, h(`button#btn${log.id}.btn.btn-primary.btn-sm.btn-redirect`, {
            onclick: () => model.router.go(`?page=log-detail&id=${log.id}`),
        }, 'More')),
    },
});

/**
 * Method to retrieve the list of active columns for the logs table on the home overview page
 * @param {Object} model The global model object
 * @return {Object} A collection of columns with parameters for the Log table
 */
export const activeHomeOverviewColumns = (model) => ({
    id: {
        name: 'Entry ID',
        visible: false,
        primary: true,
    },
    title: {
        name: 'Title',
        visible: true,
        sortable: false,
        size: 'w-60',
        expand: true,
        format: (title, log) => title ? title : log.parentLogId ? `Re: log id ${log.parentLogId}` : 'Re: - ',
        filter: titleFilter(model),
    },
    createdAt: {
        name: 'Created',
        visible: true,
        sortable: false,
        size: 'w-30',
        format: (date) =>
            date ? new Date(date).toLocaleString('en-GB', { timeStyle: 'medium', dateStyle: 'medium' }) : '-',
        filter: createdFilter(model),
    },
    actions: {
        name: '',
        visible: true,
        sortable: false,
        size: 'w-10',
        format: (_, log) =>
            h('.flex-row', {
                style: 'justify-content: end',
            }, h(`button#btn${log.id}.btn.btn-primary.btn-sm.btn-redirect`, {
                onclick: () => model.router.go(`?page=log-detail&id=${log.id}`),
            }, 'More')),
    },
});

export default activeColumns;
