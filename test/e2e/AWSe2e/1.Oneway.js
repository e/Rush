var should = require('should');
var chai = require('chai');
var superagent = require('superagent');
var config = require('./config.js');
var redis = require('redis');
var _ = require('underscore');
var expect = chai.expect;

var HOST = config.rushServer.hostname;
var PORT = config.rushServer.port;

var RUSHENDPOINT = 'http://' + HOST + ':' + PORT;
var ENDPOINT = config.externalEndpoint;
var TIMEOUT = 100;

// Verbose MODE
var vm = false;


describe('ACCEPTANCE TESTS: EXTERNAL VALID SCENARIOS [AWS]', function () {
	this.timeout(5000);
	var agent = superagent.agent();

	function _validScenario(data, i){
		return function(){
			it(data.name, function(done){
				agent
						[data.method.toLowerCase()](RUSHENDPOINT )
						.set('x-relayer-host', ENDPOINT)  //Always the same endpoint
						.set(data.headers)
						.end(function(err, res) {
							expect(err).to.not.exist;
							expect(res.statusCode).to.equal(200); //Status code 200
							expect(res.body).to.exist;
							expect(res.body.id).to.exist;
							if (vm) {console.log(res.body);}
              var transId = res.body.id;
							setTimeout(function () {
								agent
										.get(RUSHENDPOINT +'/response/' + res.body['id'])
										.end(
										function onResponse2(err2, res2) {
											res2.headers['content-type'].should.eql('application/json; charset=utf-8');
											res2.should.have.status(200);
											res2.text.should.include('id');
											if (data.headers['x-relayer-topic']) {
												res2.body['topic'].should.eql('TEST');
											}
											else{
												res2.body['topic'].should.eql('undefined');
											}
											if (vm) {console.log(i+1);
												console.log(res2.body);}
										});

								return done();
							}, TIMEOUT);
						});
			});
		};
	}


	describe('\nCheck single features: with a invalid header policy request using method /GET', function () {
		var dataSetGET = [
			{method: 'GET',  headers: {}, name : "Oneway No header: Should NOT accept the request and retrieve the result"},
			{method: 'GET', headers: {"x-relayer-persistence" : "STATUS"}, name : "Persistance STATUS: Should accept the request and retrieve the stored status"},
			{method: 'GET', headers: {"x-relayer-persistence" : "HEADER"}, name : "Persistance HEADER: Should accept the request and retrieve stored header"},
			{method: 'GET', headers: {"x-relayer-persistence" : "BODY"}, name : "Persistance BODY: Should accept the request and retrieve the stored body"},
			{method: 'GET', headers: {"x-relayer-httpcallback" : "http://noname.com"}, name : "Callback: Should accept the request and retrieve the completed task"},
			{method: 'GET', headers: {"x-relayer-httpcallback-error" : "http://noname.com"},
				name : "Error Callback: Should accept the request and retrieve the completed task"},
			{method: 'GET', headers: {"x-relayer-retry" : "10, 20, 30"}, name : "Retry: Should accept the request and retrieve the completed task"},
			{method: 'GET', headers: {'x-relayer-proxy' : 'http://proxy.com'}, name : "Proxy: Should accept the request and retrieve the completed task"},
			{method: 'GET', headers: {'x-relayer-encoding' : 'base64'}, name : "Encoding: Should accept the request and retrieve the completed task"},
			{method: 'GET', headers: {'x-relayer-topic' : 'TEST'}, name : "TOPIC: Should accept the request and retrieve the topic and the completed task"}
		];



		for(i=0; i < dataSetGET.length; i++){
			_validScenario(dataSetGET[i], i)();  //Launch every test in data set
		}

	});


	describe('\nCheck single features: with a valid header policy request using method /POST', function () {
		var dataSetPOST = [
			{method: 'POST', headers: {}, name : "Oneway No header: Should accept the request and retrieve the result"},
			{method: 'POST', headers: {"x-relayer-persistence" : "STATUS"}, name : "Persistance STATUS: Should accept the request and retrieve the stored status"},
			{method: 'POST', headers: {"x-relayer-persistence" : "HEADER"}, name : "Persistance HEADER: Should accept the request and retrieve stored header"},
			{method: 'POST', headers: {"x-relayer-persistence" : "BODY"}, name : "Persistance BODY: Should accept the request and retrieve the stored body"},
			{method: 'POST', headers: {"x-relayer-httpcallback" : "http://noname.com"}, name : "Callback: Should accept the request and retrieve the completed task"},
			{method: 'POST', headers: {"x-relayer-httpcallback-error" : "http://noname.com"},
				name : "Error Callback: Should accept the request and retrieve the completed task"},
			{method: 'POST', headers: {"x-relayer-retry" : "10, 20, 30"}, name : "Retry: Should accept the request and retrieve the completed task"},
			{method: 'POST', headers: {'x-relayer-proxy' : 'http://proxy.com'}, name : "Proxy: Should accept the request and retrieve the completed task"},
			{method: 'POST', headers: {'x-relayer-encoding' : 'base64'}, name : "Encoding: Should accept the request and retrieve the completed task"},
			{method: 'POST', headers: {'x-relayer-topic' : 'TEST'}, name : "TOPIC: Should accept the request and retrieve the topic and the completed task"}
		];

		for(i=0; i < dataSetPOST.length; i++){
			_validScenario(dataSetPOST[i], i)();  //Launch every test in data set
		}
	});

	describe('\nCheck single features: with a valid header policy request using method /PUT', function () {
		var dataSetPUT = [
			{method: 'PUT', headers: {}, name : "Oneway No header: Should accept the request and retrieve the result"},
			{method: 'PUT', headers: {"x-relayer-persistence" : "STATUS"}, name : "Persistance STATUS: Should accept the request and retrieve the stored status"},
			{method: 'PUT', headers: {"x-relayer-persistence" : "HEADER"}, name : "Persistance HEADER: Should accept the request and retrieve stored header"},
			{method: 'PUT', headers: {"x-relayer-persistence" : "BODY"}, name : "Persistance BODY: Should accept the request and retrieve the stored body"},
			{method: 'PUT', headers: {"x-relayer-httpcallback" : "http://noname.com"}, name : "Callback: Should accept the request and retrieve the completed task"},
			{method: 'PUT', headers: {"x-relayer-httpcallback-error" : "http://noname.com"},
				name : "Error Callback: Should accept the request and retrieve the completed task"},
			{method: 'PUT', headers: {"x-relayer-retry" : "10, 20, 30"}, name : "Retry: Should accept the request and retrieve the completed task"},
			{method: 'PUT', headers: {'x-relayer-proxy' : 'http://proxy.com'}, name : "Proxy: Should accept the request and retrieve the completed task"},
			{method: 'PUT', headers: {'x-relayer-encoding' : 'base64'}, name : "Encoding: Should accept the request and retrieve the completed task"},
			{method: 'PUT', headers: {'x-relayer-topic' : 'TEST'}, name : "TOPIC: Should accept the request and retrieve the topic and the completed task"}
		];

		for(i=0; i < dataSetPUT.length; i++){
			_validScenario(dataSetPUT[i], i)();  //Launch every test in data set
		}
	});

	describe('\nCheck single features: with a valid header policy request using method /DELETE', function () {
		var dataSetDEL = [
			{method: 'DEL', headers: {}, name : "Oneway No header: Should accept the request and retrieve the result"},
			{method: 'DEL', headers: {"x-relayer-persistence" : "STATUS"}, name : "Persistance STATUS: Should accept the request and retrieve the stored status"},
			{method: 'DEL', headers: {"x-relayer-persistence" : "HEADER"}, name : "Persistance HEADER: Should accept the request and retrieve stored header"},
			{method: 'DEL', headers: {"x-relayer-persistence" : "BODY"}, name : "Persistance BODY: Should accept the request and retrieve the stored body"},
			{method: 'DEL', headers: {"x-relayer-httpcallback" : "http://noname.com"}, name : "Callback: Should accept the request and retrieve the completed task"},
			{method: 'DEL', headers: {"x-relayer-httpcallback-error" : "http://noname.com"},
				name : "Error Callback: Should accept the request and retrieve the completed task"},
			{method: 'DEL', headers: {"x-relayer-retry" : "10, 20, 30"}, name : "Retry: Should accept the request and retrieve the completed task"},
			{method: 'DEL', headers: {'x-relayer-proxy' : 'http://proxy.com'}, name : "Proxy: Should accept the request and retrieve the completed task"},
			{method: 'DEL', headers: {'x-relayer-encoding' : 'base64'}, name : "Encoding: Should accept the request and retrieve the completed task"},
			{method: 'DEL', headers: {'x-relayer-topic' : 'TEST'}, name : "TOPIC: Should accept the request and retrieve the topic and the completed task"}
		];

		for(i=0; i < dataSetDEL.length; i++){
			_validScenario(dataSetDEL[i], i)();  //Launch every test in data set
		}
	});

	describe('\nCheck single features: with a valid header policy request using method /OPTIONS', function () {
		var dataSetOPTIONS = [
			{method: 'OPTIONS', headers: {}, name : "Oneway No header: Should accept the request and retrieve the result"},
			{method: 'OPTIONS', headers: {"x-relayer-persistence" : "STATUS"}, name : "Persistance STATUS: Should accept the request and retrieve the stored status"},
			{method: 'OPTIONS', headers: {"x-relayer-persistence" : "HEADER"}, name : "Persistance HEADER: Should accept the request and retrieve stored header"},
			{method: 'OPTIONS', headers: {"x-relayer-persistence" : "BODY"}, name : "Persistance BODY: Should accept the request and retrieve the stored body"},
			{method: 'OPTIONS', headers: {"x-relayer-httpcallback" : "http://noname.com"}, name : "Callback: Should accept the request and retrieve the completed task"},
			{method: 'OPTIONS', headers: {"x-relayer-httpcallback-error" : "http://noname.com"},
				name : "Error Callback: Should accept the request and retrieve the completed task"},
			{method: 'OPTIONS', headers: {"x-relayer-retry" : "10, 20, 30"}, name : "Retry: Should accept the request and retrieve the completed task"},
			{method: 'OPTIONS', headers: {'x-relayer-proxy' : 'http://proxy.com'}, name : "Proxy: Should accept the request and retrieve the completed task"},
			{method: 'OPTIONS', headers: {'x-relayer-encoding' : 'base64'}, name : "Encoding: Should accept the request and retrieve the completed task"},
			{method: 'OPTIONS', headers: {'x-relayer-topic' : 'TEST'}, name : "TOPIC: Should accept the request and retrieve the topic and the completed task"}
			//{method: 'OPTIONS', headers: {'x-relayer-topic' : 'TEST2'}, name : "TO DO: CHECK why the last test is not validated..."}
		];

		for(i=0; i < dataSetOPTIONS.length; i++){
			_validScenario(dataSetOPTIONS[i], i)();  //Launch every test in data set
		}
	});




});


