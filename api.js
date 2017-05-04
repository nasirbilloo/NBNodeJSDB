'use strict';
var express = require('express');
var bodyparser = require('body-parser');
var expresslogger = require('./util/expressmiddleware/logger');

var logger = require('./util/logger');

var app = express();
//var logger = require('./services/log');

app.use(expresslogger);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));

app.use(express.static('../client', {
    index: 'index.html'
}));


/*
//CORS: Cross Origin Request Sharing
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});
*/
var jiraRoute = require('./routes/jiraRoute');
var authRoute = require('./routes/authRoute');
var reportAssigneeRoute = require('./routes/reportAssigneeRoute');
var routeMonthly = require('./routes/routeMonthly');
var estimatesToActuals = require('./routes/estimatesToActuals');
var listsRoute = require('./routes/listsRoute');
var adHocRoute = require('./routes/adHocReports');
var pieRoute = require('./routes/pieRoute');
var bugbash2016 = require('./routes/bugBash2016');
var cadence = require('./routes/cadenceRoutes');
var defects = require('./routes/defectsRoute');
var clients = require('./routes/clientRoute');
var teams = require('./routes/teamRoute');
var dashboard = require('./routes/dashboardRoute.js');
var projectReports = require('./routes/projectReports');

//JIRA
app.use('/api/jira/boards', jiraRoute.boards);
app.use('/api/jira/boardepics', jiraRoute.boardEpics);
app.use('/api/jira/boardissues/:boardId', jiraRoute.boardIssues);
app.use('/api/jira/epicissues/:boardId/:epicId', jiraRoute.boardEpicIssues);
app.use('/api/jira/issue/:issueId', jiraRoute.getIssue);
app.use('/api/jira/customfields', jiraRoute.customFields);
app.use('/api/jira/systemfields', jiraRoute.systemFields);
app.use('/api/jira/dashboards', jiraRoute.dashboards);
app.use('/api/jira/issuetypes', jiraRoute.issueTypes);
app.use('/api/jira/priorities', jiraRoute.priorities);
app.use('/api/jira/projects', jiraRoute.projects);
app.use('/api/jira/projectcategories', jiraRoute.projectCategories);
app.use('/api/jira/statuses', jiraRoute.statuses);
app.use('/api/jira/statuscategories', jiraRoute.statusCategories);

//LOGIN
app.use('/api/login', authRoute.login);
app.use('/api/logout', authRoute.logout);

//ASSIGNEE
app.use('/api/report/adHocIssueCountsReport', reportAssigneeRoute.adHocIssueCountsReport);

//WAIT and PROCESS TIME
app.use('/api/report/adHocCycleTimeReport', adHocRoute.adHocCycleTimeReport);
app.use('/api/report/agingReport', adHocRoute.agingReport);
app.use('/api/report/defectLife', adHocRoute.defectLife);


//Last 30 days
app.use('/api/report/monthlyTopIssues', routeMonthly.monthlyTopIssues);
app.use('/api/report/monthlyPeopleTotalTime', routeMonthly.monthlyPeopleTotalTime);

//Worklog Pies
app.use('/api/report/worklogPieSummaryReport', pieRoute.worklogPieSummaryReport);
app.use('/api/report/worklogPieDetailReport', pieRoute.worklogPieDetailReport);
app.use('/api/report/worklogPieDetail2Report', pieRoute.worklogPieDetail2Report);
app.use('/api/report/lists/getPieList', pieRoute.getPieList);


//estimatesToActuals
app.use('/api/report/estimatesToActuals', estimatesToActuals.estimatesToActuals);
app.use('/api/report/billingReport', estimatesToActuals.billingReport);
app.use('/api/report/estimatesToActualsWT', estimatesToActuals.estimatesToActualsWT);
app.use('/api/report/billingReportWT', estimatesToActuals.billingReportWT);
app.use('/api/report/billingReportTnM', estimatesToActuals.billingReportTnM);
app.use('/api/report/issueChainSummary', estimatesToActuals.issueChainSummary);
app.use('/api/report/issueChain', estimatesToActuals.issueChain);
app.use('/api/report/issueChainDetails', estimatesToActuals.issueChainDetails);

//LISTS
app.use('/api/report/lists/cadences', listsRoute.cadences);
app.use('/api/report/lists/departments', listsRoute.departments);
app.use('/api/report/lists/truncatedCadences', listsRoute.truncatedCadences);
app.use('/api/report/lists/clients', listsRoute.clients);
app.use('/api/report/lists/projects', listsRoute.projects);
app.use('/api/report/lists/issuetypes', listsRoute.issueTypes);
app.use('/api/report/lists/issuetypes2', listsRoute.issueTypes2);
app.use('/api/report/lists/issuetypes3', listsRoute.issueTypes3);
app.use('/api/report/lists/priorities', listsRoute.priorities);
app.use('/api/report/lists/statuses', listsRoute.statuses);
app.use('/api/report/lists/allPeople', listsRoute.allPeople);
app.use('/api/report/lists/activePeople', listsRoute.activePeople);
app.use('/api/report/lists/activePeopleWithDepartments', listsRoute.activePeopleWithDepartments);
app.use('/api/report/lists/worktypes', listsRoute.worktypes);
app.use('/api/report/lists/teams', listsRoute.teams);
app.use('/api/report/lists/assigneeFields', listsRoute.assigneeFields);
app.use('/api/report/lists/issueCountFields', listsRoute.issueCountFields);
app.use('/api/report/lists/getIssue', listsRoute.getIssue);

