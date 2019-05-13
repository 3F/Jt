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

import { IJt } from './IJt';
import { IJtAct } from './IJtAct';
import { IJtConfig } from './IJtConfig';
import { JtAct } from './JtAct';
import { JtConfig } from './JtConfig';
import { IDictionary } from '../Types/IDictionary';

/**
 * Meet Mr. Jt.
 */
//#__export = Jt  -- this directive will export this module for eumd wrapper
export class Jt implements IJt
{
    /**
     * Default config. Each item can be redefined from `as` methods.
     * @field {JtConfig}
     */
    public config: IJtConfig;
    
    /**
     * IJtAct instances.
     * @protected
     */
    protected _act: IDictionary<IJtAct> = {};
    
    /**
     * Use already captured raw data.
     * `.value()` will return undefined if it's not exists.
     * 
     * @param name Named data for use.
     * @returns IJtAct instance that provides actual actions for new chain.
     */
    public use(name: string): IJtAct;
    
    /**
     * Capture once raw data as `name`.
     * It will either use existing raw data without updating them
     * or add then use it.
     * 
     * See also `set` method for more strong behaviour.
     * 
     * @param name Naming for data use.
     * @param data Raw data with placeholders etc.
     * @returns Returns IJtAct instance to continue chain.
     */
    public use(name: string, data: string | undefined): IJtAct;
    
    /**
     * List of already captured raw data.
     * 
     * @param name Names for use.
     * @returns Returns IJt instances to continue chain.
     */
    public use(name: string[]): IDictionary<IJtAct>;

    /**
     * Capture list of raw data.
     * [ {name: data}, ... ]
     * 
     * @param data Key-Value List of named raw data with placeholders etc.
     * @returns Returns IJt instances to continue chain.
     */
    public use(data: IDictionary<string>[]): IDictionary<IJtAct>;
    
    /**
     * `public use(name: string): IJtAct;`
     *
     * Use already captured raw data.
     * `.value()` will return undefined if it's not exists.
     * 
     * @param name {string} Named data for use.
     * @returns {JtAct} IJtAct instance that provides actual actions for new chain.
     *
     * 
     * `public use(name: string, data: string | undefined): IJtAct;`
     *
     * Capture once raw data as `name`.
     * It will either use existing raw data without updating them
     * or add then use it.
     * 
     * See also `set` method for more strong behaviour.
     * 
     * @param name {string} Naming for data use.
     * @param data {string | undefined} Raw data with placeholders etc.
     * @returns {JtAct} Returns IJtAct instance to continue chain.
     *
     * 
     * `public use(name: string[]): IDictionary<IJtAct>;`
     *
     * List of already captured raw data.
     * 
     * @param name {string[]} Names for use.
     * @returns {IDictionary<IJtAct>} Returns IJt instances to continue chain.
     *
     * 
     * `public use(data: IDictionary<string>[]): IDictionary<IJtAct>;`
     *
     * Capture list of raw data.
     * [ {name: data}, ... ]
     * 
     * @param data {IDictionary<string>[]} Key-Value List of named raw data with placeholders etc.
     * @returns {IDictionary<IJtAct>} Returns IJt instances to continue chain.
     */
    public use(name: string | string[] | IDictionary<string>[], data?: string): IJtAct | IDictionary<IJtAct>
    {
        if(name && typeof name === 'object') { //+ [], {}
            return this._many(name);
        }
        return this._one(name, data);
    }

    /**
     * Force capturing raw data as `name`.
     * While `use` will either use existing raw data or add then use,
     * this `set` will update data for each call.
     * 
     * @param name {string} Naming for data use.
     * @param data {string | undefined} Raw data with placeholders etc.
     * @returns {JtAct} Returns IJtAct instance to continue chain.
     */
    public set(name: string, data: string | undefined): IJtAct
    {
        return this._one(name, data, true);
    }

    /**
     * To final remove any data from nodes.
     * @param names {...string[]} List of named data.
     * @returns {Jt} Returns itself IJt instance to continue chain.
     */
    public nil(...names: string[]): IJt
    {
        if(!names) {
            return this;
        }

        for(let k in names) {
            delete this._act[names[k]];
        }
        return this;
    }
    
    /**
     * Checks existence.
     * Fast alternative to `use` methods 
     * because it will not create an empty IJtAct if it's not defined.
     * 
     * @param name {string} Named data for use.
     * @returns {JtAct | null} Returns either IJtAct instance to continue chain or null if name does not exist.
     */
    public is(name: string): IJtAct | null
    {
        if(this._act[name]) {
            return this._act[name];
        }
        return null;
    }
    
    /**
     * @param pair Initialize with `IJtConfig.pair()` logic.
     */
    public constructor(pair: string);

    /**
     * @param config Initialize with `IJtConfig` configuration.
     */
    public constructor(config: IJtConfig);
    
    public constructor();

    /**
     * `constructor();`
     * 
     * Initialize {Jt} with default data.
     * 
     * `constructor(pair: string);`
     * 
     * @param pair {string} Initialize with `IJtConfig.pair()` logic.
     * 
     * `constructor(config: IJtConfig);`
     * 
     * @param config {IJtConfig | undefined} Initialize with `IJtConfig` configuration.
     */
    public constructor(config?: any)
    {
        this.config = JtConfig.make(config);
    }

    /** @protected */
    protected _one(name: string | any, data: string | undefined = undefined, set: boolean = false): IJtAct
    {
        if(set) {
            this.nil(name);
        }
        
        if(!this.is(name)) {
            this._act[name] = this._newJtAct(data);
        }
        return this._act[name];
    }
    
    /**
     * 
     * NOTE: we're using IDictionary<string>[] instead of IDictionary<string> 
     *       ie. [ {name:data}, ... ] instead of { name:data, ... }
     *       because of simplified overloading for an string vs object argument;
     *       keep calm.
     * 
     * @protected
     */
    protected _many(mixed: string[] | IDictionary<string>[]): IDictionary<IJtAct>
    {
        let ret: IDictionary<IJtAct> = {};

        for(let k in mixed)
        {
            let data = mixed[k];

            if(typeof data === 'string') {
                ret[data] = this._one(data);
                continue;
            }
            
            for(let name in data) {
                ret[name] = this._one(name, data[name]);
                break;
            }
        }
        
        return ret;
    }

    /** @protected */
    protected _newJtAct(data?: string): IJtAct
    {
        return new JtAct(this, data);
    }
}