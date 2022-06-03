# Simple XML merge

## Installation

```bash
#Installation
npm install simple-xml-merge
```

## Usage

### Basic example

```ts
import { mergeXml } from 'simple-xml-merge';

const xmlData1: string = ''; //read xml from fs/network/Buffer
const xmlData2: string = ''; //read xml from fs/network/Buffer
const mergedXml = mergeXml(xmlData1, xmlData2);

//Serialize and use
console.log(mergedXml.toString());
```

## Example with node "name" comparator

```ts
import { mergeXml } from 'simple-xml-merge';

const xmlData1: string = ''; //read xml from fs/network/Buffer
const xmlData2: string = ''; //read xml from fs/network/Buffer
const mergedXml = mergeXml(xmlData1, xmlData2, (node1, node2) => node1.name === node2.name);

//Serialize and use
console.log(mergedXml.toString());
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
