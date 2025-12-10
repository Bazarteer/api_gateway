const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = path.join(__dirname, 'protos', 'order.proto');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     defaults: true,
     oneofs: true
    });

const orderProto = grpc.loadPackageDefinition(packageDefinition).order;
const clientStub = new orderProto.OrderService('localhost:9092', grpc.credentials.createInsecure()); //TODO ko das v produkcijo zamenjaj z createSsl zdaj je plaintext

module.exports = clientStub;