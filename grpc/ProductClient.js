const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = path.join(__dirname, 'protos', 'product.proto');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const productProto = grpc.loadPackageDefinition(packageDefinition).product;
const clientStub = new productProto.ProductService('localhost:9091', grpc.credentials.createInsecure()); //TODO ko das v produkcijo zamenjaj z createSsl zdaj je plaintext

module.exports = clientStub;