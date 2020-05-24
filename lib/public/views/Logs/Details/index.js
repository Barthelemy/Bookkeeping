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
import spinner from '../../../components/common/spinner.js';
import PostBox from '../../../components/Post/index.js';

/**
 * A collection of details relating to a log
 * @param {object} model Pass the model to access the defined functions
 * @return {vnode} Return the view of the table with the filtering options
 */
const logDetailScreen = (model) => {
    const data = model.logs.getData();
    const error = model.logs.hasErrorOccurred();

    if (data && data.length !== 0) {
        const id = parseInt(model.router.params.id, 10);

        // eslint-disable-next-line require-jsdoc
        const treeItem = (item, level) => h('.mw-100', {
            style: {
                'margin-left': `${2 * level}rem`,
            },
        }, PostBox(item, item.id, item.id === id));

        // eslint-disable-next-line require-jsdoc
        const tree = (obj, level = 0, items = []) => {
            if (level === 0) {
                items.push(treeItem(obj, level));
                return tree(obj, level + 1, items);
            }

            for (const child of obj.children || []) {
                items.push(treeItem(child, level));
                items = tree(child, level + 1, items);
            }

            return items;
        };

        return h('', h('.w-100.flex-column', tree(data[0])));
    } else if (error) {
        return h('', [
            h('.danger', 'This log could not be found.'),
            h('button.btn.btn-primary.mv3', {
                onclick: () => model.router.go('?page=home'),
            }, 'Return to Overview'),
        ]);
    } else {
        return spinner();
    }
};

export default (model) => [logDetailScreen(model)];