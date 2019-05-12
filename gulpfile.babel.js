/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import { src, dest, series, parallel } from 'gulp'
import { cfg } from './tasks/config'

import gclean from 'gulp-clean'
import { Jt } from './tasks/Jt'
import { JtHandlers } from './tasks/JtHandlers'
import { distr } from './tasks/distr'


exports.build = series
(
    clean,
    parallel(
        Jt,
        JtHandlers,
    ),
    distr
);
exports.clean = clean;

function clean()
{
    return src([cfg.dir.out, cfg.dir.obj, cfg.dir.zipped], {
                allowEmpty: true, 
                read: false
            })
            .pipe(gclean());
}

exports.default = function(cb)
{
    console.log
    (
        "Usage:\n\n" +
        "  gulp build --conf (release|debug*)\n" +
        "  gulp clean\n" +
        "\n" +
        "gulp --tasks\n"
    );
    cb();
}