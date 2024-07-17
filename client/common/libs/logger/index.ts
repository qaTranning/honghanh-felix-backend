import LogT from 'logt';

const logger = process.env.NODE_ENV === 'production ' ? new LogT('none') : new LogT('info');

export { logger };
