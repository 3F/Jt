/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2019  Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import { IJtConfig } from './IJtConfig';

//#__export:JtConfig = JtConfig  -- this directive will export this module for eumd wrapper
export class JtConfig implements IJtConfig
{
    /**
     * Opening tag. E.g.: '{{' + name.
     *
     * @field {string | undefined}
     */
    public op: string | undefined;

    /**
     * Ending tag. E.g.: name + '}}'.
     *
     * @field {string | undefined}
     */
    public ed: string | undefined;

    /**
     * Sets `op` + `ed` tags via pair logic.
     * - '%':    '%' + name + '%'
     * - '{}':   '{' + name + '}'
     * - '{{}}': '{{' + name + '}}'
     * - '{{}':  '{{' + name + '}'
     *
     * @param {string}
     * @returns {void}
     */
    public pair(value: string): void
    {
        if(!value) {
            return;
        }
        
        if(value.length === 1) {
            this.op = this.ed = value;
            return;
        }
        
        const half = Math.ceil(value.length / 2);
        
        this.op = value.slice(0, half);
        this.ed = value.slice(half);
    }
    
    /**
     * Formats input word as user tag.
     *
     * @param word {string} Input word.
     * @returns {string}
     */
    public tag(word: string): string
    {
        return this.op + word + this.ed;
    }

    /**
     * Tries to make new configuration.
     * @param config {IJtConfig | string | undefined} Either string to constructor or available config instance.
     * @returns {JtConfig} Returns new instance or this if it's failed.
     */
    public try(config?: IJtConfig | string): IJtConfig
    {
        if(!config) {
            return this;
        }
        return JtConfig.make(config);
    }

    /**
     * Makes JtConfig instance from provided data.
     *
     * @param config {IJtConfig | string | undefined} Either string to constructor or available config instance.
     * @returns {JtConfig}
     * @static
     */
    public static make(config?: IJtConfig | string): JtConfig
    {
        let _cfg = new JtConfig();
        
        if(!config) {
            return _cfg;
        }

        if(typeof config === 'string') {
            _cfg.pair(config);
            return _cfg;
        }

        if(!(config instanceof JtConfig))
        {
            // TODO: ~ clone function
            _cfg.op = config.op;
            _cfg.ed = config.ed || '';
            return _cfg;
        }

        return config;
    }
    
    /**
     * @param pair {string} Initialize with `IJtConfig.pair()` logic.
     */
    public constructor(pair: string = '%')
    {
        this.pair(pair);
    }
}