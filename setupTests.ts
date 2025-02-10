/* eslint-disable prettier/prettier */
// setupTests.ts
import { expect } from 'vitest';
// Usa un import con * para los matchers
import * as matchers from '@testing-library/jest-dom/matchers';

// Extiende las aserciones de Vitest con los matchers de jest-dom
expect.extend(matchers);