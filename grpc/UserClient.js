const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = path.join(__dirname, 'protos', 'user.proto');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const userProto = grpc.loadPackageDefinition(packageDefinition).user;
const clientStub = new userProto.UserService('localhost:9090', grpc.credentials.createInsecure()); //TODO ko das v produkcijo zamenjaj z createSsl zdaj je plaintext

module.exports = clientStub;