//adHocReports
app.use('/api/report/adHocChartedSingleFieldReport', adHocRoute.adHocChartedSingleFieldReport);
app.use('/api/report/adHocMonthlyWorklogsReport', adHocRoute.adHocMonthlyWorklogsReport);
app.use('/api/report/adHocWorklogsReport', adHocRoute.adHocWorklogsReport);
app.use('/api/report/adHocSQLQuery', adHocRoute.adHocSQLQuery);

//Bug Bash
app.use('/api/report/bugbash2016/closedIssueCountByTeam', bugbash2016.closedIssueCountByTeam);
app.use('/api/report/bugbash2016/openIssueCountByTeam', bugbash2016.openIssueCountByTeam);
app.use('/api/report/bugbash2016/baIssueCountByTeam', bugbash2016.baIssueCountByTeam);
app.use('/api/report/bugbash2016/devIssueCountByTeam', bugbash2016.devIssueCountByTeam);
app.use('/api/report/bugbash2016/qaIssueCountByTeam', bugbash2016.qaIssueCountByTeam);
app.use('/api/report/bugbash2016/aging', bugbash2016.aging);
app.use('/api/report/bugbash2016/status', bugbash2016.statusReport);
app.use('/api/report/bugbash2016/statusByClient', bugbash2016.statusByClientReport);
app.use('/api/report/bugbash2016/uatIssueCountByTeam', bugbash2016.uatIssueCountByTeam);
app.use('/api/report/bugbash2016/impeded', bugbash2016.impeded);
app.use('/api/report/bugbash2016/clientFacing', bugbash2016.clientFacing);
app.use('/api/report/bugbash2016/notClientFacing', bugbash2016.notClientFacing);
app.use('/api/report/bugbash2016/uatDefects', bugbash2016.uatDefects);

//Cadence
app.use('/api/report/team/teamDetails', teams.teamIssue);
app.use('/api/report/team/teamSummary', teams.teamIssueChart);


app.use('/api/report/defects/statusByClientReport', defects.statusByClientReport);
app.use('/api/report/defects/clientFacing', defects.clientFacing);
app.use('/api/report/defects/notClientFacing', defects.notClientFacing);
app.use('/api/report/defects/openSDLCDefects', defects.openSDLCDefects);
app.use('/api/report/defects/openATLDefects', defects.openATLDefects);
app.use('/api/report/defects/closedDefectsSince', defects.closedDefectsSince);
app.use('/api/report/defects/statusByClientReport', defects.statusByClientReport);
app.use('/api/report/defects/incomingVsOutgoingSummary', defects.incomingVsOutgoingSummary);
app.use('/api/report/defects/incomingVsOutgoingDetails', defects.incomingVsOutgoingDetails);
app.use('/api/report/defects/clientFacingSummary', defects.clientFacingSummary);
app.use('/api/report/defects/incomingVsOutgoingDailySummary', defects.incomingVsOutgoingDailySummary);

app.use('/api/report/client/clientIssue', clients.clientIssue);
app.use('/api/report/client/clientIssueChart', clients.clientIssueChart);

app.use('/api/report/cadence/cadenceDetails', clients.clientIssue);
app.use('/api/report/cadence/cadenceSummary', clients.clientIssueChart);


//Dashboard
app.use('/api/report/dashboard/epicCountsInPlay', dashboard.epicCountsInPlay);
app.use('/api/report/dashboard/defectCountsInPlay', dashboard.defectCountsInPlay);
app.use('/api/report/dashboard/atlDefectCountsInPlay', dashboard.atlDefectCountsInPlay);
app.use('/api/report/dashboard/topActiveEpicsInPlay', dashboard.topActiveEpicsInPlay);
app.use('/api/report/dashboard/topActiveDefectssInPlay', dashboard.topActiveDefectssInPlay);
app.use('/api/report/dashboard/clientFacingDefects', dashboard.clientFacingDefects);
app.use('/api/report/dashboard/topOpenDeliverables', dashboard.topOpenDeliverables);
app.use('/api/report/dashboard/defectsAboveTheLineNotClosed', dashboard.defectsAboveTheLineNotClosed);
app.use('/api/report/dashboard/deliverablesAboveTheLineNotClosed', dashboard.deliverablesAboveTheLineNotClosed);
app.use('/api/report/dashboard/timeReportedAGainstClosedTickets', dashboard.timeReportedAGainstClosedTickets);
app.use('/api/report/dashboard/timeReportedAGainstNonHLs', dashboard.timeReportedAGainstNonHLs);
app.use('/api/report/dashboard/itemsClosedLastWeek', dashboard.itemsClosedLastWeek);


//Crud
var crudProjectRoute = require('./routes/crudProjectHandler');
app.use('/api/forms/projects', crudProjectRoute);

var crudProjectTicketsRoute = require('./routes/crudProjectTicketsHandler');
app.use('/api/forms/projectsTickets', crudProjectTicketsRoute);

app.use('/api/report/projectSummary', projectReports.projectSummary);
app.use('/api/report/projectChain', projectReports.projectChain);
app.use('/api/report/projectChainDetails', projectReports.projectChainDetails);
app.use('/api/report/projectHoursWorked', projectReports.projectHoursWorked);
app.use('/api/report/projectHoursWorkedDetail', projectReports.projectHoursWorkedDetail);
app.use('/api/report/projectEASummary', estimatesToActuals.projectEASummary);
app.use('/api/report/projectEADetails', estimatesToActuals.projectEADetails);
app.use('/api/report/projectBurnRate', projectReports.projectBurnRate);
app.use('/api/report/projectBurnRateDetails', projectReports.projectBurnRateDetails);

var server = app.listen(80, function () {
    logger.info("api listening on ", server.address().port);
})