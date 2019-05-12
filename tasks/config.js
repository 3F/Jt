/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

const configs = 
{
    "debug": {
        isDbg: true,
    },
    "release": {
        
    },
    "release-public": {
        
    },
}

const cfg = 
{
    dir:
    {
        src: 'src/',
        out: 'dist/',
        obj: 'obj/',
        zipped: 'dist.zip/',
    },
    
    src:
    {
        Jt: 'Core/Jt',
        handlers: 'Handlers/',
        protected: '$protected',
        externs: '.externs',
        eumd: 'Pkg/eumd.js',
        umd: 'Pkg/umd.js',
    },

    handlers: 
    {
        JtIf: 'JtIfHandler',
        __ignore: '!(IJtHandler)', //glob !(one|two|...)
        moduleExclude:
        [
            // 'Core/JtConfig'
        ],
    },
    
    obj:
    {
        Jt: 'Jt.js',
    },
    
    babel:
    {
        presets: [[
            '@babel/preset-env',
            {
                targets: '> 0.25%, not dead',
            }
        ]]
    },
    
    closure:
    {
        def: {
            compilation_level: 'ADVANCED', // BUNDLE, WHITESPACE_ONLY, SIMPLE (default), ADVANCED
            warning_level: 'QUIET',
            // language_out: '', // ECMASCRIPT3, ECMASCRIPT5, ECMASCRIPT5_STRICT, ECMASCRIPT_2015, STABLE 
        },
    },
    
    /** arguments to current process */
    argv: null,
    umd: undefined,
    eumd: undefined,
    isDebug: function() { return this.type.data['isDbg'] == true; },
    
    type:
    {
        name: undefined,
        data: undefined,
    },
}

/* = = = = = = = = = = = = */

import minimist from 'minimist';
import path from 'path';

exports.cfg = cfg;
exports.setconf = setconf;
exports.jpath = path.posix.join; // do not use win32 because of gulp reserve
exports.dsrc = (input) => exports.jpath(cfg.dir.src, input || '');
exports.dobj = (input) => exports.jpath(cfg.dir.obj, input || '');

function setconf(confname)
{
    if(!configs[confname])
    {
        cfg.type.name = undefined;
        cfg.type.data = undefined;
        return false;
    }
    
    cfg.type.name   = confname;
    cfg.type.data   = configs[confname];
    return true;
}

(function()
{
    setconf('debug');
    cfg.argv = minimist(process.argv.slice(2));

    if(cfg.argv['conf'])
    {
        const cfgname = cfg.argv['conf'].toLowerCase();
        if(!setconf(cfgname)) {
            throw new Error("Configuration '" + cfgname+ "' is not defined.");
        }
    }

    console.log("\n\x1b[47m \x1b[107m \x1b[100m  '" + cfg.type.name + "' configuration is activated \x1b[0m\n");

})();