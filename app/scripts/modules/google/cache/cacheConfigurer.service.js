'use strict';

let angular = require('angular');
import {ACCOUNT_SERVICE} from 'core/account/account.service';
import {GCE_HEALTH_CHECK_READER} from '../healthCheck/healthCheck.read.service';
import {NETWORK_READ_SERVICE} from 'core/network/network.read.service';
import {SUBNET_READ_SERVICE} from 'core/subnet/subnet.read.service';

module.exports = angular.module('spinnaker.gce.cache.initializer', [
  require('../backendService/backendService.reader.js'),
  ACCOUNT_SERVICE,
  require('core/instance/instanceTypeService.js'),
  require('core/loadBalancer/loadBalancer.read.service.js'),
  NETWORK_READ_SERVICE,
  require('core/securityGroup/securityGroup.read.service.js'),
  SUBNET_READ_SERVICE,
  GCE_HEALTH_CHECK_READER,
  require('../httpHealthCheck/httpHealthCheck.reader.js'),
])
  .factory('gceCacheConfigurer', function (accountService, gceBackendServiceReader,
                                           gceCertificateReader, gceHealthCheckReader,
                                           gceHttpHealthCheckReader, instanceTypeService,
                                           loadBalancerReader, networkReader, subnetReader) {

    let config = Object.create(null);

    config.backendServices = {
      initializers: [ () => gceBackendServiceReader.listBackendServices() ],
    };

    config.certificates = {
      initializers: [ () => gceCertificateReader.listCertificates() ],
    };

    config.credentials = {
      initializers: [ () => accountService.getCredentialsKeyedByAccount('gce') ],
    };

    config.healthChecks = {
      initializers: [ () => gceHealthCheckReader.listHealthChecks() ],
    };

    config.httpHealthChecks = {
      initializers: [ () => gceHttpHealthCheckReader.listHttpHealthChecks() ],
    };

    config.instanceTypes = {
      initializers: [ () => instanceTypeService.getAllTypesByRegion('gce') ],
    };

    config.loadBalancers = {
      initializers: [ () => loadBalancerReader.listLoadBalancers('gce') ],
    };

    config.networks = {
      initializers: [ () => networkReader.listNetworksByProvider('gce') ],
    };

    config.subnets = {
      initializers: [ () => subnetReader.listSubnetsByProvider('gce') ],
    };

    return config;
  });
