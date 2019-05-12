/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import { src, dest, series, parallel } from 'gulp';
import { cfg, dsrc } from './config';
import { umdNative, removeComments } from './umd'
import { esname, libEdition, nccEdition } from './suffixes';

import browserify from 'browserify';
import source from 'vinyl-source-stream';
import tsify from 'tsify';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';
import closureCompiler from 'google-closure-compiler';
import rename from 'gulp-rename';
import gulpif from 'gulp-if';
import gap from 'gulp-append-prepend';
import through2 from 'through2';
import path from 'path';

exports.JtHandlers = parallel(
    JtHandlersBuildES3, JtHandlersBuildES6,
    JtHandlersBuildNodeES6
);

function JtHandlersBuildES3()
{
    // for current JtHandlers, TSC ES6 -> CC ES3 doesn't have the same things as it was for Jt Core (see there related remark)
    return build('ES3', 'ECMASCRIPT3');
}

function JtHandlersBuildES6()
{
    return build('ES6', 'ECMASCRIPT_2015');
}

function JtHandlersBuildNodeES6()
{
    return build('ES6', 'ECMASCRIPT_2015', false);
}

function build(tsTarget, ccTarget, compile = true)
{
    const cc    = closureCompiler.gulp();
    const es    = esname(ccTarget);
    const ncc   = nccEdition(!compile);

    let inf = '/*[Jt handler] '+ es +'+ ';
    if(ncc) {
        inf += '[NCC]'
    }
    inf += '*/';

    let fout;

    let stream = src([ cfg.dir.src + cfg.src.handlers + cfg.handlers.__ignore + '*.ts' ])
    .pipe(through2.obj(function(file, _, cb)
    {
        fout = path.parse(file.path).name;
        
        // browserify({
        //     debug: cfg.isDebug(),
        //     entries: [ file.path ],
        // })
        // .plugin(tsify, { "target": tsTarget })
        // .bundle()
        // .pipe(source('bundle.js'))
        // .pipe(buffer())
        // .pipe(gulpif(cfg.isDebug(), sourcemaps.init({ loadMaps: true })))

        umdNative([ file.path ], tsTarget, '', cfg.handlers.moduleExclude)
        .pipe(through2.obj(function(res, _, cbres)
        {
            file.contents = res.contents;

            cbres(null, res);
            cb(null, file);
        }));
        
    }))
    .pipe(gulpif(compile, cc({
        ...cfg.closure.def, 
        language_out: ccTarget,
        externs: cfg.dir.src + cfg.src.handlers + cfg.src.externs + '.js',
        chunk: [],
    })))

    removeComments(stream, compile)
    .pipe(gap.prependText(inf))
    .pipe(gulpif(cfg.isDebug(), sourcemaps.write('./')))
    .pipe(rename((path) => {
        path.basename = cfg.src.handlers + fout + '.' + es.toLowerCase() + ncc;
        path.extname = ".js";
    }))
    .pipe(dest(cfg.dir.obj, { overwrite: true }));

    return stream;
}
