# Portfolio Ali Butt
This portfolio contains my contributions to the project. In this document there will be code snippets and examples to demonstrate the work that has been performed during this project.

## Individual Contribution
Depicted below is a table including the work I have performed during this project. 

| Contribution  | Proof | Collaborators |
| ------------- |:-------------:|:---:|
| Ticket O2B-425 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/441)  | Team |
| Ticket O2B-431 | Filter by created date log issue (unresolved) | Sander van de Kamp |
| Ticket O2B-438 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/440)  | Sander van de Kamp |
| Ticket O2B-444 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/457) (In Review) | X |
| Runs.js refactoring | In Progress | Team |
| Introduction | Technical Documentation | X |
| Product vision | Technical Documentation | Team |
| Functional requirements | Technical Documentation | Team |


All above mentioned contributions contain either parts for tickets for improvements or bug fixes in the bookkeeping application or the refactoring of the runs.js file.

## Code Snippets
### Quality
Depicted below is a contribution to the project which I believe displays the best quality of my product development skills. 

```
        const activeColumns = (model) => ({
    id: {
        name: 'ID',
        visible: false,
        primary: true,
    },
    runNumber: {
        name: 'Run',
        visible: true,
        size: 'cell-s',
        filter: runNumberFilter(model),
    },
    detectors: {
        name: 'Detectors',
        visible: true,
        size: 'cell-m',
        format: (detectors) => `${detectors.toString()}`,
        filter: detectorsFilter(model),
    },
    tags: {
        name: 'Tags',
        visible: true,
        size: 'cell-l',
        format: (tags) => tags.map(({ text }) => text).join(', '),
        filter: tagsFilter(model),
    },
```
```
h('.flex-row.items-center', [
            h('div.show-overflow.w-wrapped', {
                id: `${columnId}-text`,
            }, !displayToolTip ? tableText : h('div.tooltip', tableText, h('span.tooltiptext', {
                style: 'width: 250px; word-break: break-all;',
            }, formattedText))),
        ]),
```
```
    logsColumns.title.size = 'cell-l';
    logsColumns.author.size = 'cell-m';
    logsColumns.createdAt.size = 'cell-m';
    logsColumns.tags.size = 'cell-m';
    logsColumns.replies.size = 'cell-m';
    logsColumns.runs.size = 'cell-m';
    logsColumns.attachments.size = 'cell-m';
```

#### **Context**
This code snippet is from ticket O2B-444, specifically from the _lib/public/Views/Logs/Overview/Index.js_, _lib/public/Views/Logs/ActiveColumns/Index.js_ and _lib/public/Components/Table/Rows.js_ files. The request was to move the column of detectors up and make a string of the shown value so there wouldn't be a 'null' value shown if it is empty. Furthermore all cells of all tables in the applications needed to be truncated so they don't overflow once the value is too long. The solution for the overflow found a new bug that wasn't applicable to the 'cell-fm' and 'cell-f' class, so these cell classes needed to be recasted to 'cell-l' and 'cell-m' class.

### Complexity
Depicted below is a contribution to the project which I believe displays the highest complexity of my product development skills. 

```
        h('.flex-row', [
                 h('.flex.w-100', [
                     h('h2.mv2', { onremove: () => model.runs.clearRun() }, `Run #${data.payload.runNumber}`),
                     h('.flex-row.mv2', [
                         h('button.btn.btn-primary.w-15.mh2#create', {
                             onclick: () => model.router.go(`/?page=log-create&id=${data.payload.runNumber}`),
                         }, 'Add Log Entries'),
                         h('label.form-check-label.f5.w-11.mh2', 'Add log entries to the run'),
                     ]),
                     h('.flex-row.mv2', [
                         h('button.btn.btn-success.w-15.mh2', {
                             onclick: () => model.runs.updateRunTags(),
                             title: 'This action will overwrite existing tags',
                             disabled: !model.runs.selectedTagsChanged(),
                         }, 'Update Tags'),
                         h('label.form-check-label.f5.w-15.mh2', { for: 'tags' }, [
                             'Add one or multiple tags to the run. ',
                             '(CTRL + click to select multiple tags).',
                         ]),
                     ]),
                     h('select#tags-control.form-control.w-30.mh2', {
                         multiple: true,
                         onchange: ({ target }) => model.runs.setSelectedTags(target.selectedOptions),
                     }, !tagsAvailable ? h('option', {
                         onclick: () => model.router.go('?page=tag-create'),
                     }, h('a#tagCreateLink', {
                     }, noTagsText)) :
                         allTags.isSuccess() ? [
                             ...allTags.payload.map((tag) => h('option', {
                                 value: tag.id,
                                 selected: selectedTags.includes(tag.id),
                             }, tag.text)),
                         ] : h('option', { disabled: true }, 'Loading tags...')),
                 ]),
                 h('.justify-content-end', [runDetail(model, data.payload)]),
             ]),
```
#### **Context**
This code snippet is from the ticket O2B-438, specifically from the _lib/public/views/Runs/Details/index.js_ file. The table that was previously on the bottom of the screen needs to be relocated at the top right of the screen. Afterwards the main tab needs to be removed and the logs tab needs to be selected as default.

## Unit Tests
With each ticket, existing unit tests have to be modified or created, which at the time of writing is 3 unit tests. One of the unit test that needed modifying is the one depicted below. 

```
     it('can navigate to the flp panel', async () => {
         await pressElement(page, '#flps-tab');
         await page.waitForTimeout(100);
         const redirectedUrl = await page.url();
         expect(String(redirectedUrl).startsWith(`${url}/?page=run-detail&id=1&panel=flps`)).to.be.true;
     });
```
#### **Context**
This unit test is for ticket O2B-438, specifically from the _/test/public/runs/detail.test.js_ file: the puppeteer tests replicate the applicatio being made in a browser and run the tests in a certain order. The order of the tests make a big difference in succesfull or unsuccesfull tests. This test navigates to the flp panel, which makes it so that a certain bug doesn't show up. This bug has been fixed since then in another ticket.
