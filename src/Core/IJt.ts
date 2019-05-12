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
import { IJtAct } from './IJtAct';
import { IDictionary } from '../Types/IDictionary';

export interface IJt
{
    /**
     * Default config. Each item can be redefined from `as` methods.
     */
    config: IJtConfig;

    /**
     * Use already captured raw data.
     * `.value()` will return undefined if it's not exists.
     * 
     * @param name Named data for use.
     * @returns Returns IJtAct instance to continue chain.
     */
    use(name: string): IJtAct;

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
    use(name: string, data: string | undefined): IJtAct;

    /**
     * List of already captured raw data.
     * 
     * @param name Names for use.
     * @returns Returns IJtAct instances to continue chain.
     */
    use(name: string[]): IDictionary<IJtAct>;

    /**
     * Capture list of raw data.
     * [ {name: data}, ... ]
     * 
     * @param data Key-Value List of named raw data with placeholders etc.
     * @returns Returns IJtAct instances to continue chain.
     */
    use(data: IDictionary<string>[]): IDictionary<IJtAct>;
    
    /**
     * Force capturing raw data as `name`.
     * While `use` will either use existing raw data or add then use,
     * this `set` will update data for each call.
     * 
     * @param name Naming for data use.
     * @param data Raw data with placeholders etc.
     * @returns Returns IJtAct instance to continue chain.
     */
    set(name: string, data: string | undefined): IJtAct;
    
    /**
     * To final remove any data from nodes.
     * @param names List of named data.
     * @returns Returns itself IJt instance to continue chain.
     */
    nil(...names: string[]): IJt;

    /**
     * Checks existence.
     * Fast alternative to `use` methods 
     * because it will not create an empty IJtAct if it's not defined.
     * 
     * @param name Named data for use.
     * @returns Returns either IJtAct instance to continue chain or null if name does not exist.
     */
    is(name: string): IJtAct | null;
}