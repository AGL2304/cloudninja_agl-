import { formatServiceName } from '../src/utils/serviceUtils.js';


test('formatServiceName ajoute un préfixe', () => {
  expect(formatServiceName('Web')).toBe('[Service] Web');
});
