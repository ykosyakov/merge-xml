import { XmlAttribute } from '../src/common/classes/xml-attribute';

describe('XmlAttribute', () => {
	it('toString() should return correct value', () => {
		const attribute = new XmlAttribute('test', 'test');

		expect(attribute.toString()).toBe('test="test"');
	});
});
