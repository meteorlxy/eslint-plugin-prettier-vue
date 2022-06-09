import type { Rule } from 'eslint';
import { create } from './create';
import { meta } from './meta';

export const rule: Rule.RuleModule = {
  meta,
  create,
};
