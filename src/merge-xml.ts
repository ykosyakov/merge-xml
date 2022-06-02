import { fullNodeComparator } from './xml-merge/node-comparators';
import { NodesComparator, XmlMerger } from './xml-merge/xml-merger';
import { XmlParser } from './xml-parser/xml-parser';

export function mergeXml(sourceXmlData: string, destinationXmlsData: string | string[], comparator: NodesComparator = fullNodeComparator): string {
	try {
		const parser = new XmlParser();
		const merger = new XmlMerger();

		let mergedXml = parser.parse(sourceXmlData);

		const destinationXmlArray = Array.isArray(destinationXmlsData) ? destinationXmlsData : [destinationXmlsData];

		for (const destinationXmlData of destinationXmlArray) {
			const destinationxml = parser.parse(destinationXmlData);
			mergedXml = merger.merge(mergedXml, destinationxml, comparator);
		}

		return mergedXml.toString();
	} catch (e) {
		throw new Error(`Merge completed with error: ${e.message}`);
	}
}
