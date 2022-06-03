# Simple XML merge

## Installation

```bash
#Installation
npm install simple-xml-merge
```

## Usage

### Basic example

```ts
const xmlData1: string = //read xml from fs/network/Buffer
const xmlData2: string = //read xml from fs/network/Buffer
const mergedXml = mergeXml(xmlData1, xmlData2);
```

## Example with node "name" comparator

```ts
const xmlData1: string = //read xml from fs/network/Buffer
const xmlData2: string = //read xml from fs/network/Buffer
const mergedXml = mergeXml(xmlData1, xmlData2, (node1, node2) => node1.name === node2.name);
```

With comparator it's possible to define rules for nodes merge.
For example, XMLs

```xml
<root>
  <test attr="value">
</root>
```

and

```xml
<root>
  <test attr="value2">
</root>
```

will be merged to:

```xml
<root>
  <test attr="value2">
</root>
```

Without comparator the full comparison (name, attributes) will be used and such merge result to:

```xml
<root>
  <test attr="value">
  <test attr="value2">
</root>
```
