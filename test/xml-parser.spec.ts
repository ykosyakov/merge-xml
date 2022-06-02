import { XmlDocument } from '../src/common/classes/xml-document';
import { XmlParser } from '../src/xml-parser/xml-parser';

describe('XmlParser', () => {
	const parser = new XmlParser();
	it('Should throw on non-XML (has at least XML-like node)', () => {
		const testWrongData = jest.fn(() => {
			parser.parse('');
			parser.parse('just a text');
			parser.parse('> <');
			parser.parse('<?xml>');
		});
		expect(testWrongData).toThrowError('Wrong XML data');
	});

	it('Should accept only XML (has one header and at least XML node)', () => {
		const testCorrectData = jest.fn(() => {
			parser.parse('<?xml><root>');
			return;
		});

		expect(testCorrectData).not.toThrow();
	});

	it('Should return instanceOf XmlDocument', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><root/>');
		});

		const result = test();

		expect(result).toBeInstanceOf(XmlDocument);
	});

	it('Should return XmlDocument with header', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><root/>');
		});

		const result = test();

		expect(result).toHaveProperty<XmlDocument>('header');
	});

	it('Should return XmlDocument with root', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><root/>');
		});

		const result = test();

		expect(result).toHaveProperty<XmlDocument>('root');
	});

	it('Should parse a node name correct', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><root/>');
		});

		const result = test();

		expect(result.root.name).toBe('root');
	});

	it('Should parse a node "selfclosing" correct', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><root/>');
		});

		const result = test();

		expect(result.root.selfClosing).toBeTruthy();
	});
	it('Should allow an undescore in a node name', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><_root/>');
		});

		const result = test();

		expect(result.root.name).toBe('_root');
	});

	it('Should parse a node name consisting of alphanumerics correct', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><root12_12/>');
		});

		const result = test();

		expect(result.root.name).toBe('root12_12');
	});

	it('Should throw on incorrect node name', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><!root/>');
		});

		expect(test).toThrow(`Node <!root/> has incorrect name`);
	});

	it('Should extract correct attribute', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><root a="1=1" />');
		});

		const result = test();

		expect(result.root.attributes.length).toBe(1);
		expect(result.root.attributes[0].name).toBe('a');
		expect(result.root.attributes[0].value).toBe('1=1');
	});

	it('Should extract correct multiple attributes', () => {
		const test = jest.fn(() => {
			return parser.parse('<?xml><root a="1" b="2=?!"/>');
		});

		const result = test();

		expect(result.root.attributes.length).toBe(2);
		expect(result.root.attributes[0].name).toBe('a');
		expect(result.root.attributes[1].value).toBe('2=?!');
	});

	it(`Should ignore attributes with not escaped "'&`, () => {
		const test = jest.fn(() => {
			return parser.parse(`<?xml><root a=""" b="'" c="&"/>`);
		});

		const result = test();

		expect(result.root.attributes.length).toBe(0);
	});
});
