/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import { src, dest, series, parallel } from 'gulp';
import { cfg, dsrc, umd } from './config';

import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import ts from 'gulp-typescript';
import replace from 'gulp-replace';
import fs from 'fs';
import through2 from 'through2';

exports.eumdNative = function(input, tsTarget, edition)
{
    cfg.eumd = cfg.eumd || fs.readFileSync(dsrc(cfg.src.eumd), 'utf8');

    let exTypes = {};

    return native(input, tsTarget, [])
    .pipe(replace(
        /\/\/#__export(?::([a-z0-9_$]+))?\s*=\s*([a-z0-9_$]+)/gi,
        (m, p1, p2, offset, str) =>
        {
            exTypes[p1 || p2] = p1 ? p2 : p2 + edition;
            return m;
        }
    ))
    .pipe(replace(
        /^[\s\S]+\/\/#__export\s*=\s*([a-z0-9_$]+)[\s\S]+$/i,
        (m, p1, offset, str) =>
        {
            return cfg.eumd
                        .replace('/*__export*/', toStringJSON(exTypes))
                        .replace('/*__body*/', str);
        }
    ));
}

exports.umdNative = function(input, tsTarget, edition, exclude)
{
    cfg.umd = cfg.umd || fs.readFileSync(dsrc(cfg.src.umd), 'utf8');

    return native(input, tsTarget, exclude || [])
    .pipe(replace(
        /^[\s\S]+\/\/#__export\s*=\s*([a-z0-9_$]+)[\s\S]+$/i,
        (m, p1, offset, str) =>
        {
            return cfg.umd
                        .replace('/*__export_global*/', p1)
                        .replace('/*__export*/', p1 + edition)
                        .replace('/*__body*/', str);
        }
    ));
}

exports.removeComments = function(stream, compile)
{
    if(compile) {
        return stream;
    }

    return stream
        .pipe(replace(/\/\*(?!\*)[\s\S]+?\*\//g, ''))
        .pipe(replace(/\/\/.*/g, ''))
        .pipe(replace(/(\r?\n){2,}/g, '$1'));
}

function native(input, tsTarget, exclude)
{
    return src(input)
    .pipe(ts({
        target: tsTarget,
        removeComments: false,
        module: 'amd',
        outFile: 'compiled.js'
    }))
    .pipe(gulpif(cfg.isDebug(), sourcemaps.init({ loadMaps: true })))
    .pipe(replace(/\/\*{2}-_\*\/[^}]+?}\s*;?/g, ''))
    .pipe(replace(/\/\*{2}-_-\*\/[\s\S]+?throw 8;?\s*}\s*;?/g, ''))
    .pipe(replace(
        /define\s*\(\s*['"]\s*([a-z0-9_$/\\]+)\s*['"][\s\S]+?function\s*\(([^)]+?)\)[\s\S]+?__esModule[^;]+?;([\s\S]+?)(?:exports\s*\.[\s\S]+?}\);|}\);)/gi, // ES3 & ES6
        (m, p1, p2, p3) =>
        {
            // p1 - module name ~ Core/JtConfig
            // p2 - function( -> require, exports, ... <-
            // p3 - body

            if(!p3 || exclude.indexOf(p1) != -1) {
                return '';
            }

            var arg = p2.split(',');
            for(let i = 2; i < arg.length; ++i) { //2+ require, exports, ... <-
                p3 = p3.replace(new RegExp(arg[i] + '\\s*.', 'g'), ' ');
            }
            return p3;
        }
    ));
}

function toStringJSON(obj)
{
    if(!obj) {
        return '{}';
    }

    let ret = '{';
    for(let k in obj) {
        ret += '"' + k + '":' + obj[k] + ',';
    }
    ret += '}';

    return ret;
}