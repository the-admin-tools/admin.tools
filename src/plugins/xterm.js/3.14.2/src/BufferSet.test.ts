/**
 * Copyright (c) 2017 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import { assert } from 'chai';
import { ITerminal } from './Types';
import { BufferSet } from './BufferSet';
import { Buffer } from './Buffer';
import { MockTerminal } from './TestUtils.test';

describe('BufferSet', () => {
  let terminal: ITerminal;
  let bufferSet: BufferSet;

  beforeEach(() => {
    terminal = new MockTerminal();
    (terminal as any).cols = 80;
    (terminal as any).rows = 24;
    terminal.options.scrollback = 1000;
    bufferSet = new BufferSet(terminal);
  });

  describe('constructor', () => {
    it('should create two different buffers: alt and normal', () => {
      assert.instanceOf(bufferSet.normal, Buffer);
      assert.instanceOf(bufferSet.alt, Buffer);
      assert.notEqual(bufferSet.normal, bufferSet.alt);
    });
  });

  describe('activateNormalBuffer', () => {
    beforeEach(() => {
      bufferSet.activateNormalBuffer();
    });

    it('should set the normal buffer as the currently active buffer', () => {
      assert.equal(bufferSet.active, bufferSet.normal);
    });
  });

  describe('activateAltBuffer', () => {
    beforeEach(() => {
      bufferSet.activateAltBuffer();
    });

    it('should set the alt buffer as the currently active buffer', () => {
      assert.equal(bufferSet.active, bufferSet.alt);
    });
  });

  describe('cursor handling when swapping buffers', () => {
    beforeEach(() => {
      bufferSet.normal.x = 0;
      bufferSet.normal.y = 0;
      bufferSet.alt.x = 0;
      bufferSet.alt.y = 0;
    });

    it('should keep the cursor stationary when activating alt buffer', () => {
      bufferSet.activateNormalBuffer();
      bufferSet.active.x = 30;
      bufferSet.active.y = 10;
      bufferSet.activateAltBuffer();
      assert.equal(bufferSet.active.x, 30);
      assert.equal(bufferSet.active.y, 10);
    });
    it('should keep the cursor stationary when activating normal buffer', () => {
      bufferSet.activateAltBuffer();
      bufferSet.active.x = 30;
      bufferSet.active.y = 10;
      bufferSet.activateNormalBuffer();
      assert.equal(bufferSet.active.x, 30);
      assert.equal(bufferSet.active.y, 10);
    });
  });
});
