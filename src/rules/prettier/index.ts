import type { Rule } from 'eslint';
import { meta } from './meta';
import { create } from './create';

export const rule: Rule.RuleModule = {
  meta,
  create,
};
