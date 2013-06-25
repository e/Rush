// https://pdihub.hi.inet/TDAF/tdaf-api-authserver/blob/feature/APIAUTHSVR-6/test/acceptance/component/grant-types/client-credentials/client-credentials
// DATASET


var should = require('should');
var chai = require('chai');
var superagent = require('superagent');
var config = require('../config');

var HOST = config.rushServer.hostname;
var PORT = config.rushServer.port;
var URL_RUSH = 'http://' + HOST + ':' + PORT;
var ENDPOINT = config.externalEndpoint;
var TIMEOUT = 1000;


describe('USING DATASETS', function () {


	describe('with a valid Endpoint and Headers', function () {
		var agent = superagent.agent();

		it('should accept requests using / POST', function (done) {
			agent
					.post(URL_RUSH)
					.set('X-relayer-host', ENDPOINT)
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				res.headers['x-powered-by'].should.eql('Express');
				res.headers['content-type'].should.eql('application/json; charset=utf-8');
			//	ids.push(res.body['id']);
				res.should.have.status(200);
				res.text.should.include('id');
				return done();
			}
		});






it('Scenario 0: Using the datasets', function(done) {
	var var1 = '1';
	var var2 = '2:';
	var var3  = '3 3';
	var dataSet = [          //sample dataSet with random values
				{param1: 'a', param2: ''}, //Empty param2
				{param1: 'b', param2: '2'}, //Numeric
				{param1: 'value1', param2: var2}, // Adding var
				{param1: 'value2', param2: var3}, // Adding space
				{param1: var1, param2: ''}, //Empty param2
				{param1: var1, param2: 'HmAX3MnJcGm0b Ld'}, // Adding space
				{param1: var1, param2: 'HmAX3MnJcGm0b:Ld'} // Adding ':'
			],
			i = 0,
			tests = dataSet.length,
			validated = 0;

		//Execute test with the data set
	for (i = 0, tests = dataSet.length; i < tests; i += 1) {
    //console.log('DATASET [', i, '] -> ', dataSet[i].param1, '/ ', dataSet[i].param2 );
   	agent
					.post(URL_RUSH)
					.set('X-relayer-host', ENDPOINT)
					.set('X-www','blabla')    //fixed tag
					.set(dataSet[i].param1,dataSet[i].param2)     //dataSet use
					.end(onResponse);
		}

	function onResponse( err, res) {
		should.not.exist(err);
		should.exist(res);
		//console.log(res.body);
		res.body.should.have.property('id');
		res.should.have.property('statusCode', 200);
		validated += 1;
		if (validated === tests) {
			done();
		}
	}
});



		it.skip('Scenario X: should return an access RUSH token when includes valid client credentials ', function(done) {
			setupMock(oauthMockHelper.getTokenResponseConfig(), function () {
				agent
						.post(URL_RUSH)
						.set('X-relayer-host', ENDPOINT)
						.end(function(err, res) {
							expect(err).to.not.exist;
							expect(res.statusCode).to.equal(200);
							expect(res.body[OAUTH_PARAM_ACCESS_TOKEN]).to.exist;
							expect(res.body[OAUTH_PARAM_TOKEN_TYPE]).to.equal(OAUTH_VALUE_TOKEN_TYPE_BEARER);
							getAuthServerRequest(function(request) {
								var params = qs.parse(request.body);
								expect(request.headers['content-type']).to.equal('application/x-www-form-urlencoded; charset=utf-8');
								expect(params[OAUTH_PARAM_GRANT_TYPE]).to.equal(OAUTH_REQUEST_VALID_GRANT_TYPE);
								expect(Object.keys(params).length).to.equal(1);
								done();
							});
						});
			});
		});


	});
});
