const fs = require('fs');

const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 260 >>
stream
BT
/F1 18 Tf
50 720 Td
(Lecture 1: Principles of Computer Architecture) Tj
/F1 12 Tf
0 -35 Td
(The CPU is defined as the central processing unit that executes instructions.) Tj
0 -25 Td
(RAM refers to random access memory which stores volatile working data.) Tj
0 -25 Td
(Cache memory is a high-speed volatile storage buffer close to the processor core.) Tj
0 -25 Td
(Pipelining is an implementation technique where multiple instructions are overlapped in execution.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000227 00000 n 
0000000539 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
618
%%EOF`;

fs.writeFileSync('samples/sample-lecture.pdf', pdfContent);
fs.writeFileSync('public/samples/sample-lecture.pdf', pdfContent);
console.log('Sample PDF created successfully');
