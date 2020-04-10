/**
 * This file is part of the ALICE Electronic Logbook v2, also known as Jiskefet.
 * Copyright (C) 2020  Stichting Hogeschool van Amsterdam
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Get all users
 * @param {Object} _request request  object
 * @param {Object} response response object
 * @returns {undefined}
 */
const index = (_request, response) => {
    response.status(501).json({
        error: [
            {
                status: '501',
                title:  'Not implemented',
            },
        ],
    });
};

/**
 * Get all logs of User
 * @param {Object} _request request  object
 * @param {Object} response response object
 * @returns {undefined}
 */
const getLogs = (_request, response) => {
    response.status(501).json({
        error: [
            {
                status: '501',
                title:  'Not implemented',
            },
        ],
    });
};

/**
 * Get Tokens of user
 * @param {Object} _request request  object
 * @param {Object} response response object
 * @returns {undefined}
 */
const getTokens = (_request, response) => {
    response.status(501).json({
        error: [
            {
                status: '501',
                title:  'Not implemented',
            },
        ],
    });
};

/**
 * Get user
 * @param {Object} _request request  object
 * @param {Object} response response object
 * @returns {undefined}
 */
const read = (_request, response) => {
    response.status(501).json({
        error: [
            {
                status: '501',
                title:  'Not implemented',
            },
        ],
    });
};

/**
 * Post token for user
 * @param {Object} _request request  object
 * @param {Object} response response object
 * @returns {undefined}
 */
const postTokens = (_request, response) => {
    response.status(501).json({
        error: [
            {
                status: '501',
                title:  'Not implemented',
            },
        ],
    });
};

module.exports = {
    index,
    read,
    getLogs,
    getTokens,
    postTokens,
};
