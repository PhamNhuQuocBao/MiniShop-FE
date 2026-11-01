const { spawn } = require('node:child_process');
const port = process.env.PORT || '3000';
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname','0.0.0.0','--port',port],{stdio:'inherit'});
child.on('exit',code=>process.exit(code??1));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
