import http from 'http';
import crypto from 'crypto';

// 1. 先创建http服务

const server = http.createServer((req, res) => {
  const errorCode = 400;
  res.writeHead(errorCode, { 'Content-Type': 'text/plain' });

  res.end(`HTTP ${errorCode} Bad Request`);
})

// 2. 升级协议
server.on('upgrade', (req, socket, head) => { 
  const key = req.headers['sec-websocket-key'];
  const acceptValue = generateAcceptValue(key);

  const responseHeaders = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptValue}`
  ]
  // 发送切换协议的请求头
  socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

  // 处理数据
  socket.on('data', (buffer) => { 
    socket.write(generateWebsocketFrame('Hello from server'));
    // 处理buffer
    const firstByte = buffer.readUInt8(0);
    const secondByte = buffer.readUInt8(1);
    const opCode = firstByte & 0b00001111; // 取后四位
    const isMasked = (secondByte & 0b10000000) === 0b10000000; // 取第一位
    let payloadLength = secondByte & 0b01111111; // 取后七位
    let currentOffset = 2;
    if (payloadLength === 126) {
      payloadLength = buffer.readUInt16BE(currentOffset);
      currentOffset += 2;
    } else if (payloadLength === 127) {
      // 64位长度暂不处理
      throw new Error('Large payloads not currently implemented');
    }
    let maskingKey;
    if (isMasked) {
      maskingKey = buffer.slice(currentOffset, currentOffset + 4);
      currentOffset += 4;
    }
    const payloadData = buffer.slice(currentOffset, currentOffset + payloadLength);
    let unmaskedPayload = payloadData;
    if (isMasked) {
      unmaskedPayload = Buffer.alloc(payloadLength);
      for (let i = 0; i < payloadLength; i++) {
        unmaskedPayload[i] = payloadData[i] ^ maskingKey[i % 4];
      }
    }
    if (opCode === 0x1) {
      // 文本帧
      console.log('Received message:', unmaskedPayload.toString('utf8'));
    } else if (opCode === 0x8) {
      // 连接关闭帧
      console.log('Connection close frame received');
      socket.end();
    } else if (opCode === 0x9) {
      // 心跳帧
      console.log('Ping frame received');
      // 回复 Pong 帧
      const pongFrame = Buffer.from([0b10001010, 0]);
      socket.write(pongFrame);
    } else if (opCode === 0xA) {
      // Pong 帧
      console.log('Pong frame received');
    } else {
      console.log('Unsupported frame type:', opCode);
    }
  })
})

// 3. 处理数据帧

server.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});


/**
 * 根据客户端的 Sec-WebSocket-Key 生成 Sec-WebSocket-Accept
 *
 * @param {*} acceptKey 
 * @returns {*} 
 */
function generateAcceptValue(acceptKey) {
  return crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
}


/**
 * 传一个数据，生成一个 WebSocket 帧
 *
 * @param {*} data 
 * @returns {*} 
 */
function generateWebsocketFrame(data) {
  const message = Buffer.from(data);
  // 帧缓冲
  const frame = Buffer.alloc(2 + message.length);
  // 标志位
  // 设置第一个字节
  frame[0] = 0b10000001; // FIN + 文本帧
  // 设置第二个字节
  frame[1] = message.length; // 不进行掩码处理
  // 设置数据部分
  message.copy(frame, 2);
  return frame;
}