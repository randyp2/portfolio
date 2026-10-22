import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface ResumePdfDocumentProps {
  src: string;
  width?: number;
}

/** Renders the current resume with PDF.js. */
const ResumePdfDocument: React.FC<ResumePdfDocumentProps> = ({ src, width }) => (
  <Document
    file={src}
    suspense={false}
    loading={<span>LOADING RESUME...</span>}
    error={<span>PREVIEW UNAVAILABLE</span>}
  >
    <Page
      pageNumber={1}
      width={width}
      renderAnnotationLayer={false}
      renderTextLayer={false}
    />
  </Document>
);

export default ResumePdfDocument;
