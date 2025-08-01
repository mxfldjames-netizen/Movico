import React, { useRef, useState,useEffect } from "react";
import AnimatedStatsCard from "./AnimatedStatsCard";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  Sparkles,
  Zap,
  Award,
} from "lucide-react";

const videoData = [
  {
    id: 1,
    title: "AI Commercial",
    thumbnail:
      "https://m.media-amazon.com/images/S/aplus-media/vc/09679e0b-d23f-4afb-a821-7bd728d91562.__CR0,0,970,600_PT0_SX970_V1___.png",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    orientation: "landscape",
  },
  {
    id: 2,
    title: "Tech Animation",
    thumbnail:
      "https://images-na.ssl-images-amazon.com/images/I/31GjEJUp2EL.jpg",
    video: "https://www.youtube.com/embed/jNQXAC9IVRw",
    orientation: "vertical",
  },
  {
    id: 3,
    title: "Product Showcase",
    thumbnail:
      "https://teknonel.com/wp-content/uploads/2022/06/5-Best-gaming-mouse-under-30-in-2022-min.jpg",
    video: "https://www.youtube.com/embed/M7lc1UVf-VE",
    orientation: "landscape",
  },
  {
    id: 4,
    title: "Lamborghini",
    thumbnail:
      "https://tse2.mm.bing.net/th/id/OIP.udVRZ3t2BwxQW9GlKTu1fgHaNE?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    video: "https://www.youtube.com/embed/YyNz4--6fro",
    orientation: "vertical",
  },
  {
    id: 5,
    title: "Motion Graphics",
    thumbnail:
      "https://cubicleninjas.com/wp-content/uploads/2019/09/motion-graphics-examples.jpg",
    video: "https://www.youtube.com/embed/L_jWHffIx5E",
    orientation: "landscape",
  },
  {
    id: 6,
    title: "AI Visualization",
    thumbnail:
      "https://img.freepik.com/premium-photo/innovative-intelligence-artificial-intelligence-depicted-through-brain-digital-elements-vertical_904318-11327.jpg",
    video: "https://www.youtube.com/embed/9bZkp7q19f0",
    orientation: "vertical",
  },
  {
    id: 7,
    title: "Digital Art",
    thumbnail: "https://wallpaperaccess.com/full/176937.jpg",
    video: "https://www.youtube.com/embed/ScMzIvxBSi4",
    orientation: "landscape",
  },
  {
    id: 8,
    title: "Future Tech",
    thumbnail:
      "https://tse3.mm.bing.net/th/id/OIP.hzXCVO3ceyYL35RSiDGBvAHaHn?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    video: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
    orientation: "vertical",
  },
];