describe('ACCEPTANCE TESTS: EXTERNAL INVALID SCENARIOS [AWS]', function () {
	this.timeout(5000);
	var agent = superagent.agent();

	function _invalidScenario(data, i){
		return function(){
			it(data.name, function(done){
				agent
						[data.method.toLowerCase()](RUSHENDPOINT )
						.set('x-relayer-host', ENDPOINT)  //Always the same endpoint
						.set(data.headers)
						.end(function(err, res) {
							should.not.exist(err)
							res.should.have.status(400);
							res.text.should.include("ok");
							if (data.headers['x-relayer-persistence']) {
								res.text.should.include("errors");
								res.body['ok'].should.eql(false);
								res.body['errors'].should.match(/^invalid persistence type/);
								if (vm) {console.log(res.body['errors']);}
							}
							if (vm) {console.log(res.body);}
							done();
						});
			});
		};
	}


	describe('\nCheck single features: with a valid header policy request using method /GET', function () {
		var dataSetGET = [
			{method: 'GET', headers: {"x-relayer-persistence" : "STATUSSS"}, name : "Persistance STATUS: Should NOT accept the request"},
			{method: 'GET', headers: {"x-relayer-persistence" : "HEADERRR"}, name : "Persistance HEADER: Should NOT accept the request"},
			{method: 'GET', headers: {"x-relayer-persistence" : "BODYY"}, name : "Persistance BODY: Should NOT accept the request"},
			{method: 'GET', headers: {"x-relayer-httpcallback" : "httpSDD://noname.com"}, name : "Callback: Should NOT accept the request"},
			{method: 'GET', headers: {"x-relayer-httpcallback-error" : "AAhttp://noname.com"},
				name : "Error Callback: Should NOT accept the request and retrieve the completed task"},
			{method: 'GET', headers: {"x-relayer-retry" : "10a, aa, 30"}, name : "Retry: Should NOT accept the request"}
		// POSSIBLE ISSUES TO CHECK
		//	{method: 'GET', headers: {'x-relayer-proxy' : 'aaa://\n'}, name : "Proxy: Should NOT accept the request"},
		//	{method: 'GET', headers: {'x-relayer-encoding' : 'XXXIOSbase64'}, name : "Encoding: Should NOT accept the request"}
		//	{method: 'GET', headers: {'x-relayer-topic' : '\n'}, name : "TOPIC: Should NOT accept the request"}
		];
	for(i=0; i < dataSetGET.length; i++){
			_invalidScenario(dataSetGET[i], i)();  //Launch every test in data set
		}

	});



});