# Methods and Techniques Report
## Contributions
### Work Done

My work contributions can be split among two categories for this project, one being the tickets that I worked on and the other being the research of the project itself. Below will be two lists showing my work for the ALICE projects maintanance and upgrades and another for the work on the logs cleanup.

<br>

#### <b>ALICE tickets</b>

| Code | Link | Description | work percentage | Collaborators |
| --- | --- | --- | --- | ---|
| O2B-450 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/451) | CSV/JSON Export not working | 30% | X |
| O2B-431 | WIP (unreproducable issue) | Filter by created date log issue | 10% | Ali Butt |
| O2B-466 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/463) | Pages should display table on whole page | 20% | X |
| O2B-449 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/451) | JSON exports are sometimes empty | 10% | X |
| O2B-425 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/441) | Reply to a log entry should not require a title | 5% | Whole team |
| O2B-438 | Pull Request resolved | how details on run page by default | 5% | Ali Butt |

<br>

#### <b> Alice refactoring project</b>

| Name | work percentage | Collaborators |
| --- | --- | ---|
| Analysed the research about the logs.js issues | 10% | X |
| implemented Sonarqube | 5% | X |
| Analysed SonarQube's recommended code changes  | 5% | X |

## Contribution example
The code below is for the re-implementation of the old csv/json export system for runs, the old implementation could only export the runs which were actively visible on screen. Which was an issue since, as to be expected, the users wanted to export multiple runs at the same time without having to look for it manually.

Explanation of the code will be given below the code snippet.
```
async getFilteredRuns() {
    this.runs = RemoteData.loading();
    this.notify();

    const runIds = this.getSelectedRunNumbers().split(',')
        .filter((runId) => parseInt(runId, 10));
    const filteredRuns = [];

    // Checks if it isn't an empty list and shows error on incorrect input
    if (runIds.length == 0) {
        this.runs = RemoteData.failure([
            {
                title: 'Invalid Input',
                detail: 'No valid run numbers can be found',
            },
        ]);
        this.notify();
        return [];
    }

    // Loops through every run id that has been filled in and retrieves them from the database
    for (const runId of runIds) {
        const response = await fetchClient(`/api/runs/${runId}`, { method: 'GET' });
        const result = await response.json();

        if (!result.data) {
            this.runs = RemoteData.failure(result.errors || [
                {
                    title: result.error,
                    detail: result.message,
                },
            ]);
            this.notify();
            return [];
        }
        filteredRuns.push(result.data);
    }

    this.runs = RemoteData.success();
    return filteredRuns.map((selectedRun) => 
        pick(selectedRun, this.getSelectedRunsFields()));
}
```
<b> Explanation </b>

The first two lines in the implementation are to set the runs data visible on screen to loading and update the page through the notify method. After that the runIds get gathered from an input field, split by komma's as per the inputs requirements and then filtered to remove any incorrect inputs from the list. After that a quick check is made to make sure the input is valid and an error will be shown on an invalid input. After that it will loop through the runs and collect them all one by one from the database, collect them from the database or throw an error on an incorrect run ID and then push it to the filteredRuns array. The making of database calls in a loop is normally something I would avoid, but the person overseeing the tickets said it was fine to implement it in a loop. After the collecting of the runs it sets the runs data to success to remove any existing errors, and returns the requested runs with only the requested tabs through the array.map function and utilizing a pre-existing pick method.

## Complexity example

The code below is in my opinion a relatively complex usage of javascript async methods combined with non async methods to minimize necessary code while chaining the code for efficiency. The snippet below was intended for the export runs ticket as shown above, however due to the fact that an error needs to be thrown to stop a loop to avoid excessive database calls being made. We decided to not implement this, since any error that gets thrown by the code gets logged in their database system combined with errors from other projects, which is why we have to avoid throwing actual errors.

```
const filteredLists = await Promise.all(runIds.map((runId) => {
    const response = await fetchClient(`/api/runs/${runId}`, { method: 'GET' });
    const result = await response.json();

    if (!result.data) {
        this.runs = RemoteData.failure(result.errors || [
            {
                title: result.error,
                detail: result.message,
            },
        ]);
        this.notify();
        throw "";
    }
})).map((selectedRun) => pick(selectedRun, this.getSelectedRunsFields()));

this.runs = RemoteData.success();
return filteredLists;
```

## Tests written
So far the only tests I have written are front end tests that check for UI changes that should have happened after user inputs through code changes. 

### Front end test
This is an example of a front end test that I have made to properly check whether the appropriate error gets shown after filling in an incorrect run number on the export page. Where it goes through every step the user would make to recieve the error.

```
    it('shows an error on incorrect run number', async () => {
        await goToPage(page, 'run-export');
        const runNumbersStr = '99999999';

        // Send the value of the run numbers string to the input and select the id field
        await page.type('#run-number', runNumbersStr);
        await page.select('select#fields', 'id');
        await page.click('#send');

        // We expect there to be an error message
        const expectedMessage = 'Run with this id (' + runNumbersStr + ') could not be found';
        await expectInnerText(page, '.alert-danger', expectedMessage);
    });
```