import { XmlNode } from '../common/classes/xml-node';
import { NodesComparator } from './xml-merger';

export const fullNodeComparator: NodesComparator = (sourceNode: XmlNode, destinationNode: XmlNode) => {
	const allAttributesEqual = sourceNode.attributes.every((sourceAttribute) =>
		destinationNode.attributes.some(
			(destinationAttribute) => sourceAttribute.name === destinationAttribute.name && sourceAttribute.value === destinationAttribute.value,
		),
	);
	const nameEqual = sourceNode.name === destinationNode.name;

	return nameEqual && allAttributesEqual;
};

export const nameComparator: NodesComparator = (sourceNode: XmlNode, destinationNode: XmlNode) => sourceNode.name === destinationNode.name;

export const nameAndOrderComparator: NodesComparator = (sourceNode: XmlNode, destinationNode: XmlNode) =>
	sourceNode.name === destinationNode.name && sourceNode.order === destinationNode.order;
