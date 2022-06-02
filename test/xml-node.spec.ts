import { XmlAttribute } from '../src/common/classes/xml-attribute';
import { XmlNode } from '../src/common/classes/xml-node';

describe('XmlNode', () => {
	it('toString should return self-closed node with selfClofing property = true', () => {
		const node = new XmlNode('test', true);
		expect(node.toString()).toBe('<test/>');
	});

	it('toString should serialize attributes', () => {
		const node = new XmlNode('test', true);
		node.attributes.push(new XmlAttribute('1', '1'), new XmlAttribute('2', '2'));
		expect(node.toString()).toBe(`<test 1="1" 2="2" />`);
	});

	it('toString should serialize value + attributes', () => {
		const node = new XmlNode('test', false);
		node.value = 'test';
		node.attributes.push(new XmlAttribute('1', '1'), new XmlAttribute('2', '2'));
		expect(node.toString()).toBe(`<test 1="1" 2="2" >test</test>`);
	});

	it('toString should serialize value + attributes + children nodes', () => {
		const node = new XmlNode('test', false);
		node.value = 'test';
		node.attributes.push(new XmlAttribute('1', '1'), new XmlAttribute('2', '2'));
		node.nodes.push(new XmlNode('child', true));
		expect(node.toString()).toBe(`<test 1="1" 2="2" >test\r\n  <child/>\r\n</test>`);
	});
});
