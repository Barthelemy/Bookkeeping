# Portfolio Wies de Graaf
This portfolio contains my individual contributions to the project. I will be making use of code snippets and examples to demonstrate the level of work that has been performed.

## Individual Contribution
Depicted below is a table including the work I have performed during this project. 

| Contribution  | Proof | Collaboration |
| ------------- |:-------------:|:---:|
| Ticket O2B-425 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/441) | With Team |
| Ticket O2B-432      | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/430)    | N/A |
| Ticket O2B-447      | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/438)     | N/A |
| Ticket O2B-456     | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/454)     | N/A 
| Ticket O2B-460 | In Progress | N/A
| Runs.js refactoring | In Progress | N/A
| Domain Model | Technical Documentation | N/A
| Logical Architecture Diagram | Technical Documentation | N/A


All contributions took a similar amount of time; resolved within the week of taking up the ticket, unless stated otherwise. This does not include the contributions currently in progress. 

## Code Snippets
### Quality
Depicted below is a contribution to the project which I believe displays the best quality of my product development skills. 

```
        if (checkboxes.length == 0) {
            return h('.form-check.mr2'), [h('p', 'No tags.')];
        } else if (checkboxes.length <= TAGS_LIMIT) {
            return [tagFilterOperationRadioButtons(model), ...checkboxes];
        } else {
            const showMoreFilters = model.logs.shouldShowMoreTags();
            const toggleFilters = h('button.btn.btn-primary.mv1#toggleMoreTags', {
                onclick: () => model.logs.toggleMoreTags(),
            }, ...showMoreFilters ? [iconMinus(), ' Less tags'] : [iconPlus(), ' More tags']);

            const slicedCheckboxes = showMoreFilters ? checkboxes : checkboxes.slice(0, TAGS_LIMIT);
            slicedCheckboxes.splice(TAGS_LIMIT, 0, toggleFilters);

            return [tagFilterOperationRadioButtons(model), ...slicedCheckboxes];
        }
```
#### **Context**
This code snippet is from ticket O2B-456, specifically from the _lib/public/components/Filters/LogsFilter/tags.js_ file. The client wished to have the text 'No tags found' displayed when no tags are present in the database and hide the radio buttons which modifies how tags can be filtered. This ticket initially seemed very complex due to the many different files and functions that must be searched through, but once the location of the radio buttons was found the code, I found it was easy to modify the code by adding a third if statement to the existing two if statements, making the code more cohesive as a whole while complying to the client's wishes.

### Complexity
Depicted below is a contribution to the project which I believe displays the highest complexity of my product development skills. 

```
        h('.flex-row.mv1', [
            h('.w-100', h('.w-100.flex-column.mh3', [
                table(payload, logsColumns, model, (entry) => ({
                    onclick: () => model.router.go(`?page=log-detail&id=${entry.id}`),
                })),
                h('.flex-row.justify-between.mv3', [
                    h('.w-15', amountSelector(() =>
                        model.logs.toggleLogsDropdownVisible(), (amount) => model.logs
                        .setLogsPerPage(amount), amountDropdownVisible, AVAILABLE_AMOUNTS, logsPerPage, model.logs)),
                    data.isSuccess()
                    && pageSelector((page) => model.logs.setSelectedPage(page), model.logs),
                    h('.w-15'),
                ]),
            ])),
        ]),
```
#### **Context**
This code snippet is from the in progress ticket O2B-460, specifically from the _lib/public/views/Logs/Overview/index.js_ file. The client wishes to add a clickable button which leads the user from the record of a log or run to the details page. Currently, clicking the entire record leads the user to a details page, but this prevents them from copying and pasting the text. All tables on the app are configured this way; thus the change must take place in multiple files. Adding the column and button are simple enough, but finding the id per record proves more challenging, as well as modifying the unit tests that test clicking each record.

The code above is responsible for displaying the table on the logs page, which was the most complex to modify so that only clicking the button leads to the details page.

## Unit Tests
With each ticket, existing unit tests have to be modified, which at the time of writing is 4 unit tests, excluding the tickets in progress. The unit test that needed modifying that has the most complexity is the one depicted below. 

```
    it('can navigate to a log detail page', async () => {
        table = await page.$$('tr');
        firstRowId = await getFirstRow(table, page);
        const parsedFirstRowId = parseInt(firstRowId.slice('row'.length, firstRowId.length), 10);

        // We expect the entry page to have the same id as the id from the tag overview
        await pressElement(page, `#${firstRowId}`);
        await page.waitForTimeout(100);
        const redirectedUrl = await page.url();
        expect(String(redirectedUrl).startsWith(`${url}/?page=log-detail&id=${parsedFirstRowId}`)).to.be.true;
    });
```
#### **Context**
This unit test is for ticket O2B-447, specifically from the _/test/public/tags/detail.test.js_ file: the client wished to have the table with tag details to be displayed by default. In the previous situation, the page had two differen tabs, one which displayed the tag name, and the other, details where the tag is used. Changing this, tests had to be modified or removed. For example, testing for the switching between tabs, as the initial tab is now removed so the table is displayed. Depicted above is the test that was modified.