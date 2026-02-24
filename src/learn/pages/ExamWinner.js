import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Download, 
  Bell, 
  User, 
  LayoutGrid, 
  ChevronDown, 
  PlayCircle, 
  FileText, 
  Lock, 
  ArrowLeft,
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
  ChevronRight,
  Settings,
  CheckCircle2
} from 'lucide-react';

// Supabase Configuration
const SUPABASE_URL = "https://fxcfusffpncorldogyku.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Y2Z1c2ZmcG5jb3JsZG9neWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NDEwMzQsImV4cCI6MjA4MzAxNzAzNH0.7lF1aYo4eP2by4wAnSCTpqhElgN6_TdPsItvQtxNGPI";

// Image Mappings
const SUBJECT_IMAGES = {
  'maths': 'https://examwinner.app/media/subjects/Subject_name_slide-04_1_2XsKfIB_jA7R82z_jZb6LOG_q9mSqDA_JMARou5_2OKQ3KM_Ql2Etso_kXnLWW6.jpg',
  'che': 'https://examwinner.app/media/subjects/Subject_name_slide-03_1_YJ4Ip67_CVc7TOK_C5COVdx_rDFVFYh_XgPvkdb.jpg',
  'chemistry': 'https://examwinner.app/media/subjects/Subject_name_slide-03_1_YJ4Ip67_CVc7TOK_C5COVdx_rDFVFYh_XgPvkdb.jpg',
  'phy': 'https://examwinner.app/media/subjects/Subject_name_slide-01_1_csP8hJa_hL2Tb39_ApyIn8E_H71SSXG_eWFmc2I.jpg',
  'physics': 'https://examwinner.app/media/subjects/Subject_name_slide-01_1_csP8hJa_hL2Tb39_ApyIn8E_H71SSXG_eWFmc2I.jpg',
  'improvement': 'https://examwinner.app/media/subjects/WhatsApp_Image_2025-01-01_at_3.31.12_PM_bLbV8H9.jpeg',
  'batch info': 'https://examwinner.app/media/subjects/BATCH_INFO-02_LWItCkw_bciw6pX_GCAdjKt_nqihPWq_16NU1XZ_oHroBZY_Q8tNUeS_qZZsrGk_i_B8Cv41y.jpg',
  'bio': 'https://examwinner.app/media/subjects/Subject_name_slide-02_1_qMe7IjG_AeO6TVO_eGyfXtI_7x8dZ3Q_cBQnE3Y.jpg',
  'biology': 'https://examwinner.app/media/subjects/Subject_name_slide-02_1_qMe7IjG_AeO6TVO_eGyfXtI_7x8dZ3Q_cBQnE3Y.jpg',
  'cs': 'https://examwinner.app/media/subjects/Subject_name_slide-05_1_rzI8A30_BDhUESR_yLV8Lwf_D1m625p_eqcDcbI_ZYiBqVU_e7QxQGP_Zwj2UUa.jpg',
  'computer science': 'https://examwinner.app/media/subjects/Subject_name_slide-05_1_rzI8A30_BDhUESR_yLV8Lwf_D1m625p_eqcDcbI_ZYiBqVU_e7QxQGP_Zwj2UUa.jpg'
};

