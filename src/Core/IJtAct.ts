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
import { IJt } from './IJt';
import { IJtHandler } from '../Handlers/IJtHandler';
import { IDictionary } from '../Types/IDictionary';
import { vrel } from '../Types/vrel';

export interface IJtAct
{
    /**
     * @returns Returns parent IJt container.
     */
    jt(): IJt;

    /**
     * Chooses specific layer of data.
     * 
     * @param index The index of layer starting from 1 (ie. 0 after `.use()`).
     * @param offset Use as offset from this layer, eg.: `.as(-1, true)` will point to previous layer.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    as(index: number, offset?: boolean): IJtAct;

    /**
     * Applies input values to the captured data in previous chain.
     * 
     * @param values Key-value storage to apply.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    as(values: IDictionary<vrel>): IJtAct;

    /**
     * Applies input values to the captured data in previous chain.
     * 
     * @param values Key-value storage to apply.
     * @param pair Access to `IJtConfig.pair` property.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    as(values: IDictionary<vrel>, pair: string): IJtAct;
    
    /**
     * Applies input values to the captured data in previous chain.
     * 
     * @param values Key-value storage to apply.
     * @param cfg Configuration for applying data.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    as(values: IDictionary<vrel>, cfg: IJtConfig): IJtAct;
    
    /**
     * Applies changing via custom handler.
     * if/else; for; ...
     * 
     * @param handler Custom handler that implements `IJtHandler`.
     * @param data Specific data for this handler if needed.
     * @returns Returns itself IJtAct instance to continue chain.
     */
    sa(handler: IJtHandler, data?: any): IJtAct;

    /**
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
     * @param handler Custom handler that implements `IJtHandler`.
     * @param data Specific data for this handler.
     * @param cfg To configure this handler via list of possible configurations, ie. [ cfg1, cfg2, ... ]
     * @returns Returns itself IJtAct instance to continue chain.
     */
    sa(handler: IJtHandler, data: any, cfg: IJtConfig[] | string[]): IJtAct;

    /**
     * To clear chain after selected node.
     * 
     * @returns Returns itself IJtAct instance to continue chain.
     */
    clear(): IJtAct;
    
    /**
     * Access to actual layer.
     * It may return anything because of custom handlers.
     * While an `.val()` alternative will return only string.
     *
     * @returns Returns final data from selected chain.
     */
    value(): any;
    
    /**
     * Wraps `.value()` to return empty string instead of possible falsy values.
     *
     * @returns Returns final data from selected chain.
     */
    val(): string;
    
    /**
     * `.value()` alias with the continuing of the chain.
     * @param cb Callback `(v: any) => void` on ejected data.
     */
    eject(cb: (v: any) => void): IJtAct;
    
    /**
     * `.as(1)` alias that resets chain to the initial data.
     */
    reset(): IJtAct;
    
    /**
     * `.as(latest)` alias that restores chain to the uppermost changes of the data.
     */
    top(): IJtAct;
    
    /**
     * Binds values with custom raw data.
     * 
     * @param raw Custom raw data.
     * @param values Key-value storage to apply.
     * @param config Optional config instance.
     * @returns Returns processed data with injected values.
     */
    bind(raw: string | undefined, values?: IDictionary<vrel>, config?: IJtConfig): string | undefined;
}