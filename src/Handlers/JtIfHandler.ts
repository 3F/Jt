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

import { IJtHandler } from './IJtHandler';
import { IJtConfig } from '../Core/IJtConfig';
import { IJtAct } from '../Core/IJtAct';
import { IJtIfOperator } from './JtIfHandler/IJtIfOperator';
import { IDictionary } from '../Types/IDictionary';
import { IJtIfMeta } from './JtIfHandler/IJtIfMeta';

/**
 * Exposes a very basic implementation without regex.
 *
 * Configurable via IJtIfOperator:
 *  {( ... )} ... {/} ... {;}
 *  {if( ... )} ... {else} ... {endif}
 * ...
 * 
 * This implementation faster than `eval()` and `new Function()`:
 *  - Firefox: ~+ x2.8 for new Function() / ~+ x2.5 for eval()
 *  - Chrome:  ~+ x5.9 for new Function() / ~+ x3.4 for eval()
 * 
 * TODO: 
 *  - Composite Conditions. For example, native parser from SBE-Scripts:
 *      https://github.com/3F/vsSolutionBuildEvent/blob/master/vsSolutionBuildEvent/SBEScripts/Components/Condition/Expression.cs#L257
 *
 *  - `else if()` operator
 *  - Negation via exclamation mark (`!`), ie. `!true`, etc.
 *  - Nested JtIfHandler statements for the same IJtIfOperator configurations,
 *      ie. currently various is possible but not for {if(...)} inside {if(...)}
 */
//#__export = JtIfHandler
export class JtIfHandler implements IJtHandler
{
    /** @protected */
    protected _ops: IJtIfOperator =
    {
        if: '',     // ie. (...)
        else: '/',
        elif: '/',  // ie. /(...)
        fi: ';',
    };
    
    /** @private */
    private _initcfg: IJtConfig[] | string[]; 
    
    /**
     * Processes data using custom logic.
     * 
     * Accepts configs:
     *  - 1. main config to configure general block eg. ~ {if(...)} ... 
     *  - 2. config that affects for values inside if(...), eg.: 
     *       %n% from: {if( %n% == 5 )} ... {else}
     * 
     * @param act {IJtAct} Access to parent IJtAct instance.
     * @param data Specific data for this handler.
     * @param cfg {IJtConfig[] | string[]} To configure this handler via list of possible configurations.
     * @returns {string} Returns final processed data.
     */
    public process(act: IJtAct, data?: any, cfg?: IJtConfig[] | string[]): string
    {
        let raw = act.val();
        if(!raw) {
            return raw;
        }
        
        let [ hcfg, vcfg ] = this._defineConfig(2, act, cfg);
        
        const op = hcfg.op + this._ops.if;
        
        const lpos = raw.indexOf(op);
        if(lpos < 0) {
            return raw;
        }
        
        const ed    = hcfg.tag(this._ops.fi);
        const rpos  = raw.indexOf(ed, lpos);
        
        if(rpos < 0) {
            return raw;
        }
        
        return raw.slice(0, lpos)
        + this._evaluate
        (
            <IJtIfMeta> {
                act: act,
                lval: raw,
                hcfg: hcfg,
                vcfg: vcfg,
            },

            lpos + op.length, 
            rpos,

            data
        ) 
        + raw.slice(rpos + ed.length);
    }
    
    /**
     * @param cfg {IJtConfig[] | string[]} To configure handler and its values data.
     * @param ops {IJtIfOperator} To configure JtIf operators.
     */
    public constructor(cfg: IJtConfig[] | string[] = [ '{}', '%' ], ops?: IJtIfOperator)
    {
        if(ops) {
            this._ops = ops;
        }
        this._initcfg = cfg;
    }
    
    /** @protected */
    protected _evaluate(meta: IJtIfMeta, a: number, b: number, data?: any): string
    {
        let raw = meta.lval;
        
        a = raw.indexOf('(', a) + 1; // if -> ( ...

        const edheader  = ')' + meta.hcfg.ed;
        const posheader = raw.indexOf(edheader, a);

        const condition = meta.act.bind
        (
            raw.slice(a, posheader),
            data, 
            meta.vcfg
        );

        const edelse    = meta.hcfg.tag(this._ops.else);
        const poselse   = raw.indexOf(edelse, posheader);
        
        if(poselse < 0)
        {
            return this._evalIfElse
            (
                this._evalCond(condition), 
                raw.slice(posheader + edheader.length, b)
            );
        }
        
        return this._evalIfElse
        (
            this._evalCond(condition),
            raw.slice(posheader + edheader.length, poselse),
            raw.slice(poselse + edelse.length, b)
        );
    }

    /** @protected */
    protected _evalCond(cond: string | undefined): boolean
    {
        if(!cond) {
            return false;
        }
        
        cond = this._replace
        (
            {
                '&lt;': '<',
                '&gt;': '>',
                'LSS':  '<' ,
                'LEQ':  '<=',
                'GTR':  '>' ,
                'GEQ':  '>=',
                'EQU':  '==',
                'NEQ':  '!=' 
            }, 
            cond
        );
        
        let [ t0, t1, t2 ]: any = this._ternary
        (
            cond, 
            [ '===', '!==', '==', '!=', '<=', '>=', '<', '>' ]
        );

        if(!t2) {
            return !!this._eData(t0);
        }
        
        [ t0, t2 ] = [ this._eData(t0), this._eData(t2) ];

        // NOTE: switch...case with closure compiler ~+40 bytes

        if(t1 == '===') return t0 === t2;
        if(t1 == '!==') return t0 !== t2;
        if(t1 == '==' ) return t0 == t2;
        if(t1 == '!=' ) return t0 != t2;
        if(t1 == '<=' ) return t0 <= t2;
        if(t1 == '>=' ) return t0 >= t2;
        if(t1 == '<'  ) return t0 <  t2;
        if(t1 == '>'  ) return t0 >  t2;
        
        return t0 == t2;
    }
    
    /** @protected */
    protected _eData(data: string): number | string | boolean
    {
        const n = parseFloat(data);

        if(!isNaN(n) && isFinite(n)) {
            return n;
        }

        data = data.trim();
        
        // NOTE: switch...case with closure compiler ~+25 bytes
        
        if(data == 'true') return true;
        if(data == 'false') return false;
        
        return data;
    }
    
    /** @protected */
    protected _evalIfElse(cond: boolean, btrue: string, bfalse?: string): string
    {
        if(bfalse) {
            return cond ? btrue : bfalse;
        }
        return cond ? btrue : '';
    }

    /** @protected */
    protected _ternary(data: string, operators: string[]): string[]
    {
        for(let k in operators)
        {
            let pos = data.indexOf(operators[k]);
            if(pos < 0) {
                continue;
            }

            return [
                data.slice(0, pos).trim(),
                operators[k],
                data.slice(pos + operators[k].length).trim()
            ]
        }

        return [ data ];
    }
    
    /** @protected */
    protected _defineConfig(rcv: number, act: IJtAct, cfg?: IJtConfig[] | string[]): IJtConfig[]
    {
        let ret: IJtConfig[] = [];
        
        if(!cfg) {
            cfg = ret;
        }

        for(let i = 0; i < rcv; ++i) {
            ret[i] = act.jt().config.try(cfg[i] || this._initcfg[i]);
        }
        return ret;
    }
    
    /** @private */
    private _replace(v: IDictionary<string>, str: string): string
    {
        for(let k in v) {
            str = str.replace(k, v[k]);
        }
        return str;
    }
}