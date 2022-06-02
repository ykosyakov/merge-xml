import { XmlNode } from './xml-node';

export class XmlDocument {
	constructor(public readonly header: XmlNode, public readonly root: XmlNode) {}

	toString() {
		return `<?xml ${this.header.attributes.map((attribute) => `${attribute.name}="${attribute.value}"`).join(' ')}?>\r\n${this.root.toString()}`;
	}
}
