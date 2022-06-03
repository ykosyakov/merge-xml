import { XmlAttribute } from '../common/classes/xml-attribute';
import { XmlDocument } from '../common/classes/xml-document';
import { XmlNode } from '../common/classes/xml-node';

export class XmlParser {
	public parse(xmlData: string): XmlDocument {
		const nodesMatches = xmlData.match(/(<)?[^<>]*(>)?/gm);

		if (!nodesMatches) {
			throw new Error('Wrong XML data');
		}

		const [header, root, ...allNodes] = Array.from(nodesMatches)
			.filter((nodeMatch) => nodeMatch.trim())
			.map((nodeMatch) => this.matchToNode(nodeMatch));

		if (!(root instanceof XmlNode) || !(header instanceof XmlNode)) {
			throw new Error('Wrong XML data');
		}

		this.assignNodes(root, allNodes);

		const parsedDocument = new XmlDocument(header, root);
		return parsedDocument;
	}

	private assignNodes(root: XmlNode, allNodes: (XmlNode | string)[]): void {
		let currentParent = root;

		for (const node of allNodes) {
			if (typeof node === 'string') {
				currentParent.value = node;
				continue;
			}

			if (node.selfClosing) {
				node.parent = currentParent;
				currentParent.nodes.push(node);
				continue;
			}

			if (node.name === currentParent.name) {
				currentParent = currentParent.parent;

				continue;
			}

			node.order = currentParent.nodes.length + 1;
			currentParent.nodes.push(node);
			node.parent = currentParent;
			currentParent = node;
		}
	}

	private matchToNode(nodeText: string): XmlNode | string {
		const isNode = new RegExp('<[^<>]*>').test(nodeText);

		if (isNode) {
			return this.stringToNode(nodeText);
		}

		return nodeText;
	}

	private stringToNode(nodeText: string): XmlNode {
		const nodeAttributesText = Array.from(nodeText.match(/[\w\d_]+="[^<>&"']+"/gm) ?? []);
		const nodeName = Array.from(nodeText.match(/<\/?[\w\d_?]+/) ?? [])[0]
			?.replace('<', '')
			?.replace('/', '');

		if (!nodeName) {
			throw new Error(`Node ${nodeText} has incorrect name`);
		}
		const selfClosing = Boolean(nodeText.match(/\/\s*>/));
		const node = new XmlNode(nodeName, selfClosing);
		if (nodeAttributesText.length >= 1) {
			node.attributes.push(...this.extractAttributes(nodeAttributesText));
		}
		return node;
	}

	private extractAttributes(nodeEntities: string[]): XmlAttribute[] {
		const attributesText = nodeEntities.filter((match) => match.includes('='));
		return attributesText.map((text) => this.constructAttribute(text));
	}

	private constructAttribute(attributeText: string): XmlAttribute {
		const [name, ...value] = attributeText.split('=');
		const cleanValue = value.join('=').replace(/"/g, '');

		return new XmlAttribute(name, cleanValue);
	}
}
