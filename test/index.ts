import { Logger } from '../src';
const log = new Logger({
  level: ['warning', 'info'],
});

for (let i = 0; i < 20; i++) {
  log.info('Hello World');
  log.error('Hello World');
  log.warning('Hello World');
  log.debug('Hello World');
}
log.setLogLevel(['info', 'error']);
for (let i = 0; i < 20; i++) {
  log.info('Hello World');
  log.error('Hello World');
  log.warning('Hello World');
  log.debug('Hello World');
}
console.log(process.env);
