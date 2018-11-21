String.prototype.replaceAll = function(what, replacement) {
	return this.split(what).join(replacement);
};

String.prototype.compact = function() {
	return this.trim().replaceAll("\t", "").replaceAll("\n", "").trim();
};

const DOCXjs = function() {
	let textElements = [];

	const documentGen = function() {
		// Headers
		let output = `
			<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
			<w:document mc:Ignorable="w14 wp14" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
				<w:body>
		`;
		// Paragraphs
		textElements.forEach((element, index) => {
			output += `
				<w:p w:rsidP="00EA68DC" w:rsidR="001A6335" w:rsidRDefault="00EA68DC">
					<w:r w:rsidRPr="00C703AC">
						<w:t>${element}</w:t>
					</w:r>
				</w:p>
			`;
		});
		// Bottom section
		output += `
			<w:sectPr w:rsidR="001A6335" w:rsidSect="0067748C">
				<w:headerReference r:id="rId7" w:type="even"/>
				<w:headerReference r:id="rId8" w:type="default"/>
				<w:footerReference r:id="rId9" w:type="even"/>
				<w:footerReference r:id="rId10" w:type="default"/>
				<w:headerReference r:id="rId11" w:type="first"/>
				<w:footerReference r:id="rId12" w:type="first"/>
				<w:pgSz w:code="9" w:h="16839" w:w="11907"/>
				<w:pgMar w:bottom="1134" w:footer="720" w:gutter="0" w:header="720" w:left="1417" w:right="1417" w:top="1417"/>
				<w:cols w:space="720"/>
				<w:docGrid w:linePitch="360"/>
			</w:sectPr>
		`;
		// Close
		output += "</w:body></w:document>";
		return output.compact();
	};

	const generate = function() {
		// Content types
		const files = [
			"[Content_Types].xml",
			"_rels/.rels",
			"docProps/app.xml",
			"docProps/core.xml",
			"word/_rels/document.xml.rels",
			"word/endnotes.xml",
			"word/fontTable.xml",
			"word/footer1.xml",
			"word/footer2.xml",
			"word/footer3.xml",
			"word/footnotes.xml",
			"word/header1.xml",
			"word/header2.xml",
			"word/header3.xml",
			"word/settings.xml",
			"word/styles.xml",
			"word/stylesWithEffects.xml",
			"word/theme/theme1.xml",
			"word/webSettings.xml"
		];

		const doOutput = () => {
			zip.generateAsync({
					compression: "DEFLATE",
					compressionOptions: {
						level: 9
					},
					type: "blob"
				})
				.then(content => saveAs(content, "hello.docx"));
		};

		const zip = new JSZip();
		zip.file("word/document.xml", documentGen());

		let loadedFiles = 0;

		files.forEach(file => {
			fetch("./blank/" + file)
				.then(raw => raw.text())
				.then(text => {
					zip.file(file, text.compact());
					loadedFiles++;

					if (files.length === loadedFiles)
						doOutput();
				});
		});
	};

	return {
		output() {
			generate();
		},
		text(str) {
			textElements.push(str);
		}
	};
};
