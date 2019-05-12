/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import { cfg, dsrc } from './config';

/**
 * @returns Returns unified name for an ES standard
 */
exports.esname = function(input)
{
    input = input.toUpperCase();
    switch(input)
    {
        case 'ECMASCRIPT3': return 'ES3';
        case 'ECMASCRIPT5': return 'ES5';
        case 'ECMASCRIPT5_STRICT': return 'ES5';
        case 'ECMASCRIPT_2015': return 'ES6';
        case 'ES2015': return 'ES6';
        case 'ES2016': return 'ES7';
        case 'ES2017': return 'ES8';
        case 'ES2018': return 'ES9';
    }
    return input;
}

exports.libEdition = function(input)
{
    switch(input)
    {
        case cfg.src.protected: return '.safe';
    }
    return input;
}

exports.nccEdition = function(ncc)
{
    return ncc ? '.ncc' : '';
}
