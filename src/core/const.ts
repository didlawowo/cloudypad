import * as path from 'path';

export const CLOUDYPAD_PROVIDER_AWS = "aws"
export const CLOUDYPAD_PROVIDER_PAPERSPACE = "paperspace"
export type CLOUDYPAD_PROVIDER = typeof CLOUDYPAD_PROVIDER_AWS | typeof CLOUDYPAD_PROVIDER_PAPERSPACE

export const CLOUDYPAD_HOME = path.resolve(`${process.env.HOME || ''}/.cloudypad`)
export const CLOUDYPAD_INSTANCES_DIR = path.resolve(`${CLOUDYPAD_HOME}/instances`)