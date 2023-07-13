import { connect, StringCodec } from '../nats.js';

const sc = StringCodec();

export const getConnection = async (servers) => {
  try {
    const conn = await connect({
      servers,
    });
    console.log(`successfully connected to servers: ${servers.join(', ')}`);
    return conn;
  } catch (err) {
    console.log({
      message: `unable to connect to nats. Tried servers: ${servers.join(',')}`,
      error: err,
    });
    return null;
  }
};

export const closeConnection = async (conn) => {
  // this promise indicates the client closed
  const done = conn.closed();
  // do something with the connection

  // close the connection
  await conn.close();
  // check if the close was OK
  const err = await done;
  if (err) {
    console.log(`error closing:`, err);
  }
};

export const processMsgs = async (sub, cb) => {
  for await (const m of sub) {
    const msg = sc.decode(m.data);
    console.log(`[${sub.getProcessed()}]: ${msg}`);
    cb(msg);
  }
  console.log('subscription closed');
};

export const subscribe = ({ conn, subject }) => {
  const sub = conn.subscribe(subject);
  return sub;
};

export const publish = async ({ conn, subject, msg }) => {
  console.log(`publishing
  to subject: '${subject}'
  message: '${msg}'`);
  conn.publish(subject, sc.encode(msg));
};

// export const testPubSub = async () => {
//   const conn = await getConnection(DEFAULT_SERVERS);
//   const subject = 'hello';
//   subscribe({ conn, subject });
//   publish({ conn, subject, msg: 'world!' });
// };