const Navigation = ({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (item: string) => void;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home Page" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact Us" },
  ];
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-white/80 backdrop-blur-sm'} border-b border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Movico Studio"
              className="h-8 sm:h-10 lg:h-12 w-auto transition-all duration-300 hover:scale-105"
            />
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`relative px-3 py-2 text-base lg:text-lg font-medium transition-all duration-300 overflow-hidden ${
                  activeItem === item.id
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {activeItem === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-black via-gray-700 to-gray-500 rounded-full" />
                )}
                <div 
                  className={`absolute inset-0 bg-gray-100 rounded-lg transform scale-x-0 transition-transform duration-300 origin-left ${activeItem === item.id ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'}`}
                  style={{ transform: activeItem === item.id ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
            ))}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div
                  className={`w-full h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <div
                  className={`w-full h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <div
                  className={`w-full h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ${
            isMobileMenuOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm rounded-lg mt-2 border border-gray-200 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  activeItem === item.id
                    ? "text-black bg-gray-100"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};


const VideoModal = ({
  video,
  isOpen,
  onClose,
}: {
  video: (typeof videoData)[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-300 z-10"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Video Container */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-video">
            <iframe
              src={`${video.video}?autoplay=1`}
              title={video.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Info */}
          <div className="p-4 sm:p-6 bg-white">
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
              {video.title}
            </h3>
            <p className="text-gray-600">
              AI-generated content showcasing creative possibilities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoCard = ({
  video,
  index,
  onPlay,
  isGrid = false,
}: {
  video: (typeof videoData)[0];
  index: number;
  onPlay: (video: (typeof videoData)[0]) => void;
  isGrid?: boolean;
}) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(video);
  };

  const isVertical = video.orientation === "vertical";

  if (isGrid) {
    return (
      <div className="relative group">
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 aspect-video bg-gray-100 hover:scale-105 hover:shadow-2xl"
          onClick={handlePlayClick}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          {/* Thumbnail */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {/* Play Icon - Always Visible */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4 cursor-pointer hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
            </div>
          </div>
          {/* Title */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20">
            <h3 className="text-white font-medium text-sm sm:text-base transition-all duration-300 group-hover:text-yellow-300">
              {video.title}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // For Carousel (horizontal scroll)
  return (
    <div className="relative flex-shrink-0 h-36 sm:h-40 lg:h-44">
      <div
        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 h-full group ${
          isVertical ? "w-24 sm:w-28 lg:w-32" : "w-48 sm:w-56 lg:w-64"
        } hover:scale-105 hover:shadow-2xl`}
        onClick={handlePlayClick}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {/* Play Icon - Always Visible */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 cursor-pointer hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white" />
          </div>
        </div>
        {/* Title */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-20">
          <h3 className="text-white font-medium text-xs sm:text-sm transition-all duration-300 group-hover:text-yellow-300">
            {video.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

const VideoCarousel = ({
  onVideoPlay,
}: {
  onVideoPlay: (video: (typeof videoData)[0]) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Create enough copies for seamless infinite scroll
  const duplicatedVideoData = [
    ...videoData,
    ...videoData,
    ...videoData,
    ...videoData,
  ];

  // Auto-scroll functionality
  React.useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 0.5; // pixels per frame - reduced for smoother experience

    const autoScroll = () => {
      if (!isPaused && !isHovered && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Calculate when to reset for seamless loop
        const singleSetWidth = scrollContainer.scrollWidth / 4; // Since we have 4 copies
        if (scrollContainer.scrollLeft >= singleSetWidth * 2) {
          scrollContainer.scrollLeft = singleSetWidth; // Reset to second set
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, isHovered]);

  const scroll = (direction: "left" | "right") => {
    setIsPaused(true);

    if (scrollRef.current) {
      const scrollAmount = 280; // Adjust based on card width + gap
      const newScrollLeft =
        scrollRef.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scroll Buttons - Hidden on mobile */}
      <button
        onClick={() => scroll("left")}
        className="hidden sm:block absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 lg:p-3 text-black hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="hidden sm:block absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 lg:p-3 text-black hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
      </button>

      {/* Video Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {duplicatedVideoData.map((video, index) => (
          <VideoCard
            key={`${video.id}-${index}`}
            video={video}
            index={index}
            onPlay={onVideoPlay}
          />
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 left-0 w-8 sm:w-16 lg:w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-8 sm:w-16 lg:w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      <style jsx>{`
        .scrollbar-hide {
          -webkit-scrollbar: none;
        }
      `}</style>
    </div>
  );
};

const PortfolioPage = ({
  onVideoPlay,
  onBack,
}: {
  onVideoPlay: (video: (typeof videoData)[0]) => void;
  onBack: () => void;
}) => {
  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="text-base sm:text-lg">Back to Home</span>
          </button>
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
              Our Portfolio
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto px-4">
            Explore our collection of AI-generated advertisements and short
            films that showcase the future of creative storytelling.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {videoData.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              onPlay={onVideoPlay}
              isGrid={true}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 lg:mt-20 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 text-sm text-gray-500">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">
                {videoData.length}+
              </div>
              <div className="whitespace-nowrap">Creative Projects</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">
                100%
              </div>
              <div className="whitespace-nowrap">AI Generated</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">
                ∞
              </div>
              <div className="whitespace-nowrap">Creative Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ onVideoPlay }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        {/* Main Content Container */}
        <div className="text-center space-y-6 sm:space-y-8 mb-8">
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
              AI-Generated Ads & Short Films
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
            Unleashing storytelling with AI creativity.
          </p>

          {/* Start Creating Now Button */}
          <button className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-black to-gray-800 rounded-full hover:from-gray-800 hover:to-black hover:scale-105 hover:shadow-2xl hover:shadow-black/25">
            <span className="relative z-10">Start Creating Now</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>
        </div>

        {/* Video Carousel */}
        <div className="w-full max-w-5xl mb-16">
          <VideoCarousel onVideoPlay={onVideoPlay} />
        </div>

        {/* Stats Section - Animated Cards with Counters */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4 w-full max-w-4xl mx-auto">
          <AnimatedStatsCard 
            icon={Zap} 
            number="50+" 
            label="ADS CREATED" 
            delay={0} 
          />
          <AnimatedStatsCard 
            icon={Award} 
            number="10+" 
            label="HAPPY CLIENTS" 
            delay={200} 
          />
          <AnimatedStatsCard 
            icon={Sparkles} 
            number="100" 
            label="PRODUCTIVITY" 
            delay={400} 
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-50/95 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Movico Studio" className="h-8 w-auto" />
              </div>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 max-w-md">
                Pioneering the future of storytelling through AI-powered video creation. Transform your ideas into stunning visual narratives.
              </p>
              <div className="flex space-x-4">
                <button className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-colors duration-300">
                  <div className="w-5 h-5 bg-current" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }} />
                </button>
                <button className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-colors duration-300">
                  <div className="w-5 h-5 bg-current rounded-full" />
                </button>
                <button className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-colors duration-300">
                  <div className="w-5 h-5 bg-current" style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)" }} />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-black font-semibold text-lg mb-6">Services</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">AI Video Generation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">Commercial Production</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">Short Film Creation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">Brand Storytelling</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">Motion Graphics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black font-semibold text-lg mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="text-gray-600"><span className="block text-sm text-gray-500">Email</span>hello@movico.studio</li>
                <li className="text-gray-600"><span className="block text-sm text-gray-500">Phone</span>+1 (555) 123-4567</li>
                <li className="text-gray-600"><span className="block text-sm text-gray-500">Address</span>123 Creative District, Los Angeles, CA 90028</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Movico Studio. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      </div>

  );
};

function App() {
  const [activeItem, setActiveItem] = useState("home");
  const [selectedVideo, setSelectedVideo] = useState<
    (typeof videoData)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoPlay = (video: (typeof videoData)[0]) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleBackToHome = () => {
    setActiveItem("home");
  };

  useEffect(() => {
    // Add global styles for animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) translateX(0) rotate(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(20px) rotate(360deg); opacity: 0; }
      }
      @keyframes shine {
        from { transform: translateX(-100%) rotate(0deg); }
        to { transform: translateX(100%) rotate(5deg); }
      }
      @keyframes gradient-x {
        0% { background-size: 100%; background-position: 0% 0%; }
        50% { background-size: 200%; background-position: 100% 0%; }
        100% { background-size: 100%; background-position: 0% 0%; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Page Content */}
      {activeItem === "home" && <HomePage onVideoPlay={handleVideoPlay} />}
      {activeItem === "portfolio" && (
        <PortfolioPage
          onVideoPlay={handleVideoPlay}
          onBack={handleBackToHome}
        />
      )}
      {activeItem === "about" && <HomePage onVideoPlay={handleVideoPlay} />}
      {activeItem === "contact" && <HomePage onVideoPlay={handleVideoPlay} />}

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;