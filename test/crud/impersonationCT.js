/**
 * Created by Pedrofuentes on 8/23/2015.
 *
 * CRUD tests for the Impersonation Feature on Room Manager.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
var impersonationLib = require('../../lib/impersonationLib');
var tokenLib = require('../../lib/tokenLib');
var impersonationRequest = require('../../requestJSONs/impersonationRequest.json');
var services = require('../../lib/servicesLib');
var settings = require('../../settings.json');

/*
 This test suit is used for acceptance tests on the Room Manager Impersonation feature.
 */
describe('Room Manager Impersonation Acceptance Tests:', function(){
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);

    var token = '';
    var serviceId = '';
    var impReq = '';

    var contentTypeInfo = impersonationRequest.ContentType;
    var authenticationState = impersonationRequest.authenticationSettings;

    /*
     The before method creates a token that is stored in the "token" global variable, and it's used
     for the whole group of test cases in this test suit.
     */
    before('Setting the token', function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });

    before('Setting the Service ID', function(done){
        services
            .getServices(token)
            .end(function(err, res){
                serviceId = res.body[0]._id;
                done();
            });
    });

    describe('', function(){

        /*
         This afterEach restores the initial non-impersonation state on Room Manager.
         */
        afterEach(function(done){
            impReq = impersonationRequest.impersonationUnChecked;


            impersonationLib
                .setImpersonation(serviceId, contentTypeInfo, token, impReq)
                .end(function(err, res){

                    impersonationLib
                        .setAuthentication(authenticationState, token)
                        .end(function(err, res){

                            done();
                        });
                });
        });

        /*
         This test case is to verify the update information setting for the impersonation option
         available on Room Manager is successful.

         The impersonation check is verifying the presence of the Room Manager API for
         this test case.
         */
        it('User Impersonation is checked', function(done){
            impReq = impersonationRequest.impersonationChecked;
            var impersonation;
            var serviceInfo;

            impersonationLib
                .setImpersonation(serviceId, contentTypeInfo, token, impReq)
                .end(function(err, res){
                    impersonation = res.body;

                    services
                        .getServicesById(token, serviceId)
                        .end(function(err, res){

                            serviceInfo = res.body;

                            expect(err).to.be.not.OK;
                            expect(res.status).to.equal(200);
                            expect(impersonation.credential).to.equal(serviceInfo.credential._id);
                            expect(impersonation.type).to.equal(serviceInfo.type);
                            expect(impersonation.name).to.equal(serviceInfo.name);
                            expect(impersonation.version).to.equal(serviceInfo.version);
                            expect(impersonation.serviceUrl).to.equal(serviceInfo.serviceUrl);
                            expect(impersonation._id).to.equal(serviceInfo._id);
                            expect(impersonation.__v).to.equal(serviceInfo.__v);
                            expect(impersonation.impersonate).to.equal(serviceInfo.impersonate);
                            expect(impersonation.alternativeServiceUrls).to.be.empty;

                            /*
                             The request and the response is setAuthentication()
                             */
                            impersonationLib
                                .setAuthentication(authenticationState, token)
                                .end(function(err, res){
                                    var authState = res.body;

                                    expect(err).to.be.not.OK;
                                    expect(res.status).to.equal(200);
                                    expect(authState.authentication).to.equal(authenticationState.authentication);

                                    done();
                                });
                        });
                });
        });
    });

    /*
     This test case is to verify the update information setting for the impersonation option
     available on Room Manager is successful.

     The impersonation uncheck is verifying the presence of the Room Manager API for
     this test case.
     */
    it('User Impersonation is unchecked', function(done){
        impReq = impersonationRequest.impersonationUnChecked;
        var impersonation;
        var serviceInfo;

        impersonationLib
            .setImpersonation(serviceId, contentTypeInfo, token, impReq)
            .end(function(err, res){
                impersonation = res.body;

                services
                    .getServicesById(token, serviceId)
                    .end(function(err, res){

                        serviceInfo = res.body;

                        expect(err).to.be.not.OK;
                        expect(res.status).to.equal(200);
                        expect(impersonation.credential).to.equal(serviceInfo.credential._id);
                        expect(impersonation.type).to.equal(serviceInfo.type);
                        expect(impersonation.name).to.equal(serviceInfo.name);
                        expect(impersonation.version).to.equal(serviceInfo.version);
                        expect(impersonation.serviceUrl).to.equal(serviceInfo.serviceUrl);
                        expect(impersonation._id).to.equal(serviceInfo._id);
                        expect(impersonation.__v).to.equal(serviceInfo.__v);
                        expect(impersonation.impersonate).to.equal(serviceInfo.impersonate);
                        expect(impersonation.alternativeServiceUrls).to.be.empty;

                       /*
                         The request and the response is setAuthentication()
                         */
                        impersonationLib
                            .setAuthentication(authenticationState, token)
                            .end(function(err, res){
                                var authState = res.body;

                                expect(err).to.be.not.OK;
                                expect(res.status).to.equal(200);
                                expect(authState.authentication).to.equal(authenticationState.authentication);
                                done();
                            });
                    });
            });
    });
});
