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
import { IJtHandler } from '../Handlers/IJtHandler';
import { JtConfig } from './JtConfig';
import { IList } from '../Types/IList';
import { IDictionary } from '../Types/IDictionary';
import { vrel } from '../Types/vrel';

//#__export = JtAct  -- this directive will export this module for eumd wrapper
export class JtAct implements IJtAct
{
    /**
     * Represents layers of data as the list of already processed in the nodes.
     * @protected
     */
    protected _layers: IList<string | undefined> = [];

    /**
     * Current selected layer of attached data.
     * @private
     */
    private _index: number = 0;
    
    /** @private */
    private readonly _jt: IJt;
    
    /**
     * @returns {Jt} Returns parent IJt container.
     */
    public jt(): IJt
    {
        return this._jt;
    }
    
    /**
     * Chooses specific layer of data.
     * 
     * @param index The index of layer starting from 1 (ie. 0 after `.use()`).
     * @param offset Use as offset from this layer, eg.: `.as(-1, true)` will point to previous layer.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    public as(index: number, offset?: boolean): IJtAct;

    /**
     * Applies input values to the captured data in previous chain.
     * 
     * @param values Key-value storage to apply.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    public as(values: IDictionary<vrel>): IJtAct;

    /**
     * Applies input values to the captured data in previous chain.
     * 
     * @param values Key-value storage to apply.
     * @param pair Access to `IJtConfig.pair` property.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    public as(values: IDictionary<vrel>, pair: string): IJtAct;
    
    /**
     * Applies input values to the captured data in previous chain.
     * 
     * @param values Key-value storage to apply.
     * @param cfg Configuration for applying data.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    public as(values: IDictionary<vrel>, cfg: IJtConfig): IJtAct;
    
    /**
     * `public as(index: number, offset?: boolean): IJtAct;`
     * 
     * Chooses specific layer of data.
     * 
     * @param index The index of layer starting from 1 (ie. 0 after `.use()`).
     * @param offset Use as offset from this layer, eg.: `.as(-1, true)` will point to previous layer.
     * @returns Returns itself IJtAct instance to continue chain.
     * 
     * 
     * `public as(values: IDictionary<vrel>): IJtAct;`
     * 
     * Applies input values to the captured data in previous chain.
     * 
     * @param values {IDictionary<vrel>} Key-value storage to apply.
     * @returns {JtAct} Returns itself IJtAct instance to continue chain.
     * 
     * 
     * `public as(values: IDictionary<vrel>, pair: string): IJtAct;`
     * 
     * Applies input values to the captured data in previous chain.
     * 
     * @param values {IDictionary<vrel>} Key-value storage to apply.
     * @param pair {string} Access to `IJtConfig.pair` property.
     * @returns {JtAct} Returns itself IJtAct instance to continue chain.
     * 
     * 
     * `public as(values: IDictionary<vrel>, cfg: IJtConfig): IJtAct;`
     * 
     * Applies input values to the captured data in previous chain.
     * 
     * @param values {IDictionary<vrel>} Key-value storage to apply.
     * @param cfg {IJtConfig} Configuration for applying data.
     * @returns {JtAct} Returns itself IJtAct instance to continue chain.
     */
    public as(values: any, cfg?: any): IJtAct
    {
        if(typeof values !== 'number')
        {
            // NOTE: We'll leave an empty or null data because of call hierarchies:
            //       Each `.as()` processing should increase total layers.
            // 
            // let ret = this.value();
            // if(!ret) {
            //     return this;
            // }
            
            return this._add(
                this.bind(this.value(), values, this._getCfg(cfg))
            );
        }
        
        if(cfg) {
            values += this._index;
        }
        
        this._index = Math.max
        (
            1, 
            Math.min
            (
                values,
                this._layers.length
            )
        );
        
        return this;
    }
    
    /**
     * Applies changing via custom handler.
     * if/else; for; ...
     * 
     * @param handler Custom handler that implements `IJtHandler`.
     * @param data Specific data for this handler if needed.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    public sa(handler: IJtHandler, data?: any): IJtAct;

    /**
     * Applies changing via custom handler.
     * if/else; for; ...
     * 
     * Each handler may accept any number of configurations for its logic.
     * 
     * For example, `JtIfHandler` accept 2:
     *  - 1. main config to configure general block eg. {if(...)} ...
     *  - 2. config that affects for values inside if(...)
     * 
     * therefore, you can pass your configurations as follow:
     * ```
     * .sa(jtif, { ... }, [ '{}', '%' ])
     * .sa(jtif, { ... }, [ jtCfgInstance, { op: '$' } ])
     * ```
     * 
     * @param handler Custom handler that implements `IJtHandler`.
     * @param data Specific data for this handler.
     * @param cfg To configure this handler via list of possible configurations, ie. [ cfg1, cfg2, ... ]
     * @returns Returns itself IJtAct instance to continue chain.
     */
    public sa(handler: IJtHandler, data: any, cfg: IJtConfig[] | string[]): IJtAct;
    
