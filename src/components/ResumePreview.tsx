import { useInView } from "framer-motion";
import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";

const ResumePdfDocument = lazy(() => import("./ResumePdfDocument"));

interface ResumePreviewProps {
  src: string;
}

/** Defers the PDF renderer until the resume preview approaches the viewport. */
const ResumePreview: React.FC<ResumePreviewProps> = ({ src }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  const shouldLoad = useInView(containerRef, { margin: "200px", once: true });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => setWidth(container.clientWidth);
    const resizeObserver = new ResizeObserver(updateWidth);

    updateWidth();
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="resume-preview-document"
      role="img"
      aria-label="Preview of Randy Pahang II resume"
    >
      {shouldLoad ? (
        <Suspense
          fallback={<span className="resume-preview-status">LOADING RESUME...</span>}
        >
          <ResumePdfDocument src={src} width={width} />
        </Suspense>
      ) : (
        <span className="resume-preview-status">LOADING RESUME...</span>
      )}
    </div>
  );
};

export default ResumePreview;
