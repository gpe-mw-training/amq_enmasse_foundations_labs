/*
 * Copyright 2015 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var container = require('rhea');

var args = require('./options.js').options({
      'm': { alias: 'messages', default: 100, describe: 'number of messages to expect'},
      'n': { alias: 'node', default: 'examples', describe: 'name of node (e.g. queue) from which messages are received'},
      'p': { alias: 'port', default: 5672, describe: 'port to connect to'}
    }).help('help').argv;

var received = 0;
var expected = args.messages;

container.on('message', function (context) {
    if (context.message.id && context.message.id < received) {
        // ignore duplicate message
        return;
    }
    if (expected === 0 || received < expected) {
        console.log(JSON.stringify(context.message.body))
        if (++received === expected) {
            context.receiver.detach();
            context.connection.close();
        }
    }
});


container.connect({port:args.port,host:"messaging-db8482f-amq-online-infra.apps.cluster-76bb.76bb.example.opentlc.com", username:'user1', password:'password', transport:'tls',rejectUnauthorized:false}).open_receiver({source:args.node, snd_settle_mode:0});