const CustomVideoPlayer = ({ url, title }) => {
  const getYoutubeId = (rawUrl) => {
    if (!rawUrl) return null;
    let videoId = '';
    if (rawUrl.includes('v=')) videoId = rawUrl.split('v=')[1].split('&')[0];
    else if (rawUrl.includes('youtu.be/')) videoId = rawUrl.split('youtu.be/')[1].split('?')[0];
    else if (rawUrl.includes('embed/')) videoId = rawUrl.split('embed/')[1].split('?')[0];
    else videoId = rawUrl;
    return videoId;
  };

  const videoId = getYoutubeId(url);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&disablekb=0&fs=1`}
        className="w-full h-full"
        allow="autoplay; encrypted-media"
        title={title || 'Exam Winner Video'}
      />

      {/* Block top YouTube bar (title/channel links) */}
      <div className="absolute top-0 left-0 w-full h-8 bg-transparent z-20" />

      {/* Optional overlay for bottom branding area */}
      <div className="absolute bottom-0 left-0 w-full h-6 bg-transparent z-20" />

      {/* Optional video title */}
      <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded text-white text-[11px] font-semibold">
        {title}
      </div>
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const [standards, setStandards] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // Persistence using LocalStorage
  const [selectedStandard, setSelectedStandard] = useState(() => localStorage.getItem('ew_std') || '');
  const [selectedCourse, setSelectedCourse] = useState(() => localStorage.getItem('ew_course') || '');
  
  const [view, setView] = useState('home'); 
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentTopicType, setCurrentTopicType] = useState(null);
  const [currentClass, setCurrentClass] = useState(null);
  const [supabase_ew_learn, setSupabase_ew_learn] = useState(null);

  // Dropdown States
  const [isStdDropdownOpen, setIsStdDropdownOpen] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      const client = window.supabase_ew_learn.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      setSupabase_ew_learn(client);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (supabase_ew_learn) fetchData();
  }, [supabase_ew_learn]);

  // Persist selections
  useEffect(() => {
    if (selectedStandard) localStorage.setItem('ew_std', selectedStandard);
    if (selectedCourse) localStorage.setItem('ew_course', selectedCourse);
  }, [selectedStandard, selectedCourse]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase_ew_learn.from('learn').select('*').eq('institution', 'exam-winner');
      if (error) throw error;
      if (data) {
        setAllData(data);
        setStandards([...new Set(data.map(i => String(i.std)).filter(Boolean))].sort((a,b) => a-b));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update courses when standard changes
  useEffect(() => {
    if (selectedStandard && allData.length > 0) {
      const filtered = allData.filter(i => String(i.std) === String(selectedStandard));
      const uniqueCourses = [...new Set(filtered.map(i => i.course).filter(Boolean))];
      setCourses(uniqueCourses);
      // Reset course if it's not in the new standard's list
      if (selectedCourse && !uniqueCourses.includes(selectedCourse)) {
        setSelectedCourse('');
      }
    }
  }, [selectedStandard, allData]);

  const getFilteredData = () => {
    return allData.filter(i => 
      String(i.std) === String(selectedStandard) && 
      i.course === selectedCourse
    );
  };

  const goBack = () => {
    if (view === 'chapters') setView('home');
    else if (view === 'topicTypes') setView('chapters');
    else if (view === 'classes') setView('topicTypes');
    else if (view === 'player') setView('classes');
  };

  const getSubjectImage = (name) => {
    const key = name.toLowerCase();
    for (let k in SUBJECT_IMAGES) if (key.includes(k)) return SUBJECT_IMAGES[k];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128`;
  };

  if (!loading && (!selectedStandard || !selectedCourse)) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center px-6">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full border border-blue-100">
        <div className="mb-8 text-center">
          <img 
            src="https://examwinner.com/wp-content/uploads/2023/03/Exam-Winner-Learning-App-LOGO.png" 
            alt="Exam Winner" 
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center">
            Welcome Student to{" "}
            <span className="text-blue-600">ExamWinner</span>{" "}
            powered by{" "}
            <span className="text-indigo-600">Pixovia Learn</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Select your details to continue learning
          </p>
        </div>

        {/* Standard Selection */}
        <div className="mb-6">
          <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
            1. Choose Standard
          </label>
          <div className="grid grid-cols-3 gap-2">
            {standards.map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedStandard(s)}
                className={`py-3 rounded-xl text-sm font-bold border-2 transition-all shadow-sm ${
                  selectedStandard === s
                    ? 'border-blue-600 bg-blue-600 text-white shadow-blue-100'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                Std {s}
              </button>
            ))}
          </div>
        </div>

        {/* Course Selection */}
        {selectedStandard && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
              2. Select Your Batch
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
              {courses.map(c => (
                <button 
                  key={c} 
                  onClick={() => setSelectedCourse(c)}
                  className={`w-full text-left p-4 rounded-xl text-xs font-bold border-2 flex justify-between items-center transition-all shadow-sm ${
                    selectedCourse === c
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  <span className="uppercase">{c}</span>
                  {selectedCourse === c && <CheckCircle2 size={16} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Optional footer note */}
        <div className="mt-8 text-center text-[11px] text-gray-400 font-medium">
          © {new Date().getFullYear()} Exam Winner
        </div>
      </div>
    </div>
  );
}

  const renderHome = () => {
    const filtered = getFilteredData();
    const uniqueSubjects = [...new Set(filtered.map(i => i.subject))];
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {uniqueSubjects.map((sub, idx) => (
          <div key={idx} onClick={() => { setCurrentSubject(sub); setView('chapters'); }} className="group flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-blue-100">
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
              <img src={getSubjectImage(sub)} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xs font-extrabold text-gray-800 text-center uppercase leading-tight line-clamp-2">{sub}</h3>
          </div>
        ))}
      </div>
    );
  };

  const renderChapters = () => {
    const chapters = [...new Set(getFilteredData().filter(i => i.subject === currentSubject).map(i => i.chapter))];
    return (
      <div className="space-y-3">
        {chapters.map((chap, idx) => (
          <div key={idx} onClick={() => { setCurrentChapter(chap); setView('topicTypes'); }} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold shadow-md">{idx + 1}</span>
              <span className="text-sm font-bold text-gray-700">{chap}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        ))}
      </div>
    );
  };

  const renderTopicTypes = () => {
    const types = [...new Set(getFilteredData().filter(i => i.subject === currentSubject && i.chapter === currentChapter).map(i => i.topic))];
    return (
      <div className="space-y-3">
        {types.map((type, idx) => (
          <div key={idx} onClick={() => { setCurrentTopicType(type); setView('classes'); }} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 cursor-pointer shadow-sm hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><PlayCircle size={18} /></div>
              <span className="text-xs font-black uppercase text-gray-700 tracking-wide">{type}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        ))}
      </div>
    );
  };

  const renderClasses = () => {
    const classes = getFilteredData().filter(i => i.subject === currentSubject && i.chapter === currentChapter && i.topic === currentTopicType);
    return (
      <div className="space-y-3">
        {classes.map((item, idx) => (
          <div key={idx} onClick={() => { setCurrentClass(item); setView('player'); }} className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow group">
            <div className="relative w-28 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
               <img src={getSubjectImage(currentSubject)} className="w-full h-full object-cover opacity-50" />
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <Play size={20} fill="white" className="text-white" />
               </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="font-bold text-xs text-gray-800 uppercase line-clamp-2 leading-snug">{item.title || `${currentSubject} Lecture`}</h4>
              <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-wider">{currentTopicType}</p>
            </div>
            <div className="flex items-center px-1"><Lock size={14} className="text-gray-300" /></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-[#2563eb] text-white p-4 flex items-center sticky top-0 z-50 shadow-lg">
        {view !== 'home' && (
          <button onClick={goBack} className="mr-3 p-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
        )}
        <div className="flex-1 truncate">
          <div className="flex items-center gap-2">
  {view === 'home' ? (
    <>
      <img
        src="https://yt3.googleusercontent.com/lQUVtvnD91oE98WjUQXoG9Hac441wr3woXzQxhXtwqU7qVSbU2dyRmsV7A_4OYJ3CUxqv86EyQ=s900-c-k-c0x00ffffff-no-rj"
        alt="Exam Winner Logo"
        className="h-6 w-auto rounded-sm"
      />
      <div className="h-5 w-px bg-white/50 mx-1" />
      <img
        src="https://pixovia.pages.dev/icon-coloured-closeup.jpg"
        alt="Pixovia Logo"
        className="h-6 w-5 rounded-md object-cover"
      />
      <span className="font-black text-sm uppercase tracking-tight ml-1">
        Learn
      </span>
    </>
  ) : (
    <h1 className="text-sm font-black uppercase tracking-tight truncate">
      {view === 'chapters'
        ? currentSubject
        : view === 'topicTypes'
        ? currentChapter
        : view === 'classes'
        ? currentTopicType
        : 'Video Lesson'}
    </h1>
  )}
</div>
        </div>
        
        {view === 'home' && (
          <div className="flex gap-2">
            <button 
              onClick={() => { setIsStdDropdownOpen(!isStdDropdownOpen); setIsCourseDropdownOpen(false); }} 
              className="bg-white/10 px-2 py-1.5 rounded-md text-[9px] font-bold border border-white/20 uppercase flex items-center gap-1 hover:bg-white/20"
            >
              STD {selectedStandard}
              <ChevronDown size={10} />
            </button>
            <button 
              onClick={() => { setIsCourseDropdownOpen(!isCourseDropdownOpen); setIsStdDropdownOpen(false); }} 
              className="bg-white/10 px-2 py-1.5 rounded-md text-[9px] font-bold border border-white/20 uppercase flex items-center gap-1 hover:bg-white/20"
            >
              BATCH
              <ChevronDown size={10} />
            </button>
          </div>
        )}

        {/* Dynamic Dropdowns */}
        {isStdDropdownOpen && (
          <div className="absolute top-14 right-24 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[60] text-gray-800 overflow-hidden">
            {standards.map(s => (
              <button 
                key={s} 
                onClick={() => { setSelectedStandard(s); setIsStdDropdownOpen(false); }} 
                className={`w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-blue-50 uppercase ${selectedStandard === s ? 'text-blue-600 bg-blue-50' : ''}`}
              >
                Std {s}
              </button>
            ))}
          </div>
        )}
        {isCourseDropdownOpen && (
          <div className="absolute top-14 right-4 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[60] text-gray-800 overflow-hidden">
            {courses.map(c => (
              <button 
                key={c} 
                onClick={() => { setSelectedCourse(c); setIsCourseDropdownOpen(false); }} 
                className={`w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-blue-50 uppercase line-clamp-1 ${selectedCourse === c ? 'text-blue-600 bg-blue-50' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            {view === 'home' && renderHome()}
            {view === 'chapters' && renderChapters()}
            {view === 'topicTypes' && renderTopicTypes()}
            {view === 'classes' && renderClasses()}
            {view === 'player' && (
              <div className="space-y-6">
                <CustomVideoPlayer url={currentClass?.class} title={currentClass?.title || currentSubject} />
                {currentClass?.note && currentClass.note !== "null" && (
                  <a href={currentClass.note} target="_blank" rel="noreferrer" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileText size={20} /></div>
                      <span className="text-xs font-black uppercase text-gray-600 tracking-wide">Download Study Material</span>
                    </div>
                    <Download size={18} className="text-blue-600" />
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </main>

    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center ${active ? 'text-blue-600' : 'text-gray-300'}`}>
    {icon}
    <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
