"use client"

import { useState, useRef, useCallback, useEffect, useLayoutEffect, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"
import { useWorldStore } from "@/state/useWorldStore"

interface Project {
  id: string
  image: string
  title: string
  description?: string
  tags?: string[]
  status?: "In Development" | "Finished" | "Archived"
  link?: string
}

// Helper to detect if media is a video file
const isVideoFile = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

interface AnimatedFolderProps {
  title: string
  projects: Project[]
  className?: string
  isColliding?: boolean  // External collision trigger from physics
  isDisabled?: boolean   // Disable folder interaction (shows "0 projects")
}

export const AnimatedFolder = forwardRef<HTMLDivElement, AnimatedFolderProps>(
  function AnimatedFolder({ title, projects, className, isColliding, isDisabled }, ref) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Handle collision trigger - one-time folder opening (only if not disabled)
  useEffect(() => {
    if (isColliding && !isOpen && !isDisabled) {
      setIsOpen(true)  // Once open, stays open
    }
  }, [isColliding, isOpen, isDisabled])

  const setLightboxOpen = useWorldStore((state) => state.setLightboxOpen)

  const handleProjectClick = (project: Project, index: number) => {
    const cardEl = cardRefs.current[index]
    let rect: DOMRect | null = null
    if (cardEl) {
      rect = cardEl.getBoundingClientRect()
    }
    setSourceRect(rect)
    setSelectedIndex(index)
    setHiddenCardId(project.id)
    setLightboxOpen(true)  // Disable ball dragging
  }

  const handleCloseLightbox = () => {
    setSelectedIndex(null)
    setSourceRect(null)
    setLightboxOpen(false)  // Re-enable ball dragging
  }

  const handleCloseComplete = () => {
    setHiddenCardId(null)
  }

  const handleNavigate = (newIndex: number) => {
    setSelectedIndex(newIndex)
    setHiddenCardId(projects[newIndex]?.id || null)
  }

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col items-center justify-center",
          "p-8 rounded-2xl",
          "bg-card border border-border",
          "transition-all duration-500 ease-out",
          "group cursor-pointer",
          className,
        )}
        onMouseEnter={() => !isDisabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (!isDisabled) setIsOpen(true)
        }}
        style={{
          minWidth: "280px",
          minHeight: "320px",
          perspective: "1000px",
        }}
      >
        {/* Subtle background glow on collision */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 70%, oklch(0.75 0.10 225) 0%, transparent 70%)",
            opacity: isOpen || isHovered ? 0.12 : 0,
          }}
        />

        <div className="relative flex items-center justify-center mb-4" style={{ height: "160px", width: "200px" }}>
          {/* Folder back layer - z-index 10 */}
          <div
            className="absolute w-32 h-24 bg-folder-back rounded-lg shadow-md"
            style={{
              transformOrigin: "bottom center",
              transform: isOpen ? "rotateX(-15deg)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* Folder tab - z-index 10 */}
          <div
            className="absolute w-12 h-4 bg-folder-tab rounded-t-md"
            style={{
              top: "calc(50% - 48px - 12px)",
              left: "calc(50% - 64px + 16px)",
              transformOrigin: "bottom center",
              transform: isOpen ? "rotateX(-25deg) translateY(-2px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* Project cards - z-index 20, between back and front */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                image={project.image}
                title={project.title}
                delay={index * 80}
                isVisible={isOpen}
                index={index}
                onClick={() => handleProjectClick(project, index)}
                isSelected={hiddenCardId === project.id}
              />
            ))}
          </div>

          {/* Folder front layer - z-index 30 */}
          <div
            className="absolute w-32 h-24 bg-folder-front rounded-lg shadow-lg"
            style={{
              top: "calc(50% - 48px + 4px)",
              transformOrigin: "bottom center",
              transform: isOpen ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 30,
            }}
          />

          {/* Folder shine effect - z-index 31 */}
          <div
            className="absolute w-32 h-24 rounded-lg overflow-hidden pointer-events-none"
            style={{
              top: "calc(50% - 48px + 4px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
              transformOrigin: "bottom center",
              transform: isOpen ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 31,
            }}
          />
        </div>

        {/* Folder title */}
        <h3
          className="text-3xl font-bold text-white mt-4 transition-all duration-300"
          style={{
            transform: isOpen ? "translateY(4px)" : "translateY(0)",
          }}
        >
          {title}
        </h3>

        {/* Project count */}
        <p
          className="text-sm text-muted-foreground transition-all duration-300"
          style={{
            opacity: isOpen ? 0.7 : 1,
          }}
        >
          {isDisabled ? "0 projects" : `${projects.length} projects`}
        </p>

        {/* Collision hint - visual indicator (hidden when disabled) */}
        {!isDisabled && (
          <div
            className="absolute -bottom-16 left-1/2 flex flex-col items-center gap-2 transition-all duration-300 pointer-events-none"
            style={{
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? "translateX(-50%) translateY(10px)" : "translateX(-50%) translateY(0)",
            }}
          >
            {/* Arrow pointing up */}
            <svg
              className="w-6 h-6 text-white animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
            {/* Bouncing ball indicator */}
            <div
              className="w-4 h-4 rounded-full bg-white animate-bounce"
              style={{
                boxShadow: "0 0 12px rgba(255, 255, 255, 0.9), 0 0 24px rgba(255, 255, 255, 0.5)",
              }}
            />
            <span
              className="text-sm font-medium text-white whitespace-nowrap mt-1"
              style={{
                textShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)",
              }}
            >
              Hit to open
            </span>
          </div>
        )}
      </div>

      <ImageLightbox
        projects={projects.slice(0, 3)}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        sourceRect={sourceRect}
        onCloseComplete={handleCloseComplete}
        onNavigate={handleNavigate}
      />
    </>
  )
})

