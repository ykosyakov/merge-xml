import { XmlAttribute } from './xml-attribute';

export class XmlNode {
	public order: number;

	public value: string;

	private _parent: XmlNode;

	public get parent(): XmlNode {
		return this._parent;
	}
	public set parent(value: XmlNode) {
		this._parent = value;
	}

	public readonly nodes: XmlNode[];
	public readonly attributes: XmlAttribute[];

	constructor(public readonly name: string, public readonly selfClosing: boolean) {
		this.nodes = [];
		this.attributes = [];
	}

	getAttribute(name: string) {
		return this.attributes.find((attribute) => attribute.name === name);
	}

	copyAttributes(): XmlAttribute[] {
		return this.attributes.map((attribute) => new XmlAttribute(attribute.name, attribute.value));
	}

	toString(level = 0) {
		const levelTab = '  '.repeat(level);
		const attributesString = this.attributes.length ? ` ${this.attributes.map((attribute) => attribute.toString()).join(' ')} ` : '';

		let result = `${levelTab}<${this.name}${attributesString}${this.selfClosing ? '/' : ''}>`;

		if (!this.selfClosing) {
			if (this.value) {
				result += this.value;
			}

			if (this.nodes.length) {
				result += '\r\n' + this.nodes.map((node) => node.toString(level + 1)).join('\r\n');
			}

			result += `${this.nodes.length ? '\r\n' : ''}${this.nodes.length ? levelTab : ''}</${this.name}>`;
		}
		return result;
	}
}