    /**
     * `public sa(handler: IJtHandler, data?: any): IJtAct;`
     * 
     * Applies changing via custom handler.
     * if/else; for; ...
     * 
     * @param handler {IJtHandler} Custom handler that implements `IJtHandler`.
     * @param data Specific data for this handler if needed.
     * @returns {JtAct} Returns itself IJtAct instance to continue chain.
     * 
     *
     * `public sa(handler: IJtHandler, data: any, cfg: IJtConfig[] | string[]): IJtAct;`
     * 
     * Applies changing via custom handler.
     * if/else; for; ...
     * 
     * Each handler may accept any number of configurations for its logic.
     * 
     * For example, `JtIfHandler` accept 2:
     *  - 1. main config to configure general block eg. ~ {if(...)} ...
     *  - 2. config that affects for values inside if(...)
     * 
     * therefore, you can pass your configurations as follow:
     * ```
     * .sa(jtif, { ... }, [ '{}', '%' ])
     * .sa(jtif, { ... }, [ jtCfgInstance, { op: '@' } ])
     * ```
     * 
     * @param handler {IJtHandler} Custom handler that implements `IJtHandler`.
     * @param data Specific data for this handler.
     * @param cfg {IJtConfig[] | string[]} To configure this handler via list of possible configurations, ie. [ cfg1, cfg2, ... ]
     * @returns {JtAct} Returns itself IJtAct instance to continue chain.
     */
    public sa(handler: IJtHandler, data?: any, cfg?: IJtConfig[] | string[]): IJtAct
    {
        // NOTE: We'll leave an empty or null data because of call hierarchies and for custom processing.
        //       Firstly, this way allows handlers interact with nodes, for example, to rollback 
        //       or even for allocating absolutely new data.
        //       Secondly, we'll repeat logic of `.as()` processing for unified behavior.

        return this._add(handler && handler.process(this, data, cfg));
    }
    
    /**
     * To clear chain after selected node.
     * 
     * @returns {JtAct} Returns itself IJtAct instance to continue chain.
     */
    public clear(): IJtAct
    {
        this._layers.length = Math.max(1, this._index);
        return this;
    }
    
    /**
     * Access to actual layer.
     * It may return anything because of custom handlers.
     * While an `.val()` alternative will return only string.
     *
     * @returns Returns final data from selected chain.
     */
    public value(): any
    {
        return this._layers && this._layers[this._index - 1];
    }
    
    /**
     * Wraps `.value()` to return empty string instead of possible falsy values.
     *
     * @returns {string} Returns final data from selected chain.
     */
    public val(): string
    {
        return this.value() || '';
    }
    
    /**
     * `.value()` alias with the continuing of the chain.
     *
     * @param cb {(v: any) => void} Callback on ejected data.
     * @returns {JtAct}
     */
    public eject(cb: (v: any) => void): IJtAct
    {
        cb(this.value());
        return this;
    }
    
    /**
     * `.as(1)` alias that resets chain to the initial data.
     *
     * @returns {JtAct}
     */
    public reset(): IJtAct
    {
        return this.as(1);
    }

    /**
     * `.as(latest)` alias that restores chain to the uppermost changes of the data.
     *
     * @returns {JtAct}
     */
    public top(): IJtAct
    {
        return this.as(this._layers.length);
    }
    
    /**
     * Binds values with custom raw data.
     * 
     * @param raw {string | undefined} Custom raw data.
     * @param values {IDictionary<vrel> | undefined} Key-value storage to apply.
     * @param config {IJtConfig | undefined} Optional config instance.
     * @returns {string | undefined} Returns processed data with injected values.
     */
    public bind(raw: string | undefined, values?: IDictionary<vrel>, config?: IJtConfig): string | undefined
    {
        if(!values || !raw) {
            return raw;
        }

        const _cfg = this._getCfg(config);

        for(let key in values) {
            raw = this._replaceAll(raw, _cfg.tag(key), values[key]);
        }
        return raw;
    }
    
    /**
     * @param jt {IJt} Parent IJt container.
     * @param data {string | undefined} Initial data for the chain.
     */
    public constructor(jt: IJt, data: string | undefined = undefined)
    {
        this._jt = jt;
        this._push(data);
    }

    /** @protected */
    protected _replaceAll(str: string, from: string, to: vrel): string
    {
        let ret:string  = '';
        let pos         = 0;
        let prev        = 0;
        
        to = this._toString(to);

        while(pos < str.length)
        {
            pos = str.indexOf(from, prev);
            if(pos < 0) {
                break;
            }
            
            ret += str.slice(prev, pos) + to;
            prev = pos + from.length;
        }
        
        ret += str.slice(prev);
        return ret;
    }
    
    /** @protected */
    protected _add(value: string | undefined): IJtAct
    {
        this.clear();
        this._push(value);
        return this;
    }
    
    /** @protected */
    protected _push(data: string | undefined): void
    {
        this._layers[this._index++] = data;
    }
    
    /** @protected */
    protected _toString(data: vrel): string
    {
        return '' + data;
    }

    /** @private */
    private _getCfg(config: IJtConfig | undefined): IJtConfig
    {
        return JtConfig.make(config || this.jt().config);
    }
}