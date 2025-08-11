"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  Waves,
  TreePine,
  Camera,
  Phone,
  Mail,
  Calendar,
  Eye,
  // Play,
  Volume2,
  VolumeX,
} from "lucide-react"
import CanvasElement from "@/components/ui/CanvasElement"

export default function VillaLanding() {
  const [selectedImage, setSelectedImage] = useState(0)
  // const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [activeSection, setActiveSection] = useState("hero")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing...")

  const images = [
    { preview: "/interior_preview.png", full: "/cayley_interior.jpg" },
    { preview: "/billiard_hall_preview.png", full: "/billiard_hall.jpg" },
    { preview: "/bathroom_preview.png", full: "/modern_bathroom.jpg" },
    { preview: "/bedroom_preview.png", full: "/hotel_room.jpg" },
    { preview: "/fireplace_preview.png", full: "/fireplace.jpg" },
  ]

  const features = [
    { icon: Bed, label: "5 Bedrooms", value: "5" },
    { icon: Bath, label: "4 Bathrooms", value: "4" },
    { icon: Square, label: "450 m²", value: "450" },
    { icon: Car, label: "2 Car Garage", value: "2" },
  ]

  const amenities = [
    { icon: Waves, label: "Swimming Pool" },
    { icon: TreePine, label: "Private Garden" },
    { icon: Wifi, label: "High-Speed WiFi" },
    { icon: Camera, label: "Security System" },
  ]

  // const highlights = [
  //   { icon: Award, label: "Luxury Property Award 2024" },
  //   { icon: Star, label: "5-Star Rated Location" },
  // ]

  // Loading sequence
  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: "Loading luxury experience..." },
      { progress: 40, text: "Preparing villa showcase..." },
      { progress: 60, text: "Loading video content..." },
      { progress: 80, text: "Finalizing details..." },
      { progress: 100, text: "Welcome to Villa Tuscany" },
    ]

    let currentStep = 0
    const loadingInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingProgress(loadingSteps[currentStep].progress)
        setLoadingText(loadingSteps[currentStep].text)
        currentStep++
      } else {
        clearInterval(loadingInterval)
      }
    }, 800)

    // Simulate video loading and other assets
    const videoLoadPromise = new Promise((resolve) => {
      const video = document.createElement("video")
      video.src = "/placeholder-video.mp4"
      video.onloadeddata = () => resolve(true)
      video.onerror = () => resolve(true) // Resolve even on error to prevent infinite loading
      // Fallback timeout
      setTimeout(() => resolve(true), 4000)
    })

    // Simulate image preloading
    const imageLoadPromises = images.map((obj) => {
      return new Promise((resolve) => {
        const img = new window.Image()
        img.src = obj.full;
        img.onload = () => resolve(true)
        img.onerror = () => resolve(true)
        // Fallback timeout
        setTimeout(() => resolve(true), 2000)
      })
    })

    // Wait for all assets to load
    Promise.all([videoLoadPromise, ...imageLoadPromises]).then(() => {
      // Ensure minimum loading time for smooth experience
      setTimeout(() => {
        setIsLoading(false)
        document.body.style.overflow = "unset"
      }, 1000)
    })

    // Prevent scrolling during loading
    document.body.style.overflow = "hidden"

    return () => {
      clearInterval(loadingInterval)
      document.body.style.overflow = "unset"
    }
  }, [])

  // Scroll effect and progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Calculate scroll progress
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((currentScrollY / documentHeight) * 100, 100)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 120 // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  // Active section detection
  useEffect(() => {
    const sections = ["hero", "gallery", "details", "contact"]
    const observers = sections.map((sectionId) => {
      const element = document.getElementById(sectionId)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId)
          }
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0.1,
        },
      )

      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  const openLightbox = (imageIndex: number) => {
    setLightboxImage(imageIndex)
    setShowLightbox(true)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
    document.body.style.overflow = "unset"
  }

  const nextImage = () => {
    setLightboxImage((prev) => (prev + 1) % images.length)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  const prevImage = () => {
    setLightboxImage((prev) => (prev - 1 + images.length) % images.length)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5))
    if (zoomLevel <= 1) {
      setPanPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const toggleVideoMute = () => {
    const video = document.getElementById("hero-video") as HTMLVideoElement
    if (video) {
      video.muted = !video.muted
      setIsVideoMuted(video.muted)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return

      switch (e.key) {
        case "Escape":
          closeLightbox()
          break
        case "ArrowLeft":
          prevImage()
          break
        case "ArrowRight":
          nextImage()
          break
        case "+":
        case "=":
          zoomIn()
          break
        case "-":
          zoomOut()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showLightbox])

  // Calculate navbar styles based on scroll
  const navbarOpacity = Math.min(scrollY / 100, 0.95)
  const navbarBlur = Math.min(scrollY / 10, 20)
  const isScrolled = scrollY > 50

  // Show loader while loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Main Loader Container */}
        <div className="relative z-10 text-center space-y-12 max-w-md mx-auto px-6">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <div className="text-4xl font-light text-white tracking-wider">Villa Europa</div>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto" />
            <div className="text-white/70 text-sm font-light tracking-wide">Luxury Real Estate Experience</div>
          </div>

          {/* Animated Villa Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto relative">
              {/* Animated Building */}
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="relative">
                  {/* Main Building */}
                  <div
                    className="w-16 h-12 bg-gradient-to-t from-white/20 to-white/10 border border-white/20 relative"
                    style={{
                      clipPath: "polygon(0 100%, 0 20%, 50% 0%, 100% 20%, 100% 100%)",
                      animation: "fadeInUp 2s ease-out infinite alternate",
                    }}
                  >
                    {/* Windows */}
                    <div
                      className="absolute top-4 left-2 w-2 h-2 bg-white/30 rounded-sm animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div
                      className="absolute top-4 right-2 w-2 h-2 bg-white/30 rounded-sm animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-white/20 rounded-sm" />
                  </div>

                  {/* Side Wings */}
                  <div className="absolute -left-3 bottom-0 w-6 h-8 bg-gradient-to-t from-white/15 to-white/5 border border-white/15" />
                  <div className="absolute -right-3 bottom-0 w-6 h-8 bg-gradient-to-t from-white/15 to-white/5 border border-white/15" />
                </div>
              </div>

              {/* Floating Particles */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${10 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: `${2 + i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${loadingProgress}%` }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>

              {/* Progress Percentage */}
              <div className="absolute -top-8 left-0 text-white/60 text-xs font-light">{loadingProgress}%</div>
            </div>

            {/* Loading Text */}
            <div className="space-y-2">
              <div className="text-white/90 text-lg font-light tracking-wide min-h-[28px] flex items-center justify-center">
                {loadingText}
              </div>

              {/* Animated Dots */}
              <div className="flex justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Loading Steps Indicator */}
          <div className="flex justify-center space-x-2">
            {[20, 40, 60, 80, 100].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${loadingProgress >= step
                  ? "bg-gradient-to-r from-blue-400 to-purple-400 scale-110"
                  : "bg-white/20 scale-100"
                  }`}
              />
            ))}
          </div>

          {/* Subtle Animation Message */}
          <div className="text-white/50 text-xs font-light tracking-widest">CRAFTING YOUR EXPERIENCE</div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-white/20" />
        <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-white/20" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-white/20" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-white/20" />

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            0% { transform: translateY(2px); opacity: 0.8; }
            100% { transform: translateY(-2px); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-slate-200/50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{
            width: `${scrollProgress}%`,
            boxShadow: scrollProgress > 0 ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
          }}
        />
      </div>

      {/* Header with Scroll Effects */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}
        style={{
          backgroundColor: `rgba(255, 255, 255, ${navbarOpacity})`,
          backdropFilter: `blur(${navbarBlur}px)`,
          marginTop: "4px", // Account for progress bar
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className={`text-2xl font-bold text-slate-900 transition-all duration-300 ${isScrolled ? "scale-90" : "scale-100"
                }`}
            >
              Villa Europa
            </div>

            {/* Centered Navigation */}
            <nav
              className={`hidden md:flex items-center gap-1 border border-slate-200 rounded-full px-6 py-3 shadow-lg transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md scale-95" : "bg-white/90 backdrop-blur-sm scale-100"
                }`}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 py-2 transition-all duration-300 ${activeSection === "gallery" ? "bg-slate-900 text-white hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                onClick={() => scrollToSection("gallery")}
              >
                Gallery
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 py-2 transition-all duration-300 ${activeSection === "details" ? "bg-slate-900 text-white hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                onClick={() => scrollToSection("details")}
              >
                Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 py-2 transition-all duration-300 ${activeSection === "contact" ? "bg-slate-900 text-white hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </Button>
            </nav>

            {/* CTA Button */}
            <Button
              size="sm"
              className={`bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 transition-all duration-300 ${isScrolled ? "scale-90" : "scale-100"
                }`}
              onClick={() => scrollToSection("contact")}
            >
              Schedule Visit
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-300 ${isScrolled ? "mt-2" : "mt-4"}`}>
            <nav
              className={`flex items-center justify-center gap-1 border border-slate-200 rounded-full px-4 py-2 shadow-lg mx-auto w-fit transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md scale-95" : "bg-white/90 backdrop-blur-sm scale-100"
                }`}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-2 text-sm transition-all duration-300 ${activeSection === "gallery" ? "bg-slate-900 text-white hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                onClick={() => scrollToSection("gallery")}
              >
                Gallery
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-2 text-sm transition-all duration-300 ${activeSection === "details" ? "bg-slate-900 text-white hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                onClick={() => scrollToSection("details")}
              >
                Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-2 text-sm transition-all duration-300 ${activeSection === "contact" ? "bg-slate-900 text-white hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </Button>
            </nav>
          </div>
        </div>

        {/* Progress Indicator with Section Labels */}
        {scrollProgress > 5 && (
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-2">
            <div className="container mx-auto">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <span className="font-medium">{Math.round(scrollProgress)}% Complete</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <span className={activeSection === "hero" ? "text-slate-900 font-medium" : ""}>Hero</span>
                  <span className={activeSection === "gallery" ? "text-slate-900 font-medium" : ""}>Gallery</span>
                  <span className={activeSection === "details" ? "text-slate-900 font-medium" : ""}>Details</span>
                  <span className={activeSection === "contact" ? "text-slate-900 font-medium" : ""}>Contact</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Video Background */}
      <section id="hero" className="relative min-h-screen overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            id="hero-video"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`, // Parallax effect
            }}
          >
            <source src="/bg-vid.mp4" type="video/mp4" />
            {/* Fallback image */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-300"></div>
          </video>

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>

          {/* Video Controls */}
          <button
            onClick={toggleVideoMute}
            className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
          >
            {isVideoMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-32">
            <div className="max-w-7xl mx-auto">
              {/* Hero Content */}
              <div
                className="text-center mb-16 space-y-8"
                style={{
                  transform: `translateY(${scrollY * 0.2}px)`, // Parallax effect
                  opacity: Math.max(1 - scrollY / 500, 0), // Fade out on scroll
                }}
              >
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">Available Now</span>
                </div>

                {/* Main Title */}
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-8xl font-light text-white leading-tight drop-shadow-2xl">
                    Villa Tuscany
                  </h1>

                  <div className="flex items-center justify-center text-white/90 text-xl">
                    <MapPin className="h-6 w-6 mr-3" />
                    Florence, Italy
                  </div>

                  <p className="text-4xl lg:text-6xl font-light text-white mt-8 drop-shadow-xl">€2,850,000</p>
                </div>

                {/* Description */}
                <div className="max-w-2xl mx-auto">
                  <p className="text-xl text-white/90 leading-relaxed drop-shadow-lg">
                    A meticulously designed villa nestled in the heart of Tuscany, offering breathtaking views of
                    rolling hills and vineyards. Traditional Italian architecture meets modern luxury.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  {/* <Dialog open={showVirtualTour} onOpenChange={setShowVirtualTour}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Eye className="h-6 w-6 mr-3" />
                        Virtual Tour
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>3D Virtual Tour - Luxury Villa Tuscany</DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 bg-slate-100 rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mx-auto">
                            <Play className="h-8 w-8 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-slate-900">3D Virtual Tour</p>
                            <p className="text-slate-600">Replace this section with your 3D tour component</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog> */}
                  <Button
                    size="lg"
                    onClick={() => openLightbox(selectedImage)}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Eye className="h-6 w-6 mr-3" />
                    Virtual Tour
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-white/50 hover:bg-white/10 text-white hover:text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => scrollToSection("contact")}
                  >
                    <Calendar className="h-6 w-6 mr-3" />
                    Schedule Visit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          style={{
            opacity: Math.max(1 - scrollY / 200, 0),
          }}
        >
          <div className="flex flex-col items-center text-white/70 animate-bounce">
            <span className="text-sm mb-2">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Content Section with Fade-in Effect */}
      <section
        id="gallery"
        className="relative bg-white"
        style={{
          transform: `translateY(${Math.max(0, 100 - scrollY / 5)}px)`,
        }}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Main Image */}
            <div className="mb-12">
              <div
                className="relative aspect-[16/9] bg-slate-100 cursor-pointer group overflow-hidden rounded-lg shadow-2xl"
                onClick={() => openLightbox(selectedImage)}
              >
                <Image
                  src={images[selectedImage].preview || "/placeholder.svg"}
                  alt="Luxury Villa Tuscany"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                      <Eye className="h-8 w-8 text-slate-800" />
                    </div>
                  </div>
                </div>

                {/* Image Counter */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm text-slate-800 rounded px-3 py-1 text-sm font-medium">
                    {selectedImage + 1} / {images.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-slate-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-slate-900">{feature.value}</p>
                    <p className="text-slate-600 text-sm">{feature.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Thumbnail Gallery */}
            <div className="space-y-6">
              <h3 className="text-center text-lg font-medium text-slate-900">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    onDoubleClick={() => openLightbox(index)}
                    className={`relative aspect-square bg-slate-100 overflow-hidden transition-all duration-300 rounded-lg ${selectedImage === index
                      ? "ring-2 ring-slate-900 ring-offset-4 shadow-xl"
                      : "hover:ring-2 hover:ring-slate-300 hover:ring-offset-2 hover:shadow-lg"
                      }`}
                  >
                    <Image
                      src={image.preview || "/placeholder.svg"}
                      alt={`Villa view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Highlights */}
            <div className="mt-16 pt-16 border-t border-slate-200">
              <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-slate-900">Property Highlights</h3>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      Marble flooring throughout
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      Infinity swimming pool
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      Panoramic terraces
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      Wine cellar
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-slate-900">Location</h3>
                  <div className="space-y-3 text-slate-600">
                    <div className="flex justify-between">
                      <span>Florence City Center</span>
                      <span>25 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Florence Airport</span>
                      <span>30 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chianti Wine Region</span>
                      <span>15 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section id="details" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Property Details</h2>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Interior Features</h3>
                      <ul className="space-y-2 text-slate-600">
                        <li>• Marble flooring throughout</li>
                        <li>• High ceilings with exposed beams</li>
                        <li>• Fireplace in living room</li>
                        <li>• Walk-in closets in bedrooms</li>
                        <li>• Modern kitchen with island</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Exterior Features</h3>
                      <ul className="space-y-2 text-slate-600">
                        <li>• Infinity swimming pool</li>
                        <li>• Landscaped gardens</li>
                        <li>• Outdoor dining area</li>
                        <li>• Wine cellar</li>
                        <li>• Panoramic terraces</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {amenities.map((amenity, index) => (
                    <Card key={index}>
                      <CardContent className="p-6 text-center">
                        <amenity.icon className="h-8 w-8 mx-auto mb-3 text-slate-600" />
                        <p className="font-medium text-slate-900">{amenity.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Prime Location</h3>
                    <div className="aspect-video bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                      <p className="text-slate-600">Interactive Map Placeholder</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div>
                        <p className="font-medium text-slate-900">Florence City Center</p>
                        <p>25 minutes drive</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Florence Airport</p>
                        <p>30 minutes drive</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Chianti Wine Region</p>
                        <p>15 minutes drive</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Interested in This Property?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Contact our expert team to schedule a private viewing or get more information.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-3 text-slate-600" />
                  <p className="font-medium text-slate-900">Call Us</p>
                  <p className="text-slate-600">+39 055 123 4567</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-3 text-slate-600" />
                  <p className="font-medium text-slate-900">Email Us</p>
                  <p className="text-slate-600">info@villaeuropa.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-3 text-slate-600" />
                  <p className="font-medium text-slate-900">Schedule Visit</p>
                  <p className="text-slate-600">Book online 24/7</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg">Contact Agent</Button>
              <Button variant="outline" size="lg">
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">Villa Europa</div>
          <p className="text-slate-400 mb-4">Luxury Real Estate in Europe</p>
          <p className="text-sm text-slate-500">© 2024 Villa Europa. All rights reserved.</p>
        </div>
      </footer>

      {/* Advanced Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm">
          {/* Lightbox Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">Villa Gallery</h3>
                <span className="text-white/70">
                  {lightboxImage + 1} of {images.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
                  <button
                    onClick={zoomOut}
                    className="p-2 hover:bg-white/20 rounded transition-colors"
                    disabled={zoomLevel <= 0.5}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  <span className="px-3 py-1 text-sm font-medium min-w-[60px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    onClick={zoomIn}
                    className="p-2 hover:bg-white/20 rounded transition-colors"
                    disabled={zoomLevel >= 3}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Close Button */}
                <button onClick={closeLightbox} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-24">
            <div
              className="relative max-w-full w-full h-full max-h-full overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
            >
              {/* <Image
                src={images[lightboxImage].full || "/placeholder.svg"}
                alt={`Villa view ${lightboxImage + 1}`}
                width={1200}
                height={800}
                className="max-w-none transition-transform duration-300 ease-out"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  maxWidth: "none",
                  maxHeight: "none",
                }}
                priority
              /> */}
              <CanvasElement texture={images[lightboxImage].full || "/fireplace.jpg"} />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            disabled={images.length <= 1}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            disabled={images.length <= 1}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Bottom Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxImage(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${lightboxImage === index
                    ? "ring-2 ring-white scale-110"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                >
                  <Image
                    src={image.preview || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div className="text-center text-white/70 text-sm mt-4">
              <p>Use arrow keys to navigate • +/- to zoom • ESC to close • Drag to pan when zoomed</p>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin opacity-0 transition-opacity duration-300" />
          </div>
        </div>
      )}
    </div>
  )
}
