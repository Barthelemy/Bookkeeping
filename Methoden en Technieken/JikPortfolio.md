# Portfolio Jik Huijberts

## Code Contributions

| Contribution  | Proof | Effort |  Collaboration |
| ------------- |:-------------:|:------:|:---:|
| Ticket O2B-425 | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/441) | 5% | With Team |
| Ticket O2B-425 - after first commit | [GitHub](https://github.com/AliceO2Group/Bookkeeping/pull/441)| 10% |  N/A |
| Ticket O2B-396 | Testing phase| 20% | N/A
| Logs.js refactoring | In Progress | 40% | N/A

## Technical Contributions
| Contribution | Proof | Effort | Collaboration | 
| Logs.js Design/Documentation | Technical Documentation| 20% | N/A |
| Deployment, Backend Workflow, | Technical Documentation| 5% | N/A |


### Collaberation
Collaberation with Wies. We did not do the complete tickets together but did some pair programming togheter. 
Furthermore we did a the 425 ticket together with the team. 

### Effort
Most of the effort went to the refactoring of the logs.js file.

## Code Snippets
```
constructor(model) {
        super();
        this.model = model;
        this.logService = new LogService();
        this.clearLogs();
        this.resetLogsParams(false);

        this.createdLog = RemoteData.NotAsked();
        this.clearAllEditors();
        this.logs = RemoteData.NotAsked();
}
```
For the code snippet I used the snippet for logs.js. Since this is a big operation the constructor is a good start to see what changed in the class itself.
The class has changed in the way that a service is added to the file to decrease the total amount in code to different organized files.


### Status endpoint
In the snippets below you see the intergration of a status endpoint. This part of code shows how the status of the database is actively tested. 
This code has a bit more of complexety because of all the moving parts. An endpoint is created to communicate with the database to check if the database is active.
In the useCase (service layer) a ping is given with the sequelize authentication function. This function will throw an error if the database could not connect and can show the connectivity status that way.
#### Snippets
```
const getDatabaseInformation = async (request, response) => {
    const gui = await new GetDatabaseStatusUseCase()
        .execute();
 
    if (gui === null) {
        response.status(501).json({
            errors: [
                {
                    status: 501,
                    title: 'Something went wrong',
                },
            ],
        });
    } else {
        response.status(200).json({
            data: gui,
        });
    }
};
 
module.exports = {
    method: 'get',
    path: '/status/',
    controller: StatusController.getGuiHealthCheck,
    children: [
        {
            method: 'get',
            path: 'gui',
            args: { public: true },
            controller: [StatusController.getGuiHealthCheck],
        },
        {
            method: 'get',
            path: 'database',
            args: { public: false },
            controller: [StatusController.getDatabaseHealthCheck],
        },
    ],
};
async execute() {
        const status = await SequelizeDatabase.status();
        if (status == true) {
            return {
                host: host,
                port: port,
                status: {
                    ok: true,
                    configured: true,
                } };
        } else {
            return {
                host: host,
                port: port,
                status: {
                    ok: false,
                    message: status,
                },
            };
        }
```
### Complexity
The most complex part of the project is the refactoring of logs.js. This is an observable class made for everything that has something to do with the logs model.
This makes the file significantly big and thus has many dependencies. 
The reason this is the most complex part of code is because the design intergrates two patterns to split the file into different functionalities.
A good portion of the time spend is gathering information and grouping important functionalities.

## Tests
There are different tests performed to create maintainable code. These tests consists out of unit tests, frontend tests with mocking and end-to-end testing.
In this chapter different types are discussed and shown with a code snippet.
### Unit testing

Example of a unit test.
```
    it('should create a new Log with empty title but a parent log', async () => {
        const expectedTitle = '';
        const expectedParentLogId = 3;

        createLogDto.body.title = expectedTitle;
        createLogDto.body.parentLogId = expectedParentLogId;

        createLogDto.session = {
            personid: 2,
            id: 2,
            name: 'Jan Janssen',
        };

        const { result } = await new CreateLogUseCase()
            .execute(createLogDto);
        expect(result.title).to.equal(expectedTitle);
        expect(result.parentLogId).to.equal(expectedParentLogId);
    });
```
### Frontend tests
The frontend is also tested by using puppeteer this is used. 

A example can be shown below.
```
    it('can disable submit with invalid data', async () => {
        const title = 'A';
        const text = 'Sample Text';

        await goToPage(page, 'log-create');
        // Select the boxes and send the values of the title and text to it
        await page.type('#title', title);
        // eslint-disable-next-line no-undef
        await page.evaluate((text) => model.logs.editor.setValue(text), text);

        // Verify that the text from the first matches with the text posted and correct working of the redirect
        // eslint-disable-next-line no-undef
        const doesContentMatch = JSON.stringify(await page.evaluate(() => model.logs.editors['text'].getValue()))
            .includes(text);
        expect(doesContentMatch).to.equal(true);

        // Create check disabled button
        const isDisabled = await page.$eval('button#send', (button) => {
            return button.disabled;
          });

        expect(isDisabled).to.equal(true);
    });
```
### e2e testing
For different types of validations e2e testing needs to be done. These tests are ran for the openapi endpoints. 
These e2e tests send http requests to the endpoints and the backend itself. 
The response is checked and validated to see if data is received properly.

```
        it('should return 201 if a title is empty', (done) => {
            request(server)
                .post('/api/logs')
                .send({
                    title: 'Yet another run',
                    title: '',
                    text: 'Text of yet another run',
                    tags: [1, 2],
                    parentLogId: 2,
                })
                .expect(201)
```

#### Code coverage
For merging the new code with the master a few checks needed to be passed before actually merging. One of these tests is code coverage. If the over code coverage what lies about 96% was decreased test would not pass. The checks always passed so the code coverage is assured.
