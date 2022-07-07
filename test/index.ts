import { Logger } from '../src';
const log = new Logger();
log.info('Hello World');
log.error('Error');
log.setLogLevel('none');
log.info('Info');
console.log(log);
