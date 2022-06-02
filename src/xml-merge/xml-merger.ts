import { XmlDocument } from '../common/classes/xml-document';
import { XmlNode } from '../common/classes/xml-node';
import { fullNodeComparator } from './node-comparators';

export type NodesComparator = (node1: XmlNode, node2: XmlNode) => boolean;

export class XmlMerger {
	public merge(sourceDocument: XmlDocument, destinationDocument: XmlDocument, comparator: NodesComparator): XmlDocument {
		if (sourceDocument.root.name !== destinationDocument.root.name) {
			throw new Error(`Roots of XML documents to merge are different: ${sourceDocument.root.name} != ${destinationDocument.root.name}`);
		}

		const root = this.mergeNodes(sourceDocument.root, destinationDocument.root, comparator);
		const header = new XmlNode(sourceDocument.header.name, false);
		header.attributes.push(...sourceDocument.header.copyAttributes());

		return new XmlDocument(header, root);
	}

	private mergeNodes(sourceRoot: XmlNode, destinationRoot: XmlNode, comparator: NodesComparator): XmlNode {
		const sourceNodes = sourceRoot.nodes;
		const destinationNodes = destinationRoot.nodes;
		const mergedRoot = new XmlNode(sourceRoot.name, sourceRoot.selfClosing);
		mergedRoot.attributes.push(...destinationRoot.copyAttributes());
		mergedRoot.nodes.push(...sourceRoot.nodes);
		mergedRoot.value = destinationRoot.value;

		for (const destinationNode of destinationNodes) {
			let sourceIndex = -1;
			const sourceNode = sourceNodes.find((sourceNode, index) => {
				const compareResult = comparator(sourceNode, destinationNode);
				if (compareResult) {
					sourceIndex = index;
				}

				return compareResult;
			});

			if (sourceNode) {
				mergedRoot.nodes[sourceIndex] = this.mergeNodes(sourceNode, destinationNode, comparator);
			} else {
				mergedRoot.nodes.push(destinationNode);
			}
		}

		return mergedRoot;
	}
}
