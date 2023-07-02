import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'node:path';
import fs from 'node:fs';

const TIMEOUT = 300;
const INTERVAL = 300;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, TIMEOUT);
    expect(setTimeout).toHaveBeenCalledWith(callback, TIMEOUT);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, TIMEOUT);
    expect(callback).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, INTERVAL);
    expect(setInterval).toHaveBeenCalledWith(callback, INTERVAL);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, INTERVAL);
    expect(callback).not.toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = jest.spyOn(path, 'join');
    await readFileAsynchronously('test.txt');
    expect(pathToFile).toHaveBeenCalled();
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const result = await readFileAsynchronously('test.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const text = 'bla bla bla';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(text);
    const result = await readFileAsynchronously('test.txt');
    expect(result).toEqual(text);
  });
});
