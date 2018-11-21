## Usage:

```javascript
const doc = new DOCXjs();
doc.text("This is a test");
doc.text("It was created with DOCXjs.");
doc.output("filename");
```

## What's new?

- jszip updated to newest version and it gets loaded over CDN
- FileSaver will be used to download the file
- Filename can be defined in the output-function
- Updated DOCX-file to DIN-A4
- DOCX-file will be compressed to smallest file size
