# Portfolio Bradley Buurmeester

## Individual Contribution
Depicted below is a table including the work I have performed during this project. 

| Contribution   | Proof                                                        | Collaboration         | Time spent |
|:--------------:|:------------------------------------------------------------:|:---------------------:|:----------:|
| Ticket O2B-425 | [Link](https://github.com/AliceO2Group/Bookkeeping/pull/441) | Ali, Jik, Sander, Wies| 2 hours    |
| Ticket O2B-434 | [Link](#explaination-ticket-o2b-434)                         | N/A                   | 2 weeks    |
| Ticket O2B-446 | In Progress                                                  | N/A                   | on going   |
| Documentation  | Technical Documentation                                      | N/A                   | on going   |
| Runs.js refactoring | In Progress                                             | N/A                   | on going   |

## Best Quality and Complexity
Depicted below is a contribution to the project whith the best quality and complexity of my contributions. 

### Code snippet
```
async connectDatabase() {
        try {
            await this.database.connect();

            if (this.isInTestMode()) {
                await this.database.dropAllTables();
            }

            await this.database.migrate();

            if (this.isInTestMode()) {
                await this.database.seed();
            }
        } catch (error) {
            this.logger.error(`Error while starting: ${error}`);
        }
    }
```
### Explanation
For this ticket I am needed to fix the problem of a server fail when the database was not connected. In the first line you can see: `await this.database.connect();` line.
This line was used previously in a try-catch statement. When this statement catches an error the server would stop or crash. I have added the method above with multiple
checks in its own try-catch statement so the server does not crash or stop. In this code snippet you can see the *connectDatabase* method. Which is called in the same line
of coded as the server run method.

## Unit Test
Depicted below is a unit test which was made not only by me but as a team.

### Code snippet

```
    it('should return 201 if a title is empty', (done) => {
            request(server)
                .post('/api/logs')
                .send({
                    title: '',
                    text: 'Text of yet another run',
                    tags: [1, 2],
                    parentLogId: 2,
                })
                .expect(201)
                .end((err, res) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    expect(res).to.satisfyApiSpec;

                    expect(res.body.data.title).to.equal('');
                    expect(res.body.data.text).to.equal('Text of yet another run');
                    expect(res.body.data.tags).to.deep.equal([
                        {
                            id: 1,
                            text: 'FOOD',
                        },
                        {
                            id: 2,
                            text: 'RUN',
                        },
                    ]);
                    expect(res.body.data.rootLogId).to.equal(1);
                    expect(res.body.data.parentLogId).to.equal(2);

                    done();
                });
        });
```
### Explanation
This unit test is for ticket O2B-425. The request of the ticket was: for the title not be a requirement. In the code snippet above you can see the title is empty. The body without a title is send to the mock api
and after it is send the test will check if it succesfull and checks if all the data is the same as the filled in form.

## Explanation ticket O2B-434
I have been working on this ticket for a long time. First thing I do when working on a ticket is searching where the problem exists. The first few days I could not find where the problem would be, so I asked for help. after asking for help I knew where the problem layed and try to fix it. After a week of trying to fix it I asked for help again this time from my team members. When we could not find the problem with the problem I was having with running the code, I went to ask for help to the same person I asked before. After two hours of searching we found that the problem layed in the schematics of the database and a refactoring is necessary. This problem would than be fixed by someone else who should handle the schematics and not me. This is why I have placed the ticket as a contribution, because I have spend a lot of time on it and the CERN member was glad that I had researched this problem.