interface ImageLightboxProps {
  projects: Project[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  sourceRect: DOMRect | null
  onCloseComplete?: () => void
  onNavigate: (index: number) => void
}

function ImageLightbox({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
}: ImageLightboxProps) {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial")
  const [isClosing, setIsClosing] = useState(false)
  const [internalIndex, setInternalIndex] = useState(currentIndex)
  const [isSliding, setIsSliding] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalProjects = projects.length
  const hasNext = internalIndex < totalProjects - 1
  const hasPrev = internalIndex > 0

  const currentProject = projects[internalIndex]

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true)

      const timer = setTimeout(() => {
        setInternalIndex(currentIndex)
        setIsSliding(false)
      }, 400)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, isOpen])

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex)
      setIsSliding(false)
    }
  }, [isOpen, currentIndex])

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1 || isSliding) return
    onNavigate(internalIndex + 1)
  }, [internalIndex, totalProjects, isSliding, onNavigate])

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) return
    onNavigate(internalIndex - 1)
  }, [internalIndex, isSliding, onNavigate])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    onClose()
    setTimeout(() => {
      setIsClosing(false)
      setAnimationPhase("initial")
      onCloseComplete?.()
    }, 400)
  }, [onClose, onCloseComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowRight") navigateNext()
      if (e.key === "ArrowLeft") navigatePrev()
    }

    window.addEventListener("keydown", handleKeyDown)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleClose, navigateNext, navigatePrev])

  useLayoutEffect(() => {
    if (isOpen) {
      setAnimationPhase("initial")
      setIsClosing(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating")
        })
      })
      const timer = setTimeout(() => {
        setAnimationPhase("complete")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, sourceRect])

  const handleDotClick = (idx: number) => {
    if (isSliding || idx === internalIndex) return
    onNavigate(idx)
  }

  if (!isOpen || !currentProject) return null

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {}

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const targetWidth = Math.min(768, viewportWidth - 64)
    const targetHeight = Math.min(viewportHeight * 0.85, 600)

    const targetX = (viewportWidth - targetWidth) / 2
    const targetY = (viewportHeight - targetHeight) / 2

    const scaleX = sourceRect.width / targetWidth
    const scaleY = sourceRect.height / targetHeight
    const scale = Math.max(scaleX, scaleY)

    const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2)
    const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2)

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      opacity: 1,
    }
  }

  const getFinalStyles = (): React.CSSProperties => {
    return {
      transform: "translate(0, 0) scale(1)",
      opacity: 1,
    }
  }

  // If no sourceRect, skip initial animation and go straight to final position
  const currentStyles = (animationPhase === "initial" && !isClosing && sourceRect)
    ? getInitialStyles()
    : getFinalStyles()

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none")}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Background overlay removed - no color change */}
      {/* Click handler moved to image container below */}


      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-3xl pointer-events-auto"
        style={{
          ...currentStyles,
          transform: isClosing ? "translate(0, 0) scale(0.95)" : currentStyles.transform,
          transition:
            animationPhase === "initial" && !isClosing
              ? "none"
              : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
          transformOrigin: "center center",
        }}
      >
        <div
          className={cn("relative overflow-hidden", "rounded-2xl", "bg-black", "ring-1 ring-zinc-800", "shadow-2xl")}
          style={{
            borderRadius: animationPhase === "initial" && !isClosing ? "8px" : "16px",
            transition: "border-radius 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-400 ease-out"
              style={{
                transform: `translateX(-${internalIndex * 100}%)`,
                transition: isSliding ? "transform 400ms cubic-bezier(0.32, 0.72, 0, 1)" : "none",
              }}
            >
              {projects.map((project) => (
                isVideoFile(project.image) ? (
                  <video
                    key={project.id}
                    src={project.image}
                    className="w-full h-auto max-h-[70vh] object-contain bg-background flex-shrink-0"
                    style={{ minWidth: "100%" }}
                    onClick={(e) => e.stopPropagation()}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    key={project.id}
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-auto max-h-[70vh] object-contain bg-background flex-shrink-0"
                    style={{ minWidth: "100%" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )
              ))}
            </div>

            {/* Close button - top right of image */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClose()
              }}
              className={cn(
                "absolute top-3 right-3 z-50",
                "w-10 h-10 flex items-center justify-center",
                "rounded-full bg-black/60 backdrop-blur-md",
                "border border-white/20",
                "text-white hover:bg-black/80",
                "transition-all duration-300 ease-out hover:scale-110 active:scale-95",
              )}
              style={{
                opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-10px)",
                transition: "opacity 300ms ease-out, transform 300ms ease-out",
              }}
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Previous button - left side of image */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigatePrev()
              }}
              disabled={!hasPrev || isSliding}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 z-50",
                "w-12 h-12 flex items-center justify-center",
                "rounded-full bg-black/60 backdrop-blur-md",
                "border border-white/20",
                "text-white hover:bg-black/80",
                "transition-all duration-300 ease-out hover:scale-110 active:scale-95",
                "disabled:opacity-0 disabled:pointer-events-none",
              )}
              style={{
                opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
                transition: "opacity 300ms ease-out 150ms",
              }}
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>

            {/* Next button - right side of image */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateNext()
              }}
              disabled={!hasNext || isSliding}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 z-50",
                "w-12 h-12 flex items-center justify-center",
                "rounded-full bg-black/60 backdrop-blur-md",
                "border border-white/20",
                "text-white hover:bg-black/80",
                "transition-all duration-300 ease-out hover:scale-110 active:scale-95",
                "disabled:opacity-0 disabled:pointer-events-none",
              )}
              style={{
                opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
                transition: "opacity 300ms ease-out 150ms",
              }}
            >
              <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
            </button>

            {/* Subtle vignette effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-card/20 via-transparent to-card/10" />
          </div>

          <div
            className={cn("px-6 py-5", "bg-black", "border-t border-zinc-800")}
            style={{
              opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
              transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 300ms ease-out 100ms, transform 300ms ease-out 100ms",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white tracking-tight truncate">
                    {currentProject?.title}
                  </h3>
                  {currentProject?.status && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap",
                        currentProject.status === "Finished"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : currentProject.status === "In Development"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30"
                      )}
                    >
                      {currentProject.status}
                    </span>
                  )}
                </div>
                {currentProject?.description && (
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                    {currentProject.description}
                  </p>
                )}
                {currentProject?.tags && currentProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    {projects.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          idx === internalIndex
                            ? "bg-white scale-110"
                            : "bg-zinc-600 hover:bg-zinc-500",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {currentProject?.link && (
                <a
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2",
                    "text-sm font-medium text-zinc-300",
                    "bg-zinc-800 hover:bg-zinc-700",
                    "rounded-lg border border-zinc-700",
                    "transition-all duration-200 ease-out",
                    "hover:text-white",
                  )}
                >
                  <span>View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProjectCardProps {
  image: string
  title: string
  delay: number
  isVisible: boolean
  index: number
  onClick: () => void
  isSelected: boolean
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ image, title, delay, isVisible, index, onClick, isSelected }, ref) => {
    const rotations = [-12, 0, 12]
    const translations = [-55, 0, 55]

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-20 h-28 rounded-lg overflow-hidden shadow-xl",
          "bg-zinc-900 border border-zinc-700",
          "cursor-pointer hover:ring-2 hover:ring-blue-400/50",
          isSelected && "opacity-0",
        )}
        style={{
          transform: isVisible
            ? `translateY(-90px) translateX(${translations[index]}px) rotate(${rotations[index]}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.5)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
          zIndex: 10 - index,
          left: "-40px",
          top: "-56px",
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
{isVideoFile(image) ? (
          <video src={image} className="w-full h-full object-cover" autoPlay loop muted playsInline />
        ) : (
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <p
          className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-semibold text-white truncate"
          style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)" }}
        >
          {title}
        </p>
      </div>
    )
  },
)

ProjectCard.displayName = "ProjectCard"
